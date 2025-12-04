-- 1. Fix Duplicate Index
DROP INDEX IF EXISTS idx_registrations_date;

-- 2. Remove Redundant Policies (Cleaning up "Multiple Permissive Policies" warnings)

-- Alumni Members
DROP POLICY IF EXISTS "Public read alumni" ON alumni_members;
DROP POLICY IF EXISTS "Allow authenticated users to delete alumni_members" ON alumni_members;
DROP POLICY IF EXISTS "Allow authenticated users to manage alumni_members" ON alumni_members;
DROP POLICY IF EXISTS "Allow authenticated users to update alumni_members" ON alumni_members;
-- Note: "Allow public read access to alumni_members" is kept for public access.

-- Announcements
DROP POLICY IF EXISTS "Admins manage announcements" ON announcements; -- Duplicate of "Admins can manage announcements"
DROP POLICY IF EXISTS "Public read announcements" ON announcements; -- Duplicate of "Public announcements are viewable by everyone"

-- Blogs
DROP POLICY IF EXISTS "Public read published blogs" ON blogs;
DROP POLICY IF EXISTS "Enable delete for all users" ON blogs;
DROP POLICY IF EXISTS "Enable insert for all users" ON blogs;
DROP POLICY IF EXISTS "Enable update for all users" ON blogs;

-- Contact Messages
DROP POLICY IF EXISTS "allow_public_insert_contact" ON contact_messages;

-- Event Galleries
DROP POLICY IF EXISTS "Public read galleries" ON event_galleries;

-- Event Registration Forms
DROP POLICY IF EXISTS "Public read forms" ON event_registration_forms;

-- Events
DROP POLICY IF EXISTS "Public read events" ON events;

-- Faculty Members
DROP POLICY IF EXISTS "Public read faculty" ON faculty_members;

-- Newsletter Logs
DROP POLICY IF EXISTS "Admins manage logs" ON newsletter_logs;

-- Newsletter Subscribers
DROP POLICY IF EXISTS "Public subscribe" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Admins manage subscribers" ON newsletter_subscribers;

-- Team Members
DROP POLICY IF EXISTS "Public read team" ON team_members;
DROP POLICY IF EXISTS "Allow authenticated users to manage team_members" ON team_members;

-- Testimonials
DROP POLICY IF EXISTS "Public read testimonials" ON testimonials;
DROP POLICY IF EXISTS "Allow authenticated delete" ON testimonials;
DROP POLICY IF EXISTS "Allow authenticated insert" ON testimonials;
DROP POLICY IF EXISTS "Allow authenticated update" ON testimonials;

-- 3. Performance Optimizations (Auth RLS Init Plan)
-- Recreating policies with optimized auth.uid() calls
-- This replaces the inefficient policies with optimized versions

-- Team Members: Allow admins to manage
CREATE OR REPLACE POLICY "Admins manage team"
ON team_members
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admins
    WHERE admins.id = (select auth.uid())
  )
);

-- Alumni Members: Allow admins to manage
CREATE OR REPLACE POLICY "Admins manage alumni"
ON alumni_members
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admins
    WHERE admins.id = (select auth.uid())
  )
);

-- Testimonials: Allow admins to manage
CREATE OR REPLACE POLICY "Admins manage testimonials"
ON testimonials
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admins
    WHERE admins.id = (select auth.uid())
  )
);

-- Blogs: Allow admins to manage
CREATE OR REPLACE POLICY "Admins manage blogs"
ON blogs
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admins
    WHERE admins.id = (select auth.uid())
  )
);

-- Announcements: Allow admins to manage
CREATE OR REPLACE POLICY "Admins can manage announcements"
ON announcements
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admins
    WHERE admins.id = (select auth.uid())
  )
);

-- Event Galleries: Allow admins to manage
CREATE OR REPLACE POLICY "Admins manage galleries"
ON event_galleries
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admins
    WHERE admins.id = (select auth.uid())
  )
);

-- Event Registration Forms: Allow admins to manage
CREATE OR REPLACE POLICY "Admins manage forms"
ON event_registration_forms
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admins
    WHERE admins.id = (select auth.uid())
  )
);

-- Events: Allow admins to manage
CREATE OR REPLACE POLICY "Admins manage events"
ON events
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admins
    WHERE admins.id = (select auth.uid())
  )
);

-- Faculty Members: Allow admins to manage
CREATE OR REPLACE POLICY "Admins manage faculty"
ON faculty_members
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admins
    WHERE admins.id = (select auth.uid())
  )
);

-- Newsletter Logs: Allow admins to manage
CREATE OR REPLACE POLICY "Admins can manage logs"
ON newsletter_logs
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admins
    WHERE admins.id = (select auth.uid())
  )
);

-- Newsletter Subscribers: Allow admins to view
CREATE OR REPLACE POLICY "Admins can view subscribers"
ON newsletter_subscribers
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admins
    WHERE admins.id = (select auth.uid())
  )
);
