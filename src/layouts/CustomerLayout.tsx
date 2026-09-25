import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/customer/Header';
import { Footer } from '../components/customer/Footer';
import { CartDrawer } from '../components/customer/CartDrawer';
import { OfferPopup } from '../components/customer/OfferPopup';
import { SEO } from '../components/common/SEO';
import { useLanguage } from '../i18n';

export const CustomerLayout: React.FC = () => {
  const { dir } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface antialiased" dir={dir}>
      <SEO />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <OfferPopup />
    </div>
  );
};
