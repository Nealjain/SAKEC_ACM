-- Create testimonials table
CREATE TABLE public.testimonials (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text NOT NULL,
    position text NOT NULL,
    quote text NOT NULL,
    image_url text NOT NULL,
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT testimonials_pkey PRIMARY KEY (id)
);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON public.testimonials
    FOR SELECT
    USING (true);

-- Allow authenticated users to insert (optional - for admin panel)
CREATE POLICY "Allow authenticated insert" ON public.testimonials
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update (optional - for admin panel)
CREATE POLICY "Allow authenticated update" ON public.testimonials
    FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete (optional - for admin panel)
CREATE POLICY "Allow authenticated delete" ON public.testimonials
    FOR DELETE
    USING (auth.role() = 'authenticated');

-- Create index for better query performance
CREATE INDEX idx_testimonials_display_order ON public.testimonials(display_order);
CREATE INDEX idx_testimonials_is_active ON public.testimonials(is_active);

-- Insert sample data (optional - you can modify or remove this)
INSERT INTO public.testimonials (name, position, quote, image_url, display_order, is_active) VALUES
('Neal Jain', 'Technical Head, SAKEC ACM', 'Being part of SAKEC ACM has been transformative. The workshops and mentorship programs have helped me grow both technically and professionally. The community here is incredibly supportive and inspiring.', 'https://dhxzkzdlsszwuqjkicnv.supabase.co/storage/v1/object/public/team-photos/Again%20photos/neal.JPG', 1, true),
('Nihaar Kotak', 'Membership Chairperson, SAKEC ACM', 'ACM has provided me with countless opportunities to learn, network, and lead. The hands-on experience with real-world projects has been invaluable for my career development.', 'https://dhxzkzdlsszwuqjkicnv.supabase.co/storage/v1/object/public/team-photos/Again%20photos/nihaar.jpg', 2, true),
('Viya Punmiya', 'Publicity Head, SAKEC ACM', 'The collaborative environment at ACM has helped me discover my passion for technology. Working with talented peers and mentors has accelerated my learning journey significantly.', 'https://dhxzkzdlsszwuqjkicnv.supabase.co/storage/v1/object/public/team-photos/Again%20photos/viya.jpg', 3, true),
('Manali Patil', 'Treasurer, SAKEC ACM', 'ACM has been instrumental in shaping my technical skills and leadership abilities. The events and competitions have pushed me to constantly improve and innovate.', 'https://dhxzkzdlsszwuqjkicnv.supabase.co/storage/v1/object/public/team-photos/Again%20photos/manali.jpg', 4, true);
