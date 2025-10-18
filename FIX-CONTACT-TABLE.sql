-- First, check if table exists and drop it if needed
DROP TABLE IF EXISTS public.contact_messages CASCADE;

-- Create the contact_messages table
CREATE TABLE public.contact_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  is_read boolean DEFAULT false,
  CONSTRAINT contact_messages_pkey PRIMARY KEY (id)
);

-- Disable RLS for now to test
ALTER TABLE public.contact_messages DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON public.contact_messages TO anon;
GRANT ALL ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
