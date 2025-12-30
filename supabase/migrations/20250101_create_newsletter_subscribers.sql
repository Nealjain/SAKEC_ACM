DROP TABLE IF EXISTS public.newsletter_subscribers;

create table public.newsletter_subscribers (
  id uuid not null default gen_random_uuid (),
  email text not null,
  subscribed_at timestamp with time zone null default now(),
  is_active boolean null default true,
  name character varying(255) null,
  unsubscribe_token character varying(255) null,
  created_at timestamp with time zone null default now(),
  constraint newsletter_subscribers_pkey primary key (id),
  constraint newsletter_subscribers_email_key unique (email),
  constraint newsletter_subscribers_unsubscribe_token_key unique (unsubscribe_token)
) TABLESPACE pg_default;

create index IF not exists idx_newsletter_unsubscribe_token on public.newsletter_subscribers using btree (unsubscribe_token) TABLESPACE pg_default;

create index IF not exists idx_newsletter_email on public.newsletter_subscribers using btree (email) TABLESPACE pg_default;

create index IF not exists idx_newsletter_active on public.newsletter_subscribers using btree (is_active) TABLESPACE pg_default;

-- Add RLS policies to allow public access
alter table public.newsletter_subscribers enable row level security;

create policy "Public Access newsletter_subscribers" on public.newsletter_subscribers
    for insert to public with check (true);

create policy "Public Read newsletter_subscribers" on public.newsletter_subscribers
    for select to public using (true);
