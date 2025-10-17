-- Insert sample blog posts
-- Make sure you have team_members table with some data first

-- Insert sample blogs (replace author_id with actual team member IDs from your team_members table)
INSERT INTO public.blogs (title, content, excerpt, image_url, author_id, category, tags, is_published, reading_time)
VALUES 
(
  'Getting Started with Web Development',
  E'# Getting Started with Web Development\n\nWeb development is an exciting field that combines creativity with technical skills. In this comprehensive guide, we''ll explore the fundamentals of web development and help you start your journey.\n\n## What is Web Development?\n\nWeb development involves creating websites and web applications. It encompasses everything from simple static pages to complex web applications.\n\n## Key Technologies\n\n### Frontend\n- HTML: Structure\n- CSS: Styling\n- JavaScript: Interactivity\n\n### Backend\n- Node.js\n- Python\n- Databases\n\n## Getting Started\n\n1. Learn HTML and CSS basics\n2. Master JavaScript fundamentals\n3. Explore frameworks like React or Next.js\n4. Build projects to practice\n\n## Conclusion\n\nWeb development is a rewarding career path with endless opportunities for growth and creativity.',
  'Learn the fundamentals of web development and start building amazing websites. This guide covers HTML, CSS, JavaScript, and modern frameworks.',
  '/web-development-workshop-coding.png',
  (SELECT id FROM public.team_members WHERE position LIKE '%President%' LIMIT 1),
  'Web Development',
  ARRAY['HTML', 'CSS', 'JavaScript', 'Tutorial'],
  true,
  5
),
(
  'Introduction to Machine Learning',
  E'# Introduction to Machine Learning\n\nMachine Learning is transforming the way we interact with technology. Let''s dive into the basics of this fascinating field.\n\n## What is Machine Learning?\n\nMachine Learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed.\n\n## Types of Machine Learning\n\n### Supervised Learning\nLearning from labeled data to make predictions.\n\n### Unsupervised Learning\nFinding patterns in unlabeled data.\n\n### Reinforcement Learning\nLearning through trial and error with rewards.\n\n## Popular Libraries\n\n- TensorFlow\n- PyTorch\n- Scikit-learn\n- Keras\n\n## Getting Started\n\n1. Learn Python programming\n2. Understand statistics and linear algebra\n3. Study ML algorithms\n4. Work on real-world projects\n\n## Applications\n\n- Image recognition\n- Natural language processing\n- Recommendation systems\n- Autonomous vehicles\n\nMachine Learning is the future, and now is the perfect time to start learning!',
  'Discover the world of Machine Learning and AI. Learn about different types of ML, popular frameworks, and how to get started in this exciting field.',
  '/innovation-lab-students.png',
  (SELECT id FROM public.team_members WHERE position LIKE '%Vice President%' LIMIT 1),
  'Artificial Intelligence',
  ARRAY['Machine Learning', 'AI', 'Python', 'Data Science'],
  true,
  7
),
(
  'Cybersecurity Best Practices',
  E'# Cybersecurity Best Practices\n\nIn today''s digital world, cybersecurity is more important than ever. Learn how to protect yourself and your applications.\n\n## Why Cybersecurity Matters\n\nCyber attacks are becoming more sophisticated, and everyone needs to understand basic security principles.\n\n## Essential Security Practices\n\n### 1. Strong Passwords\n- Use unique passwords for each account\n- Enable two-factor authentication\n- Use a password manager\n\n### 2. Keep Software Updated\nRegular updates patch security vulnerabilities.\n\n### 3. Be Cautious with Emails\n- Don''t click suspicious links\n- Verify sender identity\n- Watch for phishing attempts\n\n### 4. Secure Your Network\n- Use VPN on public WiFi\n- Enable firewall\n- Secure your router\n\n## For Developers\n\n- Validate all inputs\n- Use HTTPS everywhere\n- Implement proper authentication\n- Regular security audits\n- Keep dependencies updated\n\n## Common Threats\n\n1. Phishing\n2. Malware\n3. SQL Injection\n4. Cross-Site Scripting (XSS)\n5. DDoS Attacks\n\n## Conclusion\n\nCybersecurity is everyone''s responsibility. Stay informed and stay safe!',
  'Learn essential cybersecurity practices to protect yourself and your applications from common threats. A must-read guide for developers and users.',
  '/cybersecurity-lecture.png',
  (SELECT id FROM public.team_members WHERE position LIKE '%Secretary%' LIMIT 1),
  'Security',
  ARRAY['Cybersecurity', 'Security', 'Best Practices', 'Privacy'],
  true,
  6
),
(
  'Building Your First Mobile App',
  E'# Building Your First Mobile App\n\nMobile app development is an exciting journey. Let''s explore how to build your first mobile application.\n\n## Choosing Your Platform\n\n### Native Development\n- iOS: Swift/SwiftUI\n- Android: Kotlin/Jetpack Compose\n\n### Cross-Platform\n- React Native\n- Flutter\n- Ionic\n\n## Why React Native?\n\nReact Native allows you to build mobile apps using JavaScript and React, with a single codebase for both iOS and Android.\n\n## Getting Started\n\n### Prerequisites\n- Node.js installed\n- Basic JavaScript knowledge\n- React fundamentals\n\n### Setup\n```bash\nnpx react-native init MyFirstApp\ncd MyFirstApp\nnpm start\n```\n\n## Key Concepts\n\n1. **Components**: Building blocks of your app\n2. **State Management**: Managing app data\n3. **Navigation**: Moving between screens\n4. **APIs**: Fetching data from servers\n\n## Best Practices\n\n- Keep components small and focused\n- Use TypeScript for type safety\n- Implement proper error handling\n- Test on real devices\n- Optimize performance\n\n## Publishing Your App\n\n1. Prepare app assets\n2. Create developer accounts\n3. Build release versions\n4. Submit to app stores\n\nStart building today and bring your ideas to life!',
  'Step-by-step guide to building your first mobile application. Learn about different platforms, frameworks, and best practices for mobile development.',
  '/coding-workshop-students.png',
  (SELECT id FROM public.team_members WHERE position LIKE '%Treasurer%' LIMIT 1),
  'Mobile Development',
  ARRAY['Mobile', 'React Native', 'Flutter', 'App Development'],
  true,
  8
),
(
  'Hackathon Success Tips',
  E'# Hackathon Success Tips\n\nHackathons are intense, exciting events where you can learn, build, and network. Here''s how to make the most of them.\n\n## Before the Hackathon\n\n### Preparation\n- Form a balanced team\n- Brainstorm ideas beforehand\n- Set up development environment\n- Get familiar with APIs you might use\n\n### What to Bring\n- Laptop and chargers\n- Snacks and water\n- Comfortable clothes\n- Positive attitude\n\n## During the Hackathon\n\n### Time Management\n- First 2 hours: Planning and setup\n- Next 12 hours: Core development\n- Last 6 hours: Polish and presentation\n- Final 2 hours: Practice demo\n\n### Team Collaboration\n- Use version control (Git)\n- Divide tasks clearly\n- Regular check-ins\n- Help each other\n\n## Building Your Project\n\n### MVP First\nFocus on core functionality before adding features.\n\n### Use Existing Tools\n- APIs and libraries\n- Templates and boilerplates\n- Cloud services\n\n### Keep It Simple\nA working simple project beats a broken complex one.\n\n## The Presentation\n\n### Structure\n1. Problem statement (30 seconds)\n2. Your solution (1 minute)\n3. Live demo (2 minutes)\n4. Tech stack (30 seconds)\n5. Future plans (30 seconds)\n\n### Tips\n- Practice your demo\n- Have a backup plan\n- Show enthusiasm\n- Explain impact\n\n## After the Hackathon\n\n- Network with participants\n- Share your project\n- Continue development\n- Apply learnings\n\n## Common Mistakes to Avoid\n\n1. Overcomplicating the project\n2. Poor time management\n3. Not sleeping at all\n4. Ignoring the presentation\n5. Working alone\n\nRemember: Hackathons are about learning and having fun. Win or lose, you''ll gain valuable experience!',
  'Maximize your hackathon experience with these proven tips and strategies. Learn how to plan, build, and present your project effectively.',
  '/hackathon-competition.png',
  (SELECT id FROM public.team_members LIMIT 1),
  'Events',
  ARRAY['Hackathon', 'Competition', 'Tips', 'Team Work'],
  true,
  10
);

-- Verify the data was inserted
SELECT id, title, category, is_published, created_at 
FROM public.blogs 
ORDER BY created_at DESC;
