-- Create table for storing sent emails from admin
CREATE TABLE IF NOT EXISTS public.sent_emails (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    recipient_email text NOT NULL,
    sender_email text NOT NULL,
    sender_name text NOT NULL,
    subject text NOT NULL,
    message text NOT NULL,
    sent_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    sent_by text, -- admin username
    status text DEFAULT 'sent',
    error_message text
);

-- Enable RLS
ALTER TABLE public.sent_emails ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users (admins) to insert
CREATE POLICY "Allow admins to insert sent emails"
ON public.sent_emails FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy: Allow authenticated users (admins) to read
CREATE POLICY "Allow admins to read sent emails"
ON public.sent_emails FOR SELECT
TO authenticated
USING (true);

-- Create index for faster queries
CREATE INDEX idx_sent_emails_sent_at ON public.sent_emails(sent_at DESC);
CREATE INDEX idx_sent_emails_recipient ON public.sent_emails(recipient_email);
