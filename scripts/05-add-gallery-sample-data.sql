-- Add sample event gallery data
INSERT INTO event_galleries (
  event_name,
  description,
  event_date,
  image_1,
  image_2,
  image_3,
  image_4,
  is_featured
) VALUES 
(
  'IOT Workshop',
  'Hands-on Internet of Things workshop where students learned to build smart devices and connect them to the cloud.',
  '2024-01-15',
  'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=300&fit=crop',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=300&fit=crop',
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=300&fit=crop',
  'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=500&h=300&fit=crop',
  true
),
(
  'Creathon 2024',
  'Annual 48-hour hackathon where teams competed to build innovative solutions for real-world problems.',
  '2024-02-20',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&h=300&fit=crop',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&h=300&fit=crop',
  'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=500&h=300&fit=crop',
  'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=500&h=300&fit=crop',
  true
),
(
  'AI/ML Bootcamp',
  'Intensive machine learning bootcamp covering neural networks, deep learning, and practical AI applications.',
  '2024-03-10',
  'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&h=300&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&h=300&fit=crop',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&h=300&fit=crop',
  false
),
(
  'Web Development Workshop',
  'Full-stack web development workshop covering React, Node.js, and modern web technologies.',
  '2024-03-25',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&h=300&fit=crop',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&h=300&fit=crop',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&h=300&fit=crop',
  'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=500&h=300&fit=crop',
  false
);
