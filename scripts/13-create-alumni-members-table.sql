-- Create alumni_members table
CREATE TABLE IF NOT EXISTS alumni_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  twitter_url TEXT,
  email TEXT,
  graduation_year TEXT,
  department TEXT NOT NULL,
  achievements TEXT[],
  skills TEXT[],
  current_company TEXT,
  current_role TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_alumni_members_position ON alumni_members(position);
CREATE INDEX IF NOT EXISTS idx_alumni_members_graduation_year ON alumni_members(graduation_year);
CREATE INDEX IF NOT EXISTS idx_alumni_members_display_order ON alumni_members(display_order);

-- Enable Row Level Security (RLS)
ALTER TABLE alumni_members ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access to alumni_members" ON alumni_members
  FOR SELECT USING (true);

-- Create policy to allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users to manage alumni_members" ON alumni_members
  FOR ALL USING (auth.role() = 'authenticated');

-- Add sample data
INSERT INTO alumni_members (
  name, 
  position, 
  bio, 
  image_url, 
  linkedin_url, 
  github_url, 
  email, 
  graduation_year, 
  department, 
  achievements, 
  skills, 
  current_company,
  current_role,
  display_order
) VALUES
(
  'Ananya Desai',
  'Former President',
  'Led SAKEC ACM chapter from 2020-2022. Implemented several successful initiatives and grew membership by 40%.',
  '/alumni-ananya.png',
  'https://linkedin.com/in/ananya-desai',
  'https://github.com/ananyad',
  'ananya.desai@gmail.com',
  '2022',
  'Computer Engineering',
  ARRAY['Best Chapter Leader Award 2021', 'Outstanding Student Leadership Award', 'Research Publication in IEEE'],
  ARRAY['Leadership', 'Project Management', 'Python', 'Machine Learning', 'Public Speaking'],
  'Google',
  'Software Engineer',
  1
),
(
  'Rohan Mehta',
  'Former Technical Lead',
  'Served as Technical Lead from 2019-2021. Organized coding bootcamps and hackathons that attracted over 500 participants.',
  '/alumni-rohan.png',
  'https://linkedin.com/in/rohan-mehta',
  'https://github.com/rohanm',
  'rohan.mehta@outlook.com',
  '2021',
  'Information Technology',
  ARRAY['Best Technical Initiative Award', 'Hackathon Winner 2020', 'Open Source Contributor'],
  ARRAY['JavaScript', 'React', 'Node.js', 'AWS', 'System Architecture'],
  'Microsoft',
  'Senior Developer',
  2
),
(
  'Neha Kapoor',
  'Former Secretary',
  'Managed chapter communications and documentation from 2020-2022. Streamlined processes and improved member engagement.',
  '/alumni-neha.png',
  'https://linkedin.com/in/neha-kapoor',
  'https://github.com/nehak',
  'neha.kapoor@yahoo.com',
  '2022',
  'Computer Engineering',
  ARRAY['Outstanding Secretary Award', 'Event Management Excellence', 'Technical Writing Award'],
  ARRAY['Documentation', 'Event Planning', 'Content Creation', 'Java', 'Database Management'],
  'Adobe',
  'Product Manager',
  3
);