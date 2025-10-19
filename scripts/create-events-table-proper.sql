-- Create events table with proper date and time formats
CREATE TABLE IF NOT EXISTS public.events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title character varying(255) NOT NULL,
  description text NULL,
  date DATE NOT NULL,  -- Proper DATE type instead of TEXT
  location character varying(255) NULL,
  image_url text NULL,
  registration_link text NULL,
  is_featured boolean NULL DEFAULT false,
  category character varying(100) NULL,
  max_participants integer NULL,
  current_participants integer NULL DEFAULT 0,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  faculty_coordinator text NULL,  -- Renamed from "Faculty Co-ordinator" (no spaces)
  time TIME NULL,  -- Proper TIME type instead of VARCHAR(10)
  CONSTRAINT events_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_category 
  ON public.events USING btree (category) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_events_date 
  ON public.events USING btree (date) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_events_featured 
  ON public.events USING btree (is_featured) TABLESPACE pg_default;

-- Add helpful comments
COMMENT ON TABLE public.events IS 'Events organized by SAKEC ACM Student Chapter';
COMMENT ON COLUMN public.events.date IS 'Event date in YYYY-MM-DD format';
COMMENT ON COLUMN public.events.time IS 'Event time in HH:MM:SS format (24-hour clock)';
COMMENT ON COLUMN public.events.faculty_coordinator IS 'Faculty member coordinating the event';

-- Example insert with proper date/time format:
-- INSERT INTO public.events (title, description, date, time, location, category)
-- VALUES (
--   'Web Development Workshop',
--   'Learn modern web development with React and Next.js',
--   '2025-02-15',  -- DATE format: YYYY-MM-DD
--   '14:30:00',    -- TIME format: HH:MM:SS
--   'Computer Lab 1',
--   'Workshop'
-- );
