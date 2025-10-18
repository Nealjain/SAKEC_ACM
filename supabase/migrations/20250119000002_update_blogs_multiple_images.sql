-- Add multiple image columns to blogs table (min 1, max 4)
ALTER TABLE blogs 
  ADD COLUMN IF NOT EXISTS image_1 TEXT,
  ADD COLUMN IF NOT EXISTS image_2 TEXT,
  ADD COLUMN IF NOT EXISTS image_3 TEXT,
  ADD COLUMN IF NOT EXISTS image_4 TEXT;

-- Migrate existing image_url to image_1
UPDATE blogs 
SET image_1 = image_url 
WHERE image_url IS NOT NULL AND image_1 IS NULL;

-- Add constraint to ensure at least one image
ALTER TABLE blogs 
  ADD CONSTRAINT blogs_at_least_one_image 
  CHECK (image_1 IS NOT NULL);

-- Optional: Drop old image_url column after migration
-- ALTER TABLE blogs DROP COLUMN IF EXISTS image_url;
