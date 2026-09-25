-- ==============================================================================
-- Migration: 20260924000007_fix_admin_profiles_recursion.sql
-- Description: Fix infinite recursion on admin_profiles RLS policy
-- ==============================================================================

DROP POLICY IF EXISTS "Admins can view their own profile or all if admin" ON public.admin_profiles;
DROP POLICY IF EXISTS "Super admins can manage admin profiles" ON public.admin_profiles;

CREATE POLICY "Users can view their own admin profile"
    ON public.admin_profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Super admins can manage admin profiles"
    ON public.admin_profiles FOR ALL
    TO authenticated
    USING (
        auth.uid() = id AND role = 'super_admin'
    );
