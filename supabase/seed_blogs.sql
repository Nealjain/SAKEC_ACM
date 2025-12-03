-- Insert Blog Posts
INSERT INTO public.blogs (title, content, excerpt, author_id, category, tags, is_published, reading_time, image_1)
VALUES 
(
  'Getting Started with Web Development', 
  'Web development is an exciting field that allows you to create interactive and dynamic websites. In this guide, we will cover the basics of HTML, CSS, and JavaScript...', 
  'Learn the fundamentals of web development in this comprehensive guide.', 
  (SELECT id FROM public.team_members LIMIT 1), 
  'Web Development', 
  ARRAY['html', 'css', 'javascript'], 
  true, 
  5,
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80'
),
(
  'The Future of AI', 
  'Artificial Intelligence is rapidly evolving and transforming various industries. From healthcare to finance, AI is making a significant impact...', 
  'Explore how AI is shaping the future of technology and society.', 
  (SELECT id FROM public.team_members LIMIT 1), 
  'Artificial Intelligence', 
  ARRAY['ai', 'machine-learning', 'future'], 
  true, 
  7,
  'https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=1200&q=80'
);
