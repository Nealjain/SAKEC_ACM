-- Enable Row Level Security on contact_messages table
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public to insert contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow admins to read contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow admins to update contact messages" ON public.contact_messages;

-- Policy: Allow anyone to insert contact messages (public form submission)
CREATE POLICY "Allow public to insert contact messages"
ON public.contact_messages
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Policy: Allow authenticated users (admins) to read all contact messages
CREATE POLICY "Allow admins to read contact messages"
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
