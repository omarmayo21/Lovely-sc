export type RoutineStep = 'cleanse' | 'tone' | 'treat' | 'moisturize' | 'protect';

export interface Product {
  id: string;
  name: string;
  englishName?: string;
  slug: string;
  brand: string;
  brandSlug: string;
  category: string;
  categorySlug: string;
  price: number;
  discountPrice?: number;
  images: string[];
  description: string;
  volume?: string;
  skinType?: string[];
  keyIngredients?: string[];
  ingredients?: string;
  howToUse?: string;
  routineStep?: RoutineStep;
  stock: number;
  sku: string;
  featured?: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
  rating: number;
  reviewsCount: number;
  isActive: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: OrderStatus;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
}

export interface Category {
  id: string;
  name: string;
  englishName?: string;
  slug: string;
  icon?: string;
  description?: string;
  productCount: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  origin: 'korean' | 'european';
  originLabel: string;
  description?: string;
  productCount: number;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercentage: number;
  minOrderAmount?: number;
  expiryDate: string;
  isActive: boolean;
  usageCount: number;
}

export interface StoreSettings {
  storeName: string;
  storeSubtitle: string;
  primaryPhone: string;
  secondaryPhone: string;
  branchAddress: string;
  branchLandmark: string;
  workingHours: string;
  whatsappNumber: string;
  instagramUrl?: string;
  facebookUrl?: string;
  freeShippingThreshold?: number;
  googleAnalyticsId?: string;
  metaPixelId?: string;
  clarityProjectId?: string;
  siteTitle?: string;
  metaDescription?: string;
  defaultOgImage?: string;
  googleVerificationCode?: string;
}

export interface Offer {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  discountText?: string;
  linkUrl?: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  displayOrder?: number;
  createdAt?: string;
}

export interface SearchEvent {
  id: string;
  query: string;
  resultsCount: number;
  createdAt: string;
}
