-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  author_id UUID REFERENCES team_members(id),
  category TEXT,
  tags TEXT[],
  is_published BOOLEAN DEFAULT false,
  reading_time INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add sample blog posts
INSERT INTO blogs (title, content, excerpt, image_url, author_id, category, tags, is_published, reading_time)
VALUES
  ('Getting Started with Web Development', 'This is a comprehensive guide to web development...', 'Learn the basics of web development', '/images/blog/web-dev.jpg', (SELECT id FROM team_members LIMIT 1), 'Technology', ARRAY['web', 'development', 'html', 'css'], true, 5),
  ('Introduction to Machine Learning', 'Machine learning is transforming industries...', 'Discover the power of machine learning', '/images/blog/ml-intro.jpg', (SELECT id FROM team_members LIMIT 1), 'Technology', ARRAY['machine learning', 'ai', 'data science'], true, 8),
  ('ACM Workshop Highlights', 'Our recent workshop covered several important topics...', 'Recap of our successful workshop', '/images/blog/workshop.jpg', (SELECT id FROM team_members LIMIT 1), 'Events', ARRAY['workshop', 'learning', 'coding'], true, 4);