-- Create event_galleries table for grouping photos by event
CREATE TABLE IF NOT EXISTS public.event_galleries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  image_1 TEXT NOT NULL,
  image_2 TEXT NOT NULL,
  image_3 TEXT NOT NULL,
  image_4 TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for better search performance
CREATE INDEX IF NOT EXISTS idx_event_galleries_event_name ON public.event_galleries USING gin(to_tsvector('english', event_name));
CREATE INDEX IF NOT EXISTS idx_event_galleries_date ON public.event_galleries(event_date DESC);

-- Enable RLS
ALTER TABLE public.event_galleries ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access" ON public.event_galleries
FOR SELECT USING (true);

-- Insert sample data
INSERT INTO public.event_galleries (event_name, description, event_date, image_1, image_2, image_3, image_4, is_featured) VALUES
('IOT Workshop', 'Hands-on Internet of Things development workshop', '2024-01-15', 
 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500', 
 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500',
 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=500',
 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500', true),
('Creathon 2024', 'Annual creativity and innovation hackathon', '2024-02-20',
 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500',
 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=500',
 'https://images.unsplash.com/photo-1515378791036-0648a814c963?w=500',
 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500', true),
('AI/ML Bootcamp', 'Intensive machine learning training program', '2024-03-10',
 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500',
 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500',
 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500', false),
('Tech Fest Opening', 'Grand opening ceremony of annual tech festival', '2024-04-05',
 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500',
 'https://images.unsplash.com/photo-1559223607-b4d0555ae227?w=500',
 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500',
 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500', false);
