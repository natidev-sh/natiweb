-- =========================================
-- TEAM ACTIVITY FEED & POSTS
-- =========================================

-- Activity Feed Table
CREATE TABLE IF NOT EXISTS public.team_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'shared_app', 'joined', 'left', 'role_changed', 'posted', 'commented'
  target_type TEXT, -- 'app', 'member', 'post', NULL
  target_id UUID, -- Reference to app, member, or post
  metadata JSONB, -- Extra data like old_role, new_role, app_name, etc.
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Team Posts/Comments Table
CREATE TABLE IF NOT EXISTS public.team_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add parent_id column separately to avoid circular reference issues
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'team_posts' AND column_name = 'parent_id'
  ) THEN
    ALTER TABLE public.team_posts 
    ADD COLUMN parent_id UUID REFERENCES public.team_posts(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_team_activity_team_id ON public.team_activity(team_id);
CREATE INDEX IF NOT EXISTS idx_team_activity_created_at ON public.team_activity(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_team_activity_user_id ON public.team_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_team_activity_action_type ON public.team_activity(action_type);

CREATE INDEX IF NOT EXISTS idx_team_posts_team_id ON public.team_posts(team_id);
CREATE INDEX IF NOT EXISTS idx_team_posts_user_id ON public.team_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_team_posts_parent_id ON public.team_posts(parent_id);
CREATE INDEX IF NOT EXISTS idx_team_posts_created_at ON public.team_posts(created_at DESC);

-- RLS Policies for Activity
ALTER TABLE public.team_activity ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Team members can view activity" ON public.team_activity;
CREATE POLICY "Team members can view activity"
  ON public.team_activity FOR SELECT
  USING (
    team_id IN (
      SELECT team_id FROM public.get_user_team_ids(auth.uid())
    )
  );

DROP POLICY IF EXISTS "System can insert activity" ON public.team_activity;
CREATE POLICY "System can insert activity"
  ON public.team_activity FOR INSERT
  WITH CHECK (
    team_id IN (
      SELECT team_id FROM public.get_user_team_ids(auth.uid())
    )
  );

-- RLS Policies for Posts
ALTER TABLE public.team_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Team members can view posts" ON public.team_posts;
CREATE POLICY "Team members can view posts"
  ON public.team_posts FOR SELECT
  USING (
    team_id IN (
      SELECT team_id FROM public.get_user_team_ids(auth.uid())
    )
  );

DROP POLICY IF EXISTS "Team members can create posts" ON public.team_posts;
CREATE POLICY "Team members can create posts"
  ON public.team_posts FOR INSERT
  WITH CHECK (
    team_id IN (
      SELECT team_id FROM public.get_user_team_ids(auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can update own posts" ON public.team_posts;
CREATE POLICY "Users can update own posts"
  ON public.team_posts FOR UPDATE
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own posts" ON public.team_posts;
CREATE POLICY "Users can delete own posts"
  ON public.team_posts FOR DELETE
  USING (user_id = auth.uid());

-- Function to auto-create activity when events happen
CREATE OR REPLACE FUNCTION public.create_team_activity()
RETURNS TRIGGER AS $$
BEGIN
  -- Handle different trigger events
  IF TG_TABLE_NAME = 'team_members' THEN
    IF TG_OP = 'INSERT' THEN
      INSERT INTO public.team_activity (team_id, user_id, action_type, metadata)
      VALUES (NEW.team_id, NEW.user_id, 'joined', jsonb_build_object('role', NEW.role));
    ELSIF TG_OP = 'UPDATE' AND OLD.role != NEW.role THEN
      INSERT INTO public.team_activity (team_id, user_id, action_type, metadata)
      VALUES (NEW.team_id, NEW.user_id, 'role_changed', 
        jsonb_build_object('old_role', OLD.role, 'new_role', NEW.role));
    ELSIF TG_OP = 'DELETE' THEN
      INSERT INTO public.team_activity (team_id, user_id, action_type, metadata)
      VALUES (OLD.team_id, OLD.user_id, 'left', jsonb_build_object('role', OLD.role));
    END IF;
  ELSIF TG_TABLE_NAME = 'team_apps' THEN
    IF TG_OP = 'INSERT' THEN
      INSERT INTO public.team_activity (team_id, user_id, action_type, target_type, target_id, metadata)
      VALUES (NEW.team_id, NEW.shared_by, 'shared_app', 'app', NEW.app_id,
        jsonb_build_object('app_id', NEW.app_id));
    END IF;
  ELSIF TG_TABLE_NAME = 'team_posts' THEN
    IF TG_OP = 'INSERT' THEN
      IF NEW.parent_id IS NULL THEN
        INSERT INTO public.team_activity (team_id, user_id, action_type, target_type, target_id)
        VALUES (NEW.team_id, NEW.user_id, 'posted', 'post', NEW.id);
      ELSE
        INSERT INTO public.team_activity (team_id, user_id, action_type, target_type, target_id, metadata)
        VALUES (NEW.team_id, NEW.user_id, 'commented', 'post', NEW.parent_id,
          jsonb_build_object('comment_id', NEW.id));
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers
DROP TRIGGER IF EXISTS team_members_activity_trigger ON public.team_members;
CREATE TRIGGER team_members_activity_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.team_members
  FOR EACH ROW EXECUTE FUNCTION public.create_team_activity();

DROP TRIGGER IF EXISTS team_apps_activity_trigger ON public.team_apps;
CREATE TRIGGER team_apps_activity_trigger
  AFTER INSERT ON public.team_apps
  FOR EACH ROW EXECUTE FUNCTION public.create_team_activity();

DROP TRIGGER IF EXISTS team_posts_activity_trigger ON public.team_posts;
CREATE TRIGGER team_posts_activity_trigger
  AFTER INSERT ON public.team_posts
  FOR EACH ROW EXECUTE FUNCTION public.create_team_activity();

-- Grants
GRANT ALL ON public.team_activity TO authenticated;
GRANT ALL ON public.team_posts TO authenticated;

-- Comments
COMMENT ON TABLE public.team_activity IS 'Tracks all team activity for the feed';
COMMENT ON TABLE public.team_posts IS 'Team posts and comments';
COMMENT ON COLUMN public.team_activity.action_type IS 'Type of action: shared_app, joined, left, role_changed, posted, commented';
COMMENT ON COLUMN public.team_posts.parent_id IS 'NULL for posts, references post_id for comments';
