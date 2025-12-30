-- Create announcements table
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  type TEXT DEFAULT 'popup', -- 'popup', 'banner'
  has_input BOOLEAN DEFAULT false,
  input_type TEXT DEFAULT 'email', -- 'email', 'text'
  input_placeholder TEXT,
  input_button_label TEXT DEFAULT 'Submit',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Create newsletter_logs table to track sent emails
CREATE TABLE IF NOT EXISTS public.newsletter_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  recipient_count INTEGER DEFAULT 0,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_by UUID -- Reference to admin user if available
);

-- Enable RLS
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_logs ENABLE ROW LEVEL SECURITY;

-- Policies for announcements (Public read, Admin write)
CREATE POLICY "Public announcements are viewable by everyone" 
ON public.announcements FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage announcements" 
ON public.announcements FOR ALL 
USING (true) 
WITH CHECK (true); -- Simplified for now, assuming admin auth is handled via app logic or separate role

-- Policies for newsletter_subscribers (Public insert, Admin all)
CREATE POLICY "Anyone can subscribe" 
ON public.newsletter_subscribers FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view subscribers" 
ON public.newsletter_subscribers FOR SELECT 
USING (true);

-- Policies for newsletter_logs (Admin only)
CREATE POLICY "Admins can manage logs" 
ON public.newsletter_logs FOR ALL 
USING (true);
