-- ==============================================================================
-- Migration: 20260924000002_rls_policies.sql
-- Description: Row Level Security (RLS) policies for Lovely SkinCare
-- Security Model:
--   - Public Storefront: Can view active catalog (products, categories, brands, settings, active coupons)
--   - Public Checkout: Can insert orders and order items; CANNOT view other orders
--   - Admin Dashboard: Full access to manage catalog, orders, customers, inventory, coupons, settings
-- ==============================================================================

-- Helper Function: Check if current authenticated user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid()
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Enable RLS on all tables
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 1. ADMIN PROFILES POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Admins can view their own profile or all if admin"
    ON public.admin_profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Super admins can manage admin profiles"
    ON public.admin_profiles FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    );

-- ------------------------------------------------------------------------------
-- 2. CATEGORIES POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view all categories"
    ON public.categories FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Admins can insert categories"
    ON public.categories FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update categories"
    ON public.categories FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete categories"
    ON public.categories FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- 3. BRANDS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view all brands"
    ON public.brands FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Admins can insert brands"
    ON public.brands FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update brands"
    ON public.brands FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete brands"
    ON public.brands FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- 4. PRODUCTS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view active products"
    ON public.products FOR SELECT
    TO public
    USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can insert products"
    ON public.products FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update products"
    ON public.products FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete products"
    ON public.products FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- 5. PRODUCT IMAGES POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view product images"
    ON public.product_images FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Admins can insert product images"
    ON public.product_images FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update product images"
    ON public.product_images FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete product images"
    ON public.product_images FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- 6. CUSTOMERS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Admins have full access to customers"
    ON public.customers FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Public can insert or update customer during checkout"
    ON public.customers FOR INSERT
    TO public
    WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 7. ORDERS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can place orders"
    ON public.orders FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Admins can view and manage all orders"
    ON public.orders FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 8. ORDER ITEMS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can insert order items"
    ON public.order_items FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Admins can view and manage all order items"
    ON public.order_items FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 9. INVENTORY LOGS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Admins can view and insert inventory logs"
    ON public.inventory_logs FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 10. COUPONS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view active coupons"
    ON public.coupons FOR SELECT
    TO public
    USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can manage coupons"
    ON public.coupons FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 11. STORE SETTINGS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view store settings"
    ON public.store_settings FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Admins can manage store settings"
    ON public.store_settings FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());
