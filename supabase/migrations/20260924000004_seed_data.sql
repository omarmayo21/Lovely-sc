-- ==============================================================================
-- Migration: 20260924000004_seed_data.sql
-- Description: Seed Data for Lovely SkinCare Initial Catalog & Settings
-- ==============================================================================

-- 1. SEED CATEGORIES
INSERT INTO public.categories (name, english_name, slug, icon, description, display_order)
VALUES
    ('واقي شمس وحماية', 'Sun Care & SPF', 'sunscreen', 'Sun', 'حماية فائقة بمعامل SPF50+ مع قوام خفيف ومكونات مغذية للبشرة', 1),
    ('سيروم وعلاجات مركزة', 'Serums & Ampoules', 'serums', 'Sparkles', 'تركيبات علاجية عالية الفعالية لاستهداف التصبغات، الترميم، والنضارة', 2),
    ('تونر وخلاصات مهدئة', 'Toners & Essences', 'toners', 'Droplets', 'موازنة حموضة البشرة، ترطيب عميق، وتهدئة فورية للمسام الحساسة', 3),
    ('مرطبات وترميم الحاجز', 'Moisturizers & Creams', 'moisturizers', 'ShieldCheck', 'حبس الرطوبة داخل البشرة وتقوية حاجز الحماية الطبيعي بالسيراميد', 4),
    ('غسول ومنظفات لطيفة', 'Cleansers & Oils', 'cleansers', 'Flame', 'تنظيف عميق للمسام والشوائب دون تجريد البشرة من ترطيبها الطبيعي', 5),
    ('عناية خاصة وعلاج الحبوب', 'Special Care & Patches', 'special-care', 'Heart', 'لصقات علاج الحبوب الموضعية، مقشرات الأحماض اللطيفة، وعناية الشفاه', 6)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    english_name = EXCLUDED.english_name,
    icon = EXCLUDED.icon,
    description = EXCLUDED.description,
    display_order = EXCLUDED.display_order;

-- 2. SEED BRANDS
INSERT INTO public.brands (name, slug, origin, origin_label, description, display_order)
VALUES
    ('Beauty of Joseon', 'beauty-of-joseon', 'korean', 'كوري أصلي 100%', 'العناية الكورية التقليدية الفاخرة المعتمدة على الأعشاب الشرقية (Hanbang) وخلاصات الأرز والجينسنغ.', 1),
    ('COSRX', 'cosrx', 'korean', 'كوري أصلي 100%', 'العلامة الكورية الرائدة في حلول البشرة المعرضة للحبوب ومستحضرات الحلزون النقية وسينتيلا.', 2),
    ('Anua', 'anua', 'korean', 'كوري أصلي 100%', 'تركيبات نباتية نقية تركز على نبات الهارتليف 77% لتهدئة الاحمرار وتوازن إفراز الدهون.', 3),
    ('SKIN1004', 'skin1004', 'korean', 'كوري أصلي 100%', 'نقاء سينتيلا اسياتيكا الطبيعية من مدغشقر لترميم حاجز البشرة ومقاومة التحسس.', 4),
    ('La Roche-Posay', 'la-roche-posay', 'european', 'فرنسي درماتولوجي', 'الخبرة الجلدية الفرنسية بمياه الينابيع الحرارية، الحل الأول الموصى به من أطباء الجلدية حول العالم.', 5),
    ('Round Lab', 'round-lab', 'korean', 'كوري أصلي 100%', 'مستحضرات ترطيب حائزة على جوائز الجمال الكورية مع عصارة شجر البتولا ومياه جزر دوكدو النقية.', 6),
    ('AXIS-Y', 'axis-y', 'korean', 'كوري أصلي 100%', 'عناية مستوحاة من المناخ، متخصصة في تفتيح التصبغات وعلاج آثار الحبوب بالنياسيناميد والسكوالان.', 7),
    ('SOME BY MI', 'some-by-mi', 'korean', 'كوري أصلي 100%', 'حلول التقشير اللطيف المعجزة بأحماض AHA/BHA/PHA والريتينول المنشط لتجديد خلايا البشرة.', 8),
    ('ma:nyo', 'manyo', 'korean', 'كوري أصلي 100%', 'زيوت التنظيف العضوية وخلاصات البيفيدا المخمرة لتعزيز ميكروبيوم البشرة ونضارتها الطبيعية.', 9),
    ('dear, klairs', 'dear-klairs', 'korean', 'كوري أصلي 100%', 'بساطة وأمان للبشرة الأكثر حساسية، بدون عطور أو مهيجات كيميائية.', 10),
    ('iUNIK', 'iunik', 'korean', 'كوري أصلي 100%', 'مكونات نباتية بسيطة ونقية بنسبة عالية تركز على شجرة الشاي وسينتيلا وبروبوليس.', 11),
    ('Purito', 'purito', 'korean', 'كوري أصلي 100%', 'عناية صديقة للبيئة وآمنة للجلد الحساس بدون كحول أو زيوت عطرية مضافة.', 12)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    origin = EXCLUDED.origin,
    origin_label = EXCLUDED.origin_label,
    description = EXCLUDED.description,
    display_order = EXCLUDED.display_order;

