import { supabase } from '../lib/supabase';
import type { Product, Category, Brand, Order, OrderItem, Customer, Coupon, StoreSettings, OrderStatus, Offer, SearchEvent } from '../types';

// ==============================================================================
// CATEGORIES SERVICE
// ==============================================================================
export async function fetchCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data) {
      console.error('Error fetching categories from Supabase:', error);
      return [];
    }

    // Count products for each category
    const { data: products } = await supabase
      .from('products')
      .select('category_slug')
      .eq('is_active', true);

    const countMap: Record<string, number> = {};
    products?.forEach((p) => {
      countMap[p.category_slug] = (countMap[p.category_slug] || 0) + 1;
    });

    return data.map((c) => ({
      id: c.id,
      name: c.name,
      englishName: c.english_name ?? undefined,
      slug: c.slug,
      icon: c.icon ?? undefined,
      description: c.description ?? undefined,
      productCount: countMap[c.slug] || 0,
    }));
  } catch (err) {
    console.error('Unexpected error fetching categories:', err);
    return [];
  }
}

export async function createCategoryInDatabase(cat: {
  name: string;
  englishName?: string;
  slug: string;
  icon?: string;
  description?: string;
}): Promise<string | null> {
  const { data, error } = await supabase
    .from('categories')
    .insert({
      name: cat.name,
      english_name: cat.englishName,
      slug: cat.slug,
      icon: cat.icon,
      description: cat.description,
    })
    .select('id')
    .maybeSingle();

  if (error) {
    console.error('Error creating category in Supabase:', error);
    return null;
  }
  return data?.id || null;
}

export async function updateCategoryInDatabase(
  id: string,
  fields: Partial<Category>
): Promise<boolean> {
  const dbUpdates: any = {};
  if (fields.name !== undefined) dbUpdates.name = fields.name;
  if (fields.englishName !== undefined) dbUpdates.english_name = fields.englishName;
  if (fields.slug !== undefined) dbUpdates.slug = fields.slug;
  if (fields.icon !== undefined) dbUpdates.icon = fields.icon;
  if (fields.description !== undefined) dbUpdates.description = fields.description;

  const { error } = await supabase.from('categories').update(dbUpdates).eq('id', id);
  if (error) {
    console.error('Error updating category in Supabase:', error);
    return false;
  }
  return true;
}

export async function deleteCategoryInDatabase(id: string): Promise<boolean> {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) {
    console.error('Error deleting category in Supabase:', error);
    return false;
  }
  return true;
}

// ==============================================================================
// BRANDS SERVICE
// ==============================================================================
export async function fetchBrands(): Promise<Brand[]> {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data) {
      console.error('Error fetching brands from Supabase:', error);
      return [];
    }

    // Count products for each brand
    const { data: products } = await supabase
      .from('products')
      .select('brand_slug')
      .eq('is_active', true);

    const countMap: Record<string, number> = {};
    products?.forEach((p) => {
      countMap[p.brand_slug] = (countMap[p.brand_slug] || 0) + 1;
    });

    return data.map((b) => ({
      id: b.id,
      name: b.name,
      slug: b.slug,
      origin: (b.origin as 'korean' | 'european') || 'korean',
      originLabel: b.origin_label,
      description: b.description ?? undefined,
      productCount: countMap[b.slug] || 0,
    }));
  } catch (err) {
    console.error('Unexpected error fetching brands:', err);
    return [];
  }
}

export async function createBrandInDatabase(brand: {
  name: string;
  slug: string;
  origin: 'korean' | 'european';
  originLabel?: string;
  description?: string;
}): Promise<string | null> {
  const { data, error } = await supabase
    .from('brands')
    .insert({
      name: brand.name,
      slug: brand.slug,
      origin: brand.origin,
      origin_label: brand.originLabel || (brand.origin === 'korean' ? 'كوري أصلي 100%' : 'أوروبي أصلي'),
      description: brand.description,
    })
    .select('id')
    .maybeSingle();

  if (error) {
    console.error('Error creating brand in Supabase:', error);
    return null;
  }
  return data?.id || null;
}

