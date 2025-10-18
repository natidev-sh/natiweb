# 🔧 GitHub Repo Format - Quick Fix Guide

## ❌ Problem

GitHub links showing as `github.com/12345/` instead of `github.com/username/repo`

## ✅ Solution

The `github_repo` field must be in format: **`username/repo-name`**

---

## 📝 Correct Format

### **✅ CORRECT Examples:**

```
octocat/Hello-World
microsoft/vscode
facebook/react
vercel/next.js
your-username/your-project
```

### **❌ WRONG Examples:**

```
12345                                    ❌ Just repo ID
Hello-World                              ❌ Just repo name
https://github.com/octocat/Hello-World   ❌ Full URL
github.com/octocat/Hello-World           ❌ Domain included
octocat/Hello-World/                     ❌ Trailing slash
```

---

## 🛠️ How to Fix

### **Step 1: Find Your GitHub Repo URL**

Go to your GitHub repo, copy the URL:
```
https://github.com/username/repo-name
                    ^^^^^^^^^^^^^^^^
                    This part only!
```

### **Step 2: Extract Username/Repo**

From URL: `https://github.com/octocat/Hello-World`

Extract: `octocat/Hello-World`

### **Step 3: Update in Database**

**Option A - Via SQL (Supabase Dashboard):**

```sql
-- Update specific app
UPDATE public.user_apps
SET github_repo = 'your-username/your-repo-name'
WHERE id = 'your-app-id';

-- Example:
UPDATE public.user_apps
SET github_repo = 'octocat/Hello-World'
WHERE name = 'My React App';
```

**Option B - Via Web App (Coming Soon):**
- Go to My Apps
- Edit app settings
- Enter GitHub repo in format: `username/repo`

---

## 🔍 Check Current Format

**Run this SQL to see all your apps:**

```sql
SELECT 
  id,
  name,
  github_repo,
  CASE 
    WHEN github_repo LIKE '%/%' THEN '✅ OK'
    WHEN github_repo IS NULL THEN 'ℹ️  No repo'
    ELSE '❌ Fix needed'
  END as status
FROM public.user_apps
WHERE user_id = auth.uid();
```

---

## 🎯 Quick Fix Examples

### **Example 1: React App**

**Current (Wrong):**
```sql
github_repo: "12345"
```

**Fix:**
```sql
UPDATE public.user_apps
SET github_repo = 'your-username/react-dashboard'
WHERE name = 'React Dashboard';
```

**Result:**
- View Repo: `https://github.com/your-username/react-dashboard` ✅
- Fork Repo: `https://github.com/your-username/react-dashboard/fork` ✅

### **Example 2: Node API**

**Current (Wrong):**
```sql
github_repo: "node-api"
```

**Fix:**
```sql
UPDATE public.user_apps
SET github_repo = 'company/node-api'
WHERE name = 'Node API';
```

**Result:**
- View Repo: `https://github.com/company/node-api` ✅
- Fork Repo: `https://github.com/company/node-api/fork` ✅

---

## 🚀 Validation

**To ensure proper format, run this SQL:**

```sql
-- Add validation constraint
ALTER TABLE public.user_apps
ADD CONSTRAINT user_apps_github_repo_format_check
CHECK (
  github_repo IS NULL 
  OR github_repo ~ '^[a-zA-Z0-9_-]+/[a-zA-Z0-9._-]+$'
);
```

This ensures:
- ✅ Format is always `username/repo`
- ✅ Only valid characters
- ✅ Has exactly one `/`
- ✅ No URLs or IDs

---

## 📋 Batch Update Script

**If you have many apps to fix:**

```sql
-- 1. List all apps that need fixing
SELECT 
  id,
  name,
  github_repo,
  'UPDATE user_apps SET github_repo = ''USERNAME/REPO'' WHERE id = ''' || id || ''';' as command
FROM public.user_apps
WHERE github_repo IS NOT NULL
  AND github_repo NOT LIKE '%/%';

-- 2. Update each one manually (replace USERNAME/REPO):
UPDATE public.user_apps SET github_repo = 'octocat/Hello-World' WHERE id = 'app-1';
UPDATE public.user_apps SET github_repo = 'company/react-app' WHERE id = 'app-2';
UPDATE public.user_apps SET github_repo = 'team/node-api' WHERE id = 'app-3';
```

---

## ✅ Verify It Works

### **Test Links:**

After updating, test in desktop app:

**1. View Repo Button:**
- Should open: `https://github.com/username/repo`
- Should show your repository

**2. Fork Repo Button:**
- Should open: `https://github.com/username/repo/fork`
- Should show GitHub fork page

---

## 💡 Pro Tips

### **Finding GitHub Username/Repo:**

**Method 1 - From GitHub URL:**
```
URL: https://github.com/microsoft/vscode
             username ^^^^^^^^  ^^^^^^ repo
Result: microsoft/vscode
```

**Method 2 - From Git Remote:**
```bash
cd your-project
git remote -v

# Output:
origin  git@github.com:username/repo.git (fetch)
                       ^^^^^^^^^^^^
                       Extract this part (without .git)
```

**Method 3 - From Package.json:**
```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/username/repo.git"
  }
}
```
Extract: `username/repo`

---

## 🎨 Web App Integration (Future)

**Coming Soon - Edit App Dialog:**

```
┌─────────────────────────────────┐
│ Edit App                        │
├─────────────────────────────────┤
│ Name:                           │
│ [React Dashboard              ] │
│                                 │
│ Path:                           │
│ [/users/dev/projects/react    ] │
│                                 │
│ GitHub Repo (username/repo):    │
│ [octocat/Hello-World          ] │
│  ✅ Valid format                │
│                                 │
│ [Cancel]  [Save]                │
└─────────────────────────────────┘
```

With validation:
- ✅ Checks format as you type
- ✅ Shows example placeholder
- ✅ Validates before saving
- ✅ Clear error messages

---

## 📊 Common Issues

### **Issue 1: Link goes to 404**

**Problem:** `github_repo` has wrong format

**Solution:**
```sql
-- Check format
SELECT github_repo FROM user_apps WHERE id = 'your-app-id';

-- If wrong, update
UPDATE user_apps 
SET github_repo = 'correct-username/correct-repo' 
WHERE id = 'your-app-id';
```

### **Issue 2: No GitHub repo linked**

**Problem:** `github_repo` is NULL

**Solution:**
```sql
-- Add GitHub repo
UPDATE user_apps 
SET github_repo = 'username/repo' 
WHERE id = 'your-app-id';
```

### **Issue 3: Private repo not accessible**

**Problem:** Repo exists but team can't access

**Solution:**
- Make repo public, OR
- Add team members as collaborators, OR
- Use organization with team access

---

## 🎉 Summary

### **Quick Checklist:**

- [ ] Find your GitHub repo URL
- [ ] Extract `username/repo` part
- [ ] Run SQL update command
- [ ] Verify in Supabase
- [ ] Test in desktop app
- [ ] Confirm View Repo works
- [ ] Confirm Fork Repo works
- [ ] ✅ Done!

### **Format Template:**

```
github_repo: "username/repository-name"

Examples:
• "octocat/Hello-World"
• "microsoft/vscode"
• "vercel/next.js"
• "your-username/your-project"
```

---

**Now your GitHub links will work perfectly!** 🚀
