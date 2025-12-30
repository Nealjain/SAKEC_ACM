-- Add photo columns to announcements table
ALTER TABLE public.announcements 
ADD COLUMN IF NOT EXISTS photos text[] DEFAULT '{}';

-- Add comment for the new column
COMMENT ON COLUMN public.announcements.photos IS 'Array of photo URLs for the announcement';