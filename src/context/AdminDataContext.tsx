import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Order, Category, Brand, Customer, Coupon, StoreSettings, OrderStatus, Offer } from '../types';
import { initialStoreSettings } from '../data/storeSettings';
import { supabase } from '../lib/supabase';
import {
  fetchCategories,
  fetchBrands,
  fetchProducts,
  fetchOrders,
  fetchCustomers,
  fetchCoupons,
  fetchOffers,
  fetchStoreSettings,
  createOrderInDatabase,
  createProductInDatabase,
  updateProductInDatabase,
  deleteProductInDatabase,
  updateStockInDatabase,
  updateOrderStatusInDatabase,
  deleteOrderInDatabase,
  createCategoryInDatabase,
  updateCategoryInDatabase,
  deleteCategoryInDatabase,
  createBrandInDatabase,
  updateBrandInDatabase,
  deleteBrandInDatabase,
  createCouponInDatabase,
  toggleCouponInDatabase,
  deleteCouponInDatabase,
  createOfferInDatabase,
  updateOfferInDatabase,
  toggleOfferInDatabase,
  deleteOfferInDatabase,
  updateStoreSettingsInDatabase,
} from '../services/apiService';

interface AdminDataContextType {
  products: Product[];
  orders: Order[];
  categories: Category[];
  brands: Brand[];
  customers: Customer[];
  coupons: Coupon[];
  offers: Offer[];
  settings: StoreSettings;
  isLoading: boolean;
  
  // Product actions
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product | null>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  toggleProductStatus: (id: string) => Promise<boolean>;
  updateStock: (productId: string, newStock: number, reason?: string) => Promise<boolean>;
  
