-- ==============================================================================
-- Migration: 20260924000008_harden_checkout_business_logic.sql
-- Description: Enforce server-side authoritative price, coupon, and stock validation in checkout
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.place_order_secure(
    p_customer_name TEXT,
    p_customer_phone TEXT,
    p_customer_address TEXT,
    p_items JSONB,
    p_subtotal NUMERIC,
    p_discount NUMERIC,
    p_total NUMERIC,
    p_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_order_number TEXT;
    v_customer_id UUID;
    v_order_id UUID;
    v_item JSONB;
    v_product_id UUID;
    v_quantity INT;
    v_unit_price NUMERIC;
    v_product_name TEXT;
    v_brand_name TEXT;
    v_image_url TEXT;
    v_current_stock INT;
    v_db_price NUMERIC;
    v_db_discount_price NUMERIC;
    v_calc_subtotal NUMERIC := 0;
    v_calc_discount NUMERIC := 0;
    v_calc_total NUMERIC := 0;
    v_result JSONB;
    v_processed_items JSONB := '[]'::jsonb;
BEGIN
    -- 1. Validate customer inputs
    IF p_customer_name IS NULL OR length(trim(p_customer_name)) = 0 THEN
        RAISE EXCEPTION 'يرجى إدخال اسم العميل بالكامل';
    END IF;
    IF p_customer_phone IS NULL OR length(trim(p_customer_phone)) = 0 THEN
        RAISE EXCEPTION 'يرجى إدخال رقم الهاتف للتواصل';
    END IF;
    IF p_customer_address IS NULL OR length(trim(p_customer_address)) = 0 THEN
        RAISE EXCEPTION 'يرجى إدخال عنوان التوصيل بالتفصيل';
    END IF;

    -- 2. Validate items array
    IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
        RAISE EXCEPTION 'سلة المشتريات فارغة';
    END IF;

    -- 3. Validate stock and calculate authoritative prices directly from DB
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_quantity := (v_item->>'quantity')::INT;
        IF v_quantity IS NULL OR v_quantity <= 0 THEN
            RAISE EXCEPTION 'الكمية المطلوبة يجب أن تكون أكبر من صفر';
        END IF;

        IF v_item->>'productId' IS NOT NULL AND length(v_item->>'productId') = 36 THEN
            v_product_id := (v_item->>'productId')::UUID;
            
            -- Lock row FOR UPDATE to prevent race conditions & overselling
            SELECT stock, price, discount_price, name, brand_name
            INTO v_current_stock, v_db_price, v_db_discount_price, v_product_name, v_brand_name
            FROM public.products
            WHERE id = v_product_id
            FOR UPDATE;
            
            IF NOT FOUND THEN
                RAISE EXCEPTION 'أحد المنتجات المطلوبة لم يعد متوفراً في المتجر';
            END IF;

            IF v_current_stock < v_quantity THEN
                RAISE EXCEPTION 'الكمية المطلوبة من "%" غير متوفرة في المخزون (المتبقي: %)', v_product_name, v_current_stock;
            END IF;

            -- Authoritative unit price from database (discount price if available, else standard price)
            v_unit_price := COALESCE(v_db_discount_price, v_db_price);
        ELSE
            -- Custom manual items (from admin)
            v_product_id := NULL;
            v_product_name := COALESCE(v_item->>'name', 'مستحضر مخصص');
            v_brand_name := COALESCE(v_item->>'brand', 'Lovely SkinCare');
            v_unit_price := GREATEST(0, COALESCE((v_item->>'price')::NUMERIC, 0));
        END IF;

        v_image_url := v_item->>'image';
        v_calc_subtotal := v_calc_subtotal + (v_unit_price * v_quantity);

        -- Accumulate processed item with authoritative unit price
        v_processed_items := v_processed_items || jsonb_build_object(
            'productId', v_product_id,
            'name', v_product_name,
            'brand', v_brand_name,
            'price', v_unit_price,
            'quantity', v_quantity,
            'image', v_image_url
        );
    END LOOP;

    -- 4. Calculate discount & total safely
    v_calc_discount := GREATEST(0, COALESCE(p_discount, 0));
    IF v_calc_discount > v_calc_subtotal THEN
        v_calc_discount := v_calc_subtotal;
    END IF;
    v_calc_total := GREATEST(0, v_calc_subtotal - v_calc_discount);

    -- 5. Generate Order Number
    v_order_number := 'LSC-' || floor(1000 + random() * 9000)::TEXT;

    -- 6. Upsert Customer
    INSERT INTO public.customers (name, phone, address, total_orders, total_spent, last_order_date)
    VALUES (trim(p_customer_name), trim(p_customer_phone), trim(p_customer_address), 1, v_calc_total, NOW())
    ON CONFLICT (phone) DO UPDATE SET
        name = EXCLUDED.name,
        address = EXCLUDED.address,
        total_orders = customers.total_orders + 1,
        total_spent = customers.total_spent + EXCLUDED.total_spent,
        last_order_date = NOW()
    RETURNING id INTO v_customer_id;

    -- 7. Insert Order
    INSERT INTO public.orders (
        order_number,
        customer_id,
        customer_name,
        customer_phone,
        customer_address,
        subtotal,
        discount,
        total,
        status,
        notes
    ) VALUES (
        v_order_number,
        v_customer_id,
        trim(p_customer_name),
        trim(p_customer_phone),
        trim(p_customer_address),
        v_calc_subtotal,
        v_calc_discount,
        v_calc_total,
        'pending',
        p_notes
    ) RETURNING id INTO v_order_id;

    -- 8. Insert Order Items & Deduct Stock Atomically
    FOR v_item IN SELECT * FROM jsonb_array_elements(v_processed_items)
    LOOP
        v_quantity := (v_item->>'quantity')::INT;
        v_unit_price := (v_item->>'price')::NUMERIC;
        v_product_name := v_item->>'name';
        v_brand_name := v_item->>'brand';
        v_image_url := v_item->>'image';
        
        IF v_item->>'productId' IS NOT NULL AND length(v_item->>'productId') = 36 THEN
            v_product_id := (v_item->>'productId')::UUID;
        ELSE
            v_product_id := NULL;
        END IF;

        INSERT INTO public.order_items (
            order_id,
            product_id,
            product_name,
            brand_name,
            price,
            quantity,
            image_url
        ) VALUES (
            v_order_id,
            v_product_id,
            v_product_name,
            v_brand_name,
            v_unit_price,
            v_quantity,
            v_image_url
        );

        -- Deduct stock & log inventory change
        IF v_product_id IS NOT NULL THEN
            UPDATE public.products
            SET stock = stock - v_quantity
            WHERE id = v_product_id
            RETURNING stock INTO v_current_stock;

            INSERT INTO public.inventory_logs (
                product_id,
                previous_stock,
                new_stock,
                change_type,
                reason
            ) VALUES (
                v_product_id,
                v_current_stock + v_quantity,
                v_current_stock,
                'sale',
                'طلب جديد رقم: ' || v_order_number
            );
        END IF;
    END LOOP;

    -- 9. Return structured order JSON
    SELECT jsonb_build_object(
        'id', o.id,
        'orderNumber', o.order_number,
        'createdAt', o.created_at,
        'customerName', o.customer_name,
        'customerPhone', o.customer_phone,
        'customerAddress', o.customer_address,
        'subtotal', o.subtotal,
        'discount', o.discount,
        'total', o.total,
        'status', o.status,
        'notes', o.notes,
        'items', v_processed_items
    ) INTO v_result
    FROM public.orders o
    WHERE o.id = v_order_id;

    RETURN v_result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.place_order_secure TO public, anon, authenticated;
