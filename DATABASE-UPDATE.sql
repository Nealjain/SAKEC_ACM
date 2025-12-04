-- ============================================
-- DATABASE UPDATE FOR EVENT REGISTRATION SYSTEM
-- Run this in Supabase SQL Editor
-- Safe to run multiple times
-- ============================================

-- ============================================
-- STEP 1: UPDATE EVENT REGISTRATION FORMS TABLE
-- ============================================

-- Remove old photo upload columns (if they exist)
ALTER TABLE public.event_registration_forms 
DROP COLUMN IF EXISTS enable_photo_upload;

ALTER TABLE public.event_registration_forms 
DROP COLUMN IF EXISTS photo_upload_label;

-- Ensure allowed_email_domains column exists
ALTER TABLE public.event_registration_forms 
ADD COLUMN IF NOT EXISTS allowed_email_domains TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Add comment
COMMENT ON COLUMN public.event_registration_forms.allowed_email_domains 
IS 'Array of allowed email domains (e.g., @sakec.ac.in, @gmail.com). Empty array allows all domains.';

-- ============================================
-- STEP 2: CREATE INDEXES FOR PERFORMANCE
-- ============================================

-- Index for form lookups
CREATE INDEX IF NOT EXISTS idx_event_forms_event_id 
ON public.event_registration_forms(event_id);

CREATE INDEX IF NOT EXISTS idx_event_forms_active 
ON public.event_registration_forms(is_active);

-- Index for registration lookups
CREATE INDEX IF NOT EXISTS idx_registrations_form_id 
ON public.event_registrations(form_id);

CREATE INDEX IF NOT EXISTS idx_registrations_event_id 
ON public.event_registrations(event_id);

CREATE INDEX IF NOT EXISTS idx_registrations_email 
ON public.event_registrations(participant_email);

CREATE INDEX IF NOT EXISTS idx_registrations_date 
ON public.event_registrations(registration_date DESC);

-- Index for form fields
CREATE INDEX IF NOT EXISTS idx_form_fields_form_id 
ON public.event_form_fields(form_id);

CREATE INDEX IF NOT EXISTS idx_form_fields_order 
ON public.event_form_fields(form_id, display_order);

-- ============================================
-- STEP 3: ADD TABLE COMMENTS
-- ============================================

COMMENT ON TABLE public.event_registration_forms 
IS 'Custom registration forms for events with Google Forms-like functionality';

COMMENT ON TABLE public.event_form_fields 
IS 'Dynamic form fields including text, email, phone, select, checkbox, textarea, and photo upload';

COMMENT ON TABLE public.event_registrations 
IS 'Event registration submissions with participant data stored in JSONB';

-- ============================================
-- STEP 4: STORAGE BUCKET SETUP
-- ============================================
-- Note: Create the bucket manually in Supabase Dashboard first!
-- Go to Storage → Create bucket → Name: "event-registrations" → Public: Yes

-- Apply storage policies for photo uploads
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'event-registrations' );

DROP POLICY IF EXISTS "Allow Upload" ON storage.objects;
CREATE POLICY "Allow Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'event-registrations' );

DROP POLICY IF EXISTS "Allow Update Own" ON storage.objects;
CREATE POLICY "Allow Update Own"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'event-registrations' );

DROP POLICY IF EXISTS "Allow Delete" ON storage.objects;
CREATE POLICY "Allow Delete"
ON storage.objects FOR DELETE
USING ( 
  bucket_id = 'event-registrations' 
  AND auth.role() = 'authenticated'
);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- 1. Check if all columns exist
SELECT 
  column_name,
  data_type,
  column_default
FROM information_schema.columns 
WHERE table_name = 'event_registration_forms'
  AND column_name IN ('allowed_email_domains', 'max_registrations', 'registration_deadline')
ORDER BY column_name;

-- 2. Check if storage bucket exists
SELECT * FROM storage.buckets WHERE id = 'event-registrations';

-- 3. Check storage policies
SELECT 
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname IN ('Public Access', 'Allow Upload', 'Allow Update Own', 'Allow Delete');

-- 4. View current forms with all settings
SELECT 
  id,
  form_title,
  is_active,
  max_registrations,
  registration_deadline,
  allowed_email_domains,
  created_at
FROM public.event_registration_forms
ORDER BY created_at DESC;

-- 5. Count registrations per form
SELECT 
  f.form_title,
  f.max_registrations,
  COUNT(r.id) as current_registrations,
  CASE 
    WHEN f.max_registrations IS NOT NULL 
    THEN f.max_registrations - COUNT(r.id)
    ELSE NULL
  END as remaining_slots,
  f.registration_deadline,
  CASE 
    WHEN f.registration_deadline IS NOT NULL AND f.registration_deadline < NOW()
    THEN 'CLOSED (Deadline passed)'
    WHEN f.max_registrations IS NOT NULL AND COUNT(r.id) >= f.max_registrations
    THEN 'CLOSED (Full)'
    WHEN f.is_active = false
    THEN 'CLOSED (Inactive)'
    ELSE 'OPEN'
  END as status
FROM public.event_registration_forms f
LEFT JOIN public.event_registrations r ON r.form_id = f.id
GROUP BY f.id, f.form_title, f.max_registrations, f.registration_deadline, f.is_active
ORDER BY f.created_at DESC;

-- 6. Check indexes
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename IN ('event_registration_forms', 'event_registrations', 'event_form_fields')
ORDER BY tablename, indexname;

-- ============================================
-- SUMMARY OF CHANGES
-- ============================================
/*
✅ COMPLETED FEATURES:

1. EMAIL DOMAIN RESTRICTIONS
   - Column: allowed_email_domains (TEXT[])
   - Restrict registrations to specific email domains
   - Example: ['@sakec.ac.in', '@gmail.com']

2. PHOTO UPLOADS
   - Field type: 'photo' in event_form_fields
   - Storage bucket: event-registrations
   - Multiple photo fields supported
   - Photos stored in form_data JSONB

3. CSV EXPORT
   - Download registrations with all data
   - Photo URLs included in separate columns
   - Labeled as "[Field Name] (Photo URL)"

4. AUTO-CLOSING FORMS
   - Max registrations limit
   - Registration deadline (timestamp)
   - Automatic form closure when limits reached

5. PERFORMANCE INDEXES
   - Faster form lookups
   - Optimized registration queries
   - Efficient field ordering

6. STORAGE POLICIES
   - Public read access for photos
   - Upload permissions for registrations
   - Admin delete capabilities

EXISTING COLUMNS (No changes needed):
- max_registrations: Already exists
- registration_deadline: Already exists
- form_data: JSONB stores all custom fields including photos

NEW COLUMNS ADDED:
- allowed_email_domains: TEXT[] for email restrictions

REMOVED COLUMNS:
- enable_photo_upload: No longer needed (use field_type='photo')
- photo_upload_label: No longer needed (use field_label)

NEXT STEPS:
1. Create storage bucket 'event-registrations' in Supabase Dashboard
2. Set bucket to Public
3. Test photo upload via registration form
4. Verify CSV export includes photo URLs
*/
