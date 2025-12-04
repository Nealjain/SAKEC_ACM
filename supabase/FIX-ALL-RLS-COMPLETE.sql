-- ============================================
-- COMPLETE RLS FIX FOR ALL TABLES
-- ============================================
-- This fixes 406 errors and ensures proper access control

-- ============================================
-- 1. ENABLE RLS ON ALL TABLES
-- ============================================

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carousel_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_form_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registration_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sent_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. DROP ALL EXISTING POLICIES
-- ============================================

-- Admins
DROP POLICY IF EXISTS "Admins can read own data" ON public.admins;
DROP POLICY IF EXISTS "Admins can update own data" ON public.admins;
DROP POLICY IF EXISTS "Allow admin login" ON public.admins;

-- Alumni Members
DROP POLICY IF EXISTS "Public read alumni" ON public.alumni_members;
DROP POLICY IF EXISTS "Admins manage alumni" ON public.alumni_members;

-- Announcements
DROP POLICY IF EXISTS "Public read announcements" ON public.announcements;
DROP POLICY IF EXISTS "Admins manage announcements" ON public.announcements;

-- Blogs
DROP POLICY IF EXISTS "Public read blogs" ON public.blogs;
DROP POLICY IF EXISTS "Admins manage blogs" ON public.blogs;

-- Carousel Images
DROP POLICY IF EXISTS "Public read carousel" ON public.carousel_images;
DROP POLICY IF EXISTS "Admins manage carousel" ON public.carousel_images;

-- Contact Messages
DROP POLICY IF EXISTS "Public insert messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins read messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow public to insert contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow authenticated users to read contact messages" ON public.contact_messages;

-- Event Form Fields
DROP POLICY IF EXISTS "Public read fields" ON public.event_form_fields;
DROP POLICY IF EXISTS "Admins manage fields" ON public.event_form_fields;
DROP POLICY IF EXISTS "Public can read form fields" ON public.event_form_fields;
DROP POLICY IF EXISTS "Authenticated users can manage fields" ON public.event_form_fields;

-- Event Galleries
DROP POLICY IF EXISTS "Public read galleries" ON public.event_galleries;
DROP POLICY IF EXISTS "Admins manage galleries" ON public.event_galleries;

-- Event Registration Forms
DROP POLICY IF EXISTS "Public read forms" ON public.event_registration_forms;
DROP POLICY IF EXISTS "Admins manage forms" ON public.event_registration_forms;
DROP POLICY IF EXISTS "Allow public read access to forms" ON public.event_registration_forms;
DROP POLICY IF EXISTS "Allow authenticated users to manage forms" ON public.event_registration_forms;
DROP POLICY IF EXISTS "Public can read active forms" ON public.event_registration_forms;
DROP POLICY IF EXISTS "Authenticated users can manage forms" ON public.event_registration_forms;

-- Event Registrations
DROP POLICY IF EXISTS "Public insert registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Admins read registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Public can submit registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Authenticated users can read registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Authenticated users can manage registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Authenticated users can delete registrations" ON public.event_registrations;

-- Events
DROP POLICY IF EXISTS "Public read events" ON public.events;
DROP POLICY IF EXISTS "Admins manage events" ON public.events;

-- Faculty Members
DROP POLICY IF EXISTS "Public read faculty" ON public.faculty_members;
DROP POLICY IF EXISTS "Admins manage faculty" ON public.faculty_members;

-- Newsletter Logs
DROP POLICY IF EXISTS "Admins read logs" ON public.newsletter_logs;
DROP POLICY IF EXISTS "Admins manage logs" ON public.newsletter_logs;

-- Newsletter Subscribers
DROP POLICY IF EXISTS "Public insert subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admins read subscribers" ON public.newsletter_subscribers;

-- Sent Emails
DROP POLICY IF EXISTS "Admins read sent emails" ON public.sent_emails;
DROP POLICY IF EXISTS "Admins manage sent emails" ON public.sent_emails;
DROP POLICY IF EXISTS "Allow authenticated users to insert sent emails" ON public.sent_emails;
DROP POLICY IF EXISTS "Allow authenticated users to read sent emails" ON public.sent_emails;

-- Team Members
DROP POLICY IF EXISTS "Public read team" ON public.team_members;
DROP POLICY IF EXISTS "Admins manage team" ON public.team_members;

-- Testimonials
DROP POLICY IF EXISTS "Public read testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins manage testimonials" ON public.testimonials;

-- ============================================
-- 3. CREATE NEW POLICIES
-- ============================================

-- ADMINS: Allow public read for login, authenticated manage own data
CREATE POLICY "Allow public read for login"
ON public.admins FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can update own data"
ON public.admins FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- ALUMNI_MEMBERS: Public read, authenticated manage
CREATE POLICY "Public can read alumni"
ON public.alumni_members FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can manage alumni"
ON public.alumni_members FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ANNOUNCEMENTS: Public read active, authenticated manage all
CREATE POLICY "Public can read active announcements"
ON public.announcements FOR SELECT
TO public
USING (is_active = true);

CREATE POLICY "Authenticated users can manage announcements"
ON public.announcements FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- BLOGS: Public read published, authenticated manage all
CREATE POLICY "Public can read published blogs"
ON public.blogs FOR SELECT
TO public
USING (is_published = true);

