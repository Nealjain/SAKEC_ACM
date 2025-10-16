-- Insert sample event gallery data
INSERT INTO event_galleries (id, event_name, description, event_date, image_1, image_2, image_3, image_4, is_featured, created_at) VALUES
(gen_random_uuid(), 'IOT Workshop', 'Hands-on Internet of Things workshop with Arduino and sensors', '2024-01-15', '/placeholder.svg?height=300&width=400&text=IOT-1', '/placeholder.svg?height=300&width=400&text=IOT-2', '/placeholder.svg?height=300&width=400&text=IOT-3', '/placeholder.svg?height=300&width=400&text=IOT-4', true, now()),

(gen_random_uuid(), 'Creathon 2024', '48-hour innovation hackathon with creative problem solving', '2024-02-20', '/placeholder.svg?height=300&width=400&text=Creathon-1', '/placeholder.svg?height=300&width=400&text=Creathon-2', '/placeholder.svg?height=300&width=400&text=Creathon-3', '/placeholder.svg?height=300&width=400&text=Creathon-4', true, now()),

(gen_random_uuid(), 'AI/ML Bootcamp', 'Intensive machine learning workshop with Python and TensorFlow', '2024-03-10', '/placeholder.svg?height=300&width=400&text=AI-ML-1', '/placeholder.svg?height=300&width=400&text=AI-ML-2', '/placeholder.svg?height=300&width=400&text=AI-ML-3', '/placeholder.svg?height=300&width=400&text=AI-ML-4', true, now()),

(gen_random_uuid(), 'Web Development Workshop', 'Full-stack web development with React and Node.js', '2024-03-25', '/placeholder.svg?height=300&width=400&text=WebDev-1', '/placeholder.svg?height=300&width=400&text=WebDev-2', '/placeholder.svg?height=300&width=400&text=WebDev-3', '/placeholder.svg?height=300&width=400&text=WebDev-4', false, now());
