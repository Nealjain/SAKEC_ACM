-- Insert Faculty Members
INSERT INTO public.faculty_members (name, position, bio, department, display_order)
VALUES 
('Dr. Bhavesh Patel', 'Principal', 'Principal of SAKEC with over 20 years of experience.', 'Computer Engineering', 1),
('Prof. Swati Nadkarni', 'HOD', 'Head of Computer Engineering Department.', 'Computer Engineering', 2);

-- Insert Core Team Members
INSERT INTO public.team_members (name, position, department, year, display_order, personal_quote)
VALUES 
('Neal Manawat', 'Chairperson', 'Computer Engineering', 'TE', 1, 'Innovate and Inspire'),
('Riya Shah', 'Vice Chairperson', 'Computer Engineering', 'TE', 2, 'Code is Poetry'),
('Aryan Gupta', 'Technical Head', 'Information Technology', 'TE', 3, 'Building the future, one line at a time');

-- Insert Alumni Members
INSERT INTO public.alumni_members (name, position, department, display_order)
VALUES 
('John Doe', 'Software Engineer at Google', 'Computer Engineering', 1),
('Jane Smith', 'Product Manager at Microsoft', 'Information Technology', 2);

-- Insert Events
INSERT INTO public.events (title, description, date, location, is_featured)
VALUES 
('Tech Week 2024', 'A week full of technical workshops and competitions.', '2024-12-25', 'SAKEC Auditorium', true),
('Coding Bootcamp', 'Learn full-stack development from scratch.', '2025-01-10', 'Lab 101', false);
