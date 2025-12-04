-- ============================================
-- FIX EVENT REGISTRATION FORMS RLS POLICIES
-- ============================================
-- This fixes the 406 Not Acceptable errors when querying event_registration_forms

-- Enable RLS
ALTER TABLE public.event_registration_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_form_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- ============================================
-- EVENT_REGISTRATION_FORMS POLICIES
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Public read forms" ON public.event_registration_forms;
DROP POLICY IF EXISTS "Admins manage forms" ON public.event_registration_forms;
DROP POLICY IF EXISTS "Allow public read access to forms" ON public.event_registration_forms;
DROP POLICY IF EXISTS "Allow authenticated users to manage forms" ON public.event_registration_forms;

-- Allow anyone to read active forms (needed for public event registration)
CREATE POLICY "Public can read active forms"
ON public.event_registration_forms
FOR SELECT
TO public
USING (true);  -- Allow reading all forms (both active and inactive for admin view)

-- Allow authenticated users (admins) to manage forms
CREATE POLICY "Authenticated users can manage forms"
ON public.event_registration_forms
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================
-- EVENT_FORM_FIELDS POLICIES
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Public read fields" ON public.event_form_fields;
DROP POLICY IF EXISTS "Admins manage fields" ON public.event_form_fields;

-- Allow anyone to read form fields
CREATE POLICY "Public can read form fields"
ON public.event_form_fields
FOR SELECT
TO public
USING (true);

-- Allow authenticated users to manage fields
CREATE POLICY "Authenticated users can manage fields"
ON public.event_form_fields
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================
-- EVENT_REGISTRATIONS POLICIES
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Public insert registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Admins read registrations" ON public.event_registrations;

-- Allow anyone to submit registrations
CREATE POLICY "Public can submit registrations"
ON public.event_registrations
FOR INSERT
TO public
WITH CHECK (true);

-- Allow authenticated users to read all registrations
CREATE POLICY "Authenticated users can read registrations"
ON public.event_registrations
FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to update/delete registrations
CREATE POLICY "Authenticated users can manage registrations"
ON public.event_registrations
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete registrations"
ON public.event_registrations
FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

-- Grant permissions to anon users (public)
GRANT SELECT ON public.event_registration_forms TO anon;
GRANT SELECT ON public.event_form_fields TO anon;
GRANT INSERT ON public.event_registrations TO anon;

-- Grant all permissions to authenticated users
GRANT ALL ON public.event_registration_forms TO authenticated;
GRANT ALL ON public.event_form_fields TO authenticated;
GRANT ALL ON public.event_registrations TO authenticated;

-- ============================================
-- VERIFY POLICIES
-- ============================================

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
WHERE tablename IN ('event_registration_forms', 'event_form_fields', 'event_registrations')
ORDER BY tablename, policyname;
