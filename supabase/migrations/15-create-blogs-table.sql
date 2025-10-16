-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  author_id UUID REFERENCES team_members(id),
  category VARCHAR(100),
  tags TEXT[],
  is_published BOOLEAN DEFAULT false,
  reading_time INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample blog posts
INSERT INTO blogs (title, content, excerpt, image_url, category, tags, is_published, reading_time)
VALUES
  ('Getting Started with Web Development', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'A beginner''s guide to web development', '/placeholder.jpg', 'Web Development', ARRAY['beginner', 'web', 'html', 'css'], true, 5),
  ('Introduction to Machine Learning', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'Learn the basics of machine learning', '/placeholder.jpg', 'Machine Learning', ARRAY['beginner', 'AI', 'ML'], true, 8),
  ('Advanced JavaScript Techniques', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'Take your JavaScript skills to the next level', '/placeholder.jpg', 'Web Development', ARRAY['advanced', 'javascript', 'web'], true, 12);