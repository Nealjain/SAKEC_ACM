-- Insert sample team members
INSERT INTO team_members (name, position, bio, image_url, linkedin_url, github_url, email, year, department, achievements, skills, is_executive, display_order) VALUES
('Arjun Sharma', 'President', 'Leading SAKEC ACM with passion for innovation and technology. Experienced in full-stack development and competitive programming.', '/team-president-arjun.png', 'https://linkedin.com/in/arjun-sharma', 'https://github.com/arjunsharma', 'arjun@sakec.ac.in', 'Final Year', 'Computer Engineering', ARRAY['Winner - National Coding Championship 2023', 'Google Summer of Code 2023', 'Published 3 research papers'], ARRAY['JavaScript', 'Python', 'React', 'Node.js', 'Leadership'], true, 1),

('Priya Patel', 'Vice President', 'Passionate about AI/ML and women in tech advocacy. Leading various technical workshops and mentorship programs.', '/team-vp-priya.png', 'https://linkedin.com/in/priya-patel', 'https://github.com/priyapatel', 'priya@sakec.ac.in', 'Third Year', 'Computer Engineering', ARRAY['Best Project Award - TechFest 2023', 'Women in Tech Leadership Award', 'Hackathon Winner - Mumbai Tech Week'], ARRAY['Python', 'Machine Learning', 'TensorFlow', 'Data Science', 'Public Speaking'], true, 2),

('Rahul Kumar', 'Technical Lead', 'Full-stack developer with expertise in modern web technologies. Leads technical workshops and coding bootcamps.', '/team-tech-lead-rahul.png', 'https://linkedin.com/in/rahul-kumar', 'https://github.com/rahulkumar', 'rahul@sakec.ac.in', 'Final Year', 'Information Technology', ARRAY['Microsoft Student Partner', 'Open Source Contributor', '5+ Production Applications'], ARRAY['React', 'Node.js', 'MongoDB', 'AWS', 'Docker'], true, 3),

('Sneha Joshi', 'Secretary', 'Organizing events and managing communications. Passionate about cybersecurity and ethical hacking.', '/team-secretary-sneha.png', 'https://linkedin.com/in/sneha-joshi', 'https://github.com/snehajoshi', 'sneha@sakec.ac.in', 'Third Year', 'Computer Engineering', ARRAY['Certified Ethical Hacker', 'Event Management Excellence Award', 'Cybersecurity Workshop Organizer'], ARRAY['Cybersecurity', 'Python', 'Network Security', 'Event Management', 'Communication'], true, 4);

-- Insert sample events
INSERT INTO events (title, description, date, location, image_url, registration_url, is_featured, category, max_participants) VALUES
('Annual Tech Fest 2024', 'Join us for the biggest technology festival of the year featuring competitions, workshops, and guest lectures.', '2024-03-15 09:00:00+00:00', 'SAKEC Main Auditorium', '/coding-competition.png', 'https://forms.google.com/techfest2024', true, 'Festival', 500),

('Web Development Workshop', 'Learn modern web development with React, Node.js, and MongoDB. Hands-on workshop for beginners to intermediate level.', '2024-02-20 14:00:00+00:00', 'Computer Lab 1', '/web-development-workshop-coding.png', 'https://forms.google.com/webdev-workshop', true, 'Workshop', 50),

('Hackathon 2024: Innovation Challenge', '48-hour hackathon focused on solving real-world problems using technology. Prizes worth ₹1,00,000.', '2024-04-05 18:00:00+00:00', 'SAKEC Campus', '/hackathon-innovation-challenge.png', 'https://forms.google.com/hackathon2024', true, 'Competition', 200),

('Cybersecurity Awareness Lecture', 'Guest lecture by industry expert on latest cybersecurity threats and protection strategies.', '2024-01-25 11:00:00+00:00', 'Seminar Hall', '/cybersecurity-lecture.png', 'https://forms.google.com/cybersecurity-lecture', false, 'Lecture', 100);

-- Insert sample gallery items
INSERT INTO gallery (title, description, image_url, category, event_date, photographer, is_featured, display_order) VALUES
('Tech Fest Opening Ceremony', 'Grand opening of our annual technology festival with inspiring speeches and performances.', '/gallery-tech-fest-opening.png', 'Events', '2023-03-15', 'Photography Club', true, 1),

('Coding Workshop in Action', 'Students actively participating in hands-on coding workshop learning modern web technologies.', '/gallery-coding-workshop.png', 'Workshops', '2023-02-20', 'Tech Team', true, 2),

('Team Building Activity', 'ACM chapter members participating in team building exercises and networking activities.', '/gallery-team-building.png', 'Team', '2023-01-10', 'Events Team', false, 3),

('Hackathon Winners', 'Celebrating the winners of our 48-hour innovation hackathon with their innovative projects.', '/gallery-hackathon-winners.png', 'Competitions', '2023-04-05', 'Media Team', true, 4);

-- Insert sample blog posts
INSERT INTO blogs (title, content, excerpt, image_url, category, tags, is_published, reading_time) VALUES
('Getting Started with Competitive Programming', 'Competitive programming is an excellent way to improve your problem-solving skills and algorithmic thinking. In this comprehensive guide, we''ll explore the fundamentals of competitive programming, essential data structures and algorithms, and provide you with a roadmap to get started on your journey.

## Why Competitive Programming?

Competitive programming offers numerous benefits:
- Enhances problem-solving abilities
- Improves coding speed and accuracy
- Prepares you for technical interviews
- Builds logical thinking skills

## Essential Topics to Master

### Data Structures
- Arrays and Strings
- Linked Lists
- Stacks and Queues
- Trees and Graphs
- Hash Tables

### Algorithms
- Sorting and Searching
- Dynamic Programming
- Greedy Algorithms
- Graph Algorithms
- Number Theory

## Getting Started

1. Choose a programming language (C++, Java, or Python)
2. Start with basic problems on platforms like Codeforces, AtCoder, or LeetCode
3. Practice regularly and participate in contests
4. Learn from editorial solutions and discuss with peers

Remember, consistency is key in competitive programming. Start with easier problems and gradually work your way up to more complex challenges.', 'A comprehensive guide for beginners to start their competitive programming journey with essential topics and practice strategies.', '/blog-competitive-programming.png', 'Programming', ARRAY['competitive-programming', 'algorithms', 'data-structures', 'coding'], true, 8);
