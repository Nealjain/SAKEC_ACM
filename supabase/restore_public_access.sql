-- Restore Public Read Access
-- I may have accidentally removed public access while cleaning up redundant policies.
-- This script ensures that public content is readable by everyone (anon and authenticated).

-- 1. Faculty Members
DROP POLICY IF EXISTS "Public read faculty" ON faculty_members;
CREATE POLICY "Public read faculty"
ON faculty_members FOR SELECT
TO public
USING (true);

-- 2. Team Members
DROP POLICY IF EXISTS "Public read team" ON team_members;
CREATE POLICY "Public read team"
ON team_members FOR SELECT
TO public
USING (true);

-- 3. Alumni Members
DROP POLICY IF EXISTS "Public read alumni" ON alumni_members;
CREATE POLICY "Public read alumni"
ON alumni_members FOR SELECT
TO public
USING (true);

-- 4. Events
DROP POLICY IF EXISTS "Public read events" ON events;
CREATE POLICY "Public read events"
ON events FOR SELECT
TO public
USING (true);

-- 5. Event Galleries
DROP POLICY IF EXISTS "Public read galleries" ON event_galleries;
CREATE POLICY "Public read galleries"
ON event_galleries FOR SELECT
TO public
USING (true);

-- 6. Event Registration Forms (Public needs to see the form to register)
DROP POLICY IF EXISTS "Public read forms" ON event_registration_forms;
CREATE POLICY "Public read forms"
ON event_registration_forms FOR SELECT
TO public
USING (is_active = true);

-- 7. Event Form Fields
DROP POLICY IF EXISTS "Public read form fields" ON event_form_fields;
CREATE POLICY "Public read form fields"
ON event_form_fields FOR SELECT
TO public
USING (true);

-- 8. Blogs (Published only)
DROP POLICY IF EXISTS "Public read published blogs" ON blogs;
CREATE POLICY "Public read published blogs"
ON blogs FOR SELECT
TO public
USING (is_published = true);

-- 9. Testimonials (Active only)
DROP POLICY IF EXISTS "Public read testimonials" ON testimonials;
CREATE POLICY "Public read testimonials"
ON testimonials FOR SELECT
TO public
USING (is_active = true);

-- 10. Announcements (Active only)
DROP POLICY IF EXISTS "Public read announcements" ON announcements;
CREATE POLICY "Public read announcements"
ON announcements FOR SELECT
TO public
USING (is_active = true);

-- 11. Carousel Images (Active only)
DROP POLICY IF EXISTS "Public read carousel" ON carousel_images;
CREATE POLICY "Public read carousel"
ON carousel_images FOR SELECT
TO public
USING (is_active = true);

-- 12. Contact Messages (Public Insert)
DROP POLICY IF EXISTS "Public insert contact" ON contact_messages;
CREATE POLICY "Public insert contact"
ON contact_messages FOR INSERT
TO public
WITH CHECK (true);

-- 13. Newsletter Subscribers (Public Insert)
DROP POLICY IF EXISTS "Public subscribe" ON newsletter_subscribers;
CREATE POLICY "Public subscribe"
ON newsletter_subscribers FOR INSERT
TO public
WITH CHECK (true);
