-- Create team_members table with all required fields
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  bio TEXT,
  image_url TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  twitter_url TEXT,
  email VARCHAR(255),
  year VARCHAR(50),
  department VARCHAR(255),
  achievements TEXT[],
  skills TEXT[],
  is_executive BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  personal_quote TEXT,
  about_us TEXT,
  cv_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_team_members_position ON team_members(position);
CREATE INDEX IF NOT EXISTS idx_team_members_is_executive ON team_members(is_executive);
CREATE INDEX IF NOT EXISTS idx_team_members_display_order ON team_members(display_order);

-- Enable Row Level Security (RLS)
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access to team_members" ON team_members
  FOR SELECT USING (true);

-- Create policy to allow authenticated users to insert/update/delete (optional)
CREATE POLICY "Allow authenticated users to manage team_members" ON team_members
  FOR ALL USING (auth.role() = 'authenticated');

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_team_members_updated_at 
    BEFORE UPDATE ON team_members 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
