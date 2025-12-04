-- Migration: Add photo upload settings to event_registration_forms
-- Run this if you already have the event_registration_forms table

-- Add enable_photo_upload column
ALTER TABLE public.event_registration_forms 
ADD COLUMN IF NOT EXISTS enable_photo_upload BOOLEAN DEFAULT false;

-- Add photo_upload_label column
ALTER TABLE public.event_registration_forms 
ADD COLUMN IF NOT EXISTS photo_upload_label TEXT DEFAULT 'Upload Photo (Optional)';

-- Update existing forms to have default values
UPDATE public.event_registration_forms 
SET 
  enable_photo_upload = false,
  photo_upload_label = 'Upload Photo (Optional)'
WHERE enable_photo_upload IS NULL;

-- Add comment
COMMENT ON COLUMN public.event_registration_forms.enable_photo_upload IS 'Whether to show photo upload field in registration form';
COMMENT ON COLUMN public.event_registration_forms.photo_upload_label IS 'Custom label text for photo upload field';
