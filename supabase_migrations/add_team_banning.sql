-- Add banning functionality to teams

-- Add is_banned column to teams table
ALTER TABLE public.teams 
ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT FALSE;

-- Create index for faster queries on banned teams
CREATE INDEX IF NOT EXISTS idx_teams_is_banned ON public.teams(is_banned);

-- Comment
COMMENT ON COLUMN public.teams.is_banned IS 'Whether the team has been banned by admin';

-- Update RLS policies to respect banned status
DROP POLICY IF EXISTS "Users can view their teams" ON public.teams;
CREATE POLICY "Users can view their teams"
  ON public.teams FOR SELECT
  USING (
    id IN (
      SELECT team_id FROM public.team_members
      WHERE user_id = auth.uid() AND is_active = true
    )
    AND is_banned = FALSE  -- Hide banned teams from users
  );

-- Admins can see all teams including banned ones
DROP POLICY IF EXISTS "Admins can manage all teams" ON public.teams;
CREATE POLICY "Admins can manage all teams"
  ON public.teams FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to check if team is banned
CREATE OR REPLACE FUNCTION public.is_team_banned(team_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT is_banned 
    FROM public.teams 
    WHERE id = team_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.is_team_banned(UUID) TO authenticated;
