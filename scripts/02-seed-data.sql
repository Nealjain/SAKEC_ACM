-- Insert sample events
INSERT INTO events (title, description, date, time, location, image_url) VALUES
('Tech Talk: AI in Modern Development', 'Join us for an insightful discussion on how AI is transforming software development practices.', '2024-02-15', '14:00:00', 'Seminar Hall A', '/placeholder.svg?height=300&width=400'),
('Coding Competition 2024', 'Annual coding competition with exciting prizes and challenges for all skill levels.', '2024-02-28', '10:00:00', 'Computer Lab 1', '/placeholder.svg?height=300&width=400'),
('Workshop: Web Development Fundamentals', 'Learn the basics of modern web development with hands-on exercises.', '2024-03-10', '15:30:00', 'Lab 2', '/placeholder.svg?height=300&width=400');

-- Insert sample team members
INSERT INTO team_members (name, position, bio, image_url, year, department) VALUES
('Arjun Sharma', 'President', 'Computer Science enthusiast with passion for AI and machine learning.', '/placeholder.svg?height=300&width=300', 'Final Year', 'Computer Engineering'),
('Priya Patel', 'Vice President', 'Full-stack developer and open source contributor.', '/placeholder.svg?height=300&width=300', 'Third Year', 'Information Technology'),
('Rahul Kumar', 'Technical Lead', 'Competitive programmer and algorithm enthusiast.', '/placeholder.svg?height=300&width=300', 'Final Year', 'Computer Engineering');

-- Insert sample gallery items
INSERT INTO gallery (title, description, image_url, category, event_date) VALUES
('Tech Fest 2023', 'Annual technical festival with various competitions and exhibitions.', '/placeholder.svg?height=400&width=600', 'Events', '2023-11-15'),
('Coding Workshop', 'Students learning programming concepts in our workshop.', '/placeholder.svg?height=400&width=600', 'Workshops', '2023-10-20'),
('Team Building Activity', 'ACM chapter members participating in team building exercises.', '/placeholder.svg?height=400&width=600', 'Activities', '2023-09-30');

-- Insert sample blog posts
INSERT INTO blogs (title, content, excerpt, author, image_url, published) VALUES
('Getting Started with Competitive Programming', 'Competitive programming is an excellent way to improve your problem-solving skills...', 'Learn the fundamentals of competitive programming and how to get started.', 'Rahul Kumar', '/placeholder.svg?height=300&width=500', true),
('The Future of AI in Education', 'Artificial Intelligence is revolutionizing the education sector...', 'Exploring how AI is transforming modern education systems.', 'Arjun Sharma', '/placeholder.svg?height=300&width=500', true);
