# ✅ Run Migration Cleanly

## 🎯 Fixed Issue

Added missing `DROP POLICY` statements to prevent "policy already exists" errors.

---

## 🚀 How to Run

### **Option 1: Run Full Migration**

Go to Supabase Dashboard → SQL Editor and run the entire `teams_workspace.sql` file.

The migration now includes:
- ✅ Drop existing policies first
- ✅ Create tables (IF NOT EXISTS)
- ✅ Add foreign keys (IF NOT EXISTS)
- ✅ Create policies (fresh)
- ✅ Grant permissions

**Safe to run multiple times!**

---

### **Option 2: Just Add Foreign Keys** (Quick Fix)

If you only need to fix the relationship errors, just run this:

```sql
-- Add foreign keys for profile relationships
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

Then reload schema cache (or wait 2 minutes).

---

## ✅ Verification

After running, check:

```sql
-- 1. Verify foreign keys exist
SELECT constraint_name, table_name
FROM information_schema.table_constraints
WHERE constraint_name IN (
  'team_members_user_id_fkey',
  'team_invites_invited_by_fkey'
);

-- Should return 2 rows

-- 2. Verify policies exist
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename IN ('teams', 'team_members', 'team_apps')
ORDER BY tablename, policyname;

-- Should return multiple policies
```

---

## 🎯 What Was Fixed

**Added DROP POLICY statements for:**
- ✅ `"Authenticated users can create teams"` (was missing)
- ✅ `"Users can update their own membership"` (was missing)

**Now the migration:**
1. Drops all existing policies first
2. Creates fresh policies
3. No more "already exists" errors

---

## 💡 Tips

**If you get other "already exists" errors:**

Just run:
```sql
DROP POLICY IF EXISTS "policy name here" ON public.table_name;
```

Before the CREATE POLICY statement.

**Safe to run multiple times:**

All statements use:
- `CREATE TABLE IF NOT EXISTS`
- `DROP POLICY IF EXISTS`
- `IF NOT EXISTS` checks in DO blocks

---

## ✨ Summary

**Run the full migration now - it's safe!**

1. Copy entire `teams_workspace.sql` content
2. Paste in Supabase SQL Editor
3. Run
4. Wait 1-2 minutes
5. Refresh web app
6. ✅ Everything works!

No more errors! 🎉
