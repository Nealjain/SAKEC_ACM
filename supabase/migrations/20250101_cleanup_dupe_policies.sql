
-- Consolidate Policies to remove "Multiple Permissive Policies" warnings (and duplicates)

-- 1. ADMINS
DROP POLICY IF EXISTS "Allow anon to read admins for login" ON admins;
DROP POLICY IF EXISTS "Allow public read for login" ON admins;
DROP POLICY IF EXISTS "Public Access admins" ON admins;
DROP POLICY IF EXISTS "Admins update own data" ON admins;
DROP POLICY IF EXISTS "Authenticated users can update own data" ON admins;
-- Re-apply single policy
CREATE POLICY "Public Access admins" ON admins FOR ALL TO public USING (true) WITH CHECK (true);

-- 2. ALUMNI_MEMBERS
DROP POLICY IF EXISTS "Allow public read access to alumni_members" ON alumni_members;
DROP POLICY IF EXISTS "Public can read alumni" ON alumni_members;
DROP POLICY IF EXISTS "Authenticated users can manage alumni" ON alumni_members;
DROP POLICY IF EXISTS "Public Access alumni_members" ON alumni_members;
-- Re-apply single policy
CREATE POLICY "Public Access alumni_members" ON alumni_members FOR ALL TO public USING (true) WITH CHECK (true);

-- 3. ANNOUNCEMENTS
DROP POLICY IF EXISTS "Admins can manage announcements" ON announcements;
DROP POLICY IF EXISTS "Public announcements are viewable by everyone" ON announcements;
DROP POLICY IF EXISTS "Public can read active announcements" ON announcements;
DROP POLICY IF EXISTS "Authenticated users can manage announcements" ON announcements;
DROP POLICY IF EXISTS "Public Access announcements" ON announcements;
-- Re-apply single policy
CREATE POLICY "Public Access announcements" ON announcements FOR ALL TO public USING (true) WITH CHECK (true);

-- 4. BLOGS
DROP POLICY IF EXISTS "Public Manage Blogs" ON blogs;
DROP POLICY IF EXISTS "Public Insert Blogs" ON blogs;
DROP POLICY IF EXISTS "Public Update Blogs" ON blogs;
DROP POLICY IF EXISTS "Public Delete Blogs" ON blogs;
DROP POLICY IF EXISTS "Public Read Blogs" ON blogs;
DROP POLICY IF EXISTS "Enable read for published blogs" ON blogs;
DROP POLICY IF EXISTS "Public can read published blogs" ON blogs;
DROP POLICY IF EXISTS "Public read published blogs" ON blogs;
DROP POLICY IF EXISTS "Authenticated users can manage blogs" ON blogs;
DROP POLICY IF EXISTS "Public Access blogs" ON blogs;
-- Re-apply single policy
CREATE POLICY "Public Access blogs" ON blogs FOR ALL TO public USING (true) WITH CHECK (true);

-- 5. CAROUSEL
DROP POLICY IF EXISTS "Public can read active carousel images" ON carousel_images;
DROP POLICY IF EXISTS "Authenticated users can manage carousel" ON carousel_images;
DROP POLICY IF EXISTS "Public Access carousel_images" ON carousel_images;
-- Re-apply single policy
CREATE POLICY "Public Access carousel_images" ON carousel_images FOR ALL TO public USING (true) WITH CHECK (true);

-- 6. CONTACT MESSAGES
DROP POLICY IF EXISTS "Allow Public Insert" ON contact_messages;
DROP POLICY IF EXISTS "Allow Public Manage Contact" ON contact_messages;
DROP POLICY IF EXISTS "Allow anonymous insert contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Enable insert for all users" ON contact_messages;
DROP POLICY IF EXISTS "Public can insert contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Public insert contact" ON contact_messages;
DROP POLICY IF EXISTS "Allow authenticated delete contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Allow authenticated read contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Allow authenticated update contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Authenticated users can read contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Authenticated users can update contact messages" ON contact_messages;
DROP POLICY IF EXISTS "allow_admin_select_contact" ON contact_messages;
DROP POLICY IF EXISTS "allow_admin_update_contact" ON contact_messages;
DROP POLICY IF EXISTS "Public Access contact_messages" ON contact_messages;
-- Re-apply single policy
CREATE POLICY "Public Access contact_messages" ON contact_messages FOR ALL TO public USING (true) WITH CHECK (true);

