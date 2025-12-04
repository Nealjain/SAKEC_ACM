-- ============================================
-- COMPLETE DATABASE UPDATE SCRIPT
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. CREATE SENT_EMAILS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.sent_emails (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    recipient_email text NOT NULL,
    sender_email text NOT NULL,
    sender_name text NOT NULL,
    subject text NOT NULL,
    message text NOT NULL,
    sent_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    sent_by text,
    status text DEFAULT 'sent',
    error_message text
);

-- Enable RLS on sent_emails
ALTER TABLE public.sent_emails ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies
DROP POLICY IF EXISTS "Allow admins to insert sent emails" ON public.sent_emails;
DROP POLICY IF EXISTS "Allow admins to read sent emails" ON public.sent_emails;
DROP POLICY IF EXISTS "Enable insert for service role" ON public.sent_emails;
DROP POLICY IF EXISTS "Enable read for service role" ON public.sent_emails;

-- Policy: Allow service_role to insert (for backend API)
CREATE POLICY "Enable insert for service role"
ON public.sent_emails
FOR INSERT
TO service_role
WITH CHECK (true);

-- Policy: Allow authenticated users (admins) to insert
CREATE POLICY "Allow admins to insert sent emails"
ON public.sent_emails
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy: Allow authenticated users (admins) to read
CREATE POLICY "Allow admins to read sent emails"
ON public.sent_emails
FOR SELECT
TO authenticated
USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sent_emails_sent_at ON public.sent_emails(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_sent_emails_recipient ON public.sent_emails(recipient_email);

-- Grant permissions
GRANT INSERT, SELECT ON public.sent_emails TO service_role;
GRANT INSERT, SELECT ON public.sent_emails TO authenticated;

-- ============================================
-- 2. FIX CONTACT_MESSAGES RLS POLICIES
-- ============================================

-- Enable RLS on contact_messages (if not already enabled)
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies
DROP POLICY IF EXISTS "Allow public to insert contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow admins to read contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow admins to update contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Enable insert for anon users" ON public.contact_messages;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON public.contact_messages;
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON public.contact_messages;

-- NEW POLICY: Allow ANYONE (including anonymous/public) to INSERT
CREATE POLICY "Enable insert for anonymous users"
ON public.contact_messages
FOR INSERT
TO public
WITH CHECK (true);

-- NEW POLICY: Allow authenticated users to SELECT
CREATE POLICY "Enable read for authenticated users"
ON public.contact_messages
FOR SELECT
TO authenticated
USING (true);

-- NEW POLICY: Allow authenticated users to UPDATE
CREATE POLICY "Allow admins to update contact messages"
ON public.contact_messages
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at DESC);

-- ============================================
-- 3. VERIFY TABLES EXIST
-- ============================================

-- Check if contact_messages table exists, if not create it
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'contact_messages'
    ) THEN
        CREATE TABLE public.contact_messages (
            id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
            name text NOT NULL,
            email text NOT NULL,
            subject text NOT NULL,
            message text NOT NULL,
            created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
            is_read boolean DEFAULT false
        );
        
        RAISE NOTICE 'Created contact_messages table';
    ELSE
        RAISE NOTICE 'contact_messages table already exists';
    END IF;
END $$;

-- ============================================
-- 4. GRANT PERMISSIONS
-- ============================================

-- Grant permissions to anon role for contact_messages INSERT
GRANT INSERT ON public.contact_messages TO anon;
GRANT INSERT ON public.contact_messages TO authenticated;

-- Grant permissions to authenticated role for sent_emails
GRANT INSERT, SELECT ON public.sent_emails TO authenticated;

-- Grant permissions to authenticated role for contact_messages SELECT/UPDATE
GRANT SELECT, UPDATE ON public.contact_messages TO authenticated;

-- ============================================
-- 5. VERIFICATION QUERIES
-- ============================================

-- Check RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE tablename IN ('contact_messages', 'sent_emails')
ORDER BY tablename;

-- Check policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename IN ('contact_messages', 'sent_emails')
ORDER BY tablename, policyname;

-- ============================================
-- DONE!
-- ============================================
-- After running this script:
-- 1. Contact form will save to contact_messages
-- 2. Admin emails will save to sent_emails
-- 3. All RLS policies are properly configured
-- ============================================
