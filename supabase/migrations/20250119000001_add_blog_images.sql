-- Create blog_images table for multiple images per blog post
CREATE TABLE IF NOT EXISTS blog_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blog_id UUID REFERENCES blogs(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_blog_images_blog_id ON blog_images(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_images_order ON blog_images(blog_id, display_order);

-- Add RLS policies
ALTER TABLE blog_images ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to blog images"
  ON blog_images FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users to manage blog images"
  ON blog_images FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
