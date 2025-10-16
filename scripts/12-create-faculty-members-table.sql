-- Create faculty_members table
CREATE TABLE IF NOT EXISTS faculty_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  linkedin_url TEXT,
  email TEXT,
  department TEXT NOT NULL,
  achievements TEXT[],
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add sample data
INSERT INTO faculty_members (name, position, bio, department, display_order)
VALUES 
('Dr. Jane Smith', 'Faculty Advisor', 'Dr. Jane Smith is a Professor of Computer Science with over 15 years of experience in academia and industry.', 'Computer Science', 1),
('Prof. John Doe', 'Department Head', 'Prof. John Doe leads the Computer Science department and specializes in artificial intelligence and machine learning.', 'Computer Science', 2);