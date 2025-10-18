# 🚀 Quick Fix: GitHub Links

## ⚡ The Issue
GitHub links showing wrong format: `github.com/12345/` ❌

## ✅ The Fix
Should be: `github.com/username/repo` ✅

---

## 🔧 3-Step Fix

### **Step 1: Check Your Apps**

Run in Supabase SQL Editor:
```sql
SELECT 
  id,
  name,
  github_repo,
  CASE 
    WHEN github_repo LIKE '%/%' THEN '✅ OK'
    ELSE '❌ Needs fix'
  END as status
FROM public.user_apps;
```

### **Step 2: Get Correct Format**

Go to your GitHub repo, copy URL:
```
https://github.com/your-username/your-repo
                    ^^^^^^^^^^^^^^^^^^^^^^^^
                    Copy this part only!
```

Extract: `your-username/your-repo`

### **Step 3: Update Database**

```sql
UPDATE public.user_apps
SET github_repo = 'your-username/your-repo'
WHERE name = 'Your App Name';
```

**Example:**
```sql
UPDATE public.user_apps
SET github_repo = 'octocat/Hello-World'
WHERE name = 'React Dashboard';
```

---

## 📋 Quick Examples

### **Format Template:**
```
username/repository-name
```

### **Real Examples:**
```sql
-- React app
UPDATE user_apps SET github_repo = 'facebook/react' WHERE name = 'React';

-- VS Code
UPDATE user_apps SET github_repo = 'microsoft/vscode' WHERE name = 'VSCode';

-- Next.js
UPDATE user_apps SET github_repo = 'vercel/next.js' WHERE name = 'Next.js';

-- Your app
UPDATE user_apps SET github_repo = 'your-username/your-project' WHERE name = 'My App';
```

---

## ✅ Verify It Works

After updating, check in desktop app:

**Teams Page → Shared Apps:**
- Click "View Repo" → Should open `github.com/username/repo` ✅
- Click "Fork Repo" → Should open `github.com/username/repo/fork` ✅

---

## 📁 Files to Help You:

1. **CHECK_AND_FIX_GITHUB_REPOS.sql** - Check all apps
2. **FIX_GITHUB_REPO_FORMAT.sql** - Add validation
3. **GITHUB_REPO_FORMAT_GUIDE.md** - Full guide

---

## 🎯 Summary

**Correct Format:**
```
✅ octocat/Hello-World
✅ microsoft/vscode
✅ your-username/your-repo
```

**Wrong Format:**
```
❌ 12345
❌ Hello-World
❌ https://github.com/octocat/Hello-World
❌ github.com/octocat/Hello-World
```

---

**Run the SQL, update your apps, and the links will work!** 🎉
