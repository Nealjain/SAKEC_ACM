-- ============================================
-- FIX SENT_EMAILS RLS POLICY
-- Allow authenticated users to INSERT
-- ============================================

-- Drop all existing policies
DROP POLICY IF EXISTS "Admins insert sent emails" ON public.sent_emails;
DROP POLICY IF EXISTS "Admins read sent emails" ON public.sent_emails;
DROP POLICY IF EXISTS "Enable insert for service role" ON public.sent_emails;
DROP POLICY IF EXISTS "Allow admins to insert sent emails" ON public.sent_emails;
DROP POLICY IF EXISTS "Allow admins to read sent emails" ON public.sent_emails;

-- Ensure RLS is enabled
ALTER TABLE public.sent_emails ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow authenticated users to INSERT
CREATE POLICY "authenticated_insert_sent_emails"
ON public.sent_emails
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy 2: Allow authenticated users to SELECT
CREATE POLICY "authenticated_select_sent_emails"
ON public.sent_emails
FOR SELECT
TO authenticated
USING (true);

-- Grant permissions
GRANT INSERT, SELECT ON public.sent_emails TO authenticated;

-- Verify
SELECT 
    policyname,
    cmd,
    roles
FROM pg_policies
WHERE tablename = 'sent_emails'
ORDER BY policyname;

-- Should show:
-- 1. authenticated_insert_sent_emails (INSERT, authenticated)
-- 2. authenticated_select_sent_emails (SELECT, authenticated)
