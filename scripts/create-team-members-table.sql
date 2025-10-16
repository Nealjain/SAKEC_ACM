-- Create team_members table matching your exact schema
CREATE TABLE IF NOT EXISTS public.team_members (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying(255) NOT NULL,
  position character varying(255) NOT NULL,
  image_url text NULL,
  linkedin_url text NULL,
  github_url text NULL,
  email character varying(255) NULL,
  year character varying(50) NULL,
  department character varying(255) NULL,
  display_order integer NULL DEFAULT 0,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  "PRN" text NULL,
  personal_quote text NULL,
  about_us text NULL,
  CONSTRAINT team_members_pkey PRIMARY KEY (id),
  CONSTRAINT team_members_PRN_key UNIQUE ("PRN")
) TABLESPACE pg_default;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_team_members_position 
  ON public.team_members USING btree (position) 
  TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_team_members_display_order 
  ON public.team_members USING btree (display_order) 
  TABLESPACE pg_default;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON team_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (optional but recommended)
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" 
  ON public.team_members 
  FOR SELECT 
  USING (true);

-- Create policy to allow authenticated users to insert/update/delete (adjust as needed)
CREATE POLICY "Allow authenticated users to manage team members" 
  ON public.team_members 
  FOR ALL 
  USING (auth.role() = 'authenticated');
