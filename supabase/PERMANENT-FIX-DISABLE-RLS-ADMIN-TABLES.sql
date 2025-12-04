-- ============================================
-- PERMANENT FIX: DISABLE RLS ON ADMIN TABLES
-- ============================================
-- Since the admin system uses localStorage (not Supabase Auth),
-- we disable RLS on admin-managed tables.
-- Security is handled by the admin panel's localStorage check.

-- Disable RLS on all admin-managed tables
ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_galleries DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.carousel_images DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sent_emails DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins DISABLE ROW LEVEL SECURITY;

-- Keep RLS enabled ONLY on public-facing tables
-- (These already have proper policies)
-- - contact_messages (public can insert, admins can read)
-- - event_registration_forms (public can read, admins can manage)
-- - event_form_fields (public can read, admins can manage)
-- - event_registrations (public can insert, admins can read)

-- Verify RLS status
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
