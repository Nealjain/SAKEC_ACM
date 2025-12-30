
-- Fix Blogs RLS
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Allow public read access to blogs (needed for the website to display them)
CREATE POLICY "Public Read Blogs"
ON blogs FOR SELECT
TO public
USING (true);

-- Allow public insert/update/delete for blogs (needed for admin panel)
-- We need to drop existing policies first to avoid "policy already exists" errors if re-running
DROP POLICY IF EXISTS "Public Manage Blogs" ON blogs;
DROP POLICY IF EXISTS "Public Insert Blogs" ON blogs;
DROP POLICY IF EXISTS "Public Update Blogs" ON blogs;
DROP POLICY IF EXISTS "Public Delete Blogs" ON blogs;

CREATE POLICY "Public Manage Blogs"
ON blogs FOR ALL
TO public
USING (true)
WITH CHECK (true);


-- Fix Contact Messages RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow public insert (for contact form)
DROP POLICY IF EXISTS "Allow Public Insert" ON contact_messages;
CREATE POLICY "Allow Public Insert"
ON contact_messages FOR INSERT
TO public
WITH CHECK (true);

-- Allow public select/update/delete (for admin panel)
DROP POLICY IF EXISTS "Allow Public Access" ON contact_messages;
DROP POLICY IF EXISTS "Allow Public Update" ON contact_messages;
DROP POLICY IF EXISTS "Allow Public Delete" ON contact_messages;

CREATE POLICY "Allow Public Manage Contact"
ON contact_messages FOR ALL
TO public
USING (true)
WITH CHECK (true);
