-- ==============================================================================
-- Migration: 20260924000005_admin_auth_trigger.sql
-- Description: Automatically assign super_admin profile to lovely1skincare@gmail.com on Auth signup/creation
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_admin_auth_user()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.email = 'lovely1skincare@gmail.com' THEN
        INSERT INTO public.admin_profiles (id, full_name, role)
        VALUES (NEW.id, 'مدير المتجر - Lovely SkinCare', 'super_admin')
        ON CONFLICT (id) DO UPDATE SET role = 'super_admin', full_name = EXCLUDED.full_name;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_admin
    AFTER INSERT OR UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_admin_auth_user();
