-- Create storage buckets for images
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('team-photos', 'team-photos', true),
  ('event-photos', 'event-photos', true),
  ('gallery-photos', 'gallery-photos', true),
  ('blog-photos', 'blog-photos', true);

-- Set up storage policies for public access
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (true);
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own uploads" ON storage.objects FOR UPDATE USING (auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own uploads" ON storage.objects FOR DELETE USING (auth.uid()::text = (storage.foldername(name))[1]);
