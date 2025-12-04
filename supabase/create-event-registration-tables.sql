-- Event Registration Forms Table
CREATE TABLE IF NOT EXISTS public.event_registration_forms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  form_title TEXT NOT NULL,
  form_description TEXT,
  is_active BOOLEAN DEFAULT true,
  max_registrations INTEGER,
  registration_deadline TIMESTAMP WITH TIME ZONE,
  confirmation_email_template TEXT,
  allowed_email_domains TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Form Fields Table (for custom form builder)
CREATE TABLE IF NOT EXISTS public.event_form_fields (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id UUID NOT NULL REFERENCES public.event_registration_forms(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  field_label TEXT NOT NULL,
  field_type TEXT NOT NULL, -- text, email, phone, select, checkbox, textarea
  field_options TEXT[], -- for select/checkbox options
  is_required BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Event Registrations Table
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id UUID NOT NULL REFERENCES public.event_registration_forms(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  participant_name TEXT NOT NULL,
  participant_email TEXT NOT NULL,
  participant_phone TEXT,
  form_data JSONB NOT NULL, -- stores all form field responses
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  confirmation_sent BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'confirmed' -- confirmed, cancelled, waitlist
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_event_forms_event_id ON public.event_registration_forms(event_id);
CREATE INDEX IF NOT EXISTS idx_form_fields_form_id ON public.event_form_fields(form_id);
CREATE INDEX IF NOT EXISTS idx_registrations_form_id ON public.event_registrations(form_id);
CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON public.event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON public.event_registrations(participant_email);

-- Comments
COMMENT ON TABLE public.event_registration_forms IS 'Custom registration forms for events';
COMMENT ON TABLE public.event_form_fields IS 'Dynamic form fields for registration forms';
COMMENT ON TABLE public.event_registrations IS 'Event registration submissions with participant data';
