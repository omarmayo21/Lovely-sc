import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Receipt,
  User,
  Phone,
  MapPin,
  ShoppingBag,
  MessageCircle,
  ArrowLeft,
  ArrowRight,
  Store,
} from 'lucide-react';
import { Order } from '../../types';
import { useAdminData } from '../../context/AdminDataContext';
import { Button } from '../../components/common/Button';
import { trackPurchase } from '../../services/analyticsService';
import { useTranslation } from '../../i18n';

export const OrderSuccessPage: React.FC = () => {
  const location = useLocation();
  const { settings, orders } = useAdminData();
  const { t, isRTL } = useTranslation();

  // Get order from router navigation state or fallback to latest order
  const order: Order | undefined =
    location.state?.order || (orders.length > 0 ? orders[0] : undefined);

  // Trigger Authoritative Purchase Event (with sessionStorage deduplication)
  useEffect(() => {
    if (order && order.id) {
      trackPurchase(order);
    }
  }, [order?.id]);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-primary">{t('orderSuccess.noRecentOrder')}</h2>
        <Link to="/shop">
          <Button variant="primary" size="md">
            {t('nav.shop')}
          </Button>
        </Link>
      </div>
    );
  }

  const whatsappMessage = encodeURIComponent(
    isRTL
      ? `مرحباً، أود متابعة طلبي رقم: ${order.orderNumber}\nالاسم: ${order.customerName}\nالهاتف: ${order.customerPhone}\nالإجمالي: ${order.total} ج.م`
      : `Hello, I would like to track my order #${order.orderNumber}\nName: ${order.customerName}\nPhone: ${order.customerPhone}\nTotal: ${order.total} EGP`
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-start">
      {/* Confirmation Header from Stitch (screen_6.html) */}
      <div className="bg-white rounded-3xl border border-outline-variant p-8 md:p-10 shadow-soft-sm text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm animate-scale-up">
          <CheckCircle2 size={40} />
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-bold text-tertiary-dark bg-tertiary-container px-3 py-1 rounded-full">
            {t('orderSuccess.receivedBadge')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-primary pt-2">
            {t('orderSuccess.title')}
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-muted max-w-md mx-auto">
            {t('orderSuccess.subtitle')}
          </p>
        </div>

        {/* Order ID Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cream border border-outline-variant/80 text-sm font-bold text-primary">
          <Receipt size={16} className="text-secondary" />
          <span>{t('orderSuccess.orderNumber')} <strong className="font-mono text-secondary text-base">{order.orderNumber}</strong></span>
        </div>
      </div>

      {/* Order Summary & Customer Recap Card */}
      <div className="bg-white rounded-3xl border border-outline-variant p-6 sm:p-8 shadow-soft-sm space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/60">
          <Receipt size={18} className="text-secondary" />
          <h2 className="text-base font-serif font-bold text-primary">{t('orderSuccess.orderDetails')}</h2>
        </div>

        {/* Customer Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-surface-container-low/60 p-4 rounded-2xl border border-outline-variant/40">
          <div className="space-y-1">
            <span className="text-on-surface-muted flex items-center gap-1.5 font-medium">
              <User size={13} className="text-secondary" />
              <span>{t('orderSuccess.customerName')}</span>
            </span>
            <p className="font-bold text-primary">{order.customerName}</p>
          </div>

          <div className="space-y-1">
            <span className="text-on-surface-muted flex items-center gap-1.5 font-medium">
              <Phone size={13} className="text-secondary" />
              <span>{t('orderSuccess.customerPhone')}</span>
            </span>
            <p className="font-bold text-primary" dir="ltr">{order.customerPhone}</p>
          </div>

          <div className="sm:col-span-2 space-y-1 pt-2 border-t border-outline-variant/40">
            <span className="text-on-surface-muted flex items-center gap-1.5 font-medium">
              <MapPin size={13} className="text-secondary" />
              <span>{t('orderSuccess.deliveryAddress')}</span>
            </span>
            <p className="font-semibold text-primary">{order.customerAddress}</p>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-primary">{t('orderSuccess.orderedItems')}</h3>
          <div className="divide-y divide-outline-variant/50">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.image}
                    alt=""
                    className="w-12 h-12 object-contain rounded-lg bg-oatmeal/60 p-1 border border-outline-variant/40 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] text-secondary font-semibold block">{item.brand}</span>
                    <p className="font-bold text-primary truncate max-w-sm">{item.name}</p>
                    <span className="text-on-surface-muted text-[11px]">{isRTL ? 'الكمية:' : 'Qty:'} {item.quantity}</span>
                  </div>
                </div>
                <span className="font-bold text-primary text-xs flex-shrink-0">
                  {item.price * item.quantity} {t('common.egp')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="pt-4 border-t border-outline-variant/60 space-y-2 text-xs">
          <div className="flex justify-between text-on-surface-variant">
            <span>{t('cart.subtotal')}</span>
            <span className="font-semibold">{order.subtotal} {t('common.egp')}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-secondary font-semibold">
              <span>{t('cart.discount')}</span>
              <span>-{order.discount} {t('common.egp')}</span>
            </div>
          )}
          <div className="flex justify-between items-baseline pt-3 border-t border-outline-variant text-base font-bold text-primary">
            <span>{t('cart.total')}</span>
            <span className="text-2xl font-serif text-primary">{order.total} {t('common.egp')}</span>
          </div>
        </div>
      </div>

      {/* WhatsApp & Store Actions */}
      <div className="space-y-3">
        <a
          href={`https://wa.me/${settings.whatsappNumber}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-tertiary text-white font-semibold text-sm hover:bg-tertiary-hover transition-colors shadow-sm"
        >
          <MessageCircle size={18} />
          <span>{t('orderSuccess.whatsappFollowUp')}</span>
        </a>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link to="/shop">
            <Button variant="outline" size="md" className="w-full" icon={<ShoppingBag size={16} />}>
              {t('orderSuccess.continueShopping')}
            </Button>
          </Link>
          <Link to="/">
            <Button variant="ghost" size="md" className="w-full" icon={<Store size={16} />}>
              {t('orderSuccess.backToHome')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