-- 7. EVENTS & GALLERIES
DROP POLICY IF EXISTS "Allow public read access" ON event_galleries;
DROP POLICY IF EXISTS "Public can read event galleries" ON event_galleries;
DROP POLICY IF EXISTS "Authenticated users can manage galleries" ON event_galleries;
DROP POLICY IF EXISTS "Public Access event_galleries" ON event_galleries;
CREATE POLICY "Public Access event_galleries" ON event_galleries FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read events" ON events;
DROP POLICY IF EXISTS "Authenticated users can manage events" ON events;
DROP POLICY IF EXISTS "Public Access events" ON events;
CREATE POLICY "Public Access events" ON events FOR ALL TO public USING (true) WITH CHECK (true);

-- 8. FACULTY
DROP POLICY IF EXISTS "Public can read faculty members" ON faculty_members;
DROP POLICY IF EXISTS "Authenticated users can manage faculty" ON faculty_members;
DROP POLICY IF EXISTS "Public Access faculty_members" ON faculty_members;
CREATE POLICY "Public Access faculty_members" ON faculty_members FOR ALL TO public USING (true) WITH CHECK (true);

-- 9. MEMBERSHIP APPLICATIONS
DROP POLICY IF EXISTS "Allow Public Insert" ON membership_applications;
DROP POLICY IF EXISTS "Allow anonymous insert membership applications" ON membership_applications;
DROP POLICY IF EXISTS "Allow public insert" ON membership_applications;
DROP POLICY IF EXISTS "Allow Public Select" ON membership_applications;
DROP POLICY IF EXISTS "Allow Public Update" ON membership_applications;
DROP POLICY IF EXISTS "Allow authenticated delete membership applications" ON membership_applications;
DROP POLICY IF EXISTS "Allow authenticated read all" ON membership_applications;
DROP POLICY IF EXISTS "Allow authenticated read membership applications" ON membership_applications;
DROP POLICY IF EXISTS "Allow authenticated update" ON membership_applications;
DROP POLICY IF EXISTS "Allow authenticated update membership applications" ON membership_applications;
DROP POLICY IF EXISTS "Public Access membership_applications" ON membership_applications;
-- Re-apply single policy
CREATE POLICY "Public Access membership_applications" ON membership_applications FOR ALL TO public USING (true) WITH CHECK (true);

-- 10. NEWSLETTER
DROP POLICY IF EXISTS "Admins can manage logs" ON newsletter_logs;
DROP POLICY IF EXISTS "Authenticated users can manage newsletter logs" ON newsletter_logs;
DROP POLICY IF EXISTS "Authenticated users can read newsletter logs" ON newsletter_logs;
DROP POLICY IF EXISTS "Public Access newsletter_logs" ON newsletter_logs;
CREATE POLICY "Public Access newsletter_logs" ON newsletter_logs FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can subscribe" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Public can subscribe to newsletter" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Public subscribe" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can view all subscribers" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can view subscribers" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Anyone can update with token" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Authenticated users can read subscribers" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Public Access newsletter_subscribers" ON newsletter_subscribers;
CREATE POLICY "Public Access newsletter_subscribers" ON newsletter_subscribers FOR ALL TO public USING (true) WITH CHECK (true);

-- 11. OTHERS
DROP POLICY IF EXISTS "Public Access sent_emails" ON sent_emails;
CREATE POLICY "Public Access sent_emails" ON sent_emails FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Access team_members" ON team_members;
CREATE POLICY "Public Access team_members" ON team_members FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Access testimonials" ON testimonials;
CREATE POLICY "Public Access testimonials" ON testimonials FOR ALL TO public USING (true) WITH CHECK (true);
