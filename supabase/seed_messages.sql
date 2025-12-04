-- Insert dummy messages for testing
INSERT INTO contact_messages (name, email, subject, message, is_read, created_at)
VALUES 
  ('John Doe', 'john@example.com', 'Inquiry about membership', 'Hi, I would like to know how to join the ACM chapter. Can you please provide more details?', false, NOW() - INTERVAL '2 days'),
  ('Jane Smith', 'jane@example.com', 'Event Collaboration', 'We are interested in collaborating with you for the upcoming hackathon.', true, NOW() - INTERVAL '5 days'),
  ('Alice Johnson', 'alice@example.com', 'Website Feedback', 'Great website! Just wanted to let you know I found a small typo on the about page.', false, NOW() - INTERVAL '1 hour');