  // Order actions
  addOrder: (order: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    items: Order['items'];
    subtotal: number;
    discount: number;
    total: number;
    status?: string;
    notes?: string;
  }) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<boolean>;
  deleteOrder: (orderId: string) => Promise<boolean>;

  // Category actions
  addCategory: (category: Omit<Category, 'id' | 'productCount'>) => Promise<string | null>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;

  // Brand actions
  addBrand: (brand: Omit<Brand, 'id' | 'productCount'>) => Promise<string | null>;
  updateBrand: (id: string, brand: Partial<Brand>) => Promise<boolean>;
  deleteBrand: (id: string) => Promise<boolean>;

  // Coupon actions
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usageCount'>) => Promise<string | null>;
  toggleCoupon: (id: string) => Promise<boolean>;
  deleteCoupon: (id: string) => Promise<boolean>;

  // Offer actions
  addOffer: (offer: Omit<Offer, 'id' | 'createdAt'>) => Promise<string | null>;
  updateOffer: (id: string, offer: Partial<Offer>) => Promise<boolean>;
  toggleOffer: (id: string) => Promise<boolean>;
  deleteOffer: (id: string) => Promise<boolean>;

  // Settings
  updateSettings: (settings: Partial<StoreSettings>) => Promise<boolean>;

  // Data Refresh
  refreshData: () => Promise<void>;
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export const AdminDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('lovely_admin_products');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('lovely_admin_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('lovely_admin_categories');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [brands, setBrands] = useState<Brand[]>(() => {
    try {
      const saved = localStorage.getItem('lovely_admin_brands');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem('lovely_admin_customers');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem('lovely_admin_coupons');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [offers, setOffers] = useState<Offer[]>(() => {
    try {
      const saved = localStorage.getItem('lovely_admin_offers');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('lovely_admin_settings');
      return saved ? JSON.parse(saved) : initialStoreSettings;
    } catch {
      return initialStoreSettings;
    }
  });

  // Load live data from Supabase
  const refreshData = async () => {
    try {
      setIsLoading(true);
      const [
        fetchedCategories,
        fetchedBrands,
        fetchedProducts,
        fetchedOrders,
        fetchedCustomers,
        fetchedCoupons,
        fetchedOffers,
        fetchedSettings,
      ] = await Promise.all([
        fetchCategories(),
        fetchBrands(),
        fetchProducts(),
        fetchOrders(),
        fetchCustomers(),
        fetchCoupons(),
        fetchOffers(true), // Load all offers for admin context
        fetchStoreSettings(),
      ]);

      if (fetchedCategories.length > 0) {
        setCategories(fetchedCategories);
        localStorage.setItem('lovely_admin_categories', JSON.stringify(fetchedCategories));
      }
      if (fetchedBrands.length > 0) {
        setBrands(fetchedBrands);
        localStorage.setItem('lovely_admin_brands', JSON.stringify(fetchedBrands));
      }
      if (fetchedProducts.length > 0) {
        setProducts(fetchedProducts);
        localStorage.setItem('lovely_admin_products', JSON.stringify(fetchedProducts));
      }
      if (fetchedOrders.length > 0) {
        setOrders(fetchedOrders);
        localStorage.setItem('lovely_admin_orders', JSON.stringify(fetchedOrders));
      }
      if (fetchedCustomers.length > 0) {
        setCustomers(fetchedCustomers);
        localStorage.setItem('lovely_admin_customers', JSON.stringify(fetchedCustomers));
      }
      if (fetchedCoupons.length > 0) {
        setCoupons(fetchedCoupons);
        localStorage.setItem('lovely_admin_coupons', JSON.stringify(fetchedCoupons));
      }
      if (fetchedOffers.length > 0) {
        setOffers(fetchedOffers);
        localStorage.setItem('lovely_admin_offers', JSON.stringify(fetchedOffers));
      }
      if (fetchedSettings) {
        setSettings(fetchedSettings);
        localStorage.setItem('lovely_admin_settings', JSON.stringify(fetchedSettings));
      }
    } catch (err) {
      console.warn('Could not sync live data from Supabase:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Supabase Realtime Subscription - Live updates without manual refresh
  useEffect(() => {
    const channel = supabase
      .channel('lovely_realtime_sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        async () => {
          const freshOrders = await fetchOrders();
          if (freshOrders && freshOrders.length > 0) {
            setOrders(freshOrders);
            localStorage.setItem('lovely_admin_orders', JSON.stringify(freshOrders));
          }
          const freshCustomers = await fetchCustomers();
          if (freshCustomers && freshCustomers.length > 0) {
            setCustomers(freshCustomers);
            localStorage.setItem('lovely_admin_customers', JSON.stringify(freshCustomers));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        async () => {
          const freshProducts = await fetchProducts();
          if (freshProducts && freshProducts.length > 0) {
            setProducts(freshProducts);
            localStorage.setItem('lovely_admin_products', JSON.stringify(freshProducts));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'offers' },
        async () => {
          const freshOffers = await fetchOffers(true);
          setOffers(freshOffers);
          localStorage.setItem('lovely_admin_offers', JSON.stringify(freshOffers));
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'coupons' },
        async () => {
          const freshCoupons = await fetchCoupons();
          if (freshCoupons && freshCoupons.length > 0) {
            setCoupons(freshCoupons);
            localStorage.setItem('lovely_admin_coupons', JSON.stringify(freshCoupons));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'categories' },
        async () => {
          const freshCategories = await fetchCategories();
          if (freshCategories && freshCategories.length > 0) {
            setCategories(freshCategories);
            localStorage.setItem('lovely_admin_categories', JSON.stringify(freshCategories));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'brands' },
        async () => {
          const freshBrands = await fetchBrands();
          if (freshBrands && freshBrands.length > 0) {
            setBrands(freshBrands);
            localStorage.setItem('lovely_admin_brands', JSON.stringify(freshBrands));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'store_settings' },
        async () => {
          const freshSettings = await fetchStoreSettings();
          if (freshSettings) {
            setSettings(freshSettings);
            localStorage.setItem('lovely_admin_settings', JSON.stringify(freshSettings));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // --------------------------------------------------------------------------
  // Product Actions
  // --------------------------------------------------------------------------
  const addProduct = async (newProd: Omit<Product, 'id'>): Promise<Product | null> => {
    const created = await createProductInDatabase(newProd);
    if (created) {
      setProducts((prev) => {
        const updated = [created, ...prev];
        localStorage.setItem('lovely_admin_products', JSON.stringify(updated));
        return updated;
      });
      return created;
    }
    return null;
  };

  const updateProduct = async (id: string, updatedFields: Partial<Product>): Promise<boolean> => {
    setProducts((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p));
      localStorage.setItem('lovely_admin_products', JSON.stringify(updated));
      return updated;
    });

    if (id.length === 36) {
      return await updateProductInDatabase(id, updatedFields);
    }
    return true;
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      localStorage.setItem('lovely_admin_products', JSON.stringify(updated));
      return updated;
    });

    if (id.length === 36) {
      return await deleteProductInDatabase(id);
    }
    return true;
  };

  const toggleProductStatus = async (id: string): Promise<boolean> => {
    const target = products.find((p) => p.id === id);
    if (!target) return false;
    const newStatus = !target.isActive;

    setProducts((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, isActive: newStatus } : p));
      localStorage.setItem('lovely_admin_products', JSON.stringify(updated));
      return updated;
    });

    if (id.length === 36) {
      return await updateProductInDatabase(id, { isActive: newStatus });
    }
    return true;
  };

  const updateStock = async (
    productId: string,
    newStock: number,
    reason: string = 'تعديل يدوي للمخزون'
  ): Promise<boolean> => {
    const clampedStock = Math.max(0, newStock);
    setProducts((prev) => {
      const updated = prev.map((p) =>
        p.id === productId ? { ...p, stock: clampedStock } : p
      );
      localStorage.setItem('lovely_admin_products', JSON.stringify(updated));
      return updated;
    });

    if (productId.length === 36) {
      return await updateStockInDatabase(productId, clampedStock, reason);
    }
    return true;
  };

  // --------------------------------------------------------------------------
  // Order Actions
  // --------------------------------------------------------------------------
  const addOrder = async (orderData: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    items: Order['items'];
    subtotal: number;
    discount: number;
    total: number;
    status?: string;
    notes?: string;
  }): Promise<Order> => {
    const createdOrder = await createOrderInDatabase(orderData);

    setOrders((prev) => {
      const updated = [createdOrder, ...prev];
      localStorage.setItem('lovely_admin_orders', JSON.stringify(updated));
      return updated;
    });

    // Update customer history in state
    setCustomers((prev) => {
      const existing = prev.find((c) => c.phone === orderData.customerPhone);
      let updatedCustomers: Customer[];
      if (existing) {
        updatedCustomers = prev.map((c) =>
          c.phone === orderData.customerPhone
            ? {
                ...c,
                totalOrders: c.totalOrders + 1,
                totalSpent: c.totalSpent + orderData.total,
                lastOrderDate: new Date().toISOString().split('T')[0],
              }
            : c
        );
      } else {
        updatedCustomers = [
          {
            id: `cust-${Date.now()}`,
            name: orderData.customerName,
            phone: orderData.customerPhone,
            address: orderData.customerAddress,
            totalOrders: 1,
            totalSpent: orderData.total,
            lastOrderDate: new Date().toISOString().split('T')[0],
          },
          ...prev,
        ];
      }
      localStorage.setItem('lovely_admin_customers', JSON.stringify(updatedCustomers));
      return updatedCustomers;
    });

    // Deduct stock in local products state
    setProducts((prev) =>
      prev.map((p) => {
        const item = orderData.items.find((it) => it.productId === p.id);
        if (item) {
          return { ...p, stock: Math.max(0, p.stock - item.quantity) };
        }
        return p;
      })
    );

    return createdOrder;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<boolean> => {
    setOrders((prev) => {
      const updated = prev.map((o) => (o.id === orderId ? { ...o, status } : o));
      localStorage.setItem('lovely_admin_orders', JSON.stringify(updated));
      return updated;
    });

    if (orderId.length === 36) {
      return await updateOrderStatusInDatabase(orderId, status);
    }
    return true;
  };

  const deleteOrder = async (orderId: string): Promise<boolean> => {
    setOrders((prev) => {
      const updated = prev.filter((o) => o.id !== orderId);
      localStorage.setItem('lovely_admin_orders', JSON.stringify(updated));
      return updated;
    });

    if (orderId.length === 36) {
      return await deleteOrderInDatabase(orderId);
    }
    return true;
  };

  // --------------------------------------------------------------------------
  // Category Actions
  // --------------------------------------------------------------------------
  const addCategory = async (
    categoryData: Omit<Category, 'id' | 'productCount'>
  ): Promise<string | null> => {
    const newId = await createCategoryInDatabase(categoryData);
    const cat: Category = {
      ...categoryData,
      id: newId || `cat-${Date.now()}`,
      productCount: 0,
    };
    setCategories((prev) => {
      const updated = [...prev, cat];
      localStorage.setItem('lovely_admin_categories', JSON.stringify(updated));
      return updated;
    });
    return newId;
  };

  const updateCategory = async (id: string, updatedFields: Partial<Category>): Promise<boolean> => {
    setCategories((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c));
      localStorage.setItem('lovely_admin_categories', JSON.stringify(updated));
      return updated;
    });

    if (id.length === 36) {
      return await updateCategoryInDatabase(id, updatedFields);
    }
    return true;
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    setCategories((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      localStorage.setItem('lovely_admin_categories', JSON.stringify(updated));
      return updated;
    });

    if (id.length === 36) {
      return await deleteCategoryInDatabase(id);
    }
    return true;
  };

  // --------------------------------------------------------------------------
  // Brand Actions
  // --------------------------------------------------------------------------
  const addBrand = async (brandData: Omit<Brand, 'id' | 'productCount'>): Promise<string | null> => {
    const newId = await createBrandInDatabase(brandData);
    const br: Brand = {
      ...brandData,
      id: newId || `brand-${Date.now()}`,
      productCount: 0,
    };
    setBrands((prev) => {
      const updated = [...prev, br];
      localStorage.setItem('lovely_admin_brands', JSON.stringify(updated));
      return updated;
    });
    return newId;
  };

  const updateBrand = async (id: string, updatedFields: Partial<Brand>): Promise<boolean> => {
    setBrands((prev) => {
      const updated = prev.map((b) => (b.id === id ? { ...b, ...updatedFields } : b));
      localStorage.setItem('lovely_admin_brands', JSON.stringify(updated));
      return updated;
    });

    if (id.length === 36) {
      return await updateBrandInDatabase(id, updatedFields);
    }
    return true;
  };

  const deleteBrand = async (id: string): Promise<boolean> => {
    setBrands((prev) => {
      const updated = prev.filter((b) => b.id !== id);
      localStorage.setItem('lovely_admin_brands', JSON.stringify(updated));
      return updated;
    });

    if (id.length === 36) {
      return await deleteBrandInDatabase(id);
    }
    return true;
  };

  // --------------------------------------------------------------------------
  // Coupon Actions
  // --------------------------------------------------------------------------
  const addCoupon = async (
    couponData: Omit<Coupon, 'id' | 'usageCount'>
  ): Promise<string | null> => {
    const newId = await createCouponInDatabase(couponData);
    const newCoupon: Coupon = {
      ...couponData,
      id: newId || `coupon-${Date.now()}`,
      usageCount: 0,
    };
    setCoupons((prev) => {
      const updated = [newCoupon, ...prev];
      localStorage.setItem('lovely_admin_coupons', JSON.stringify(updated));
      return updated;
    });
    return newId;
  };

  const toggleCoupon = async (id: string): Promise<boolean> => {
    const target = coupons.find((c) => c.id === id);
    if (!target) return false;
    const newStatus = !target.isActive;

    setCoupons((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, isActive: newStatus } : c));
      localStorage.setItem('lovely_admin_coupons', JSON.stringify(updated));
      return updated;
    });

    if (id.length === 36) {
      return await toggleCouponInDatabase(id, newStatus);
    }
    return true;
  };

  const deleteCoupon = async (id: string): Promise<boolean> => {
    setCoupons((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      localStorage.setItem('lovely_admin_coupons', JSON.stringify(updated));
      return updated;
    });

    if (id.length === 36) {
      return await deleteCouponInDatabase(id);
    }
    return true;
  };

  // --------------------------------------------------------------------------
  // Offer Actions
  // --------------------------------------------------------------------------
  const addOffer = async (
    offerData: Omit<Offer, 'id' | 'createdAt'>
  ): Promise<string | null> => {
    const newId = await createOfferInDatabase(offerData);
    const newOffer: Offer = {
      ...offerData,
      id: newId || `offer-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setOffers((prev) => {
      const updated = [newOffer, ...prev];
      localStorage.setItem('lovely_admin_offers', JSON.stringify(updated));
      return updated;
    });
    return newId;
  };

  const updateOffer = async (id: string, updatedFields: Partial<Offer>): Promise<boolean> => {
    setOffers((prev) => {
      const updated = prev.map((o) => (o.id === id ? { ...o, ...updatedFields } : o));
      localStorage.setItem('lovely_admin_offers', JSON.stringify(updated));
      return updated;
    });

    if (id.length === 36) {
      return await updateOfferInDatabase(id, updatedFields);
    }
    return true;
  };

  const toggleOffer = async (id: string): Promise<boolean> => {
    const target = offers.find((o) => o.id === id);
    if (!target) return false;
    const newStatus = !target.isActive;

    setOffers((prev) => {
      const updated = prev.map((o) => (o.id === id ? { ...o, isActive: newStatus } : o));
      localStorage.setItem('lovely_admin_offers', JSON.stringify(updated));
      return updated;
    });

    if (id.length === 36) {
      return await toggleOfferInDatabase(id, newStatus);
    }
    return true;
  };

  const deleteOffer = async (id: string): Promise<boolean> => {
    setOffers((prev) => {
      const updated = prev.filter((o) => o.id !== id);
      localStorage.setItem('lovely_admin_offers', JSON.stringify(updated));
      return updated;
    });

    if (id.length === 36) {
      return await deleteOfferInDatabase(id);
    }
    return true;
  };

  // --------------------------------------------------------------------------
  // Settings Actions
  // --------------------------------------------------------------------------
  const updateSettings = async (updated: Partial<StoreSettings>): Promise<boolean> => {
    setSettings((prev) => {
      const newSettings = { ...prev, ...updated };
      localStorage.setItem('lovely_admin_settings', JSON.stringify(newSettings));
      return newSettings;
    });

    return await updateStoreSettingsInDatabase(updated);
  };

  return (
    <AdminDataContext.Provider
      value={{
        products,
        orders,
        categories,
        brands,
        customers,
        coupons,
        offers,
        settings,
        isLoading,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductStatus,
        updateStock,
        addOrder,
        updateOrderStatus,
        deleteOrder,
        addCategory,
        updateCategory,
        deleteCategory,
        addBrand,
        updateBrand,
        deleteBrand,
        addCoupon,
        toggleCoupon,
        deleteCoupon,
        addOffer,
        updateOffer,
        toggleOffer,
        deleteOffer,
        updateSettings,
        refreshData,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
};
