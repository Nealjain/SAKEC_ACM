// Insert blogs directly into Supabase
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://dhxzkzdlsszwuqjkicnv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoeHpremRsc3N6d3VxamtpY252Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNTYyNjksImV4cCI6MjA3MDgzMjI2OX0.ofq619iAaQPW33zm_6uG6-r9UDg6tU7EF8krqZWlLOs'

const supabase = createClient(supabaseUrl, supabaseKey)

async function insertBlogs() {
  console.log('Getting team members...')
  
  // Get team member IDs
  const { data: members, error: membersError } = await supabase
    .from('team_members')
    .select('id')
    .limit(5)

  if (membersError || !members || members.length === 0) {
    console.error('❌ Error: No team members found. Please add team members first.')
    return
  }

  console.log(`✅ Found ${members.length} team members`)

  const blogs = [
    {
      title: 'Getting Started with Web Development',
      content: `# Getting Started with Web Development

Web development is an exciting field that combines creativity with technical skills.

## What is Web Development?

Web development involves creating websites and web applications.

## Key Technologies

- HTML: Structure
- CSS: Styling  
- JavaScript: Interactivity

## Getting Started

1. Learn HTML and CSS basics
2. Master JavaScript fundamentals
3. Explore frameworks like React
4. Build projects to practice`,
      excerpt: 'Learn the fundamentals of web development and start building amazing websites.',
      image_url: '/web-development-workshop-coding.png',
      author_id: members[0].id,
      category: 'Web Development',
      tags: ['HTML', 'CSS', 'JavaScript', 'Tutorial'],
      is_published: true,
      reading_time: 5
    },
    {
      title: 'Introduction to Machine Learning',
      content: `# Introduction to Machine Learning

Machine Learning is transforming technology.

## What is Machine Learning?

ML enables systems to learn from experience.

## Types of ML

- Supervised Learning
- Unsupervised Learning
- Reinforcement Learning

## Popular Libraries

- TensorFlow
- PyTorch
- Scikit-learn`,
      excerpt: 'Discover the world of Machine Learning and AI.',
      image_url: '/innovation-lab-students.png',
      author_id: members[1 % members.length].id,
      category: 'Artificial Intelligence',
      tags: ['Machine Learning', 'AI', 'Python'],
      is_published: true,
      reading_time: 7
    },
    {
      title: 'Cybersecurity Best Practices',
      content: `# Cybersecurity Best Practices

Protect yourself and your applications.

## Why Security Matters

Cyber attacks are becoming more sophisticated.

## Essential Practices

1. Use strong passwords
2. Enable 2FA
3. Keep software updated
4. Be cautious with emails

## For Developers

- Validate all inputs
- Use HTTPS
- Regular security audits`,
      excerpt: 'Learn essential cybersecurity practices to protect yourself and your applications.',
      image_url: '/cybersecurity-lecture.png',
      author_id: members[2 % members.length].id,
      category: 'Security',
      tags: ['Cybersecurity', 'Security', 'Best Practices'],
      is_published: true,
      reading_time: 6
    },
    {
      title: 'Building Your First Mobile App',
      content: `# Building Your First Mobile App

Mobile development made easy.

## Choosing Your Platform

- Native: Swift/Kotlin
- Cross-Platform: React Native/Flutter

## Why React Native?

Build for iOS and Android with one codebase.

## Getting Started

\`\`\`bash
npx react-native init MyApp
\`\`\`

## Key Concepts

- Components
- State Management
- Navigation`,
      excerpt: 'Step-by-step guide to building your first mobile application.',
      image_url: '/coding-workshop-students.png',
      author_id: members[3 % members.length].id,
      category: 'Mobile Development',
      tags: ['Mobile', 'React Native', 'App Development'],
      is_published: true,
      reading_time: 8
    },
    {
      title: 'Hackathon Success Tips',
      content: `# Hackathon Success Tips

Maximize your hackathon experience.

## Before the Hackathon

- Form a balanced team
- Brainstorm ideas
- Set up dev environment

## During the Hackathon

- Focus on MVP first
- Use existing tools
- Keep it simple

## The Presentation

1. Problem statement
2. Your solution
3. Live demo
4. Tech stack

## Remember

Hackathons are about learning and fun!`,
      excerpt: 'Maximize your hackathon experience with these proven tips.',
      image_url: '/hackathon-competition.png',
      author_id: members[4 % members.length].id,
      category: 'Events',
      tags: ['Hackathon', 'Competition', 'Tips'],
      is_published: true,
      reading_time: 10
    }
  ]

  console.log('\nInserting blogs...')

  const { data, error } = await supabase
    .from('blogs')
    .insert(blogs)
    .select()

  if (error) {
    console.error('❌ Error inserting blogs:', error)
    return
  }

  console.log(`✅ Successfully inserted ${data.length} blog posts!`)
  
  // Verify
  const { data: allBlogs, error: verifyError } = await supabase
    .from('blogs')
    .select('id, title, category, is_published')
    .eq('is_published', true)

  if (verifyError) {
    console.error('Error verifying:', verifyError)
  } else {
    console.log('\n📝 Published blogs in database:')
    allBlogs.forEach((blog, i) => {
      console.log(`   ${i + 1}. ${blog.title} (${blog.category})`)
    })
  }

  console.log('\n✅ Done! Refresh your /blog page to see the posts.')
}

insertBlogs().catch(console.error)
