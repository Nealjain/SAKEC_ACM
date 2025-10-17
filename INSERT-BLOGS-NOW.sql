-- Insert 5 sample blog posts into your blogs table
-- This will use your existing team members as authors

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
-- Blog 1: Web Development
(
  'Getting Started with Web Development',
  E'# Getting Started with Web Development\n\nWeb development is an exciting field that combines creativity with technical skills.\n\n## What is Web Development?\n\nWeb development involves creating websites and web applications that run on the internet. It encompasses everything from simple static pages to complex web applications.\n\n## Key Technologies\n\n- **HTML**: Structure and content\n- **CSS**: Styling and layout\n- **JavaScript**: Interactivity and dynamic behavior\n\n## Getting Started\n\n1. Learn HTML and CSS basics\n2. Master JavaScript fundamentals\n3. Explore frameworks like React\n4. Build projects to practice your skills\n\n## Resources\n\nThere are many free resources available online to help you get started with web development. Practice is key to becoming proficient.',
  'Learn the fundamentals of web development and start building amazing websites.',
  '/web-development-workshop-coding.png',
  (SELECT id FROM public.team_members LIMIT 1),
  'Web Development',
  ARRAY['HTML', 'CSS', 'JavaScript', 'Tutorial'],
  true,
  5
),

-- Blog 2: Machine Learning
(
  'Introduction to Machine Learning',
  E'# Introduction to Machine Learning\n\nMachine Learning is transforming how we interact with technology.\n\n## What is Machine Learning?\n\nMachine Learning enables systems to learn from experience without being explicitly programmed. It''s a subset of artificial intelligence that focuses on data and algorithms.\n\n## Types of Machine Learning\n\n- **Supervised Learning**: Learning from labeled data\n- **Unsupervised Learning**: Finding patterns in unlabeled data\n- **Reinforcement Learning**: Learning through trial and error\n\n## Popular Libraries\n\n- TensorFlow\n- PyTorch\n- Scikit-learn\n\n## Getting Started\n\nStart with Python basics, then move on to understanding statistics and linear algebra. Practice with real datasets to build your skills.',
  'Discover the world of Machine Learning and AI.',
  '/innovation-lab-students.png',
  (SELECT id FROM public.team_members LIMIT 1 OFFSET 1),
  'Artificial Intelligence',
  ARRAY['Machine Learning', 'AI', 'Python'],
  true,
  7
),

-- Blog 3: Cybersecurity
(
  'Cybersecurity Best Practices',
  E'# Cybersecurity Best Practices\n\nProtect yourself and your applications from cyber threats.\n\n## Why Security Matters\n\nCyber attacks are becoming more sophisticated every day. Understanding security basics is essential for every developer.\n\n## Essential Practices\n\n1. Use strong, unique passwords\n2. Enable two-factor authentication\n3. Keep software updated\n4. Be cautious with emails and links\n\n## For Developers\n\n- Validate all user inputs\n- Use HTTPS everywhere\n- Implement proper authentication\n- Regular security audits\n- Keep dependencies updated\n\n## Stay Informed\n\nFollow security news and best practices. The threat landscape is constantly evolving.',
  'Learn essential cybersecurity practices to protect yourself and your applications.',
  '/cybersecurity-lecture.png',
  (SELECT id FROM public.team_members LIMIT 1 OFFSET 2),
  'Security',
  ARRAY['Cybersecurity', 'Security', 'Best Practices'],
  true,
  6
),

-- Blog 4: Mobile Development
(
  'Building Your First Mobile App',
  E'# Building Your First Mobile App\n\nMobile development made easy with modern frameworks.\n\n## Choosing Your Platform\n\n- **Native**: Swift for iOS, Kotlin for Android\n- **Cross-Platform**: React Native, Flutter\n\n## Why React Native?\n\nBuild for both iOS and Android with a single codebase. Use JavaScript and React knowledge to create mobile apps.\n\n## Getting Started\n\n```bash\nnpx react-native init MyApp\n```\n\n## Key Concepts\n\n- Components and Props\n- State Management\n- Navigation\n- Native Modules\n\n## Tips for Success\n\nStart small, focus on core functionality first, and test on real devices whenever possible.',
  'Step-by-step guide to building your first mobile application.',
  '/coding-workshop-students.png',
  (SELECT id FROM public.team_members LIMIT 1 OFFSET 3),
  'Mobile Development',
  ARRAY['Mobile', 'React Native', 'App Development'],
  true,
  8
),

-- Blog 5: Hackathon Tips
(
  'Hackathon Success Tips',
  E'# Hackathon Success Tips\n\nMaximize your hackathon experience with these proven strategies.\n\n## Before the Hackathon\n\n- Form a balanced team with diverse skills\n- Brainstorm ideas in advance\n- Set up your development environment\n- Get familiar with available APIs and tools\n\n## During the Hackathon\n\n- Focus on building an MVP first\n- Use existing tools and libraries\n- Keep your solution simple\n- Document as you go\n\n## The Presentation\n\n1. Clear problem statement\n2. Your innovative solution\n3. Live demo (if possible)\n4. Technical stack overview\n5. Future roadmap\n\n## Remember\n\nHackathons are about learning, networking, and having fun. Don''t stress too much about winning!',
  'Maximize your hackathon experience with these proven tips.',
  '/hackathon-competition.png',
  (SELECT id FROM public.team_members LIMIT 1 OFFSET 4),
  'Events',
  ARRAY['Hackathon', 'Competition', 'Tips'],
  true,
  10
);

-- Verify the data was inserted
SELECT id, title, category, is_published, created_at 
FROM public.blogs 
ORDER BY created_at DESC;
