-- Enable RLS on sent_emails
ALTER TABLE sent_emails ENABLE ROW LEVEL SECURITY;

-- Allow anon (public) to insert into sent_emails
-- This is required because the admin panel uses custom auth and the PHP backend uses the anon key
CREATE POLICY "Allow anon insert sent_emails"
ON sent_emails
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow anon to select from sent_emails
-- This is required for the Email History tab in the admin panel
CREATE POLICY "Allow anon select sent_emails"
ON sent_emails
FOR SELECT
TO anon
USING (true);
