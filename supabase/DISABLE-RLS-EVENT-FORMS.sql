-- ============================================
-- NUCLEAR OPTION: DISABLE RLS ON EVENT FORMS
-- ============================================
-- This completely disables RLS on event registration tables
-- Use this ONLY if the policies aren't working

-- Disable RLS (makes tables publicly accessible)
ALTER TABLE public.event_registration_forms DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_form_fields DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT tablename, rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('event_registration_forms', 'event_form_fields', 'event_registrations');

-- Note: This makes the tables fully public. 
-- The table-level GRANT permissions still apply, so authenticated users can manage everything.
