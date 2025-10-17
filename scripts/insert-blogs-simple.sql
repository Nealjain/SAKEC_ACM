-- Simple Blog Insert Script
-- Copy and paste this into Supabase SQL Editor

-- First, let's get a team member ID to use as author
-- Run this first to see available team members:
-- SELECT id, name, position FROM team_members LIMIT 5;

-- Insert 5 sample blog posts
-- Replace 'AUTHOR_ID_HERE' with an actual ID from your team_members table

INSERT INTO public.blogs (
  title, 
  content, 
  excerpt, 
  image_url, 
  author_id, 
  category, 
  tags, 
  is_published, 
  reading_time
)
VALUES 
-- Blog 1
(
  'Getting Started with Web Development',
  E'# Getting Started with Web Development\n\nWeb development is an exciting field that combines creativity with technical skills.\n\n## What is Web Development?\n\nWeb development involves creating websites and web applications.\n\n## Key Technologies\n\n- HTML: Structure\n- CSS: Styling  \n- JavaScript: Interactivity\n\n## Getting Started\n\n1. Learn HTML and CSS basics\n2. Master JavaScript fundamentals\n3. Explore frameworks like React\n4. Build projects to practice',
  'Learn the fundamentals of web development and start building amazing websites.',
  '/web-development-workshop-coding.png',
  (SELECT id FROM public.team_members LIMIT 1),
  'Web Development',
  ARRAY['HTML', 'CSS', 'JavaScript', 'Tutorial'],
  true,
  5
),

-- Blog 2
(
  'Introduction to Machine Learning',
  E'# Introduction to Machine Learning\n\nMachine Learning is transforming technology.\n\n## What is Machine Learning?\n\nML enables systems to learn from experience.\n\n## Types of ML\n\n- Supervised Learning\n- Unsupervised Learning\n- Reinforcement Learning\n\n## Popular Libraries\n\n- TensorFlow\n- PyTorch\n- Scikit-learn',
  'Discover the world of Machine Learning and AI.',
  '/innovation-lab-students.png',
  (SELECT id FROM public.team_members LIMIT 1 OFFSET 1),
  'Artificial Intelligence',
  ARRAY['Machine Learning', 'AI', 'Python'],
  true,
  7
),

-- Blog 3
(
  'Cybersecurity Best Practices',
  E'# Cybersecurity Best Practices\n\nProtect yourself and your applications.\n\n## Why Security Matters\n\nCyber attacks are becoming more sophisticated.\n\n## Essential Practices\n\n1. Use strong passwords\n2. Enable 2FA\n3. Keep software updated\n4. Be cautious with emails\n\n## For Developers\n\n- Validate all inputs\n- Use HTTPS\n- Regular security audits',
  'Learn essential cybersecurity practices to protect yourself and your applications.',
  '/cybersecurity-lecture.png',
  (SELECT id FROM public.team_members LIMIT 1 OFFSET 2),
  'Security',
  ARRAY['Cybersecurity', 'Security', 'Best Practices'],
  true,
  6
),

-- Blog 4
(
  'Building Your First Mobile App',
  E'# Building Your First Mobile App\n\nMobile development made easy.\n\n## Choosing Your Platform\n\n- Native: Swift/Kotlin\n- Cross-Platform: React Native/Flutter\n\n## Why React Native?\n\nBuild for iOS and Android with one codebase.\n\n## Getting Started\n\n```bash\nnpx react-native init MyApp\n```\n\n## Key Concepts\n\n- Components\n- State Management\n- Navigation',
  'Step-by-step guide to building your first mobile application.',
  '/coding-workshop-students.png',
  (SELECT id FROM public.team_members LIMIT 1 OFFSET 3),
  'Mobile Development',
  ARRAY['Mobile', 'React Native', 'App Development'],
  true,
  8
),

-- Blog 5
(
  'Hackathon Success Tips',
  E'# Hackathon Success Tips\n\nMaximize your hackathon experience.\n\n## Before the Hackathon\n\n- Form a balanced team\n- Brainstorm ideas\n- Set up dev environment\n\n## During the Hackathon\n\n- Focus on MVP first\n- Use existing tools\n- Keep it simple\n\n## The Presentation\n\n1. Problem statement\n2. Your solution\n3. Live demo\n4. Tech stack\n\n## Remember\n\nHackathons are about learning and fun!',
  'Maximize your hackathon experience with these proven tips.',
  '/hackathon-competition.png',
  (SELECT id FROM public.team_members LIMIT 1),
  'Events',
  ARRAY['Hackathon', 'Competition', 'Tips'],
  true,
  10
);

-- Verify the insert
SELECT id, title, category, is_published, author_id, created_at 
FROM public.blogs 
ORDER BY created_at DESC;
