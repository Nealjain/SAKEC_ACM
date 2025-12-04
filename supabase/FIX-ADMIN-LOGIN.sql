-- ============================================
-- FIX ADMIN LOGIN
-- Allow anon users to SELECT from admins table
-- (needed for PHP authentication)
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Admins read own data" ON public.admins;
DROP POLICY IF EXISTS "Admins update own data" ON public.admins;
DROP POLICY IF EXISTS "Allow anon to read admins for login" ON public.admins;

-- Policy 1: Allow ANYONE (including anon) to SELECT admins
-- This is needed for PHP login authentication
CREATE POLICY "Allow anon to read admins for login"
ON public.admins
FOR SELECT
TO public
USING (true);

-- Policy 2: Allow authenticated users to UPDATE admins
CREATE POLICY "Admins update own data"
ON public.admins
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Grant SELECT permission to anon role
GRANT SELECT ON public.admins TO anon;
GRANT SELECT, UPDATE ON public.admins TO authenticated;

-- Verify
SELECT 
    policyname,
    cmd,
    roles
FROM pg_policies
WHERE tablename = 'admins'
ORDER BY policyname;

-- Should show:
-- 1. Allow anon to read admins for login (SELECT, public)
-- 2. Admins update own data (UPDATE, authenticated)