-- 3. SEED STORE SETTINGS
INSERT INTO public.store_settings (
    store_name, store_subtitle, primary_phone, secondary_phone,
    branch_address, branch_landmark, working_hours,
    whatsapp_number, instagram_url, facebook_url, free_shipping_threshold
)
VALUES (
    'Lovely SkinCare',
    'بوتيك العناية الكورية والأوروبية الفاخرة',
    '01556677616',
    '01064612047',
    'شارع بورسعيد، عمارة 455، محل Lovely بجوار أجمل لمسة - الموسكي',
    'فرع الموسكي - القاهرة (أمام مسجد البنات)',
    'يومياً من 11:00 صباحاً حتى 10:00 مساءً',
    '201556677616',
    'https://instagram.com/lovelyskincare.eg',
    'https://facebook.com/lovelyskincare.eg',
    1000
)
ON CONFLICT DO NOTHING;

-- 4. SEED COUPONS
INSERT INTO public.coupons (code, discount_percentage, min_order_amount, expiry_date, is_active, usage_count)
VALUES
    ('LOVELY10', 10, 500, '2026-12-31', true, 42),
    ('KBEAUTY15', 15, 1000, '2026-10-31', true, 19),
    ('MUSKI20', 20, 1500, '2026-11-15', true, 8),
    ('WELCOME5', 5, 300, '2026-12-31', true, 67)
ON CONFLICT (code) DO UPDATE SET
    discount_percentage = EXCLUDED.discount_percentage,
    min_order_amount = EXCLUDED.min_order_amount,
    expiry_date = EXCLUDED.expiry_date,
    is_active = EXCLUDED.is_active;

-- 5. SEED PRODUCTS & IMAGES
DO $$
DECLARE
    boj_id UUID;
    cosrx_id UUID;
    anua_id UUID;
    skin1004_id UUID;
    lrp_id UUID;
    roundlab_id UUID;
    axisy_id UUID;
    manyo_id UUID;
    
    sun_cat_id UUID;
    serum_cat_id UUID;
    toner_cat_id UUID;
    moist_cat_id UUID;
    clean_cat_id UUID;
    special_cat_id UUID;
    
    p_id UUID;
