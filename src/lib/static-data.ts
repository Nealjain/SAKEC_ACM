export const staticBlogPosts = [
  {
    id: '1',
    title: 'Getting Started with Web Development',
    content: `# Getting Started with Web Development

Web development is an exciting field that combines creativity with technical skills.

## What is Web Development?

Web development involves creating websites and web applications that run on the internet. It encompasses everything from simple static pages to complex web applications.

## Key Technologies

- **HTML**: Structure and content
- **CSS**: Styling and layout
- **JavaScript**: Interactivity and dynamic behavior

## Getting Started

1. Learn HTML and CSS basics
2. Master JavaScript fundamentals
3. Explore frameworks like React
4. Build projects to practice your skills

## Resources

There are many free resources available online to help you get started with web development. Practice is key to becoming proficient.`,
    excerpt: 'Learn the fundamentals of web development and start building amazing websites.',
    author_id: '1',
    author: {
      name: 'Arjun Sharma',
      position: 'President'
    },
    image_url: '/web-development-workshop-coding.png',
    category: 'Web Development',
    tags: ['HTML', 'CSS', 'JavaScript', 'Tutorial'],
    is_published: true,
    reading_time: 5,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Introduction to Machine Learning',
    content: `# Introduction to Machine Learning

Machine Learning is transforming how we interact with technology.

## What is Machine Learning?

Machine Learning enables systems to learn from experience without being explicitly programmed. It's a subset of artificial intelligence that focuses on data and algorithms.

## Types of Machine Learning

- **Supervised Learning**: Learning from labeled data
- **Unsupervised Learning**: Finding patterns in unlabeled data
- **Reinforcement Learning**: Learning through trial and error

## Popular Libraries

- TensorFlow
- PyTorch
- Scikit-learn

## Getting Started

Start with Python basics, then move on to understanding statistics and linear algebra. Practice with real datasets to build your skills.`,
    excerpt: 'Discover the world of Machine Learning and AI.',
    author_id: '2',
    author: {
      name: 'Priya Patel',
      position: 'Vice President'
    },
    image_url: '/innovation-lab-students.png',
    category: 'Artificial Intelligence',
    tags: ['Machine Learning', 'AI', 'Python'],
    is_published: true,
    reading_time: 7,
    created_at: '2025-02-01T14:30:00Z',
    updated_at: '2025-02-01T14:30:00Z'
  },
  {
    id: '3',
    title: 'Cybersecurity Best Practices',
    content: `# Cybersecurity Best Practices

Protect yourself and your applications from cyber threats.

## Why Security Matters

Cyber attacks are becoming more sophisticated every day. Understanding security basics is essential for every developer.

## Essential Practices

1. Use strong, unique passwords
2. Enable two-factor authentication
3. Keep software updated
4. Be cautious with emails and links

## For Developers

- Validate all user inputs
- Use HTTPS everywhere
- Implement proper authentication
- Regular security audits
- Keep dependencies updated

## Stay Informed

Follow security news and best practices. The threat landscape is constantly evolving.`,
    excerpt: 'Learn essential cybersecurity practices to protect yourself and your applications.',
    author_id: '3',
    author: {
      name: 'Rahul Kumar',
      position: 'Technical Lead'
    },
    image_url: '/cybersecurity-lecture.png',
    category: 'Security',
    tags: ['Cybersecurity', 'Security', 'Best Practices'],
    is_published: true,
    reading_time: 6,
    created_at: '2025-02-10T09:00:00Z',
    updated_at: '2025-02-10T09:00:00Z'
  },
  {
    id: '4',
    title: 'Building Your First Mobile App',
    content: `# Building Your First Mobile App

Mobile development made easy with modern frameworks.

## Choosing Your Platform

- **Native**: Swift for iOS, Kotlin for Android
- **Cross-Platform**: React Native, Flutter

## Why React Native?

Build for both iOS and Android with a single codebase. Use JavaScript and React knowledge to create mobile apps.

## Getting Started

\`\`\`bash
npx react-native init MyApp
\`\`\`

## Key Concepts

- Components and Props
- State Management
- Navigation
- Native Modules

## Tips for Success

Start small, focus on core functionality first, and test on real devices whenever possible.`,
    excerpt: 'Step-by-step guide to building your first mobile application.',
    author_id: '1',
    author: {
      name: 'Arjun Sharma',
      position: 'President'
    },
    image_url: '/coding-workshop-students.png',
    category: 'Mobile Development',
    tags: ['Mobile', 'React Native', 'App Development'],
    is_published: true,
    reading_time: 8,
    created_at: '2025-03-05T16:00:00Z',
    updated_at: '2025-03-05T16:00:00Z'
  },
  {
    id: '5',
    title: 'Hackathon Success Tips',
    content: `# Hackathon Success Tips

Maximize your hackathon experience with these proven strategies.

## Before the Hackathon

- Form a balanced team with diverse skills
- Brainstorm ideas in advance
- Set up your development environment
- Get familiar with available APIs and tools

## During the Hackathon

- Focus on building an MVP first
- Use existing tools and libraries
- Keep your solution simple
- Document as you go

## The Presentation

1. Clear problem statement
2. Your innovative solution
3. Live demo (if possible)
4. Technical stack overview
5. Future roadmap

## Remember

Hackathons are about learning, networking, and having fun. Don't stress too much about winning!`,
    excerpt: 'Maximize your hackathon experience with these proven tips.',
    author_id: '2',
    author: {
      name: 'Priya Patel',
      position: 'Vice President'
    },
    image_url: '/hackathon-competition.png',
    category: 'Events',
    tags: ['Hackathon', 'Competition', 'Tips'],
    is_published: true,
    reading_time: 10,
    created_at: '2025-03-20T11:00:00Z',
    updated_at: '2025-03-20T11:00:00Z'
  }
]

