-- Fix events table date and time format
-- Change date from TEXT to DATE type
-- Change time from VARCHAR(10) to TIME type

-- Step 1: Add new columns with correct types
ALTER TABLE public.events 
ADD COLUMN date_new DATE,
ADD COLUMN time_new TIME;

-- Step 2: Migrate existing data
-- Convert text dates to proper DATE format
UPDATE public.events 
SET date_new = CASE 
  WHEN date ~ '^\d{4}-\d{2}-\d{2}$' THEN date::DATE
  WHEN date ~ '^\d{2}/\d{2}/\d{4}$' THEN TO_DATE(date, 'MM/DD/YYYY')
  WHEN date ~ '^\d{4}/\d{2}/\d{2}$' THEN TO_DATE(date, 'YYYY/MM/DD')
  ELSE NULL
END;

-- Convert time strings to proper TIME format
UPDATE public.events 
SET time_new = CASE 
  WHEN time IS NOT NULL AND time != '' AND time != '00:00' THEN time::TIME
  ELSE NULL
END;

-- Step 3: Drop old columns
ALTER TABLE public.events 
DROP COLUMN date,
DROP COLUMN time;

-- Step 4: Rename new columns
ALTER TABLE public.events 
RENAME COLUMN date_new TO date;

ALTER TABLE public.events 
RENAME COLUMN time_new TO time;

-- Step 5: Set default date for NULL values before making it NOT NULL
UPDATE public.events 
SET date = CURRENT_DATE 
WHERE date IS NULL;

-- Now make date NOT NULL (it's required)
ALTER TABLE public.events 
ALTER COLUMN date SET NOT NULL;

-- Step 6: Recreate index on date column
DROP INDEX IF EXISTS idx_events_date;
CREATE INDEX idx_events_date ON public.events USING btree (date);

-- Step 7: Add helpful comment
COMMENT ON COLUMN public.events.date IS 'Event date in YYYY-MM-DD format';
COMMENT ON COLUMN public.events.time IS 'Event time in HH:MM:SS format (24-hour)';