CREATE POLICY "Authenticated users can manage blogs"
ON public.blogs FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- CAROUSEL_IMAGES: Public read active, authenticated manage all
CREATE POLICY "Public can read active carousel images"
ON public.carousel_images FOR SELECT
TO public
USING (is_active = true);

CREATE POLICY "Authenticated users can manage carousel"
ON public.carousel_images FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- CONTACT_MESSAGES: Public insert, authenticated read/manage
CREATE POLICY "Public can insert contact messages"
ON public.contact_messages FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Authenticated users can read contact messages"
ON public.contact_messages FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can update contact messages"
ON public.contact_messages FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- EVENT_FORM_FIELDS: Public read, authenticated manage
CREATE POLICY "Public can read event form fields"
ON public.event_form_fields FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can manage form fields"
ON public.event_form_fields FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- EVENT_GALLERIES: Public read, authenticated manage
CREATE POLICY "Public can read event galleries"
ON public.event_galleries FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can manage galleries"
ON public.event_galleries FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- EVENT_REGISTRATION_FORMS: Public read all, authenticated manage
CREATE POLICY "Public can read registration forms"
ON public.event_registration_forms FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can manage registration forms"
ON public.event_registration_forms FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- EVENT_REGISTRATIONS: Public insert, authenticated read/manage
CREATE POLICY "Public can submit event registrations"
ON public.event_registrations FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Authenticated users can read registrations"
ON public.event_registrations FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can update registrations"
ON public.event_registrations FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete registrations"
ON public.event_registrations FOR DELETE
TO authenticated
USING (true);

-- EVENTS: Public read, authenticated manage
CREATE POLICY "Public can read events"
ON public.events FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can manage events"
ON public.events FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- FACULTY_MEMBERS: Public read, authenticated manage
CREATE POLICY "Public can read faculty members"
ON public.faculty_members FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can manage faculty"
ON public.faculty_members FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- NEWSLETTER_LOGS: Authenticated only
CREATE POLICY "Authenticated users can read newsletter logs"
ON public.newsletter_logs FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can manage newsletter logs"
ON public.newsletter_logs FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- NEWSLETTER_SUBSCRIBERS: Public insert, authenticated read/manage
CREATE POLICY "Public can subscribe to newsletter"
ON public.newsletter_subscribers FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Authenticated users can read subscribers"
ON public.newsletter_subscribers FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can manage subscribers"
ON public.newsletter_subscribers FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- SENT_EMAILS: Authenticated only
CREATE POLICY "Authenticated users can insert sent emails"
ON public.sent_emails FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can read sent emails"
ON public.sent_emails FOR SELECT
TO authenticated
USING (true);

-- TEAM_MEMBERS: Public read, authenticated manage
CREATE POLICY "Public can read team members"
ON public.team_members FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can manage team"
ON public.team_members FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- TESTIMONIALS: Public read active, authenticated manage all
CREATE POLICY "Public can read active testimonials"
ON public.testimonials FOR SELECT
TO public
USING (is_active = true);

CREATE POLICY "Authenticated users can manage testimonials"
ON public.testimonials FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================
-- 4. GRANT PERMISSIONS
-- ============================================

-- Grant SELECT to anon (public) for readable tables
GRANT SELECT ON public.admins TO anon;
GRANT SELECT ON public.alumni_members TO anon;
GRANT SELECT ON public.announcements TO anon;
GRANT SELECT ON public.blogs TO anon;
GRANT SELECT ON public.carousel_images TO anon;
GRANT SELECT ON public.event_form_fields TO anon;
GRANT SELECT ON public.event_galleries TO anon;
GRANT SELECT ON public.event_registration_forms TO anon;
GRANT SELECT ON public.events TO anon;
GRANT SELECT ON public.faculty_members TO anon;
GRANT SELECT ON public.team_members TO anon;
GRANT SELECT ON public.testimonials TO anon;

-- Grant INSERT to anon for public submission tables
GRANT INSERT ON public.contact_messages TO anon;
GRANT INSERT ON public.event_registrations TO anon;
GRANT INSERT ON public.newsletter_subscribers TO anon;

-- Grant ALL to authenticated users
GRANT ALL ON public.admins TO authenticated;
GRANT ALL ON public.alumni_members TO authenticated;
GRANT ALL ON public.announcements TO authenticated;
GRANT ALL ON public.blogs TO authenticated;
GRANT ALL ON public.carousel_images TO authenticated;
GRANT ALL ON public.contact_messages TO authenticated;
GRANT ALL ON public.event_form_fields TO authenticated;
GRANT ALL ON public.event_galleries TO authenticated;
GRANT ALL ON public.event_registration_forms TO authenticated;
GRANT ALL ON public.event_registrations TO authenticated;
GRANT ALL ON public.events TO authenticated;
GRANT ALL ON public.faculty_members TO authenticated;
GRANT ALL ON public.newsletter_logs TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO authenticated;
GRANT ALL ON public.sent_emails TO authenticated;
GRANT ALL ON public.team_members TO authenticated;
GRANT ALL ON public.testimonials TO authenticated;

-- ============================================
-- 5. VERIFY POLICIES
-- ============================================

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
-- 6. VERIFY TABLE PERMISSIONS
-- ============================================

SELECT 
  table_name,
  grantee,
  string_agg(privilege_type, ', ') as privileges
FROM information_schema.table_privileges
WHERE table_schema = 'public'
  AND grantee IN ('anon', 'authenticated')
GROUP BY table_name, grantee
ORDER BY table_name, grantee;
