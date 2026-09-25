import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { CustomerLayout } from '../layouts/CustomerLayout';
import { AdminLayout } from '../layouts/AdminLayout';

// Elegant Loading Fallback
const PageLoader: React.FC = () => (
  <div className="min-h-[60vh] flex items-center justify-center p-8">
    <div className="flex flex-col items-center gap-3 animate-fade-in">
      <div className="w-9 h-9 rounded-full border-2 border-secondary/20 border-t-secondary animate-spin" />
      <span className="text-xs text-on-surface-muted font-medium tracking-wide">Lovely SkinCare...</span>
    </div>
  </div>
);

// Customer Pages (Lazy Loaded)
const HomePage = lazy(() => import('../pages/customer/HomePage').then(m => ({ default: m.HomePage })));
const ShopPage = lazy(() => import('../pages/customer/ShopPage').then(m => ({ default: m.ShopPage })));
const ProductDetailPage = lazy(() => import('../pages/customer/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })));
const CategoryPage = lazy(() => import('../pages/customer/CategoryPage').then(m => ({ default: m.CategoryPage })));
const BrandPage = lazy(() => import('../pages/customer/BrandPage').then(m => ({ default: m.BrandPage })));
const CategoriesPage = lazy(() => import('../pages/customer/CategoriesPage').then(m => ({ default: m.CategoriesPage })));
const BrandsPage = lazy(() => import('../pages/customer/BrandsPage').then(m => ({ default: m.BrandsPage })));
const CartPage = lazy(() => import('../pages/customer/CartPage').then(m => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import('../pages/customer/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const OrderSuccessPage = lazy(() => import('../pages/customer/OrderSuccessPage').then(m => ({ default: m.OrderSuccessPage })));

// Admin Pages (Lazy Loaded)
const AdminLoginPage = lazy(() => import('../pages/admin/AdminLoginPage').then(m => ({ default: m.AdminLoginPage })));
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const AdminAnalyticsPage = lazy(() => import('../pages/admin/AdminAnalyticsPage').then(m => ({ default: m.AdminAnalyticsPage })));
const AdminOrdersPage = lazy(() => import('../pages/admin/AdminOrdersPage').then(m => ({ default: m.AdminOrdersPage })));
const AdminProductsPage = lazy(() => import('../pages/admin/AdminProductsPage').then(m => ({ default: m.AdminProductsPage })));
const AdminAddProductPage = lazy(() => import('../pages/admin/AdminAddProductPage').then(m => ({ default: m.AdminAddProductPage })));
const AdminEditProductPage = lazy(() => import('../pages/admin/AdminEditProductPage').then(m => ({ default: m.AdminEditProductPage })));
const AdminOffersPage = lazy(() => import('../pages/admin/AdminOffersPage').then(m => ({ default: m.AdminOffersPage })));
const AdminCategoriesPage = lazy(() => import('../pages/admin/AdminCategoriesPage').then(m => ({ default: m.AdminCategoriesPage })));
const AdminBrandsPage = lazy(() => import('../pages/admin/AdminBrandsPage').then(m => ({ default: m.AdminBrandsPage })));
const AdminCustomersPage = lazy(() => import('../pages/admin/AdminCustomersPage').then(m => ({ default: m.AdminCustomersPage })));
const AdminInventoryPage = lazy(() => import('../pages/admin/AdminInventoryPage').then(m => ({ default: m.AdminInventoryPage })));
const AdminCouponsPage = lazy(() => import('../pages/admin/AdminCouponsPage').then(m => ({ default: m.AdminCouponsPage })));
const AdminMarketingPage = lazy(() => import('../pages/admin/AdminMarketingPage').then(m => ({ default: m.AdminMarketingPage })));
const AdminSettingsPage = lazy(() => import('../pages/admin/AdminSettingsPage').then(m => ({ default: m.AdminSettingsPage })));

export const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Customer Routes with CustomerLayout */}
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/brands" element={<BrandsPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/brand/:slug" element={<BrandPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
        </Route>

        {/* Admin Auth */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Admin Dashboard Routes with AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="products/new" element={<AdminAddProductPage />} />
          <Route path="products/:id/edit" element={<AdminEditProductPage />} />
          <Route path="offers" element={<AdminOffersPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="brands" element={<AdminBrandsPage />} />
          <Route path="customers" element={<AdminCustomersPage />} />
          <Route path="inventory" element={<AdminInventoryPage />} />
          <Route path="coupons" element={<AdminCouponsPage />} />
          <Route path="marketing" element={<AdminMarketingPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};
