-- Create payment_settings table
CREATE TABLE IF NOT EXISTS public.payment_settings (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    bank_name text,
    account_holder_name text,
    account_number text,
    ifsc_code text,
    account_type text,
    upi_id text,
    fee_amount numeric DEFAULT 400,
    qr_code_url text, -- Store the URL of the uploaded QR code
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT payment_settings_pkey PRIMARY KEY (id)
);

-- Access Policies (following the "Public Access" model for now)
ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Access payment_settings" ON public.payment_settings;
CREATE POLICY "Public Access payment_settings" ON public.payment_settings FOR ALL TO public USING (true) WITH CHECK (true);

-- Insert a default row if not exists (Singleton pattern)
INSERT INTO public.payment_settings (bank_name, account_holder_name, account_number, ifsc_code, account_type, fee_amount)
SELECT 'Canara Bank', 'SAKEC ACM STUDENT CHAPTER', '8678101302064', 'CNRB0000105', 'Savings', 400
WHERE NOT EXISTS (SELECT 1 FROM public.payment_settings);

-- Create a storage bucket for site assets if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('site_assets', 'site_assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policy
CREATE POLICY "Public Access site_assets" ON storage.objects FOR ALL TO public USING (bucket_id = 'site_assets') WITH CHECK (bucket_id = 'site_assets');
