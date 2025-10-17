# Fix Blog - Quick Steps

## Problem
Your blog shows "No blog posts available" because your Supabase `blogs` table is empty.

## Solution - 3 Simple Steps

### Step 1: Go to Supabase SQL Editor

1. Open https://app.supabase.com
2. Select your project
3. Click "SQL Editor" in the left sidebar
4. Click "New query"

### Step 2: Copy and Run This SQL

Copy this entire SQL and paste it into the SQL Editor, then click "Run":

```sql
-- Insert 5 sample blog posts
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
```

### Step 3: Verify

Run this to check if blogs were inserted:

```sql
SELECT id, title, category, is_published 
FROM public.blogs 
ORDER BY created_at DESC;
```

You should see 5 blog posts!

## Step 4: Refresh Your Website

1. Go to your website `/blog` page
2. Refresh the page (Ctrl+R or Cmd+R)
3. You should now see 5 blog posts!

## If Still Not Working

### Check RLS (Row Level Security)

Run this in Supabase SQL Editor:

```sql
-- Enable RLS
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Allow public to read published blogs
CREATE POLICY "Allow public read published blogs"
ON public.blogs
FOR SELECT
USING (is_published = true);
```

Then refresh your website again.

## Alternative: Use Static Data Temporarily

If you want to see blogs immediately while fixing Supabase, the site will automatically fall back to static blog posts. Just refresh the page and check the browser console (F12) for any errors.

## Need Help?

Check the browser console (F12 → Console tab) for error messages. The logs will show:
- "Fetching blogs from Supabase..."
- "Fetched blogs from Supabase: X posts"
- Or any error messages

## Files Created for You

- `scripts/insert-blogs-simple.sql` - Simple SQL to insert blogs
- `test-supabase-connection.js` - Test your Supabase connection
- `BLOG-SETUP-GUIDE.md` - Detailed setup guide
