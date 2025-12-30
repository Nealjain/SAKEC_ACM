-- Enable RLS on contact_messages
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow public to insert messages (for the contact form)
CREATE POLICY "Allow Public Insert"
ON contact_messages FOR INSERT
TO public
WITH CHECK (true);

-- Allow public to view/update/delete messages (for the admin panel)
-- Note: In a production app with proper auth, this should be restricted to authenticated admin users.
CREATE POLICY "Allow Public Access"
ON contact_messages FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow Public Update"
ON contact_messages FOR UPDATE
TO public
USING (true);

CREATE POLICY "Allow Public Delete"
ON contact_messages FOR DELETE
TO public
USING (true);
