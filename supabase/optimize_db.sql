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
-- The linter warns about inefficient auth.uid() calls in RLS policies.
-- To fix this, you should update your policies in the Supabase Dashboard to wrap auth functions in a select statement.
-- Example: Change `auth.uid() = ...` to `(select auth.uid()) = ...`
-- This prevents the function from being re-evaluated for every row.
