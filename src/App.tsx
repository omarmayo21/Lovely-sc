import React, { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { LanguageProvider } from './i18n';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AdminDataProvider, useAdminData } from './context/AdminDataContext';
import { initAnalytics, trackPageView } from './services/analyticsService';
import { AppRouter } from './routes/AppRouter';

// Scroll to top on route navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Global Analytics Listener for GA4, Meta Pixel, and Microsoft Clarity
const AnalyticsTracker: React.FC = () => {
  const { pathname, search } = useLocation();
  const { settings } = useAdminData();

  // Initialize scripts whenever settings change
  useEffect(() => {
    if (settings) {
      initAnalytics(settings);
    }
  }, [settings]);

  // Track customer page views
  useEffect(() => {
    if (!pathname.startsWith('/admin')) {
      trackPageView(pathname + search, document.title);
    }
  }, [pathname, search]);

  return null;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <AdminDataProvider>
            <CartProvider>
              <ScrollToTop />
              <AnalyticsTracker />
              <AppRouter />
            </CartProvider>
          </AdminDataProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
};

export default App;