BEGIN
    SELECT id INTO boj_id FROM public.brands WHERE slug = 'beauty-of-joseon';
    SELECT id INTO cosrx_id FROM public.brands WHERE slug = 'cosrx';
    SELECT id INTO anua_id FROM public.brands WHERE slug = 'anua';
    SELECT id INTO skin1004_id FROM public.brands WHERE slug = 'skin1004';
    SELECT id INTO lrp_id FROM public.brands WHERE slug = 'la-roche-posay';
    SELECT id INTO roundlab_id FROM public.brands WHERE slug = 'round-lab';
    SELECT id INTO axisy_id FROM public.brands WHERE slug = 'axis-y';
    SELECT id INTO manyo_id FROM public.brands WHERE slug = 'manyo';

    SELECT id INTO sun_cat_id FROM public.categories WHERE slug = 'sunscreen';
    SELECT id INTO serum_cat_id FROM public.categories WHERE slug = 'serums';
    SELECT id INTO toner_cat_id FROM public.categories WHERE slug = 'toners';
    SELECT id INTO moist_cat_id FROM public.categories WHERE slug = 'moisturizers';
    SELECT id INTO clean_cat_id FROM public.categories WHERE slug = 'cleansers';
    SELECT id INTO special_cat_id FROM public.categories WHERE slug = 'special-care';

    -- Product 1: BOJ Sunscreen
    INSERT INTO public.products (
        name, english_name, slug, brand_id, brand_name, brand_slug,
        category_id, category_name, category_slug, price, discount_price,
        description, volume, skin_type, key_ingredients, ingredients,
        how_to_use, routine_step, stock, sku, featured, is_bestseller, is_new, rating, reviews_count, is_active
    ) VALUES (
        'واقي شمس الأرز العضوي والبروبيوتيك Relief Sun SPF50+ PA++++',
        'Relief Sun: Rice + Probiotics SPF50+ PA++++',
        'beauty-of-joseon-relief-sun-rice-probiotics',
        boj_id, 'Beauty of Joseon', 'beauty-of-joseon',
        sun_cat_id, 'واقي شمس وحماية', 'sunscreen',
        650, 580,
        'واقي شمس كيميائي عضوي خفيف للغاية ينساب بسلاسة على البشرة دون ترك أي أثر أبيض. يحتوي على 30% من خلاصة الأرز وخلاصات الحبوب المخمرة الغنية بفيتامينات B و C و E والأحماض الأمينية لترطيب وتغذية البشرة طوال اليوم.',
        '50ml',
        ARRAY['جميع أنواع البشرة', 'البشرة الجافة', 'البشرة الحساسة'],
        ARRAY['خلاصة الأرز 30%', 'مجمع البروبيوتيك المخمر', 'النياسيناميد 2%'],
        'Water, Oryza Sativa (Rice) Extract (30%), Dibutyl Adipate, Propanediol, Diethylamino Hydroxybenzoyl Hexyl Benzoate, Polymethylsilsesquioxane, Ethylhexyl Triazone, Niacinamide...',
        'في الخطوة الأخيرة من روتين العناية الصباحي، ضعي كمية وفيرة ومتساوية على الوجه والرقبة قبل التعرض للشمس بـ 20 دقيقة.',
        'protect', 45, 'BOJ-RS-50', true, true, false, 4.9, 128, true
    ) ON CONFLICT (slug) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock
    RETURNING id INTO p_id;

    DELETE FROM public.product_images WHERE product_id = p_id;
    INSERT INTO public.product_images (product_id, image_url, display_order, is_primary) VALUES
        (p_id, 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80', 1, true),
        (p_id, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80', 2, false);

    -- Product 2: COSRX Snail Essence
    INSERT INTO public.products (
        name, english_name, slug, brand_id, brand_name, brand_slug,
        category_id, category_name, category_slug, price, discount_price,
        description, volume, skin_type, key_ingredients, ingredients,
        how_to_use, routine_step, stock, sku, featured, is_bestseller, is_new, rating, reviews_count, is_active
    ) VALUES (
        'خلاصة إفرازات الحلزون النقية 96 باور إيسنس المرطبة والمجددة',
        'Advanced Snail 96 Mucin Power Essence',
        'cosrx-advanced-snail-96-mucin-essence',
        cosrx_id, 'COSRX', 'cosrx',
        serum_cat_id, 'سيروم وعلاجات مركزة', 'serums',
        720, 650,
        'إيسنس خفيف الوزن وغني بـ 96.3% من إفرازات الحلزون المفلترة النقية التي تحمي البشرة من فقدان الرطوبة وتحسن مرونتها وتهدئ الاحمرار والتلف الناتج عن الجفاف أو الحبوب.',
        '100ml',
        ARRAY['جميع أنواع البشرة', 'البشرة الجافة والمتهيجة', 'البشرة المعرضة للحبوب'],
        ARRAY['موسين الحلزون 96.3%', 'الهيالورونيك أسيد', 'الألانتوين'],
        'Snail Secretion Filtrate, Betaine, Butylene Glycol, 1,2-Hexanediol, Sodium Polyacrylate, Phenoxyethanol...',
        'بعد تنظيف البشرة ووضع التونر، ضعي كمية مناسبة على كامل الوجه وربّتي بلطف بأطراف أصابعكِ للمساعدة على الامتصاص.',
        'treat', 32, 'COS-SN-100', true, true, false, 4.8, 94, true
    ) ON CONFLICT (slug) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock
    RETURNING id INTO p_id;

    DELETE FROM public.product_images WHERE product_id = p_id;
    INSERT INTO public.product_images (product_id, image_url, display_order, is_primary) VALUES
        (p_id, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80', 1, true);

    -- Product 3: Anua Heartleaf Toner
    INSERT INTO public.products (
        name, english_name, slug, brand_id, brand_name, brand_slug,
        category_id, category_name, category_slug, price, discount_price,
        description, volume, skin_type, key_ingredients, ingredients,
        how_to_use, routine_step, stock, sku, featured, is_bestseller, is_new, rating, reviews_count, is_active
    ) VALUES (
        'تونر نبات الهارتليف المهدئ والمعالج لمشاكل البشرة والمسام 77%',
        'Heartleaf 77% Soothing Toner',
        'anua-heartleaf-77-soothing-toner',
        anua_id, 'Anua', 'anua',
        toner_cat_id, 'تونر وخلاصات مهدئة', 'toners',
        790, 720,
        'التونر رقم 1 الأكثر مبيعاً في كوريا بتركيز 77% من خلاصة نبات الهارتليف الطبيعي المهدئ للبشرة الحساسة والمعرضة للحبوب والتهيج.',
        '250ml',
        ARRAY['البشرة الحساسة', 'البشرة الدهنية والمعرضة للحبوب', 'البشرة المختلطة'],
        ARRAY['خلاصة الهارتليف 77%', 'البانثينول (فيتامين B5)', 'خلاصة البابونج'],
        'Houttuynia Cordata Extract (77%), Purified Water, 1,2-Hexanediol, Glycerin, Betaine...',
        'بعد غسل الوجه، بللي قطعة قطنية أو اسكبي بضع قطرات في راحة يدكِ ومرريها بلطف على الوجه والرقبة.',
        'tone', 28, 'ANU-HL-250', true, true, false, 4.9, 82, true
    ) ON CONFLICT (slug) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock
    RETURNING id INTO p_id;

    DELETE FROM public.product_images WHERE product_id = p_id;
    INSERT INTO public.product_images (product_id, image_url, display_order, is_primary) VALUES
        (p_id, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80', 1, true);

    -- Product 4: SKIN1004 Centella Ampoule
    INSERT INTO public.products (
        name, english_name, slug, brand_id, brand_name, brand_slug,
        category_id, category_name, category_slug, price, discount_price,
        description, volume, skin_type, key_ingredients, ingredients,
        how_to_use, routine_step, stock, sku, featured, is_bestseller, is_new, rating, reviews_count, is_active
    ) VALUES (
        'أمبولة سينتيلا مدغشقر المركزة لترميم حاجز البشرة والتهدئة',
        'Madagascar Centella Ampoule 100ml',
        'skin1004-madagascar-centella-ampoule',
        skin1004_id, 'SKIN1004', 'skin1004',
        serum_cat_id, 'سيروم وعلاجات مركزة', 'serums',
        690, 620,
        'أمبولة نقية بنسبة 100% من خلاصة نبات السينتيلا اسياتيكا البري من مدغشقر لترميم حاجز البشرة المتضرر وتهدئة الالتهابات الفورية.',
        '100ml',
        ARRAY['البشرة الحساسة والمتهيجة', 'البشرة الجافة', 'جميع أنواع البشرة'],
        ARRAY['خلاصة سينتيلا مدغشقر 100%'],
        'Centella Asiatica Extract (100%).',
        'ضعي 2-3 قطرات مباشرة على الوجه ووزعيها بحركات دائرية خفيفة حتى تمتصها البشرة بالكامل.',
        'treat', 22, 'SKIN-CA-100', true, true, false, 4.9, 67, true
    ) ON CONFLICT (slug) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock
    RETURNING id INTO p_id;

    DELETE FROM public.product_images WHERE product_id = p_id;
    INSERT INTO public.product_images (product_id, image_url, display_order, is_primary) VALUES
        (p_id, 'https://images.unsplash.com/photo-1608248597359-bb436d4df4d4?auto=format&fit=crop&w=800&q=80', 1, true);

    -- Product 5: La Roche-Posay Effaclar Duo+M
    INSERT INTO public.products (
        name, english_name, slug, brand_id, brand_name, brand_slug,
        category_id, category_name, category_slug, price, discount_price,
        description, volume, skin_type, key_ingredients, ingredients,
        how_to_use, routine_step, stock, sku, featured, is_bestseller, is_new, rating, reviews_count, is_active
    ) VALUES (
        'مرطب إيفاكلار دو+ إم لعلاج حب الشباب وتنقية المسام ومكافحة الآثار',
        'Effaclar Duo+M Anti-Imperfections Treatment',
        'la-roche-posay-effaclar-duo-plus-m',
        lrp_id, 'La Roche-Posay', 'la-roche-posay',
        moist_cat_id, 'مرطبات وترميم الحاجز', 'moisturizers',
        780, 710,
        'العلاج المطور الجديد المضاد للعيوب والآثار المعتمد على ميكروبيوم البشرة والنياسيناميد وحمض الساليسيليك لنتائج مرئية خلال 8 ساعات.',
        '40ml',
        ARRAY['البشرة الدهنية والمعرضة للحبوب', 'البشرة المختلطة'],
        ARRAY['مركب فيلوما Phyloma', 'النياسيناميد المهدئ', 'حمض الساليسيليك LHA/BHA', 'مياه لاروش بوزيه الحرارية'],
        'Aqua / Water / Eau, Glycerin, Dimethicone, Isocetyl Stearate, Niacinamide, Isopropyl Lauroyl Sarcosinate...',
        'يُستخدم صباحاً ومساءً على كامل الوجه بعد تنظيفه بالغسول المناسب.',
        'moisturize', 18, 'LRP-EDM-40', true, true, false, 4.8, 115, true
    ) ON CONFLICT (slug) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock
    RETURNING id INTO p_id;

    DELETE FROM public.product_images WHERE product_id = p_id;
    INSERT INTO public.product_images (product_id, image_url, display_order, is_primary) VALUES
        (p_id, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80', 1, true);

    -- Product 6: Round Lab Birch Sunscreen
    INSERT INTO public.products (
        name, english_name, slug, brand_id, brand_name, brand_slug,
        category_id, category_name, category_slug, price, discount_price,
        description, volume, skin_type, key_ingredients, ingredients,
        how_to_use, routine_step, stock, sku, featured, is_bestseller, is_new, rating, reviews_count, is_active
    ) VALUES (
        'واقي شمس عصارة البتولا المرطب فائق الخفة Birch Juice SPF50+',
        'Birch Juice Moisturizing Sun Cream SPF50+ PA++++',
        'round-lab-birch-juice-moisturizing-sunscreen',
        roundlab_id, 'Round Lab', 'round-lab',
        sun_cat_id, 'واقي شمس وحماية', 'sunscreen',
        690, 620,
        'الحاصل على المركز الأول في جوائز أوليف يونغ الكورية كأفضل واقي شمس مرطب، غني بعصارة شجر البتولا الأبيض والهيالورونيك أسيد.',
        '50ml',
        ARRAY['البشرة الجافة', 'البشرة العادية', 'البشرة المختلطة والجافة'],
        ARRAY['عصارة شجر البتولا الأبيض', 'حمض الهيالورونيك المزدوج', 'خلاصة الشيح المهدئة'],
        'Water, Dibutyl Adipate, Propanediol, Diethylamino Hydroxybenzoyl Hexyl Benzoate...',
        'ضعي كمية كافية على الوجه كآخر خطوة قبل وضع المكياج أو التعرض للشمس.',
        'protect', 15, 'RL-BS-50', true, false, true, 4.9, 58, true
    ) ON CONFLICT (slug) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock
    RETURNING id INTO p_id;

    DELETE FROM public.product_images WHERE product_id = p_id;
    INSERT INTO public.product_images (product_id, image_url, display_order, is_primary) VALUES
        (p_id, 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80', 1, true);

    -- Product 7: AXIS-Y Dark Spot Serum
    INSERT INTO public.products (
        name, english_name, slug, brand_id, brand_name, brand_slug,
        category_id, category_name, category_slug, price, discount_price,
        description, volume, skin_type, key_ingredients, ingredients,
        how_to_use, routine_step, stock, sku, featured, is_bestseller, is_new, rating, reviews_count, is_active
    ) VALUES (
        'سيروم النياسيناميد 5% وتفتيح التصبغات وآثار الحبوب Dark Spot Glow',
        'Dark Spot Correcting Glow Serum 50ml',
        'axis-y-dark-spot-correcting-glow-serum',
        axisy_id, 'AXIS-Y', 'axis-y',
        serum_cat_id, 'سيروم وعلاجات مركزة', 'serums',
        660, 590,
        'سيروم مائي خفيف يحتوي على 5% نياسيناميد والسكوالان النباتي ومستخلص البابايا لتفتيح البقع الداكنة والتصبغات وتوحيد لون البشرة.',
        '50ml',
        ARRAY['البشرة المعرضة للتصبغات', 'البشرة المعرضة للحبوب', 'جميع أنواع البشرة'],
        ARRAY['النياسيناميد 5%', 'السكوالان النباتي', 'مستخلص نخالة الأرز', 'مستخلص البابايا'],
        'Water, Glycerin, Niacinamide, Sodium Hyaluronate, Propanediol, Erythritol...',
        'ضعي كمية مناسبة على الوجه بالكامل أو موضعيًا على مناطق التصبغات مع تدليك خفيف.',
        'treat', 30, 'AX-DS-50', true, true, false, 4.7, 76, true
    ) ON CONFLICT (slug) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock
    RETURNING id INTO p_id;

    DELETE FROM public.product_images WHERE product_id = p_id;
    INSERT INTO public.product_images (product_id, image_url, display_order, is_primary) VALUES
        (p_id, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80', 1, true);

    -- Product 8: ma:nyo Cleansing Oil
    INSERT INTO public.products (
        name, english_name, slug, brand_id, brand_name, brand_slug,
        category_id, category_name, category_slug, price, discount_price,
        description, volume, skin_type, key_ingredients, ingredients,
        how_to_use, routine_step, stock, sku, featured, is_bestseller, is_new, rating, reviews_count, is_active
    ) VALUES (
        'زيت مانيو النباتي المنظف للرؤوس السوداء والمسام Pure Cleansing Oil',
        'Pure Cleansing Oil 200ml',
        'manyo-pure-cleansing-oil',
        manyo_id, 'ma:nyo', 'manyo',
        clean_cat_id, 'غسول ومنظفات لطيفة', 'cleansers',
        760, 690,
        'الزيت المنظف رقم 1 في كوريا بتركيبة طبيعية 99.9% تذيب المكياج المقاوم للماء والرؤوس السوداء وتنقي المسام دون انسداد.',
        '200ml',
        ARRAY['جميع أنواع البشرة', 'البشرة الدهنية والمسام الواسعة'],
        ARRAY['زيت فول الصويا العضوي', 'زيت الجوجوبا وخلاصة نخالة الأرز', 'زيت الأرغان المخمر'],
        'Glycine Soja (Soybean) Oil, Corylus Avellana (Hazelnut) Seed Oil, Sorbeth-30 Tetraoleate...',
        'دلكي كمية وفيرة على بشرة جافة لإذابة الدهون والمكياج، ثم بللي يديكِ بالماء واستمرّي بالتدليك ليتحول لمستحلب أبيض، ثم اشطفي بالماء الفاتر.',
        'cleanse', 16, 'MAN-CO-200', true, true, false, 4.9, 110, true
    ) ON CONFLICT (slug) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock
    RETURNING id INTO p_id;

    DELETE FROM public.product_images WHERE product_id = p_id;
    INSERT INTO public.product_images (product_id, image_url, display_order, is_primary) VALUES
        (p_id, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80', 1, true);

    -- Product 9: COSRX Acne Master Patches
    INSERT INTO public.products (
        name, english_name, slug, brand_id, brand_name, brand_slug,
        category_id, category_name, category_slug, price, discount_price,
        description, volume, skin_type, key_ingredients, ingredients,
        how_to_use, routine_step, stock, sku, featured, is_bestseller, is_new, rating, reviews_count, is_active
    ) VALUES (
        'لصقات حب الشباب هايدروكولويد ماستر باتش لعلاج الحبوب السريع 24 لصقة',
        'Acne Pimple Master Patch 24pcs',
        'cosrx-acne-pimple-master-patch',
        cosrx_id, 'COSRX', 'cosrx',
        special_cat_id, 'عناية خاصة وعلاج الحبوب', 'special-care',
        190, 160,
        'لصقات هيدروكولويد رقيقة وشفافة تمتص الإفرازات والصديد من الحبة الملتهبة وتمنع التلوث والتندب وتحميها من اللمس.',
        '24 Patches',
        ARRAY['البشرة المعرضة للحبوب', 'جميع أنواع البشرة'],
        ARRAY['طبقة الهيدروكولويد الطبية A.D.F'],
        'Cellulose Gum, Styrene Isoprene Styrene Block Copolymer, Polyisobutylene...',
        'نظفي المنطقة المصابة وجففيها تمامًا بدون كريمات، ثم ضعي اللصقة بالحجم المناسب واتركيها حتى يتحول لونها للأبيض.',
        'treat', 60, 'COS-AP-24', false, true, false, 4.9, 210, true
    ) ON CONFLICT (slug) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock
    RETURNING id INTO p_id;

    DELETE FROM public.product_images WHERE product_id = p_id;
    INSERT INTO public.product_images (product_id, image_url, display_order, is_primary) VALUES
        (p_id, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80', 1, true);
END $$;

-- 6. SEED INITIAL CUSTOMERS & ORDERS
DO $$
DECLARE
    cust1_id UUID;
    cust2_id UUID;
    cust3_id UUID;
    cust4_id UUID;
    cust5_id UUID;
    
    ord_id UUID;
    p_boj UUID;
    p_cosrx_snail UUID;
    p_anua UUID;
    p_centella UUID;
    p_lrp UUID;
    p_manyo UUID;
    p_roundlab UUID;
    p_axisy UUID;
BEGIN
    SELECT id INTO p_boj FROM public.products WHERE slug = 'beauty-of-joseon-relief-sun-rice-probiotics';
    SELECT id INTO p_cosrx_snail FROM public.products WHERE slug = 'cosrx-advanced-snail-96-mucin-essence';
    SELECT id INTO p_anua FROM public.products WHERE slug = 'anua-heartleaf-77-soothing-toner';
    SELECT id INTO p_centella FROM public.products WHERE slug = 'skin1004-madagascar-centella-ampoule';
    SELECT id INTO p_lrp FROM public.products WHERE slug = 'la-roche-posay-effaclar-duo-plus-m';
    SELECT id INTO p_manyo FROM public.products WHERE slug = 'manyo-pure-cleansing-oil';
    SELECT id INTO p_roundlab FROM public.products WHERE slug = 'round-lab-birch-juice-moisturizing-sunscreen';
    SELECT id INTO p_axisy FROM public.products WHERE slug = 'axis-y-dark-spot-correcting-glow-serum';

    INSERT INTO public.customers (name, phone, address, total_orders, total_spent, last_order_date)
    VALUES ('ياسمين أحمد محمود', '01012345678', 'القاهرة - مصر الجديدة، شارع الميرغني، عمارة 14، شقة 5', 4, 4850, '2026-09-19 10:30:00+00')
    ON CONFLICT (phone) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO cust1_id;

    INSERT INTO public.customers (name, phone, address, total_orders, total_spent, last_order_date)
    VALUES ('سارة خالد المنشاوي', '01122334455', 'الجيزة - الدقي، شارع مصدق، برج الأطباء، الدور الرابع', 3, 3920, '2026-09-18 18:15:00+00')
    ON CONFLICT (phone) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO cust2_id;

    INSERT INTO public.customers (name, phone, address, total_orders, total_spent, last_order_date)
    VALUES ('مريم طارق العوضي', '01234567890', 'الإسكندرية - سموحة، شارع فوزي معاذ، عمارة الفيروز', 2, 2150, '2026-09-17 14:20:00+00')
    ON CONFLICT (phone) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO cust3_id;

    INSERT INTO public.customers (name, phone, address, total_orders, total_spent, last_order_date)
    VALUES ('نور الدين مصطفى', '01555544433', 'القاهرة - التجمع الخامس، النرجس عمارات، فيلا 12', 5, 6780, '2026-09-16 11:00:00+00')
    ON CONFLICT (phone) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO cust4_id;

    INSERT INTO public.customers (name, phone, address, total_orders, total_spent, last_order_date)
    VALUES ('هبة عبد الرحمن', '01099887766', 'المنصورة - شارع المشاية السفلية، برج الصفوة', 1, 590, '2026-09-15 09:45:00+00')
    ON CONFLICT (phone) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO cust5_id;

    -- Order 1: LSC-8921 (Pending)
    INSERT INTO public.orders (order_number, customer_id, customer_name, customer_phone, customer_address, subtotal, discount, total, status, notes, created_at)
    VALUES ('LSC-8921', cust1_id, 'ياسمين أحمد محمود', '01012345678', 'القاهرة - مصر الجديدة، شارع الميرغني، عمارة 14، شقة 5', 1230, 0, 1230, 'pending', 'يرجى الاتصال قبل التوصيل بنصف ساعة', '2026-09-19 10:30:00+00')
    ON CONFLICT (order_number) DO NOTHING
    RETURNING id INTO ord_id;

    IF ord_id IS NOT NULL THEN
        INSERT INTO public.order_items (order_id, product_id, product_name, brand_name, price, quantity, image_url)
        VALUES 
            (ord_id, p_boj, 'واقي شمس الأرز العضوي والبروبيوتيك Relief Sun SPF50+', 'Beauty of Joseon', 580, 1, 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80'),
            (ord_id, p_cosrx_snail, 'خلاصة إفرازات الحلزون النقية 96 باور إيسنس', 'COSRX', 650, 1, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80');
    END IF;

    -- Order 2: LSC-8920 (Processing)
    INSERT INTO public.orders (order_number, customer_id, customer_name, customer_phone, customer_address, subtotal, discount, total, status, created_at)
    VALUES ('LSC-8920', cust2_id, 'سارة خالد المنشاوي', '01122334455', 'الجيزة - الدقي، شارع مصدق، برج الأطباء، الدور الرابع', 1660, 100, 1560, 'processing', '2026-09-18 18:15:00+00')
    ON CONFLICT (order_number) DO NOTHING
    RETURNING id INTO ord_id;

    IF ord_id IS NOT NULL THEN
        INSERT INTO public.order_items (order_id, product_id, product_name, brand_name, price, quantity, image_url)
        VALUES 
            (ord_id, p_anua, 'تونر نبات الهارتليف المهدئ 77%', 'Anua', 720, 1, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'),
            (ord_id, p_centella, 'أمبولة سينتيلا مدغشقر المركزة 100ml', 'SKIN1004', 620, 1, 'https://images.unsplash.com/photo-1608248597359-bb436d4df4d4?auto=format&fit=crop&w=800&q=80');
    END IF;

    -- Order 3: LSC-8919 (Shipped)
    INSERT INTO public.orders (order_number, customer_id, customer_name, customer_phone, customer_address, subtotal, discount, total, status, created_at)
    VALUES ('LSC-8919', cust3_id, 'مريم طارق العوضي', '01234567890', 'الإسكندرية - سموحة، شارع فوزي معاذ، عمارة الفيروز', 710, 0, 710, 'shipped', '2026-09-17 14:20:00+00')
    ON CONFLICT (order_number) DO NOTHING
    RETURNING id INTO ord_id;

    IF ord_id IS NOT NULL THEN
        INSERT INTO public.order_items (order_id, product_id, product_name, brand_name, price, quantity, image_url)
        VALUES (ord_id, p_lrp, 'مرطب إيفاكلار دو+ إم لتنقية المسام', 'La Roche-Posay', 710, 1, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80');
    END IF;

    -- Order 4: LSC-8918 (Delivered)
    INSERT INTO public.orders (order_number, customer_id, customer_name, customer_phone, customer_address, subtotal, discount, total, status, created_at)
    VALUES ('LSC-8918', cust4_id, 'نور الدين مصطفى', '01555544433', 'القاهرة - التجمع الخامس، النرجس عمارات، فيلا 12', 1310, 50, 1260, 'delivered', '2026-09-16 11:00:00+00')
    ON CONFLICT (order_number) DO NOTHING
    RETURNING id INTO ord_id;

    IF ord_id IS NOT NULL THEN
        INSERT INTO public.order_items (order_id, product_id, product_name, brand_name, price, quantity, image_url)
        VALUES 
            (ord_id, p_manyo, 'زيت مانيو النباتي المنظف للرؤوس السوداء', 'ma:nyo', 690, 1, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'),
            (ord_id, p_roundlab, 'واقي شمس عصارة البتولا المرطب SPF50+', 'Round Lab', 620, 1, 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80');
    END IF;

    -- Order 5: LSC-8917 (Cancelled)
    INSERT INTO public.orders (order_number, customer_id, customer_name, customer_phone, customer_address, subtotal, discount, total, status, notes, created_at)
    VALUES ('LSC-8917', cust5_id, 'هبة عبد الرحمن', '01099887766', 'المنصورة - شارع المشاية السفلية، برج الصفوة', 590, 0, 590, 'cancelled', 'تم الإلغاء بطلب من العميل', '2026-09-15 09:45:00+00')
    ON CONFLICT (order_number) DO NOTHING
    RETURNING id INTO ord_id;

    IF ord_id IS NOT NULL THEN
        INSERT INTO public.order_items (order_id, product_id, product_name, brand_name, price, quantity, image_url)
        VALUES (ord_id, p_axisy, 'سيروم النياسيناميد 5% وتفتيح التصبغات', 'AXIS-Y', 590, 1, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80');
    END IF;
END $$;
