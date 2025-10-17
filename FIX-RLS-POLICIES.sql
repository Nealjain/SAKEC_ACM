-- Fix Row Level Security Policies for Blogs Table
-- Copy and paste this into Supabase SQL Editor and click RUN

-- First, drop any existing policies
DROP POLICY IF EXISTS "Allow public read published blogs" ON public.blogs;
DROP POLICY IF EXISTS "Allow public read access to published blogs" ON public.blogs;
DROP POLICY IF EXISTS "Allow authenticated users to read all blogs" ON public.blogs;
DROP POLICY IF EXISTS "Allow authenticated users to insert blogs" ON public.blogs;
DROP POLICY IF EXISTS "Allow authenticated users to update blogs" ON public.blogs;
DROP POLICY IF EXISTS "Allow authenticated users to delete blogs" ON public.blogs;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.blogs;
DROP POLICY IF EXISTS "Enable read for all users" ON public.blogs;

-- Enable RLS (if not already enabled)
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow ANYONE to read published blogs (for public website)
CREATE POLICY "Enable read for published blogs"
ON public.blogs
FOR SELECT
USING (is_published = true);

-- Policy 2: Allow ANYONE to insert blogs (for now - you can restrict this later)
CREATE POLICY "Enable insert for all users"
ON public.blogs
FOR INSERT
WITH CHECK (true);

-- Policy 3: Allow ANYONE to update blogs (for now - you can restrict this later)
CREATE POLICY "Enable update for all users"
ON public.blogs
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Policy 4: Allow ANYONE to delete blogs (for now - you can restrict this later)
CREATE POLICY "Enable delete for all users"
ON public.blogs
FOR DELETE
USING (true);

-- Verify policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'blogs';
