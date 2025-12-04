-- ============================================
-- FIX EVENT DELETION ISSUES
-- ============================================

-- Check current RLS status and policies for events table
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'events';

SELECT policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'events';

-- Ensure CASCADE delete is set up properly
-- Check foreign key constraints
SELECT
    tc.table_name, 
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.delete_rule
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints AS rc
  ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND ccu.table_name = 'events';

-- If needed, recreate the foreign key with CASCADE
-- First, find the constraint name
SELECT constraint_name
FROM information_schema.table_constraints
WHERE table_name = 'event_registration_forms'
  AND constraint_type = 'FOREIGN KEY'
  AND constraint_name LIKE '%event_id%';

-- Drop and recreate with CASCADE if needed
-- ALTER TABLE public.event_registration_forms 
-- DROP CONSTRAINT event_registration_forms_event_id_fkey;

-- ALTER TABLE public.event_registration_forms
-- ADD CONSTRAINT event_registration_forms_event_id_fkey 
-- FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;

-- Same for event_registrations
-- ALTER TABLE public.event_registrations 
-- DROP CONSTRAINT event_registrations_event_id_fkey;

-- ALTER TABLE public.event_registrations
-- ADD CONSTRAINT event_registrations_event_id_fkey 
-- FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;