export const staticEvents = [
  {
    id: '1',
    title: 'Welcome Event 2025',
    description: 'Join us for the welcome event to kick off the new academic year. Meet fellow students, learn about ACM activities, and discover opportunities to grow your technical skills.',
    date: '2025-09-20',
    time: '10:00',
    location: 'SAKEC Auditorium',
    image_url: '/placeholder.jpg',
    is_featured: true,
    current_participants: 0,
    created_at: '2025-01-01',
    updated_at: '2025-01-01'
  },
  {
    id: '2',
    title: 'Coding Workshop: JavaScript Fundamentals',
    description: 'Learn the basics of JavaScript programming in this hands-on workshop. Perfect for beginners looking to start their web development journey.',
    date: '2025-02-15',
    time: '14:00',
    location: 'Computer Lab 1',
    image_url: '/placeholder.jpg',
    is_featured: false,
    current_participants: 25,
    created_at: '2025-01-01',
    updated_at: '2025-01-01'
  },
  {
    id: '3',
    title: 'Tech Talk: AI and Machine Learning',
    description: 'Industry experts will discuss the latest trends in AI and ML, career opportunities, and how to get started in this exciting field.',
    date: '2025-03-10',
    time: '16:00',
    location: 'Main Auditorium',
    image_url: '/placeholder.jpg',
    is_featured: true,
    current_participants: 150,
    created_at: '2025-01-01',
    updated_at: '2025-01-01'
  }
]

