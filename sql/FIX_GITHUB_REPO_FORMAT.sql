-- Fix GitHub repo format in user_apps table
-- Format should be: "username/repo-name" NOT just repo ID

-- 1. Check current format
SELECT 
  id,
  name,
  github_repo,
  CASE 
    WHEN github_repo LIKE '%/%' THEN '✅ Correct format'
    WHEN github_repo IS NULL THEN 'ℹ️  No repo linked'
    ELSE '❌ Wrong format (needs username/repo)'
  END as format_status
FROM public.user_apps
WHERE github_repo IS NOT NULL
LIMIT 10;

-- 2. Example of correct formats:
-- ✅ CORRECT: "octocat/Hello-World"
-- ✅ CORRECT: "microsoft/vscode"
-- ✅ CORRECT: "facebook/react"
-- ❌ WRONG: "12345"
-- ❌ WRONG: "Hello-World"
-- ❌ WRONG: "https://github.com/octocat/Hello-World" (don't include full URL)

-- 3. Add constraint to ensure proper format (optional but recommended)
DO $$ 
BEGIN
  -- Add check constraint for github_repo format
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'user_apps_github_repo_format_check'
  ) THEN
    ALTER TABLE public.user_apps
    ADD CONSTRAINT user_apps_github_repo_format_check
    CHECK (
      github_repo IS NULL 
      OR github_repo ~ '^[a-zA-Z0-9_-]+/[a-zA-Z0-9._-]+$'
    );
    RAISE NOTICE '✅ Added format validation for github_repo';
  ELSE
    RAISE NOTICE 'ℹ️  Format validation already exists';
  END IF;
EXCEPTION
  WHEN check_violation THEN
    RAISE NOTICE '❌ Some existing repos have invalid format. Fix them first!';
END $$;

-- 4. Helper function to validate GitHub repo format
CREATE OR REPLACE FUNCTION public.is_valid_github_repo(repo TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if format is username/repo-name
  RETURN repo ~ '^[a-zA-Z0-9_-]+/[a-zA-Z0-9._-]+$';
END;
$$;

-- 5. Test the validation function
SELECT 
  'octocat/Hello-World' as repo,
  public.is_valid_github_repo('octocat/Hello-World') as is_valid;

SELECT 
  'microsoft/vscode' as repo,
  public.is_valid_github_repo('microsoft/vscode') as is_valid;

SELECT 
  'invalid-format' as repo,
  public.is_valid_github_repo('invalid-format') as is_valid;

-- 6. Example: Update wrong format to correct format
-- IMPORTANT: Manually update each app with correct GitHub username/repo
-- 
-- UPDATE public.user_apps
-- SET github_repo = 'your-username/your-repo'
-- WHERE id = 'app-id-here';

-- 7. Show all apps that need fixing
SELECT 
  id,
  name,
  github_repo,
  'Update this app with: UPDATE user_apps SET github_repo = ''username/repo'' WHERE id = ''' || id || ''';' as fix_command
FROM public.user_apps
WHERE github_repo IS NOT NULL
  AND NOT public.is_valid_github_repo(github_repo);
