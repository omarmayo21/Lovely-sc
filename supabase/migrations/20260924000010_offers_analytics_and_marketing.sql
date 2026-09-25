-- Migration: Offers, Search Analytics, Marketing Settings & Realtime Setup
-- Applied on production project: sxzcuqhaxfnnnogfqrac

-- 1. Create Offers Table
CREATE TABLE IF NOT EXISTS public.offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    discount_text TEXT,
    link_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS on Offers
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'offers' AND policyname = 'Public can read active offers'
    ) THEN
        CREATE POLICY "Public can read active offers"
        ON public.offers
        FOR SELECT
        USING (
            is_active = true 
            AND (start_date IS NULL OR start_date <= now()) 
            AND (end_date IS NULL OR end_date >= now())
        );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'offers' AND policyname = 'Admins have full access to offers'
    ) THEN
        CREATE POLICY "Admins have full access to offers"
        ON public.offers
        FOR ALL
        TO authenticated
        USING (public.is_admin())
        WITH CHECK (public.is_admin());
    END IF;
END $$;

-- Trigger for offers updated_at
DROP TRIGGER IF EXISTS set_updated_at_offers ON public.offers;
CREATE TRIGGER set_updated_at_offers
BEFORE UPDATE ON public.offers
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- 2. Create Search Events Table for Analytics
CREATE TABLE IF NOT EXISTS public.search_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query TEXT NOT NULL,
    results_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS on Search Events
ALTER TABLE public.search_events ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'search_events' AND policyname = 'Public can insert search events'
    ) THEN
        CREATE POLICY "Public can insert search events"
        ON public.search_events
        FOR INSERT
        TO anon, authenticated
        WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'search_events' AND policyname = 'Admins can read search events'
    ) THEN
        CREATE POLICY "Admins can read search events"
        ON public.search_events
        FOR SELECT
        TO authenticated
        USING (public.is_admin());
    END IF;
END $$;

-- 3. Add Marketing, Analytics & SEO columns to store_settings
ALTER TABLE public.store_settings
ADD COLUMN IF NOT EXISTS google_analytics_id TEXT,
ADD COLUMN IF NOT EXISTS meta_pixel_id TEXT,
ADD COLUMN IF NOT EXISTS clarity_project_id TEXT,
ADD COLUMN IF NOT EXISTS site_title TEXT DEFAULT 'Lovely SkinCare | منتجات العناية بالبشرة الكورية والأوروبية الأصلية',
ADD COLUMN IF NOT EXISTS meta_description TEXT DEFAULT 'متجر لافلي سكين كير الأول لمنتجات العناية بالبشرة الكورية والأوروبية الأصلية 100% في مصر - فرع الموسكي - القاهرة.',
ADD COLUMN IF NOT EXISTS default_og_image TEXT DEFAULT 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1200&q=80',
ADD COLUMN IF NOT EXISTS google_verification_code TEXT;

-- 4. Enable Supabase Realtime for core tables
DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;

    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;

    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.offers;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;

    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.coupons;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;

    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;

    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.brands;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;

    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.store_settings;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
END $$;

-- 5. Seed initial offer if empty
INSERT INTO public.offers (title, description, discount_text, link_url, image_url, is_active)
SELECT 
    'خصم حصري لفترة محدودة على المنتجات الكورية!',
    'استمتعي ببشرة زجاجية متألقة مع أفضل منتجات العناية بالبشرة الكورية الأصلية 100%. استخدمي كود LOVELY10 للحصول على خصم 10% إضافي!',
    'خصم 10%',
    '/shop',
    'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
    true
WHERE NOT EXISTS (SELECT 1 FROM public.offers LIMIT 1);
