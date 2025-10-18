# 🔧 Fix: Foreign Key Relationships

## ❌ Problem

Getting 400 errors with message:
```
"Could not find a relationship between 'team_members' and 'user_id' in the schema cache"
```

## ✅ Solution

The database needs explicit foreign key constraints so Supabase can detect relationships between `team_members`/`team_invites` and `profiles` table.

---

## 🚀 How to Fix

### **Step 1: Run the Updated Migration**

Go to Supabase Dashboard → SQL Editor and run:

```sql
-- Add explicit foreign keys to help Supabase detect the relationships
DO $$ 
BEGIN
  -- team_members.user_id -> profiles.id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'team_members_user_id_fkey' 
    AND table_name = 'team_members'
  ) THEN
    ALTER TABLE public.team_members 
    ADD CONSTRAINT team_members_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
  
  -- team_invites.invited_by -> profiles.id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'team_invites_invited_by_fkey' 
    AND table_name = 'team_invites'
  ) THEN
    ALTER TABLE public.team_invites 
    ADD CONSTRAINT team_invites_invited_by_fkey 
    FOREIGN KEY (invited_by) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
END $$;
```

### **Step 2: Verify**

Check that the foreign keys were created:

```sql
SELECT 
  constraint_name,
  table_name,
  column_name
FROM information_schema.key_column_usage
WHERE table_name IN ('team_members', 'team_invites')
  AND constraint_name LIKE '%_fkey';
```

You should see:
- `team_members_user_id_fkey`
- `team_invites_invited_by_fkey`

### **Step 3: Reload Schema Cache**

In Supabase Dashboard:
1. Go to Settings → API
2. Scroll to "PostgREST Schema Cache"
3. Click "Reload schema cache"

**OR** just wait 1-2 minutes for auto-refresh.

### **Step 4: Test**

Refresh your web app and try:
- Viewing a team
- Opening team settings
- Accepting an invite

Should work now! ✅

---

## 📝 What Was Changed

### **Files Updated:**

1. **`supabase_migrations/teams_workspace.sql`**
   - Added foreign key constraints
   - `team_members.user_id` → `profiles.id`
   - `team_invites.invited_by` → `profiles.id`

2. **`src/pages/Teams.jsx`**
   - Updated query to use `profiles!team_members_user_id_fkey`
   - Transforms response to map `profiles` to `user`

3. **`src/pages/TeamSettings.jsx`**
   - Updated query to use `profiles!team_members_user_id_fkey`
   - Transforms response to map `profiles` to `user`

4. **`src/pages/AcceptInvite.jsx`**
   - Updated query to use `profiles!team_invites_invited_by_fkey`

---

## 🔍 Technical Explanation

### **The Issue:**

```
team_members.user_id → auth.users.id (existing FK)
profiles.id = auth.users.id (same value, no FK)
```

Supabase couldn't auto-detect the relationship because there was no explicit foreign key between `team_members.user_id` and `profiles.id`.

### **The Fix:**

Added explicit foreign keys so Supabase PostgREST can detect:

```
team_members.user_id → profiles.id (new FK)
team_invites.invited_by → profiles.id (new FK)
```

Now queries can use:
```javascript
profiles!team_members_user_id_fkey(...)
profiles!team_invites_invited_by_fkey(...)
```

---

## ✅ Verification

### **Test These Pages:**

1. **Teams Page** (`/dashboard?tab=teams`)
   - Should load teams
   - Should show member counts
   - Should display team details

2. **Team Settings** (`/team/:id/settings`)
   - Should load team info
   - Should show all members with emails
   - Should display avatars
   - Should allow role changes

3. **Accept Invite** (`/invite/:token`)
   - Should load invite details
   - Should show who invited you
   - Should show team name
   - Should allow accepting

---

## 🐛 If Still Not Working

### **Check 1: Foreign Keys Exist**
```sql
SELECT * FROM information_schema.table_constraints 
WHERE constraint_name IN (
  'team_members_user_id_fkey',
  'team_invites_invited_by_fkey'
);
```

### **Check 2: Profiles Table Has Data**
```sql
SELECT id, email FROM profiles LIMIT 5;
```

### **Check 3: Schema Cache Refreshed**
- Wait 2 minutes
- Or manually reload in Supabase dashboard

### **Check 4: Console Errors**
- Open browser console
- Try loading a team
- Check for different error messages

---

## 💡 Why This Approach

**Alternative approaches we didn't use:**

1. **Manual joins** - More complex, slower
2. **Views** - Extra maintenance
3. **Removing profiles table** - Breaks other features
4. **Using auth.users directly** - Can't add custom fields

**Our approach:**
- Explicit foreign keys (best practice)
- Maintains data integrity
- Allows Supabase auto-join
- Clean query syntax
- Fast performance

---

## 📊 Schema Diagram

```
auth.users
    ↓ id
profiles (id matches auth.users.id)
    ↑ team_members_user_id_fkey
team_members (user_id)
    - Used for joins in queries
    - Supabase can now auto-detect relationship
```

---

## ✨ Summary

**What to do:**
1. Run the SQL migration (2 foreign keys)
2. Reload schema cache (or wait 2 min)
3. Refresh web app
4. Test teams functionality

**Should now work:**
- ✅ Team member lists
- ✅ Team settings page
- ✅ Invite acceptance
- ✅ All user profile data
- ✅ Avatars and names

**Time to fix:** ~5 minutes

Run the migration and you're done! 🎉
