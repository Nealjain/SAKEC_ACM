-- ============================================
-- QUICK FIX FOR 406 ERRORS
-- ============================================
-- This specifically fixes the event_registration_forms 406 errors

-- First, check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('event_registration_forms', 'event_form_fields', 'event_registrations');

-- Drop all existing policies for these tables
DROP POLICY IF EXISTS "Public read forms" ON public.event_registration_forms;
DROP POLICY IF EXISTS "Admins manage forms" ON public.event_registration_forms;
DROP POLICY IF EXISTS "Allow public read access to forms" ON public.event_registration_forms;
DROP POLICY IF EXISTS "Allow authenticated users to manage forms" ON public.event_registration_forms;
DROP POLICY IF EXISTS "Public can read active forms" ON public.event_registration_forms;
DROP POLICY IF EXISTS "Authenticated users can manage forms" ON public.event_registration_forms;
DROP POLICY IF EXISTS "Public can read registration forms" ON public.event_registration_forms;
DROP POLICY IF EXISTS "Authenticated users can manage registration forms" ON public.event_registration_forms;

DROP POLICY IF EXISTS "Public read fields" ON public.event_form_fields;
DROP POLICY IF EXISTS "Admins manage fields" ON public.event_form_fields;
DROP POLICY IF EXISTS "Public can read form fields" ON public.event_form_fields;
DROP POLICY IF EXISTS "Authenticated users can manage fields" ON public.event_form_fields;
DROP POLICY IF EXISTS "Public can read event form fields" ON public.event_form_fields;
DROP POLICY IF EXISTS "Authenticated users can manage form fields" ON public.event_form_fields;

DROP POLICY IF EXISTS "Public insert registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Admins read registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Public can submit registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Authenticated users can read registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Authenticated users can manage registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Authenticated users can delete registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Public can submit event registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Authenticated users can update registrations" ON public.event_registrations;

-- Create simple, permissive policies
-- EVENT_REGISTRATION_FORMS: Allow everyone to read, authenticated to manage
CREATE POLICY "allow_all_read_forms"
ON public.event_registration_forms
FOR SELECT
USING (true);

CREATE POLICY "allow_auth_all_forms"
ON public.event_registration_forms
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- EVENT_FORM_FIELDS: Allow everyone to read, authenticated to manage
CREATE POLICY "allow_all_read_fields"
ON public.event_form_fields
FOR SELECT
USING (true);

CREATE POLICY "allow_auth_all_fields"
ON public.event_form_fields
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- EVENT_REGISTRATIONS: Allow everyone to insert, authenticated to read/manage
CREATE POLICY "allow_all_insert_registrations"
ON public.event_registrations
FOR INSERT
WITH CHECK (true);

CREATE POLICY "allow_auth_read_registrations"
ON public.event_registrations
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "allow_auth_update_registrations"
ON public.event_registrations
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "allow_auth_delete_registrations"
ON public.event_registrations
FOR DELETE
TO authenticated
USING (true);

-- Verify the policies were created
SELECT 
  tablename,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename IN ('event_registration_forms', 'event_form_fields', 'event_registrations')
ORDER BY tablename, policyname;
