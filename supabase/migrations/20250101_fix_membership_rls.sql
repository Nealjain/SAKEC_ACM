
-- Enable RLS on membership_applications
ALTER TABLE membership_applications ENABLE ROW LEVEL SECURITY;

-- Allow public to insert applications (for the join form)
CREATE POLICY "Allow Public Insert"
ON membership_applications FOR INSERT
TO public
WITH CHECK (true);

-- Allow public to view applications (for the admin panel)
-- Note: In a production app with proper auth, this should be restricted to authenticated admin users.
CREATE POLICY "Allow Public Select"
ON membership_applications FOR SELECT
TO public
USING (true);

-- Allow public to update applications (for the admin panel to approve/reject)
CREATE POLICY "Allow Public Update"
ON membership_applications FOR UPDATE
TO public
USING (true);

-- Create storage bucket for membership payment screenshots
INSERT INTO storage.buckets (id, name, public)
VALUES ('membership_payment_screenshots', 'membership_payment_screenshots', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow public access to view files
CREATE POLICY "Public Access Screenshots"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'membership_payment_screenshots' );

-- Policy to allow public uploads
CREATE POLICY "Public Upload Screenshots"
ON storage.objects FOR INSERT
TO public
WITH CHECK ( bucket_id = 'membership_payment_screenshots' );
