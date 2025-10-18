-- ========================================
-- ADD FOREIGN KEYS - RUN THIS NOW!
-- ========================================

-- This will fix the "Could not find a relationship" error

-- 1. Add foreign key from team_members to profiles
DO $$ 
BEGIN
  -- Drop if exists (in case of retry)
  ALTER TABLE public.team_members 
  DROP CONSTRAINT IF EXISTS team_members_user_id_fkey;
  
  -- Add the constraint
  ALTER TABLE public.team_members 
  ADD CONSTRAINT team_members_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  
  RAISE NOTICE 'Added team_members_user_id_fkey';
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error adding team_members FK: %', SQLERRM;
END $$;

-- 2. Add foreign key from team_invites to profiles
DO $$ 
BEGIN
  -- Drop if exists (in case of retry)
  ALTER TABLE public.team_invites 
  DROP CONSTRAINT IF EXISTS team_invites_invited_by_fkey;
  
  -- Add the constraint
  ALTER TABLE public.team_invites 
  ADD CONSTRAINT team_invites_invited_by_fkey 
  FOREIGN KEY (invited_by) REFERENCES public.profiles(id) ON DELETE CASCADE;
  
  RAISE NOTICE 'Added team_invites_invited_by_fkey';
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error adding team_invites FK: %', SQLERRM;
END $$;

-- 3. Verify foreign keys were created
SELECT 
  constraint_name,
  table_name,
  column_name
FROM information_schema.key_column_usage
WHERE constraint_name IN (
  'team_members_user_id_fkey',
  'team_invites_invited_by_fkey'
)
ORDER BY table_name, column_name;

-- Should return 2 rows if successful!
