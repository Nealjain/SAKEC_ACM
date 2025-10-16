-- Create carousel_images table
CREATE TABLE IF NOT EXISTS carousel_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  src VARCHAR(255) NOT NULL,
  alt VARCHAR(255) NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample carousel images
INSERT INTO carousel_images (src, alt, display_order, is_active) VALUES
('/coding-workshop-students.png', 'Coding Workshop', 1, true),
('/tech-community-meeting.png', 'Tech Community', 2, true),
('/hackathon-competition.png', 'Competitions', 3, true),
('/placeholder-n0pwc.png', 'Innovation Hub', 4, true);