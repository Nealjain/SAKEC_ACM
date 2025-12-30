-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.admins (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  username character varying NOT NULL UNIQUE,
  password_hash text NOT NULL,
  email character varying,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  last_login timestamp with time zone,
  is_active boolean DEFAULT true,
  CONSTRAINT admins_pkey PRIMARY KEY (id)
);
CREATE TABLE public.alumni_members (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  position text NOT NULL,
  bio text,
  image_url text,
  department text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT alumni_members_pkey PRIMARY KEY (id)
);
CREATE TABLE public.announcements (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text,
  type text DEFAULT 'popup'::text,
  has_input boolean DEFAULT false,
  input_type text DEFAULT 'email'::text,
  input_placeholder text,
  input_button_label text DEFAULT 'Submit'::text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT announcements_pkey PRIMARY KEY (id)
);
CREATE TABLE public.blogs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title character varying NOT NULL,
  content text NOT NULL,
  excerpt text,
  image_url text,
  author_id uuid,
  category character varying,
  tags ARRAY,
  is_published boolean DEFAULT false,
  reading_time integer,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  image_1 text CHECK (image_1 IS NOT NULL),
  image_2 text,
  image_3 text,
  image_4 text,
  CONSTRAINT blogs_pkey PRIMARY KEY (id),
  CONSTRAINT blogs_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.team_members(id)
);
CREATE TABLE public.carousel_images (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  src character varying NOT NULL,
  alt character varying NOT NULL,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT carousel_images_pkey PRIMARY KEY (id)
);
CREATE TABLE public.contact_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  is_read boolean DEFAULT false,
  CONSTRAINT contact_messages_pkey PRIMARY KEY (id)
);
CREATE TABLE public.event_form_fields (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  form_id uuid NOT NULL,
  field_name text NOT NULL,
  field_label text NOT NULL,
  field_type text NOT NULL,
  field_options ARRAY,
  is_required boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT event_form_fields_pkey PRIMARY KEY (id),
  CONSTRAINT event_form_fields_form_id_fkey FOREIGN KEY (form_id) REFERENCES public.event_registration_forms(id)
);
CREATE TABLE public.event_galleries (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  event_name text NOT NULL,
  description text,
  event_date date NOT NULL,
  image_1 text NOT NULL,
  image_2 text NOT NULL,
  image_3 text NOT NULL,
  image_4 text NOT NULL,
  is_featured boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT event_galleries_pkey PRIMARY KEY (id)
);
CREATE TABLE public.event_registration_forms (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL,
  form_title text NOT NULL,
  form_description text,
  is_active boolean DEFAULT true,
  max_registrations integer,
  registration_deadline timestamp with time zone,
  confirmation_email_template text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  allowed_email_domains ARRAY DEFAULT ARRAY[]::text[],
  CONSTRAINT event_registration_forms_pkey PRIMARY KEY (id),
  CONSTRAINT event_registration_forms_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id)
);
CREATE TABLE public.event_registrations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  form_id uuid NOT NULL,
  event_id uuid NOT NULL,
  participant_name text NOT NULL,
  participant_email text NOT NULL,
  participant_phone text,
  form_data jsonb NOT NULL,
  registration_date timestamp with time zone DEFAULT timezone('utc'::text, now()),
  confirmation_sent boolean DEFAULT false,
  status text DEFAULT 'confirmed'::text,
  CONSTRAINT event_registrations_pkey PRIMARY KEY (id),
  CONSTRAINT event_registrations_form_id_fkey FOREIGN KEY (form_id) REFERENCES public.event_registration_forms(id),
  CONSTRAINT event_registrations_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id)
);
CREATE TABLE public.events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title character varying NOT NULL,
  description text,
  location character varying,
  image_url text,
  registration_link text,
  is_featured boolean DEFAULT false,
  category character varying,
  max_participants integer,
  current_participants integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  Faculty Co-ordinator text,
  date date NOT NULL,
  time time without time zone,
  CONSTRAINT events_pkey PRIMARY KEY (id)
);
CREATE TABLE public.faculty_members (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  position text NOT NULL,
  bio text,
  image_url text,
  linkedin_url text,
  email text,
  department text NOT NULL,
  achievements ARRAY,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT faculty_members_pkey PRIMARY KEY (id)
);
CREATE TABLE public.newsletter_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  content text NOT NULL,
  recipient_count integer DEFAULT 0,
  sent_at timestamp with time zone DEFAULT now(),
  sent_by uuid,
  sender_email text,
  CONSTRAINT newsletter_logs_pkey PRIMARY KEY (id)
);
CREATE TABLE public.newsletter_subscribers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  subscribed_at timestamp with time zone DEFAULT now(),
  is_active boolean DEFAULT true,
  CONSTRAINT newsletter_subscribers_pkey PRIMARY KEY (id)
);
CREATE TABLE public.sent_emails (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  recipient_email text NOT NULL,
  sender_email text NOT NULL,
  sender_name text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  sent_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  sent_by text,
  status text DEFAULT 'sent'::text,
  error_message text,
  CONSTRAINT sent_emails_pkey PRIMARY KEY (id)
);
CREATE TABLE public.team_members (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL,
  position character varying NOT NULL,
  image_url text,
  linkedin_url text,
  github_url text,
  email character varying,
  year character varying,
  department character varying,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRN text UNIQUE,
  personal_quote text,
  about_us text,
  CONSTRAINT team_members_pkey PRIMARY KEY (id)
);
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
