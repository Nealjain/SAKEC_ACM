-- Storage Bucket Setup for Event Registration Photos
-- Run this in Supabase SQL Editor

-- First, create the bucket (if it doesn't exist)
-- Note: You may need to create this manually in the Supabase Dashboard
-- Go to Storage → Create bucket → Name: "event-registrations" → Public: Yes

-- Set up storage policies for the event-registrations bucket

-- 1. Allow public read access (so photos can be viewed)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'event-registrations' );

-- 2. Allow anyone to upload (for registration forms)
DROP POLICY IF EXISTS "Allow Upload" ON storage.objects;
CREATE POLICY "Allow Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'event-registrations' );

-- 3. Allow users to update their own uploads
DROP POLICY IF EXISTS "Allow Update Own" ON storage.objects;
CREATE POLICY "Allow Update Own"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'event-registrations' );

-- 4. Allow authenticated users to delete (optional - for admins)
DROP POLICY IF EXISTS "Allow Delete" ON storage.objects;
CREATE POLICY "Allow Delete"
ON storage.objects FOR DELETE
USING ( 
  bucket_id = 'event-registrations' 
  AND auth.role() = 'authenticated'
);

-- Verify the policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage';

-- Check if bucket exists
SELECT * FROM storage.buckets WHERE id = 'event-registrations';
