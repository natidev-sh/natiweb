-- Complete fix for team deletion
-- This addresses triggers and cascade issues

-- Step 1: Temporarily disable the activity trigger that causes issues
DROP TRIGGER IF EXISTS team_members_activity_trigger ON public.team_members;
DROP TRIGGER IF EXISTS team_apps_activity_trigger ON public.team_apps;
DROP TRIGGER IF EXISTS team_posts_activity_trigger ON public.team_posts;

-- Step 2: Fix all foreign key constraints to CASCADE
ALTER TABLE public.team_activity 
DROP CONSTRAINT IF EXISTS team_activity_team_id_fkey CASCADE;

ALTER TABLE public.team_activity
ADD CONSTRAINT team_activity_team_id_fkey
FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;

ALTER TABLE public.team_posts 
DROP CONSTRAINT IF EXISTS team_posts_team_id_fkey CASCADE;

ALTER TABLE public.team_posts
ADD CONSTRAINT team_posts_team_id_fkey
FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;

ALTER TABLE public.team_members 
DROP CONSTRAINT IF EXISTS team_members_team_id_fkey CASCADE;

ALTER TABLE public.team_members
ADD CONSTRAINT team_members_team_id_fkey
FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;

ALTER TABLE public.team_apps 
DROP CONSTRAINT IF EXISTS team_apps_team_id_fkey CASCADE;

ALTER TABLE public.team_apps
ADD CONSTRAINT team_apps_team_id_fkey
FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;

ALTER TABLE public.team_invites 
DROP CONSTRAINT IF EXISTS team_invites_team_id_fkey CASCADE;

ALTER TABLE public.team_invites
ADD CONSTRAINT team_invites_team_id_fkey
FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;

-- Step 3: Recreate the activity trigger with proper checks
CREATE OR REPLACE FUNCTION public.create_team_activity()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create activity if team still exists and operation is not DELETE
  IF TG_OP = 'DELETE' THEN
    -- Don't create activity for deletions to avoid foreign key issues
    RETURN OLD;
  END IF;

  -- Handle different trigger events
  IF TG_TABLE_NAME = 'team_members' THEN
    IF TG_OP = 'INSERT' THEN
      INSERT INTO public.team_activity (team_id, user_id, action_type, metadata)
      VALUES (NEW.team_id, NEW.user_id, 'joined', jsonb_build_object('role', NEW.role));
    ELSIF TG_OP = 'UPDATE' AND OLD.role != NEW.role THEN
      INSERT INTO public.team_activity (team_id, user_id, action_type, metadata)
      VALUES (NEW.team_id, NEW.user_id, 'role_changed', 
        jsonb_build_object('old_role', OLD.role, 'new_role', NEW.role));
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

-- Step 4: Recreate triggers (only for INSERT and UPDATE, not DELETE)
CREATE TRIGGER team_members_activity_trigger
  AFTER INSERT OR UPDATE ON public.team_members
  FOR EACH ROW EXECUTE FUNCTION public.create_team_activity();

CREATE TRIGGER team_apps_activity_trigger
  AFTER INSERT ON public.team_apps
  FOR EACH ROW EXECUTE FUNCTION public.create_team_activity();

CREATE TRIGGER team_posts_activity_trigger
  AFTER INSERT ON public.team_posts
  FOR EACH ROW EXECUTE FUNCTION public.create_team_activity();

-- Step 5: Add RLS policies for deletion
DROP POLICY IF EXISTS "Team owners can delete their teams" ON public.teams;
CREATE POLICY "Team owners can delete their teams"
  ON public.teams FOR DELETE
  USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "Team owners can update their teams" ON public.teams;
CREATE POLICY "Team owners can update their teams"
  ON public.teams FOR UPDATE
  USING (owner_id = auth.uid());

-- Step 6: Ensure admins can delete any team
DROP POLICY IF EXISTS "Admins can delete any team" ON public.teams;
CREATE POLICY "Admins can delete any team"
  ON public.teams FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Comments
COMMENT ON FUNCTION public.create_team_activity() IS 'Creates activity records, skips DELETE operations to avoid FK conflicts';
COMMENT ON CONSTRAINT team_activity_team_id_fkey ON public.team_activity IS 'Cascades on team deletion';
