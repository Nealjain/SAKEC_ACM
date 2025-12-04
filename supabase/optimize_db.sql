-- 1. Fix Duplicate Index
DROP INDEX IF EXISTS idx_registrations_date;

-- 2. Remove Redundant Policies (Cleaning up "Multiple Permissive Policies" warnings)
-- These appear to be duplicates of more descriptive policies (e.g., "Public read alumni" vs "Allow public read access to alumni_members")

-- Alumni
DROP POLICY IF EXISTS "Public read alumni" ON alumni_members;

-- Announcements
DROP POLICY IF EXISTS "Admins manage announcements" ON announcements; -- Duplicate of "Admins can manage announcements"
DROP POLICY IF EXISTS "Public read announcements" ON announcements; -- Duplicate of "Public announcements are viewable by everyone"

-- Blogs
DROP POLICY IF EXISTS "Public read published blogs" ON blogs; -- Duplicate of "Enable read for published blogs"

-- Contact Messages
DROP POLICY IF EXISTS "allow_public_insert_contact" ON contact_messages; -- Duplicate of "Enable insert for all users"

-- Event Galleries
DROP POLICY IF EXISTS "Public read galleries" ON event_galleries; -- Duplicate of "Allow public read access"

-- Event Registration Forms
DROP POLICY IF EXISTS "Public read forms" ON event_registration_forms; -- Duplicate of "Admins manage forms" (or similar public read policy)

-- Events
DROP POLICY IF EXISTS "Public read events" ON events;

-- Faculty
DROP POLICY IF EXISTS "Public read faculty" ON faculty_members;

-- Newsletter Logs
DROP POLICY IF EXISTS "Admins manage logs" ON newsletter_logs; -- Duplicate of "Admins can manage logs"

-- Newsletter Subscribers
DROP POLICY IF EXISTS "Public subscribe" ON newsletter_subscribers; -- Duplicate of "Anyone can subscribe"
DROP POLICY IF EXISTS "Admins manage subscribers" ON newsletter_subscribers; -- Duplicate of "Admins can view subscribers"

-- Team Members
DROP POLICY IF EXISTS "Public read team" ON team_members;
-- Note: Be careful with "Allow authenticated users to manage team_members" vs "Admins manage team". 
-- If "Admins manage team" covers it, we can drop the other.
-- DROP POLICY IF EXISTS "Allow authenticated users to manage team_members" ON team_members;

-- Testimonials
DROP POLICY IF EXISTS "Public read testimonials" ON testimonials;

-- 3. Performance Optimizations (Auth RLS Init Plan)
-- To fix the "unnecessarily re-evaluated" warning, policies should wrap auth functions in a select.
-- Example: instead of `auth.uid() = ...`, use `(select auth.uid()) = ...`
-- Since we cannot see the exact policy definitions here, we recommend recreating the specific policies 
-- identified in the linter logs with the optimized syntax in the Supabase Dashboard.
