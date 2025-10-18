-- =========================================
-- TEAM WORKSPACES (RLS SAFE VERSION)
-- =========================================

-- ========== TABLES ==========

CREATE TABLE IF NOT EXISTS public.teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT DEFAULT 'pro' CHECK (plan IN ('pro', 'enterprise')),
  max_members INTEGER DEFAULT 5,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'editor', 'viewer')),
  invited_by UUID REFERENCES auth.users(id),
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  joined_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(team_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.team_invites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'editor', 'viewer')),
  invited_by UUID NOT NULL REFERENCES auth.users(id),
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, email)
);

CREATE TABLE IF NOT EXISTS public.team_apps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  app_id UUID NOT NULL REFERENCES public.user_apps(id) ON DELETE CASCADE,
  shared_by UUID NOT NULL REFERENCES auth.users(id),
  shared_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, app_id)
);

CREATE TABLE IF NOT EXISTS public.team_api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  encrypted_key TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.team_prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  category TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.team_activity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== INDEXES ==========
CREATE INDEX IF NOT EXISTS idx_teams_owner ON public.teams(owner_id);
CREATE INDEX IF NOT EXISTS idx_teams_slug ON public.teams(slug);
CREATE INDEX IF NOT EXISTS idx_team_members_team ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON public.team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_invites_team ON public.team_invites(team_id);
CREATE INDEX IF NOT EXISTS idx_team_invites_email ON public.team_invites(email);
CREATE INDEX IF NOT EXISTS idx_team_apps_team ON public.team_apps(team_id);
CREATE INDEX IF NOT EXISTS idx_team_activity_team ON public.team_activity(team_id);

-- ========== ENABLE RLS ==========
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_activity ENABLE ROW LEVEL SECURITY;

-- =========================================
-- HELPERS
-- =========================================

-- Helper function: safely check if a user is a member of a team (bypasses RLS)
CREATE OR REPLACE FUNCTION public.is_team_member(p_team_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.team_members tm
    WHERE tm.team_id = p_team_id
      AND tm.user_id = p_user_id
      AND tm.is_active = true
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Member limit enforcement trigger
CREATE OR REPLACE FUNCTION public.check_team_member_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (
    SELECT COUNT(*) FROM public.team_members 
    WHERE team_id = NEW.team_id AND is_active = true
  ) >= (
    SELECT max_members FROM public.teams WHERE id = NEW.team_id
  ) THEN
    RAISE EXCEPTION 'Team member limit reached';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enforce_team_member_limit ON public.team_members;
CREATE TRIGGER enforce_team_member_limit
  BEFORE INSERT ON public.team_members
  FOR EACH ROW
  EXECUTE FUNCTION public.check_team_member_limit();

-- =========================================
-- HELPER FUNCTIONS (to avoid recursion in RLS)
-- =========================================

-- Function to get user's team IDs (bypasses RLS)
CREATE OR REPLACE FUNCTION public.get_user_team_ids(p_user_id UUID)
RETURNS TABLE(team_id UUID)
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT team_id 
  FROM public.team_members 
  WHERE user_id = p_user_id AND is_active = true;
$$;

-- Function to check if user has specific role in team (bypasses RLS)
CREATE OR REPLACE FUNCTION public.user_has_team_role(p_team_id UUID, p_user_id UUID, p_roles TEXT[])
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_id = p_team_id
      AND user_id = p_user_id
      AND role = ANY(p_roles)
      AND is_active = true
  );
$$;

-- =========================================
-- RLS POLICIES
-- =========================================

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view teams they are members of" ON public.teams;
DROP POLICY IF EXISTS "Only Pro/Admin users can create teams" ON public.teams;
DROP POLICY IF EXISTS "Authenticated users can create teams" ON public.teams;
DROP POLICY IF EXISTS "Team owners can update their teams" ON public.teams;
DROP POLICY IF EXISTS "Team members can view other members" ON public.team_members;
DROP POLICY IF EXISTS "Team owners can add members" ON public.team_members;
DROP POLICY IF EXISTS "Users can join teams they're invited to" ON public.team_members;
DROP POLICY IF EXISTS "Users can update their own membership" ON public.team_members;
DROP POLICY IF EXISTS "Team members can view shared apps" ON public.team_apps;
DROP POLICY IF EXISTS "Team editors can share apps" ON public.team_apps;

-- ========== Teams ==========
CREATE POLICY "Users can view teams they are members of"
  ON public.teams FOR SELECT
  USING (
    id IN (
      SELECT team_id FROM public.get_user_team_ids(auth.uid())
    )
  );

-- Temporarily allow all authenticated users to create teams for testing
-- TODO: Re-enable Pro/Admin check once subscription system is fully set up
CREATE POLICY "Authenticated users can create teams"
  ON public.teams FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Original Pro/Admin policy (commented out for now):
-- CREATE POLICY "Only Pro/Admin users can create teams"
--   ON public.teams FOR INSERT
--   WITH CHECK (
--     EXISTS (
--       SELECT 1 FROM public.profiles
--       WHERE id = auth.uid()
--       AND (subscription_status = 'active' OR role = 'admin')
--     )
--   );

CREATE POLICY "Team owners can update their teams"
  ON public.teams FOR UPDATE
  USING (owner_id = auth.uid());

-- ========== Team Members ==========
CREATE POLICY "Team members can view other members"
  ON public.team_members FOR SELECT
  USING (
    user_id = auth.uid() -- Can always see own membership
    OR
    team_id IN (
      SELECT team_id FROM public.get_user_team_ids(auth.uid())
    )
  );

CREATE POLICY "Team owners can add members"
  ON public.team_members FOR INSERT
  WITH CHECK (
    public.user_has_team_role(team_id, auth.uid(), ARRAY['owner', 'admin'])
  );

CREATE POLICY "Users can update their own membership"
  ON public.team_members FOR UPDATE
  USING (user_id = auth.uid());

-- ========== Team Apps ==========
CREATE POLICY "Team members can view shared apps"
  ON public.team_apps FOR SELECT
  USING (
    team_id IN (
      SELECT team_id FROM public.get_user_team_ids(auth.uid())
    )
  );

CREATE POLICY "Team editors can share apps"
  ON public.team_apps FOR INSERT
  WITH CHECK (
    public.user_has_team_role(team_id, auth.uid(), ARRAY['owner', 'admin', 'editor'])
  );

-- ========== Foreign Keys for Profiles ==========
-- Add explicit foreign keys to help Supabase detect the relationships
DO $$ 
BEGIN
  -- team_members.user_id -> profiles.id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'team_members_user_id_fkey' 
    AND table_name = 'team_members'
  ) THEN
    ALTER TABLE public.team_members 
    ADD CONSTRAINT team_members_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
  
  -- team_invites.invited_by -> profiles.id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'team_invites_invited_by_fkey' 
    AND table_name = 'team_invites'
  ) THEN
    ALTER TABLE public.team_invites 
    ADD CONSTRAINT team_invites_invited_by_fkey 
    FOREIGN KEY (invited_by) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- ========== Grants ==========
GRANT ALL ON public.teams TO authenticated;
GRANT ALL ON public.team_members TO authenticated;
GRANT ALL ON public.team_invites TO authenticated;
GRANT ALL ON public.team_apps TO authenticated;
GRANT ALL ON public.team_api_keys TO authenticated;
GRANT ALL ON public.team_prompts TO authenticated;
GRANT ALL ON public.team_activity TO authenticated;
