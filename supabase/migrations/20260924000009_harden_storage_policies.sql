-- ==============================================================================
-- Migration: 20260924000009_harden_storage_policies.sql
-- Description: Restrict Storage writes and deletions strictly to admins (is_admin())
-- ==============================================================================

DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload brand logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update brand logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete brand logos" ON storage.objects;

-- Admin-only upload, update, delete for product-images
CREATE POLICY "Admins can upload product images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY "Admins can update product images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'product-images' AND public.is_admin())
    WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY "Admins can delete product images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'product-images' AND public.is_admin());

-- Admin-only upload, update, delete for brand-logos
CREATE POLICY "Admins can upload brand logos"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'brand-logos' AND public.is_admin());

CREATE POLICY "Admins can update brand logos"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'brand-logos' AND public.is_admin())
    WITH CHECK (bucket_id = 'brand-logos' AND public.is_admin());

CREATE POLICY "Admins can delete brand logos"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'brand-logos' AND public.is_admin());
