-- Add GitHub integration fields to user_apps table for team sharing

-- Add github_repo column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_apps' AND column_name = 'github_repo'
  ) THEN
    ALTER TABLE public.user_apps ADD COLUMN github_repo TEXT;
    CREATE INDEX IF NOT EXISTS idx_user_apps_github_repo ON public.user_apps(github_repo);
    RAISE NOTICE '✅ Added github_repo column to user_apps';
  ELSE
    RAISE NOTICE 'ℹ️  github_repo column already exists';
  END IF;
END $$;

-- Add desktop_app_id column if it doesn't exist (for linking web <-> desktop)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_apps' AND column_name = 'desktop_app_id'
  ) THEN
    ALTER TABLE public.user_apps ADD COLUMN desktop_app_id TEXT;
    CREATE INDEX IF NOT EXISTS idx_user_apps_desktop_app_id ON public.user_apps(desktop_app_id);
    RAISE NOTICE '✅ Added desktop_app_id column to user_apps';
  ELSE
    RAISE NOTICE 'ℹ️  desktop_app_id column already exists';
  END IF;
END $$;

-- Add description column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_apps' AND column_name = 'description'
  ) THEN
    ALTER TABLE public.user_apps ADD COLUMN description TEXT;
    RAISE NOTICE '✅ Added description column to user_apps';
  ELSE
    RAISE NOTICE 'ℹ️  description column already exists';
  END IF;
END $$;

-- Verify the columns
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'user_apps'
  AND column_name IN ('name', 'path', 'github_repo', 'desktop_app_id', 'description', 'user_id')
ORDER BY ordinal_position;

-- Show sample structure
COMMENT ON COLUMN public.user_apps.github_repo IS 'GitHub repository in format: username/repo-name';
COMMENT ON COLUMN public.user_apps.desktop_app_id IS 'Links to the desktop app instance for syncing';
COMMENT ON COLUMN public.user_apps.description IS 'Optional description of the app';
