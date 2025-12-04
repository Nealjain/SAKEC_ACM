-- Enable Row Level Security on contact_messages table
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public to insert contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow admins to read contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow admins to update contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Enable insert for anon users" ON public.contact_messages;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON public.contact_messages;

-- Policy: Allow ANYONE (including anonymous) to insert contact messages
CREATE POLICY "Enable insert for anon users"
ON public.contact_messages
FOR INSERT
TO public
WITH CHECK (true);

-- Policy: Allow authenticated users (admins) to read all contact messages
CREATE POLICY "Enable read for authenticated users"
ON public.contact_messages
FOR SELECT
TO authenticated
USING (true);

-- Policy: Allow authenticated users (admins) to update contact messages (mark as read)
CREATE POLICY "Allow admins to update contact messages"
ON public.contact_messages
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Verify the table exists and has correct structure
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'contact_messages') THEN
        CREATE TABLE public.contact_messages (
            id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
            name text NOT NULL,
            email text NOT NULL,
            subject text NOT NULL,
            message text NOT NULL,
            created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
            is_read boolean DEFAULT false
        );
    END IF;
END $$;
