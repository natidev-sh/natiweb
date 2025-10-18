-- Fix team deletion to cascade properly

-- First, drop existing foreign key constraints and recreate with CASCADE

-- Fix team_activity
ALTER TABLE public.team_activity 
DROP CONSTRAINT IF EXISTS team_activity_team_id_fkey;

ALTER TABLE public.team_activity
ADD CONSTRAINT team_activity_team_id_fkey
FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;

-- Fix team_posts (if exists)
ALTER TABLE public.team_posts 
DROP CONSTRAINT IF EXISTS team_posts_team_id_fkey;

ALTER TABLE public.team_posts
ADD CONSTRAINT team_posts_team_id_fkey
FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;

-- Fix team_members
ALTER TABLE public.team_members 
DROP CONSTRAINT IF EXISTS team_members_team_id_fkey;

ALTER TABLE public.team_members
ADD CONSTRAINT team_members_team_id_fkey
FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;

-- Fix team_apps
ALTER TABLE public.team_apps 
DROP CONSTRAINT IF EXISTS team_apps_team_id_fkey;

ALTER TABLE public.team_apps
ADD CONSTRAINT team_apps_team_id_fkey
FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;

-- Fix team_invites
ALTER TABLE public.team_invites 
DROP CONSTRAINT IF EXISTS team_invites_team_id_fkey;

ALTER TABLE public.team_invites
ADD CONSTRAINT team_invites_team_id_fkey
FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;

-- Update RLS policy for team deletion to allow owners
DROP POLICY IF EXISTS "Team owners can delete their teams" ON public.teams;
CREATE POLICY "Team owners can delete their teams"
  ON public.teams FOR DELETE
  USING (owner_id = auth.uid());

-- Ensure users can update their own teams
DROP POLICY IF EXISTS "Team owners can update their teams" ON public.teams;
CREATE POLICY "Team owners can update their teams"
  ON public.teams FOR UPDATE
  USING (owner_id = auth.uid());

-- Comments
COMMENT ON CONSTRAINT team_activity_team_id_fkey ON public.team_activity IS 'Cascades on team deletion';
COMMENT ON CONSTRAINT team_posts_team_id_fkey ON public.team_posts IS 'Cascades on team deletion';
COMMENT ON CONSTRAINT team_members_team_id_fkey ON public.team_members IS 'Cascades on team deletion';
COMMENT ON CONSTRAINT team_apps_team_id_fkey ON public.team_apps IS 'Cascades on team deletion';
COMMENT ON CONSTRAINT team_invites_team_id_fkey ON public.team_invites IS 'Cascades on team deletion';
