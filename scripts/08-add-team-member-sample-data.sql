-- Add sample data for team members with new fields
-- Update existing team members with new fields

-- Example 1: President
UPDATE team_members 
SET 
  personal_quote = 'Innovation is the key to unlocking tomorrow\'s possibilities.',
  about_us = 'Passionate about leading teams and driving technological innovation. With 3+ years of experience in software development and project management, I believe in empowering students to reach their full potential through collaborative learning and hands-on experience.',
  cv_url = 'https://example.com/cv/president.pdf'
WHERE position = 'President' 
LIMIT 1;

-- Example 2: Vice President
UPDATE team_members 
SET 
  personal_quote = 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
  about_us = 'Dedicated to fostering a culture of excellence and innovation in computer science education. Specializing in competitive programming and algorithm design, I mentor students to develop strong problem-solving skills and technical expertise.',
  cv_url = 'https://example.com/cv/vice-president.pdf'
WHERE position = 'Vice President' 
LIMIT 1;

-- Example 3: Technical Lead
UPDATE team_members 
SET 
  personal_quote = 'The best code is the code that never needs to be written.',
  about_us = 'Full-stack developer with expertise in modern web technologies and cloud computing. Committed to organizing impactful technical workshops and hackathons that bridge the gap between academic learning and industry practices.',
  cv_url = 'https://example.com/cv/technical-lead.pdf'
WHERE position = 'Technical Lead' 
LIMIT 1;

-- Example 4: Secretary
UPDATE team_members 
SET 
  personal_quote = 'Organization is the foundation of success.',
  about_us = 'Detail-oriented professional with strong organizational and communication skills. Responsible for maintaining chapter documentation, coordinating meetings, and ensuring smooth communication between all stakeholders.'
WHERE position = 'Secretary' 
LIMIT 1;

-- Example 5: General Member
UPDATE team_members 
SET 
  personal_quote = 'Learning is a journey, not a destination.',
  about_us = 'Enthusiastic about technology and eager to contribute to the ACM community. Actively participating in workshops, competitions, and collaborative projects to enhance skills and build meaningful connections.'
WHERE position NOT IN ('President', 'Vice President', 'Technical Lead', 'Secretary', 'Treasurer') 
LIMIT 1;
