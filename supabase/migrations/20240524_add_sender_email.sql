-- Add sender_email column to newsletter_logs to track which email address was used
ALTER TABLE public.newsletter_logs 
ADD COLUMN IF NOT EXISTS sender_email TEXT;

-- Optional: Add a comment or description
COMMENT ON COLUMN public.newsletter_logs.sender_email IS 'The email address used as the sender (From) for this newsletter';
