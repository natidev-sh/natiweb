-- ============================================
-- ADMIN SETUP FOR NATI.DEV
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Set yourself as admin (Replace with your email)
UPDATE auth.users 
SET raw_user_meta_data = 
  CASE 
    WHEN raw_user_meta_data IS NULL THEN '{"role": "admin"}'::jsonb
    ELSE raw_user_meta_data || '{"role": "admin"}'::jsonb
  END
WHERE email = 'ertacspotify@gmail.com';  -- ⬅️ REPLACE THIS WITH YOUR EMAIL

-- 2. Fix ALL RLS policies for ticket updates
-- Drop existing policies
DROP POLICY IF EXISTS "Users can update own tickets" ON support_tickets;
DROP POLICY IF EXISTS "Admins can update all tickets" ON support_tickets;

-- Recreate with proper logic
-- Users can only update their own open/waiting tickets
CREATE POLICY "Users can update own tickets"
ON support_tickets FOR UPDATE
USING (auth.uid() = user_id AND status IN ('open', 'waiting_for_user'))
WITH CHECK (auth.uid() = user_id AND status IN ('open', 'waiting_for_user'));

-- Admins can update ALL tickets to ANY status
CREATE POLICY "Admins can update all tickets"
ON support_tickets FOR UPDATE
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  OR
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)
WITH CHECK (true); -- Admins can set ANY status

-- 3. Verify your admin status
SELECT 
  id,
  email,
  raw_user_meta_data->>'role' as role
FROM auth.users
WHERE email = 'YOUR_EMAIL@example.com';  -- ⬅️ REPLACE THIS WITH YOUR EMAIL

-- After running this, LOG OUT and LOG BACK IN for changes to take effect!
