-- Create additional storage buckets for event registrations
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('event-registrations1', 'event-registrations1', true, 52428800, null), -- 50MB limit
  ('event-registrations2', 'event-registrations2', true, 52428800, null),
  ('event-registrations3', 'event-registrations3', true, 52428800, null)
ON CONFLICT (id) DO UPDATE SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit;

-- Policy to allow public access to view files for new buckets
CREATE POLICY "Public Access 1" ON storage.objects FOR SELECT TO public USING ( bucket_id = 'event-registrations1' );
CREATE POLICY "Public Access 2" ON storage.objects FOR SELECT TO public USING ( bucket_id = 'event-registrations2' );
CREATE POLICY "Public Access 3" ON storage.objects FOR SELECT TO public USING ( bucket_id = 'event-registrations3' );

-- Policy to allow public uploads for new buckets
CREATE POLICY "Public Upload 1" ON storage.objects FOR INSERT TO public WITH CHECK ( bucket_id = 'event-registrations1' );
CREATE POLICY "Public Upload 2" ON storage.objects FOR INSERT TO public WITH CHECK ( bucket_id = 'event-registrations2' );
CREATE POLICY "Public Upload 3" ON storage.objects FOR INSERT TO public WITH CHECK ( bucket_id = 'event-registrations3' );
