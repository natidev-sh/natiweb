-- ====================================
-- CHECK AND FIX GITHUB REPOS
-- ====================================

-- Step 1: See all your apps and their GitHub repo format
SELECT 
  id,
  name,
  github_repo,
  CASE 
    WHEN github_repo IS NULL THEN '🔵 No repo linked'
    WHEN github_repo ~ '^[a-zA-Z0-9_-]+/[a-zA-Z0-9._-]+$' THEN '✅ Correct format'
    ELSE '❌ NEEDS FIX'
  END as status,
  CASE
    WHEN github_repo IS NULL THEN 'Add: UPDATE user_apps SET github_repo = ''username/repo'' WHERE id = ''' || id || ''';'
    WHEN github_repo ~ '^[a-zA-Z0-9_-]+/[a-zA-Z0-9._-]+$' THEN '✅ Already correct'
    ELSE 'Fix: UPDATE user_apps SET github_repo = ''username/repo'' WHERE id = ''' || id || ''';'
  END as action_needed
FROM public.user_apps
ORDER BY name;

-- Step 2: Update your apps (REPLACE VALUES WITH YOUR ACTUAL GITHUB USERNAME/REPO)
-- 
-- Template:
-- UPDATE public.user_apps 
-- SET github_repo = 'your-github-username/your-repo-name'
-- WHERE id = 'your-app-id-from-above';
--
-- Examples:

-- UPDATE public.user_apps 
-- SET github_repo = 'octocat/Hello-World'
-- WHERE name = 'React Dashboard';

-- UPDATE public.user_apps 
-- SET github_repo = 'microsoft/typescript'
-- WHERE name = 'TypeScript Project';

-- UPDATE public.user_apps 
-- SET github_repo = 'vercel/next.js'
-- WHERE name = 'Next.js App';

-- Step 3: Verify the fix
SELECT 
  name,
  github_repo,
  'https://github.com/' || github_repo as view_url,
  'https://github.com/' || github_repo || '/fork' as fork_url
FROM public.user_apps
WHERE github_repo IS NOT NULL
ORDER BY name;

-- ====================================
-- QUICK REFERENCE
-- ====================================

-- Format: username/repo-name

-- ✅ CORRECT:
-- 'octocat/Hello-World'
-- 'microsoft/vscode'  
-- 'facebook/react'
-- 'your-username/your-project'

-- ❌ WRONG:
-- '12345'                    (just ID)
-- 'Hello-World'              (just repo name)
-- 'https://github.com/...'   (full URL)
-- 'github.com/...'           (with domain)