export const staticTeamMembers = [
  {
    id: '1',
    name: 'Arjun Sharma',
    position: 'President',
    bio: 'Leading SAKEC ACM with passion for innovation and technology. Experienced in full-stack development and competitive programming.',
    image_url: '/team-president-arjun.png',
    linkedin_url: 'https://linkedin.com/in/arjun-sharma',
    github_url: 'https://github.com/arjunsharma',
    email: 'arjun@sakec.ac.in',
    year: 'Final Year',
    department: 'Computer Engineering',
    achievements: ['Winner - National Coding Championship 2023', 'Google Summer of Code 2023', 'Published 3 research papers'],
    skills: ['JavaScript', 'Python', 'React', 'Node.js', 'Leadership'],
    is_executive: true,
    display_order: 1,
    personal_quote: 'Innovation is the key to unlocking tomorrow\'s possibilities.',
    about_us: 'Passionate about leading teams and driving technological innovation.',
    cv_url: 'https://example.com/cv/arjun-sharma.pdf',
    created_at: '2023-01-01'
  },
  {
    id: '2',
    name: 'Priya Patel',
    position: 'Vice President',
    bio: 'Passionate about AI/ML and women in tech advocacy. Leading various technical workshops and mentorship programs.',
    image_url: '/team-vp-priya.png',
    linkedin_url: 'https://linkedin.com/in/priya-patel',
    github_url: 'https://github.com/priyapatel',
    email: 'priya@sakec.ac.in',
    year: 'Third Year',
    department: 'Computer Engineering',
    achievements: ['Best Project Award - TechFest 2023', 'Women in Tech Leadership Award'],
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'Data Science'],
    is_executive: true,
    display_order: 2,
    personal_quote: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
    about_us: 'Dedicated to fostering a culture of excellence and innovation in computer science education.',
    cv_url: 'https://example.com/cv/priya-patel.pdf',
    created_at: '2023-01-01'
  },
  {
    id: '3',
    name: 'Rahul Kumar',
    position: 'Technical Lead',
    bio: 'Full-stack developer with expertise in modern web technologies. Leads technical workshops and coding bootcamps.',
    image_url: '/team-tech-lead-rahul.png',
    linkedin_url: 'https://linkedin.com/in/rahul-kumar',
    github_url: 'https://github.com/rahulkumar',
    email: 'rahul@sakec.ac.in',
    year: 'Final Year',
    department: 'Information Technology',
    achievements: ['Microsoft Student Partner', 'Open Source Contributor'],
    skills: ['React', 'Node.js', 'MongoDB', 'AWS', 'Docker'],
    is_executive: true,
    display_order: 3,
    personal_quote: 'The best code is the code that never needs to be written.',
    about_us: 'Full-stack developer with expertise in modern web technologies and cloud computing.',
    cv_url: 'https://example.com/cv/rahul-kumar.pdf',
    created_at: '2023-01-01'
  },
  // Additional team members based on generated directories
  {
    id: '4',
    name: 'Aasvi Patel',
    position: 'Team Member',
    bio: 'Passionate about technology and innovation.',
    image_url: '/placeholder.svg',
    year: 'Third Year',
    department: 'Computer Engineering',
    achievements: [],
    skills: [],
    is_executive: false,
    display_order: 4,
    created_at: '2023-01-01'
  },
  {
    id: '5',
    name: 'Ajitesh Bamne',
    position: 'Team Member',
    bio: 'Passionate about technology and innovation.',
    image_url: '/placeholder.svg',
    year: 'Third Year',
    department: 'Computer Engineering',
    achievements: [],
    skills: [],
    is_executive: false,
    display_order: 5,
    created_at: '2023-01-01'
  },
  {
    id: '6',
    name: 'Ankitkumar Oza',
    position: 'Team Member',
    bio: 'Passionate about technology and innovation.',
    image_url: '/placeholder.svg',
    year: 'Third Year',
    department: 'Computer Engineering',
    achievements: [],
    skills: [],
    is_executive: false,
    display_order: 6,
    created_at: '2023-01-01'
  },
  {
    id: '7',
    name: 'Arin Pawar',
    position: 'Team Member',
    bio: 'Passionate about technology and innovation.',
    image_url: '/placeholder.svg',
    year: 'Third Year',
    department: 'Computer Engineering',
    achievements: [],
    skills: [],
    is_executive: false,
    display_order: 7,
    created_at: '2023-01-01'
  },
  {
    id: '8',
    name: 'Aryan Ramesh Chandran',
    position: 'Team Member',
    bio: 'Passionate about technology and innovation.',
    image_url: '/placeholder.svg',
    year: 'Third Year',
    department: 'Computer Engineering',
    achievements: [],
    skills: [],
    is_executive: false,
    display_order: 8,
    created_at: '2023-01-01'
  },
  {
    id: '9',
    name: 'Ayushi Bhanushali',
    position: 'Team Member',
    bio: 'Passionate about technology and innovation.',
    image_url: '/placeholder.svg',
    year: 'Third Year',
    department: 'Computer Engineering',
    achievements: [],
    skills: [],
    is_executive: false,
    display_order: 9,
    created_at: '2023-01-01'
  },
  {
    id: '10',
    name: 'Deep Nitesh Shirke',
    position: 'Team Member',
    bio: 'Passionate about technology and innovation.',
    image_url: '/placeholder.svg',
    year: 'Third Year',
    department: 'Computer Engineering',
    achievements: [],
    skills: [],
    is_executive: false,
    display_order: 10,
    created_at: '2023-01-01'
  },
  {
    id: '11',
    name: 'Devesh Patel',
    position: 'Team Member',
    bio: 'Passionate about technology and innovation.',
    image_url: '/placeholder.svg',
    year: 'Third Year',
    department: 'Computer Engineering',
    achievements: [],
    skills: [],
    is_executive: false,
    display_order: 11,
    created_at: '2023-01-01'
  },
  {
    id: '12',
    name: 'Harsh Bajania',
    position: 'Team Member',
    bio: 'Passionate about technology and innovation.',
    image_url: '/placeholder.svg',
    year: 'Third Year',
    department: 'Computer Engineering',
    achievements: [],
    skills: [],
    is_executive: false,
    display_order: 12,
    created_at: '2023-01-01'
  },
  {
    id: '13',
    name: 'Jeel Mashru',
    position: 'Team Member',
    bio: 'Passionate about technology and innovation.',
    image_url: '/placeholder.svg',
    year: 'Third Year',
    department: 'Computer Engineering',
    achievements: [],
    skills: [],
    is_executive: false,
    display_order: 13,
    created_at: '2023-01-01'
  },
  {
    id: '14',
    name: 'Manali Dhamale',
    position: 'Team Member',
    bio: 'Passionate about technology and innovation.',
    image_url: '/placeholder.svg',
    year: 'Third Year',
    department: 'Computer Engineering',
    achievements: [],
    skills: [],
    is_executive: false,
    display_order: 14,
    created_at: '2023-01-01'
  },
  {
    id: '15',
    name: 'Neal Jain',
    position: 'Team Member',
    bio: 'Passionate about technology and innovation.',
    image_url: '/placeholder.svg',
    year: 'Third Year',
    department: 'Computer Engineering',
    achievements: [],
    skills: [],
    is_executive: false,
    display_order: 15,
    created_at: '2023-01-01'
  },
  {
    id: '16',
    name: 'Nihaar Kotak',
    position: 'Team Member',
    bio: 'Passionate about technology and innovation.',
    image_url: '/placeholder.svg',
    year: 'Third Year',
    department: 'Computer Engineering',
    achievements: [],
    skills: [],
    is_executive: false,
    display_order: 16,
    created_at: '2023-01-01'
  },
  {
    id: '17',
    name: 'Riaan Bhanushali',
    position: 'Team Member',
    bio: 'Passionate about technology and innovation.',
    image_url: '/placeholder.svg',
    year: 'Third Year',
    department: 'Computer Engineering',
    achievements: [],
    skills: [],
    is_executive: false,
    display_order: 17,
    created_at: '2023-01-01'
  },
  {
    id: '18',
    name: 'Rutvi Kanaba',
    position: 'Team Member',
    bio: 'Passionate about technology and innovation.',
    image_url: '/placeholder.svg',
    year: 'Third Year',
    department: 'Computer Engineering',
    achievements: [],
    skills: [],
    is_executive: false,
    display_order: 18,
    created_at: '2023-01-01'
  },
  {
    id: '19',
    name: 'Vishwa Patel',
    position: 'Team Member',
    bio: 'Passionate about technology and innovation.',
    image_url: '/placeholder.svg',
    year: 'Third Year',
    department: 'Computer Engineering',
    achievements: [],
    skills: [],
    is_executive: false,
    display_order: 19,
    created_at: '2023-01-01'
  },
  {
    id: '20',
    name: 'Viya Punmiya',
    position: 'Team Member',
    bio: 'Passionate about technology and innovation.',
    image_url: '/placeholder.svg',
    year: 'Third Year',
    department: 'Computer Engineering',
    achievements: [],
    skills: [],
    is_executive: false,
    display_order: 20,
    created_at: '2023-01-01'
  },
  {
    id: '21',
    name: 'Yami Parmar',
    position: 'Team Member',
    bio: 'Passionate about technology and innovation.',
    image_url: '/placeholder.svg',
    year: 'Third Year',
    department: 'Computer Engineering',
    achievements: [],
    skills: [],
    is_executive: false,
    display_order: 21,
    created_at: '2023-01-01'
  },
  {
    id: '22',
    name: 'Yash Yadav',
    position: 'Team Member',
    bio: 'Passionate about technology and innovation.',
    image_url: '/placeholder.svg',
    year: 'Third Year',
    department: 'Computer Engineering',
    achievements: [],
    skills: [],
    is_executive: false,
    display_order: 22,
    created_at: '2023-01-01'
  }
]