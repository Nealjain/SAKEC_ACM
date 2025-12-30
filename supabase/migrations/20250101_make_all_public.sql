
-- To make everything accessible to the application (including the Admin Panel which uses the public client),
-- we will permissive policies. 
-- NOTE: Currently, the Admin Panel uses the same anonymous authentication as the public website.
-- To allow the Admin Panel to function, we must allow access.
-- "Security" is currently handled by the Application Logic (Admin Login screen), not the Database.

-- 1. admins (Needed for Login)
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Access admins" ON admins;
CREATE POLICY "Public Access admins" ON admins FOR ALL TO public USING (true) WITH CHECK (true);

-- 2. alumni_members
ALTER TABLE alumni_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Access alumni_members" ON alumni_members;
CREATE POLICY "Public Access alumni_members" ON alumni_members FOR ALL TO public USING (true) WITH CHECK (true);

-- 3. announcements
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Access announcements" ON announcements;
CREATE POLICY "Public Access announcements" ON announcements FOR ALL TO public USING (true) WITH CHECK (true);

-- 4. blogs
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Access blogs" ON blogs;
CREATE POLICY "Public Access blogs" ON blogs FOR ALL TO public USING (true) WITH CHECK (true);

-- 5. carousel_images
ALTER TABLE carousel_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Access carousel_images" ON carousel_images;
CREATE POLICY "Public Access carousel_images" ON carousel_images FOR ALL TO public USING (true) WITH CHECK (true);

-- 6. contact_messages
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Access contact_messages" ON contact_messages;
CREATE POLICY "Public Access contact_messages" ON contact_messages FOR ALL TO public USING (true) WITH CHECK (true);

-- 7. event_galleries
ALTER TABLE event_galleries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Access event_galleries" ON event_galleries;
CREATE POLICY "Public Access event_galleries" ON event_galleries FOR ALL TO public USING (true) WITH CHECK (true);

-- 8. events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Access events" ON events;
CREATE POLICY "Public Access events" ON events FOR ALL TO public USING (true) WITH CHECK (true);

-- 9. faculty_members
ALTER TABLE faculty_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Access faculty_members" ON faculty_members;
CREATE POLICY "Public Access faculty_members" ON faculty_members FOR ALL TO public USING (true) WITH CHECK (true);

-- 10. membership_applications
ALTER TABLE membership_applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Access membership_applications" ON membership_applications;
CREATE POLICY "Public Access membership_applications" ON membership_applications FOR ALL TO public USING (true) WITH CHECK (true);

-- 11. newsletter_logs
ALTER TABLE newsletter_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Access newsletter_logs" ON newsletter_logs;
CREATE POLICY "Public Access newsletter_logs" ON newsletter_logs FOR ALL TO public USING (true) WITH CHECK (true);

-- 12. newsletter_subscribers
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Access newsletter_subscribers" ON newsletter_subscribers;
CREATE POLICY "Public Access newsletter_subscribers" ON newsletter_subscribers FOR ALL TO public USING (true) WITH CHECK (true);

-- 13. sent_emails
ALTER TABLE sent_emails ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Access sent_emails" ON sent_emails;
CREATE POLICY "Public Access sent_emails" ON sent_emails FOR ALL TO public USING (true) WITH CHECK (true);

-- 14. team_members
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Access team_members" ON team_members;
CREATE POLICY "Public Access team_members" ON team_members FOR ALL TO public USING (true) WITH CHECK (true);

-- 15. testimonials
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Access testimonials" ON testimonials;
CREATE POLICY "Public Access testimonials" ON testimonials FOR ALL TO public USING (true) WITH CHECK (true);
