-- Sample team members data matching your exact schema
INSERT INTO public.team_members (name, position, image_url, linkedin_url, github_url, email, year, department, display_order, "PRN", personal_quote, about_us)
VALUES
  (
    'John Doe',
    'President',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    'https://linkedin.com/in/johndoe',
    'https://github.com/johndoe',
    'john.doe@example.com',
    '2024',
    'Computer Science',
    1,
    'PRN001',
    'Code is poetry, and every bug is a verse waiting to be perfected.',
    'Passionate about building scalable applications and leading technical teams. Experienced in full-stack development with a focus on modern web technologies.'
  ),
  (
    'Jane Smith',
    'Vice President',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    'https://linkedin.com/in/janesmith',
    'https://github.com/janesmith',
    'jane.smith@example.com',
    '2024',
    'Information Technology',
    2,
    'PRN002',
    'Innovation distinguishes between a leader and a follower.',
    'Dedicated to fostering innovation and collaboration within the tech community. Specializes in AI/ML and data science projects.'
  ),
  (
    'Mike Johnson',
    'Technical Lead',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    'https://linkedin.com/in/mikejohnson',
    'https://github.com/mikejohnson',
    'mike.johnson@example.com',
    '2025',
    'Computer Engineering',
    3,
    'PRN003',
    'The best way to predict the future is to invent it.',
    'Enthusiastic about open-source contributions and mentoring junior developers. Expertise in cloud architecture and DevOps practices.'
  );
