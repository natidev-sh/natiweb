# 🚨 QUICK FIX - Do This Now!

## The Error:
```
Could not find a relationship between 'team_members' and 'profiles'
```

## The Fix (3 Steps):

### **Step 1: Go to Supabase Dashboard**
1. Open https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the sidebar

### **Step 2: Run This SQL**

Copy and paste this entire code block:

```sql
-- Add foreign key from team_members to profiles
ALTER TABLE public.team_members 
DROP CONSTRAINT IF EXISTS team_members_user_id_fkey;

ALTER TABLE public.team_members 
ADD CONSTRAINT team_members_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Add foreign key from team_invites to profiles
ALTER TABLE public.team_invites 
DROP CONSTRAINT IF EXISTS team_invites_invited_by_fkey;

ALTER TABLE public.team_invites 
ADD CONSTRAINT team_invites_invited_by_fkey 
FOREIGN KEY (invited_by) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Verify (should return 2 rows)
SELECT constraint_name, table_name
FROM information_schema.key_column_usage
WHERE constraint_name IN (
  'team_members_user_id_fkey',
  'team_invites_invited_by_fkey'
);
```

Click **Run** (or press Ctrl+Enter)

### **Step 3: Reload Schema Cache**

**Option A (Automatic - Wait 2 minutes):**
- Just wait 2 minutes for auto-refresh
- Then refresh your web app

**Option B (Manual - Instant):**
1. In Supabase Dashboard, go to **Settings** → **API**
2. Scroll to "PostgREST Schema Cache"
3. Click **"Reload schema cache"** button
4. Wait 10 seconds
5. Refresh your web app

---

## ✅ Test It Works

After running above:

1. Go to your web app
2. Navigate to Teams page
3. Select a team
4. **Should see members now!** ✅
5. Go to My Apps
6. Click **Share** button
7. **Should work!** ✅

---

## 🎯 That's It!

Three steps:
1. ✅ Run SQL in Supabase
2. ✅ Wait 2 min (or reload schema cache)
3. ✅ Test on web app

**Then you can share apps with your team!** 🎉