export async function updateBrandInDatabase(
  id: string,
  fields: Partial<Brand>
): Promise<boolean> {
  const dbUpdates: any = {};
  if (fields.name !== undefined) dbUpdates.name = fields.name;
  if (fields.slug !== undefined) dbUpdates.slug = fields.slug;
  if (fields.origin !== undefined) dbUpdates.origin = fields.origin;
  if (fields.originLabel !== undefined) dbUpdates.origin_label = fields.originLabel;
  if (fields.description !== undefined) dbUpdates.description = fields.description;

  const { error } = await supabase.from('brands').update(dbUpdates).eq('id', id);
  if (error) {
    console.error('Error updating brand in Supabase:', error);
    return false;
  }
  return true;
}

export async function deleteBrandInDatabase(id: string): Promise<boolean> {
  const { error } = await supabase.from('brands').delete().eq('id', id);
  if (error) {
    console.error('Error deleting brand in Supabase:', error);
    return false;
  }
  return true;
}

// ==============================================================================
// PRODUCTS SERVICE
// ==============================================================================
export async function fetchProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_images (
          image_url,
          display_order,
          is_primary
        )
      `)
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.error('Error fetching products from Supabase:', error);
      return [];
    }

    return data.map((p) => {
      const sortedImages = (p.product_images || [])
        .sort((a, b) => a.display_order - b.display_order)
        .map((img) => img.image_url);

      return {
        id: p.id,
        name: p.name,
        englishName: p.english_name ?? undefined,
        slug: p.slug,
        brand: p.brand_name,
        brandSlug: p.brand_slug,
        category: p.category_name,
        categorySlug: p.category_slug,
        price: Number(p.price),
        discountPrice: p.discount_price !== null ? Number(p.discount_price) : undefined,
        images: sortedImages.length > 0 ? sortedImages : ['https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80'],
        description: p.description,
        volume: p.volume ?? undefined,
        skinType: p.skin_type ?? [],
        keyIngredients: p.key_ingredients ?? [],
        ingredients: p.ingredients ?? undefined,
        howToUse: p.how_to_use ?? undefined,
        routineStep: p.routine_step as any,
        stock: p.stock,
        sku: p.sku,
        featured: p.featured,
        isBestSeller: p.is_bestseller,
        isNew: p.is_new,
        rating: Number(p.rating),
        reviewsCount: p.reviews_count,
        isActive: p.is_active,
      };
    });
  } catch (err) {
    console.error('Unexpected error fetching products:', err);
    return [];
  }
}

export async function createProductInDatabase(product: Omit<Product, 'id'>): Promise<Product | null> {
  try {
    // 1. Resolve brand and category UUIDs if possible
    const { data: brandData } = await supabase
      .from('brands')
      .select('id')
      .eq('slug', product.brandSlug)
      .maybeSingle();

    const { data: catData } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', product.categorySlug)
      .maybeSingle();

    // 2. Insert product
    const { data: newProd, error } = await supabase
      .from('products')
      .insert({
        name: product.name,
        english_name: product.englishName,
        slug: product.slug,
        brand_id: brandData?.id || null,
        brand_name: product.brand,
        brand_slug: product.brandSlug,
        category_id: catData?.id || null,
        category_name: product.category,
        category_slug: product.categorySlug,
        price: product.price,
        discount_price: product.discountPrice,
        description: product.description,
        volume: product.volume,
        skin_type: product.skinType,
        key_ingredients: product.keyIngredients,
        ingredients: product.ingredients,
        how_to_use: product.howToUse,
        routine_step: product.routineStep,
        stock: product.stock,
        sku: product.sku,
        featured: product.featured,
        is_bestseller: product.isBestSeller,
        is_new: product.isNew,
        rating: product.rating,
        reviews_count: product.reviewsCount,
        is_active: product.isActive,
      })
      .select()
      .single();

    if (error || !newProd) {
      console.error('Error inserting product into Supabase:', error);
      return null;
    }

    // 3. Insert images
    if (product.images && product.images.length > 0) {
      const imagesToInsert = product.images.map((imgUrl, idx) => ({
        product_id: newProd.id,
        image_url: imgUrl,
        display_order: idx + 1,
        is_primary: idx === 0,
      }));
      await supabase.from('product_images').insert(imagesToInsert);
    }

    return {
      ...product,
      id: newProd.id,
    };
  } catch (err) {
    console.error('Unexpected error inserting product:', err);
    return null;
  }
}

export async function updateProductInDatabase(
  id: string,
  fields: Partial<Product>
): Promise<boolean> {
  try {
    const dbUpdates: any = {};
    if (fields.name !== undefined) dbUpdates.name = fields.name;
    if (fields.englishName !== undefined) dbUpdates.english_name = fields.englishName;
    if (fields.brand !== undefined) dbUpdates.brand_name = fields.brand;
    if (fields.brandSlug !== undefined) dbUpdates.brand_slug = fields.brandSlug;
    if (fields.category !== undefined) dbUpdates.category_name = fields.category;
    if (fields.categorySlug !== undefined) dbUpdates.category_slug = fields.categorySlug;
    if (fields.price !== undefined) dbUpdates.price = fields.price;
    if (fields.discountPrice !== undefined) dbUpdates.discount_price = fields.discountPrice;
    if (fields.description !== undefined) dbUpdates.description = fields.description;
    if (fields.volume !== undefined) dbUpdates.volume = fields.volume;
    if (fields.skinType !== undefined) dbUpdates.skin_type = fields.skinType;
    if (fields.keyIngredients !== undefined) dbUpdates.key_ingredients = fields.keyIngredients;
    if (fields.ingredients !== undefined) dbUpdates.ingredients = fields.ingredients;
    if (fields.howToUse !== undefined) dbUpdates.how_to_use = fields.howToUse;
    if (fields.routineStep !== undefined) dbUpdates.routine_step = fields.routineStep;
    if (fields.stock !== undefined) dbUpdates.stock = fields.stock;
    if (fields.sku !== undefined) dbUpdates.sku = fields.sku;
    if (fields.featured !== undefined) dbUpdates.featured = fields.featured;
    if (fields.isBestSeller !== undefined) dbUpdates.is_bestseller = fields.isBestSeller;
    if (fields.isNew !== undefined) dbUpdates.is_new = fields.isNew;
    if (fields.isActive !== undefined) dbUpdates.is_active = fields.isActive;

    const { error } = await supabase.from('products').update(dbUpdates).eq('id', id);
    if (error) {
      console.error('Error updating product in Supabase:', error);
      return false;
    }

    // Update images if provided
    if (fields.images && fields.images.length > 0) {
      await supabase.from('product_images').delete().eq('product_id', id);
      const imagesToInsert = fields.images.map((imgUrl, idx) => ({
        product_id: id,
        image_url: imgUrl,
        display_order: idx + 1,
        is_primary: idx === 0,
      }));
      await supabase.from('product_images').insert(imagesToInsert);
    }

    return true;
  } catch (err) {
    console.error('Unexpected error updating product in Supabase:', err);
    return false;
  }
}

export async function deleteProductInDatabase(id: string): Promise<boolean> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) {
    console.error('Error deleting product in Supabase:', error);
    return false;
  }
  return true;
}

export async function updateStockInDatabase(
  productId: string,
  newStock: number,
  reason: string = 'تعديل يدوي للمخزون'
): Promise<boolean> {
  try {
    // 1. Get current stock
    const { data: current } = await supabase
      .from('products')
      .select('stock')
      .eq('id', productId)
      .single();

    const prevStock = current?.stock ?? 0;
    const clampedStock = Math.max(0, newStock);

    // 2. Update stock
    const { error } = await supabase
      .from('products')
      .update({ stock: clampedStock })
      .eq('id', productId);

    if (error) {
      console.error('Error updating stock in Supabase:', error);
      return false;
    }

    // 3. Log to inventory_logs
    await supabase.from('inventory_logs').insert({
      product_id: productId,
      previous_stock: prevStock,
      new_stock: clampedStock,
      change_type: 'manual_adjustment',
      reason,
    });

    return true;
  } catch (err) {
    console.error('Unexpected error updating stock in Supabase:', err);
    return false;
  }
}

// ==============================================================================
// ORDERS SERVICE (SECURE CHECKOUT & ADMIN MANAGEMENT)
// ==============================================================================
export async function fetchOrders(): Promise<Order[]> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.error('Error fetching orders from Supabase:', error);
      return [];
    }

    return data.map((o) => ({
      id: o.id,
      orderNumber: o.order_number,
      createdAt: o.created_at,
      customerName: o.customer_name,
      customerPhone: o.customer_phone,
      customerAddress: o.customer_address,
      subtotal: Number(o.subtotal),
      discount: Number(o.discount),
      total: Number(o.total),
      status: o.status as OrderStatus,
      notes: o.notes ?? undefined,
      items: (o.order_items || []).map((item) => ({
        productId: item.product_id ?? '',
        name: item.product_name,
        brand: item.brand_name,
        price: Number(item.price),
        quantity: item.quantity,
        image: item.image_url ?? '',
      })),
    }));
  } catch (err) {
    console.error('Unexpected error fetching orders:', err);
    return [];
  }
}

export async function createOrderInDatabase(orderData: {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  status?: string;
  notes?: string;
}): Promise<Order> {
  // 1. Call secure atomic database function
  const { data, error } = await supabase.rpc('place_order_secure', {
    p_customer_name: orderData.customerName.trim(),
    p_customer_phone: orderData.customerPhone.trim(),
    p_customer_address: orderData.customerAddress.trim(),
    p_items: orderData.items,
    p_subtotal: orderData.subtotal,
    p_discount: orderData.discount,
    p_total: orderData.total,
    p_notes: orderData.notes?.trim() || null,
  });

  if (error || !data) {
    console.error('Error calling place_order_secure:', error);
    throw new Error(error?.message || 'حدث خطأ أثناء إنشاء الطلب، يرجى المحاولة مرة أخرى.');
  }

  const result = data as any;
  return {
    id: result.id,
    orderNumber: result.orderNumber,
    createdAt: result.createdAt,
    customerName: result.customerName,
    customerPhone: result.customerPhone,
    customerAddress: result.customerAddress,
    subtotal: Number(result.subtotal),
    discount: Number(result.discount),
    total: Number(result.total),
    status: result.status as OrderStatus,
    notes: result.notes ?? undefined,
    items: orderData.items,
  };
}

export async function updateOrderStatusInDatabase(
  orderId: string,
  status: OrderStatus
): Promise<boolean> {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);

  if (error) {
    console.error('Error updating order status in Supabase:', error);
    return false;
  }
  return true;
}

export async function deleteOrderInDatabase(orderId: string): Promise<boolean> {
  const { error } = await supabase.from('orders').delete().eq('id', orderId);
  if (error) {
    console.error('Error deleting order in Supabase:', error);
    return false;
  }
  return true;
}

// ==============================================================================
// CUSTOMERS SERVICE
// ==============================================================================
export async function fetchCustomers(): Promise<Customer[]> {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('total_spent', { ascending: false });

    if (error || !data) {
      console.error('Error fetching customers from Supabase:', error);
      return [];
    }

    return data.map((c) => ({
      id: c.id,
      name: c.name,
      phone: c.phone,
      address: c.address,
      totalOrders: c.total_orders,
      totalSpent: Number(c.total_spent),
      lastOrderDate: c.last_order_date ? c.last_order_date.split('T')[0] : '2026-09-19',
    }));
  } catch (err) {
    console.error('Unexpected error fetching customers:', err);
    return [];
  }
}

// ==============================================================================
// COUPONS SERVICE
// ==============================================================================
export async function fetchCoupons(): Promise<Coupon[]> {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.error('Error fetching coupons from Supabase:', error);
      return [];
    }

    return data.map((c) => ({
      id: c.id,
      code: c.code,
      discountPercentage: c.discount_percentage,
      minOrderAmount: c.min_order_amount !== null ? Number(c.min_order_amount) : undefined,
      expiryDate: c.expiry_date,
      isActive: c.is_active,
      usageCount: c.usage_count,
    }));
  } catch (err) {
    console.error('Unexpected error fetching coupons:', err);
    return [];
  }
}

export async function createCouponInDatabase(coupon: {
  code: string;
  discountPercentage: number;
  minOrderAmount?: number;
  expiryDate: string;
  isActive: boolean;
}): Promise<string | null> {
  const { data, error } = await supabase
    .from('coupons')
    .insert({
      code: coupon.code.toUpperCase().trim(),
      discount_percentage: coupon.discountPercentage,
      min_order_amount: coupon.minOrderAmount,
      expiry_date: coupon.expiryDate,
      is_active: coupon.isActive,
    })
    .select('id')
    .maybeSingle();

  if (error) {
    console.error('Error creating coupon in Supabase:', error);
    return null;
  }
  return data?.id || null;
}

export async function toggleCouponInDatabase(id: string, isActive: boolean): Promise<boolean> {
  const { error } = await supabase
    .from('coupons')
    .update({ is_active: isActive })
    .eq('id', id);

  if (error) {
    console.error('Error toggling coupon in Supabase:', error);
    return false;
  }
  return true;
}

export async function deleteCouponInDatabase(id: string): Promise<boolean> {
  const { error } = await supabase.from('coupons').delete().eq('id', id);
  if (error) {
    console.error('Error deleting coupon in Supabase:', error);
    return false;
  }
  return true;
}

// ==============================================================================
// STORE SETTINGS SERVICE
// ==============================================================================
export async function fetchStoreSettings(): Promise<StoreSettings | null> {
  try {
    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      console.error('Error fetching store settings from Supabase:', error);
      return null;
    }

    return {
      storeName: data.store_name,
      storeSubtitle: data.store_subtitle,
      primaryPhone: data.primary_phone,
      secondaryPhone: data.secondary_phone,
      branchAddress: data.branch_address,
      branchLandmark: data.branch_landmark,
      workingHours: data.working_hours,
      whatsappNumber: data.whatsapp_number,
      instagramUrl: data.instagram_url ?? undefined,
      facebookUrl: data.facebook_url ?? undefined,
      freeShippingThreshold: data.free_shipping_threshold !== null ? Number(data.free_shipping_threshold) : undefined,
      googleAnalyticsId: data.google_analytics_id ?? undefined,
      metaPixelId: data.meta_pixel_id ?? undefined,
      clarityProjectId: data.clarity_project_id ?? undefined,
      siteTitle: data.site_title ?? undefined,
      metaDescription: data.meta_description ?? undefined,
      defaultOgImage: data.default_og_image ?? undefined,
      googleVerificationCode: data.google_verification_code ?? undefined,
    };
  } catch (err) {
    console.error('Unexpected error fetching store settings:', err);
    return null;
  }
}

export async function updateStoreSettingsInDatabase(
  updated: Partial<StoreSettings>
): Promise<boolean> {
  const dbUpdates: any = {};
  if (updated.storeName !== undefined) dbUpdates.store_name = updated.storeName;
  if (updated.storeSubtitle !== undefined) dbUpdates.store_subtitle = updated.storeSubtitle;
  if (updated.primaryPhone !== undefined) dbUpdates.primary_phone = updated.primaryPhone;
  if (updated.secondaryPhone !== undefined) dbUpdates.secondary_phone = updated.secondaryPhone;
  if (updated.branchAddress !== undefined) dbUpdates.branch_address = updated.branchAddress;
  if (updated.branchLandmark !== undefined) dbUpdates.branch_landmark = updated.branchLandmark;
  if (updated.workingHours !== undefined) dbUpdates.working_hours = updated.workingHours;
  if (updated.whatsappNumber !== undefined) dbUpdates.whatsapp_number = updated.whatsappNumber;
  if (updated.instagramUrl !== undefined) dbUpdates.instagram_url = updated.instagramUrl;
  if (updated.facebookUrl !== undefined) dbUpdates.facebook_url = updated.facebookUrl;
  if (updated.freeShippingThreshold !== undefined) dbUpdates.free_shipping_threshold = updated.freeShippingThreshold;
  if (updated.googleAnalyticsId !== undefined) dbUpdates.google_analytics_id = updated.googleAnalyticsId;
  if (updated.metaPixelId !== undefined) dbUpdates.meta_pixel_id = updated.metaPixelId;
  if (updated.clarityProjectId !== undefined) dbUpdates.clarity_project_id = updated.clarityProjectId;
  if (updated.siteTitle !== undefined) dbUpdates.site_title = updated.siteTitle;
  if (updated.metaDescription !== undefined) dbUpdates.meta_description = updated.metaDescription;
  if (updated.defaultOgImage !== undefined) dbUpdates.default_og_image = updated.defaultOgImage;
  if (updated.googleVerificationCode !== undefined) dbUpdates.google_verification_code = updated.googleVerificationCode;

  const { error } = await supabase
    .from('store_settings')
    .update(dbUpdates)
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (error) {
    console.error('Error updating store settings in Supabase:', error);
    return false;
  }
  return true;
}

// ==============================================================================
// OFFERS SERVICE
// ==============================================================================
export async function fetchOffers(includeInactive: boolean = false): Promise<Offer[]> {
  try {
    let query = supabase
      .from('offers')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (!includeInactive) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error || !data) {
      console.error('Error fetching offers from Supabase:', error);
      return [];
    }

    return data.map((o) => ({
      id: o.id,
      title: o.title,
      description: o.description ?? undefined,
      imageUrl: o.image_url ?? undefined,
      discountText: o.discount_text ?? undefined,
      linkUrl: o.link_url ?? undefined,
      isActive: o.is_active,
      startDate: o.start_date ?? undefined,
      endDate: o.end_date ?? undefined,
      displayOrder: o.display_order ?? 0,
      createdAt: o.created_at,
    }));
  } catch (err) {
    console.error('Unexpected error fetching offers:', err);
    return [];
  }
}

export async function createOfferInDatabase(offer: {
  title: string;
  description?: string;
  imageUrl?: string;
  discountText?: string;
  linkUrl?: string;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  displayOrder?: number;
}): Promise<string | null> {
  const { data, error } = await supabase
    .from('offers')
    .insert({
      title: offer.title,
      description: offer.description,
      image_url: offer.imageUrl,
      discount_text: offer.discountText,
      link_url: offer.linkUrl,
      is_active: offer.isActive ?? true,
      start_date: offer.startDate || null,
      end_date: offer.endDate || null,
      display_order: offer.displayOrder ?? 0,
    })
    .select('id')
    .maybeSingle();

  if (error) {
    console.error('Error creating offer in Supabase:', error);
    return null;
  }
  return data?.id || null;
}

export async function updateOfferInDatabase(
  id: string,
  fields: Partial<Offer>
): Promise<boolean> {
  const dbUpdates: any = {};
  if (fields.title !== undefined) dbUpdates.title = fields.title;
  if (fields.description !== undefined) dbUpdates.description = fields.description;
  if (fields.imageUrl !== undefined) dbUpdates.image_url = fields.imageUrl;
  if (fields.discountText !== undefined) dbUpdates.discount_text = fields.discountText;
  if (fields.linkUrl !== undefined) dbUpdates.link_url = fields.linkUrl;
  if (fields.isActive !== undefined) dbUpdates.is_active = fields.isActive;
  if (fields.startDate !== undefined) dbUpdates.start_date = fields.startDate || null;
  if (fields.endDate !== undefined) dbUpdates.end_date = fields.endDate || null;
  if (fields.displayOrder !== undefined) dbUpdates.display_order = fields.displayOrder;

  const { error } = await supabase.from('offers').update(dbUpdates).eq('id', id);
  if (error) {
    console.error('Error updating offer in Supabase:', error);
    return false;
  }
  return true;
}

export async function toggleOfferInDatabase(id: string, isActive: boolean): Promise<boolean> {
  const { error } = await supabase.from('offers').update({ is_active: isActive }).eq('id', id);
  if (error) {
    console.error('Error toggling offer status in Supabase:', error);
    return false;
  }
  return true;
}

export async function deleteOfferInDatabase(id: string): Promise<boolean> {
  const { error } = await supabase.from('offers').delete().eq('id', id);
  if (error) {
    console.error('Error deleting offer in Supabase:', error);
    return false;
  }
  return true;
}

// ==============================================================================
// SEARCH EVENTS SERVICE (ANALYTICS)
// ==============================================================================
export async function logSearchEvent(query: string, resultsCount: number): Promise<void> {
  if (!query || query.trim().length === 0) return;
  try {
    await supabase.from('search_events').insert({
      query: query.trim().toLowerCase(),
      results_count: resultsCount,
    });
  } catch (err) {
    // Non-blocking background analytics
    console.warn('Could not log search event:', err);
  }
}

export async function fetchSearchEvents(): Promise<SearchEvent[]> {
  try {
    const { data, error } = await supabase
      .from('search_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);

    if (error || !data) {
      console.error('Error fetching search events:', error);
      return [];
    }

    return data.map((s) => ({
      id: s.id,
      query: s.query,
      resultsCount: s.results_count,
      createdAt: s.created_at,
    }));
  } catch (err) {
    console.error('Unexpected error fetching search events:', err);
    return [];
  }
}
