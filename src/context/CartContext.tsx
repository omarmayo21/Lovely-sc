import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Coupon } from '../types';
import { supabase } from '../lib/supabase';
import { trackAddToCart, trackRemoveFromCart } from '../services/analyticsService';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  discount: number;
  total: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'lovely_skincare_cart';
const COUPON_STORAGE_KEY = 'lovely_skincare_coupon';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    try {
      const saved = localStorage.getItem(COUPON_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save coupon to localStorage', e);
    }
  }, [appliedCoupon]);

  const addToCart = (product: Product, quantity = 1) => {
    if (!product || product.stock <= 0) return;
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, product, quantity: newQty }
            : item
        );
      }
      const initialQty = Math.min(Math.max(1, quantity), product.stock);
      return [...prev, { product, quantity: initialQty }];
    });
    trackAddToCart(product, quantity);
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (productId: string) => {
    const target = items.find((it) => it.product.id === productId);
    if (target) {
      trackRemoveFromCart(target.product, target.quantity);
    }
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const maxStock = item.product.stock;
          const clamped = Math.min(quantity, maxStock);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => {
    const itemPrice = item.product.discountPrice ?? item.product.price;
    return sum + itemPrice * item.quantity;
  }, 0);

  let discount = 0;
  if (appliedCoupon && appliedCoupon.isActive) {
    if (!appliedCoupon.minOrderAmount || subtotal >= appliedCoupon.minOrderAmount) {
      discount = Math.round((subtotal * appliedCoupon.discountPercentage) / 100);
    }
  }

  const total = Math.max(0, subtotal - discount);

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, message: 'يرجى إدخال كود الخصم' };
    }

    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', cleanCode)
        .eq('is_active', true)
        .maybeSingle();

      if (error || !data) {
        return { success: false, message: 'كود الخصم غير صالح أو منتهي الصلاحية' };
      }

      // Check expiry date
      const today = new Date().toISOString().split('T')[0];
      if (data.expiry_date < today) {
        return { success: false, message: 'عذراً، انتهت صلاحية هذا الكوبون' };
      }

      const minAmount = data.min_order_amount !== null ? Number(data.min_order_amount) : undefined;
      if (minAmount && subtotal < minAmount) {
        return {
          success: false,
          message: `الحد الأدنى لتفعيل هذا الكوبون هو ${minAmount} ج.م`,
        };
      }

      const coupon: Coupon = {
        id: data.id,
        code: data.code,
        discountPercentage: data.discount_percentage,
        minOrderAmount: minAmount,
        expiryDate: data.expiry_date,
        isActive: data.is_active,
        usageCount: data.usage_count,
      };

      setAppliedCoupon(coupon);
      return {
        success: true,
        message: `تم تطبيق خصم ${coupon.discountPercentage}% بنجاح!`,
      };
    } catch (err) {
      console.error('Error validating coupon with Supabase:', err);
      return { success: false, message: 'حدث خطأ أثناء التحقق من كود الخصم' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        discount,
        total,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
