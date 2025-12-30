-- Create admins table
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_admins_username ON public.admins(username);
CREATE INDEX IF NOT EXISTS idx_admins_is_active ON public.admins(is_active);

-- Example: Add your admin user (replace with your own credentials)
-- INSERT INTO public.admins (username, password_hash, email, is_active)
-- VALUES ('yourusername', 'yourpassword', 'your@email.com', true);

COMMENT ON TABLE public.admins IS 'Stores admin user credentials with hashed passwords';
