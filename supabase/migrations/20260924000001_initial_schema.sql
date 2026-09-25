-- ==============================================================================
-- Migration: 20260924000001_initial_schema.sql
-- Description: Core Schema for Lovely SkinCare E-Commerce Store
-- Entities: categories, brands, products, product_images, customers,
--           orders, order_items, inventory_logs, coupons, store_settings,
--           admin_profiles
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. ADMIN PROFILES
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'manager' CHECK (role IN ('super_admin', 'manager', 'editor')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    english_name TEXT,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT,
    description TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. BRANDS
CREATE TABLE IF NOT EXISTS public.brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    origin TEXT NOT NULL DEFAULT 'korean' CHECK (origin IN ('korean', 'european')),
    origin_label TEXT NOT NULL DEFAULT 'كوري أصلي 100%',
    description TEXT,
    logo_url TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    english_name TEXT,
    slug TEXT NOT NULL UNIQUE,
    brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL,
    brand_name TEXT NOT NULL,
    brand_slug TEXT NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    category_name TEXT NOT NULL,
    category_slug TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    discount_price NUMERIC(10, 2) CHECK (discount_price IS NULL OR discount_price >= 0),
    description TEXT NOT NULL DEFAULT '',
    volume TEXT,
    skin_type TEXT[] DEFAULT ARRAY[]::TEXT[],
    key_ingredients TEXT[] DEFAULT ARRAY[]::TEXT[],
    ingredients TEXT,
    how_to_use TEXT,
    routine_step TEXT CHECK (routine_step IS NULL OR routine_step IN ('cleanse', 'tone', 'treat', 'moisturize', 'protect')),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    sku TEXT NOT NULL UNIQUE,
    featured BOOLEAN NOT NULL DEFAULT false,
    is_bestseller BOOLEAN NOT NULL DEFAULT false,
    is_new BOOLEAN NOT NULL DEFAULT false,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5),
    reviews_count INTEGER NOT NULL DEFAULT 0 CHECK (reviews_count >= 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. PRODUCT IMAGES
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. CUSTOMERS
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    address TEXT NOT NULL,
    total_orders INTEGER NOT NULL DEFAULT 0 CHECK (total_orders >= 0),
    total_spent NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (total_spent >= 0),
    last_order_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
    total NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    brand_name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. INVENTORY LOGS (Audit trail for stock updates)
CREATE TABLE IF NOT EXISTS public.inventory_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    previous_stock INTEGER NOT NULL,
    new_stock INTEGER NOT NULL,
    change_type TEXT NOT NULL CHECK (change_type IN ('sale', 'manual_adjustment', 'restock', 'return', 'initial')),
    reason TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. COUPONS
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    discount_percentage INTEGER NOT NULL CHECK (discount_percentage > 0 AND discount_percentage <= 100),
    min_order_amount NUMERIC(10, 2) CHECK (min_order_amount IS NULL OR min_order_amount >= 0),
    expiry_date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    usage_count INTEGER NOT NULL DEFAULT 0 CHECK (usage_count >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. STORE SETTINGS
CREATE TABLE IF NOT EXISTS public.store_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_name TEXT NOT NULL DEFAULT 'Lovely SkinCare',
    store_subtitle TEXT NOT NULL DEFAULT 'بوتيك العناية الكورية والأوروبية الفاخرة',
    primary_phone TEXT NOT NULL DEFAULT '01556677616',
    secondary_phone TEXT NOT NULL DEFAULT '01064612047',
    branch_address TEXT NOT NULL DEFAULT 'شارع بورسعيد، عمارة 455، محل Lovely بجوار أجمل لمسة - الموسكي',
    branch_landmark TEXT NOT NULL DEFAULT 'فرع الموسكي - القاهرة (أمام مسجد البنات)',
    working_hours TEXT NOT NULL DEFAULT 'يومياً من 11:00 صباحاً حتى 10:00 مساءً',
    whatsapp_number TEXT NOT NULL DEFAULT '201556677616',
    instagram_url TEXT DEFAULT 'https://instagram.com/lovelyskincare.eg',
    facebook_url TEXT DEFAULT 'https://facebook.com/lovelyskincare.eg',
    free_shipping_threshold NUMERIC(10, 2) DEFAULT 1000,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON public.products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_routine_step ON public.products(routine_step);

CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_brands_slug ON public.brands(slug);

CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_is_active ON public.coupons(is_active);

-- ==============================================================================
-- AUTOMATIC TIMESTAMP UPDATE TRIGGER
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at_categories ON public.categories;
CREATE TRIGGER set_updated_at_categories BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_brands ON public.brands;
CREATE TRIGGER set_updated_at_brands BEFORE UPDATE ON public.brands FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_products ON public.products;
CREATE TRIGGER set_updated_at_products BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_customers ON public.customers;
CREATE TRIGGER set_updated_at_customers BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_orders ON public.orders;
CREATE TRIGGER set_updated_at_orders BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_coupons ON public.coupons;
CREATE TRIGGER set_updated_at_coupons BEFORE UPDATE ON public.coupons FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_store_settings ON public.store_settings;
CREATE TRIGGER set_updated_at_store_settings BEFORE UPDATE ON public.store_settings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
