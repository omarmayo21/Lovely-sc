-- ==============================================================================
-- Migration: 20260924000006_checkout_order_function.sql
-- Description: Atomic checkout transaction with stock validation and inventory deduction
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
    v_price NUMERIC;
    v_product_name TEXT;
    v_brand_name TEXT;
    v_image_url TEXT;
    v_current_stock INT;
    v_result JSONB;
BEGIN
    -- 1. Validate items array
    IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
        RAISE EXCEPTION 'سلة المشتريات فارغة';
    END IF;

    -- 2. Validate stock for each item before performing any writes
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_quantity := (v_item->>'quantity')::INT;
        IF v_quantity <= 0 THEN
            RAISE EXCEPTION 'الكمية المطلوبة غير صحيحة';
        END IF;

        IF v_item->>'productId' IS NOT NULL AND length(v_item->>'productId') = 36 THEN
            v_product_id := (v_item->>'productId')::UUID;
            SELECT stock INTO v_current_stock FROM public.products WHERE id = v_product_id FOR UPDATE;
            
            IF NOT FOUND THEN
                NULL;
            ELSIF v_current_stock < v_quantity THEN
                RAISE EXCEPTION 'الكمية المطلوبة من المنتج غير متوفرة في المخزون (المتاح: %)', v_current_stock;
            END IF;
        END IF;
    END LOOP;

    -- 3. Generate Order Number
    v_order_number := 'LSC-' || floor(1000 + random() * 9000)::TEXT;

    -- 4. Find or Create Customer
    INSERT INTO public.customers (name, phone, address, total_orders, total_spent, last_order_date)
    VALUES (p_customer_name, p_customer_phone, p_customer_address, 1, p_total, NOW())
    ON CONFLICT (phone) DO UPDATE SET
        name = EXCLUDED.name,
        address = EXCLUDED.address,
        total_orders = customers.total_orders + 1,
        total_spent = customers.total_spent + EXCLUDED.total_spent,
        last_order_date = NOW()
    RETURNING id INTO v_customer_id;

    -- 5. Insert Order
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
        p_customer_name,
        p_customer_phone,
        p_customer_address,
        p_subtotal,
        p_discount,
        p_total,
        'pending',
        p_notes
    ) RETURNING id INTO v_order_id;

    -- 6. Insert Order Items & Deduct Stock
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_quantity := (v_item->>'quantity')::INT;
        v_price := (v_item->>'price')::NUMERIC;
        v_product_name := v_item->>'name';
        v_brand_name := COALESCE(v_item->>'brand', 'Lovely SkinCare');
        v_image_url := v_item->>'image';
        
        IF v_item->>'productId' IS NOT NULL AND length(v_item->>'productId') = 36 THEN
            v_product_id := (v_item->>'productId')::UUID;
        ELSE
            v_product_id := NULL;
        END IF;

        -- Insert item
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
            v_price,
            v_quantity,
            v_image_url
        );

        -- Deduct stock if real product
        IF v_product_id IS NOT NULL THEN
            UPDATE public.products
            SET stock = stock - v_quantity
            WHERE id = v_product_id
            RETURNING stock INTO v_current_stock;

            -- Log inventory sale
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

    -- 7. Return complete order JSON
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
        'items', p_items
    ) INTO v_result
    FROM public.orders o
    WHERE o.id = v_order_id;

    RETURN v_result;
END;
$$;

-- Allow public to execute this function
GRANT EXECUTE ON FUNCTION public.place_order_secure TO public, anon, authenticated;
