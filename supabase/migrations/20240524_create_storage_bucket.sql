-- Create storage bucket for event registrations if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-registrations', 'event-registrations', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow public access to view files
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'event-registrations' );

-- Policy to allow authenticated users (or anyone if we want open uploads) to upload
-- Since registration is public, we allow public uploads
CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
TO public
WITH CHECK ( bucket_id = 'event-registrations' );

-- Policy to allow updates (optional, maybe for admins)
CREATE POLICY "Public Update"
ON storage.objects FOR UPDATE
TO public
USING ( bucket_id = 'event-registrations' );
