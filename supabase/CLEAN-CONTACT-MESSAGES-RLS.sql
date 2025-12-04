-- ============================================
-- CLEAN CONTACT MESSAGES RLS POLICIES
-- Removes all duplicate policies and creates clean ones
-- ============================================

-- Step 1: Drop ALL existing policies on contact_messages
DROP POLICY IF EXISTS "Public insert contact" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins read contact" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins update contact" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow public to insert contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow admins to read contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow admins to update contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Enable insert for anon users" ON public.contact_messages;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON public.contact_messages;
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON public.contact_messages;

-- Step 2: Ensure RLS is enabled
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Step 3: Create ONLY 3 clean policies

-- Policy 1: Allow ANYONE (including anonymous) to INSERT
CREATE POLICY "allow_public_insert_contact"
ON public.contact_messages
FOR INSERT
TO public
WITH CHECK (true);

-- Policy 2: Allow authenticated users (admins) to SELECT
CREATE POLICY "allow_admin_select_contact"
ON public.contact_messages
FOR SELECT
TO authenticated
USING (true);

-- Policy 3: Allow authenticated users (admins) to UPDATE
CREATE POLICY "allow_admin_update_contact"
ON public.contact_messages
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Step 4: Grant permissions explicitly
GRANT INSERT ON public.contact_messages TO anon;
GRANT INSERT ON public.contact_messages TO authenticated;
GRANT SELECT, UPDATE ON public.contact_messages TO authenticated;

-- Step 5: Verify
SELECT 
    policyname,
    cmd,
    roles
FROM pg_policies
WHERE tablename = 'contact_messages'
ORDER BY policyname;

-- Should show exactly 3 policies:
-- 1. allow_admin_select_contact (SELECT, authenticated)
-- 2. allow_admin_update_contact (UPDATE, authenticated)
-- 3. allow_public_insert_contact (INSERT, public)
