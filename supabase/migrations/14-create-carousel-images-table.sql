-- Create carousel_images table
CREATE TABLE IF NOT EXISTS carousel_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  src TEXT NOT NULL,
  alt TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data
INSERT INTO carousel_images (src, alt, display_order, is_active)
VALUES
  ('/coding-workshop-students.png', 'Coding Workshop', 1, true),
  ('/tech-community-meeting.png', 'Tech Community', 2, true),
  ('/hackathon-competition.png', 'Competitions', 3, true),
  ('/placeholder-n0pwc.png', 'Innovation Hub', 4, true),
  ('/hackathon-innovation-challenge.png', 'Hackathon Innovation Challenge', 5, true),
  ('/cybersecurity-lecture.png', 'Cybersecurity Lecture', 6, true);