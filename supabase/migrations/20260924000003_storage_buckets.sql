-- ==============================================================================
-- Migration: 20260924000003_storage_buckets.sql
-- Description: Supabase Storage Buckets and RLS for Lovely SkinCare Media
-- Buckets:
--   - product-images (public): Product photography & manual order uploads
--   - brand-logos (public): Brand logos and category banners
-- ==============================================================================

-- 1. Create storage buckets if not exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('product-images', 'product-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']),
    ('brand-logos', 'brand-logos', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'])
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Storage Policies for product-images
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
CREATE POLICY "Public can view product images"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
CREATE POLICY "Authenticated users can upload product images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Authenticated users can update product images" ON storage.objects;
CREATE POLICY "Authenticated users can update product images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Authenticated users can delete product images" ON storage.objects;
CREATE POLICY "Authenticated users can delete product images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'product-images');

-- 3. Storage Policies for brand-logos
DROP POLICY IF EXISTS "Public can view brand logos" ON storage.objects;
CREATE POLICY "Public can view brand logos"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'brand-logos');

DROP POLICY IF EXISTS "Authenticated users can upload brand logos" ON storage.objects;
CREATE POLICY "Authenticated users can upload brand logos"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'brand-logos');

DROP POLICY IF EXISTS "Authenticated users can update brand logos" ON storage.objects;
CREATE POLICY "Authenticated users can update brand logos"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'brand-logos');

DROP POLICY IF EXISTS "Authenticated users can delete brand logos" ON storage.objects;
CREATE POLICY "Authenticated users can delete brand logos"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'brand-logos');
