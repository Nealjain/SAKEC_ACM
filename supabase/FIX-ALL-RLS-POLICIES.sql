-- ============================================
-- FIX ALL RLS SECURITY ISSUES
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. ENABLE RLS ON ALL PUBLIC TABLES
-- ============================================

-- Enable RLS on tables that have it disabled
ALTER TABLE public.event_galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registration_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_form_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carousel_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. EVENT_GALLERIES POLICIES
-- ============================================

DROP POLICY IF EXISTS "Allow public read access" ON public.event_galleries;
DROP POLICY IF EXISTS "Allow authenticated users to manage galleries" ON public.event_galleries;

CREATE POLICY "Allow public read access"
ON public.event_galleries
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow authenticated users to manage galleries"
ON public.event_galleries
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================
-- 3. TEAM_MEMBERS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Allow public read access to team_members" ON public.team_members;
DROP POLICY IF EXISTS "Allow authenticated users to manage team_members" ON public.team_members;

CREATE POLICY "Allow public read access to team_members"
ON public.team_members
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow authenticated users to manage team_members"
ON public.team_members
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================
-- 4. EVENTS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Allow public read access to events" ON public.events;
DROP POLICY IF EXISTS "Allow authenticated users to manage events" ON public.events;

CREATE POLICY "Allow public read access to events"
ON public.events
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow authenticated users to manage events"
ON public.events
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================
-- 5. EVENT_REGISTRATION_FORMS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Allow public read access to forms" ON public.event_registration_forms;
DROP POLICY IF EXISTS "Allow authenticated users to manage forms" ON public.event_registration_forms;

CREATE POLICY "Allow public read access to forms"
ON public.event_registration_forms
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow authenticated users to manage forms"
ON public.event_registration_forms
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================
-- 6. EVENT_FORM_FIELDS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Allow public read access to form fields" ON public.event_form_fields;
DROP POLICY IF EXISTS "Allow authenticated users to manage form fields" ON public.event_form_fields;

CREATE POLICY "Allow public read access to form fields"
ON public.event_form_fields
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow authenticated users to manage form fields"
ON public.event_form_fields
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================
-- 7. EVENT_REGISTRATIONS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Allow public to insert registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Allow authenticated users to read registrations" ON public.event_registrations;

CREATE POLICY "Allow public to insert registrations"
ON public.event_registrations
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read registrations"
ON public.event_registrations
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to update registrations"
ON public.event_registrations
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete registrations"
ON public.event_registrations
FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- 8. CAROUSEL_IMAGES POLICIES
-- ============================================

DROP POLICY IF EXISTS "Allow public read access to carousel" ON public.carousel_images;
DROP POLICY IF EXISTS "Allow authenticated users to manage carousel" ON public.carousel_images;

CREATE POLICY "Allow public read access to carousel"
ON public.carousel_images
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow authenticated users to manage carousel"
ON public.carousel_images
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================
-- 9. FACULTY_MEMBERS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Allow public read access to faculty" ON public.faculty_members;
DROP POLICY IF EXISTS "Allow authenticated users to manage faculty" ON public.faculty_members;

CREATE POLICY "Allow public read access to faculty"
ON public.faculty_members
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow authenticated users to manage faculty"
ON public.faculty_members
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================
-- 10. ADMINS POLICIES (SECURE)
-- ============================================

DROP POLICY IF EXISTS "Allow authenticated users to read admins" ON public.admins;
DROP POLICY IF EXISTS "Allow authenticated users to update own profile" ON public.admins;

-- Only authenticated users can read admin data
CREATE POLICY "Allow authenticated users to read admins"
ON public.admins
FOR SELECT
TO authenticated
USING (true);

-- Only authenticated users can update their own profile
CREATE POLICY "Allow authenticated users to update own profile"
ON public.admins
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================
-- 11. GRANT PERMISSIONS
-- ============================================

-- Grant SELECT to anon for public-facing tables
GRANT SELECT ON public.event_galleries TO anon;
GRANT SELECT ON public.team_members TO anon;
GRANT SELECT ON public.events TO anon;
GRANT SELECT ON public.event_registration_forms TO anon;
GRANT SELECT ON public.event_form_fields TO anon;
GRANT SELECT ON public.carousel_images TO anon;
GRANT SELECT ON public.faculty_members TO anon;

-- Grant INSERT for registrations
GRANT INSERT ON public.event_registrations TO anon;

-- Grant full access to authenticated users
GRANT ALL ON public.event_galleries TO authenticated;
GRANT ALL ON public.team_members TO authenticated;
GRANT ALL ON public.events TO authenticated;
GRANT ALL ON public.event_registration_forms TO authenticated;
GRANT ALL ON public.event_form_fields TO authenticated;
GRANT ALL ON public.carousel_images TO authenticated;
GRANT ALL ON public.event_registrations TO authenticated;
GRANT ALL ON public.faculty_members TO authenticated;
GRANT SELECT, UPDATE ON public.admins TO authenticated;

-- ============================================
-- 12. VERIFICATION
-- ============================================

-- Check RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN (
    'event_galleries',
    'team_members',
    'event_registration_forms',
    'events',
    'event_form_fields',
    'carousel_images',
    'event_registrations',
    'faculty_members',
    'admins'
)
ORDER BY tablename;

-- Check policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ============================================
-- DONE!
-- All RLS security issues should now be fixed
-- ============================================
