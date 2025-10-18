# ✅ Team Deletion Fix

## 🐛 Problem

**Error when deleting teams:**
```
Error: insert or update on table "team_activity" violates 
foreign key constraint "team_activity_team_id_fkey"
```

**Issues:**
1. Foreign keys not set to CASCADE on delete
2. Users couldn't delete their own teams (RLS policy missing)

---

## ✅ Solution

### **1. Fixed Foreign Key Constraints**

All team-related tables now CASCADE on delete:

```sql
-- team_activity
ALTER TABLE team_activity
ADD CONSTRAINT team_activity_team_id_fkey
FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE;

-- team_posts
ALTER TABLE team_posts
ADD CONSTRAINT team_posts_team_id_fkey
FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE;

-- team_members
ALTER TABLE team_members
ADD CONSTRAINT team_members_team_id_fkey
FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE;

-- team_apps
ALTER TABLE team_apps
ADD CONSTRAINT team_apps_team_id_fkey
FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE;

-- team_invites
ALTER TABLE team_invites
ADD CONSTRAINT team_invites_team_id_fkey
FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE;
```

---

### **2. Added RLS Policies for User Deletion**

```sql
-- Users (team owners) can delete their own teams
CREATE POLICY "Team owners can delete their teams"
  ON teams FOR DELETE
  USING (owner_id = auth.uid());

-- Users can update their own teams
CREATE POLICY "Team owners can update their teams"
  ON teams FOR UPDATE
  USING (owner_id = auth.uid());
```

---

## 🗄️ Migration

**Run this SQL in Supabase:**
```bash
supabase_migrations/fix_team_deletion_cascade.sql
```

**What it does:**
1. Drops old foreign key constraints
2. Recreates with ON DELETE CASCADE
3. Adds RLS policies for owners
4. Adds helpful comments

---

## 🎯 What Gets Deleted

When a team is deleted, **automatically deletes:**

✅ All team members (removed from team)
✅ All shared apps (team_apps entries)
✅ All team activity (logs)
✅ All team posts (messages)
✅ All team invitations (pending)

**Data is preserved:**
- User profiles (not deleted)
- Original apps (just unshared)
- User data (untouched)

---

## 🔒 Permissions

### **Who Can Delete Teams:**

**Team Owners:**
- ✅ Can delete their own teams
- ✅ All data cascades
- ✅ Works from Team Settings page

**Admins:**
- ✅ Can delete any team
- ✅ Works from Admin Dashboard
- ✅ Shows detailed warning

**Other Members:**
- ❌ Cannot delete teams
- Can only leave team

---

## 🚀 How to Test

### **Test 1: User Deletes Own Team**
```
1. Create a team as user
2. Go to Team → Settings
3. Click "Delete Team" (Danger Zone)
4. Confirm deletion
5. ✅ Team deleted, all related data removed
```

### **Test 2: Admin Deletes Any Team**
```
1. Go to Admin → Teams
2. Find any team
3. Click [🗑️] delete button
4. See warning with counts
5. Click "Delete Team"
6. ✅ Team deleted successfully
```

### **Test 3: Cascade Verification**
```sql
-- Check all related data is gone
SELECT * FROM team_members WHERE team_id = 'DELETED_TEAM_ID';
-- Should return 0 rows

SELECT * FROM team_activity WHERE team_id = 'DELETED_TEAM_ID';
-- Should return 0 rows

SELECT * FROM team_posts WHERE team_id = 'DELETED_TEAM_ID';
-- Should return 0 rows
```

---

## 📋 Checklist

**After running migration:**

- [ ] Run `fix_team_deletion_cascade.sql`
- [ ] Verify foreign keys show CASCADE
- [ ] Test user can delete own team
- [ ] Test admin can delete any team
- [ ] Verify all related data is removed
- [ ] Check RLS policies active

---

## ✅ Complete Fix

**Before:**
```
❌ Foreign keys: NO CASCADE
❌ Users can't delete teams
❌ Orphaned data left behind
```

**After:**
```
✅ Foreign keys: CASCADE on delete
✅ Owners can delete own teams
✅ Admins can delete any team
✅ All related data auto-deleted
```

---

## 🎯 Summary

The fix ensures:
1. **Clean deletion** - No orphaned data
2. **Proper permissions** - Owners and admins can delete
3. **Automatic cascade** - All related data removed
4. **Safe operation** - RLS policies enforced

**Run the migration and team deletion will work perfectly!** 🎉
