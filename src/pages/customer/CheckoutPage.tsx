import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  User,
  Phone,
  MapPin,
  FileText,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAdminData } from '../../context/AdminDataContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { trackBeginCheckout } from '../../services/analyticsService';
import { useTranslation } from '../../i18n';

export const CheckoutPage: React.FC = () => {
  const { items, subtotal, discount, total, clearCart } = useCart();
  const { addOrder } = useAdminData();
  const { t, language, isRTL } = useTranslation();
  const navigate = useNavigate();

  // Customer Form Fields
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [detailedAddress, setDetailedAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track begin_checkout event on load
  useEffect(() => {
    if (items.length > 0) {
      trackBeginCheckout(items, total);
    }
  }, []);

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  // If cart is empty, redirect to cart or shop
  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-cream flex items-center justify-center mx-auto text-secondary">
          <ShoppingBag size={28} />
        </div>
        <h2 className="text-xl font-serif font-bold text-primary">{t('cart.emptyTitle')}</h2>
        <p className="text-xs text-on-surface-muted">
          {t('cart.emptySubtitle')}
        </p>
        <Link to="/shop">
          <Button variant="primary" size="md">
            {t('nav.shop')}
          </Button>
        </Link>
      </div>
    );
  }

  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = t('checkout.fullNameRequired');
    }

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = t('checkout.phoneRequired');
    } else if (!/^01[0125][0-9]{8}$/.test(phoneNumber.trim().replace(/\s+/g, ''))) {
      newErrors.phoneNumber = t('checkout.phoneInvalid');
    }

    if (!detailedAddress.trim()) {
      newErrors.detailedAddress = t('checkout.addressRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const orderItems = items.map((item) => ({
        productId: item.product.id,
        name: language === 'en' && item.product.englishName ? item.product.englishName : item.product.name,
        brand: item.product.brand,
        price: item.product.discountPrice ?? item.product.price,
        quantity: item.quantity,
        image: item.product.images[0],
      }));

      const createdOrder = await addOrder({
        customerName: fullName.trim(),
        customerPhone: phoneNumber.trim(),
        customerAddress: detailedAddress.trim(),
        items: orderItems,
        subtotal,
        discount,
        total,
        status: 'pending',
        notes: orderNotes.trim() || undefined,
      });

      // Clear the cart
      clearCart();

      // Navigate to order confirmation
      navigate('/order-success', { state: { order: createdOrder } });
    } catch (err: any) {
      console.error('Error creating order:', err);
      setSubmitError(err?.message || t('common.errorOccurred'));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div className="text-start border-b border-outline-variant/60 pb-4">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-primary">
          {t('checkout.title')}
        </h1>
        <p className="text-xs text-on-surface-muted mt-1">
          {t('checkout.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left/Right Customer Information Form */}
        <div className="lg:col-span-7 space-y-6 text-start">
          {/* Customer Personal Details Card */}
          <div className="bg-white rounded-3xl border border-outline-variant p-6 sm:p-8 shadow-soft-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/60">
              <User size={18} className="text-secondary" />
              <h2 className="text-base font-serif font-bold text-primary">{t('checkout.customerInfo')}</h2>
            </div>

            {/* الاسم */}
            <Input
              label={t('checkout.fullName')}
              required
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
              }}
              placeholder={t('checkout.fullNamePlaceholder')}
              icon={<User size={16} />}
              error={errors.fullName}
            />

            {/* رقم الهاتف */}
            <Input
              label={t('checkout.phone')}
              required
              type="tel"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                if (errors.phoneNumber) setErrors((prev) => ({ ...prev, phoneNumber: '' }));
              }}
              placeholder={t('checkout.phonePlaceholder')}
              icon={<Phone size={16} />}
              error={errors.phoneNumber}
              dir="ltr"
              className={isRTL ? 'text-right' : 'text-left'}
              helperText={t('checkout.phoneHelper')}
            />

            {/* العنوان */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-primary">
                {t('checkout.address')} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <textarea
                  rows={3}
                  required
                  value={detailedAddress}
                  onChange={(e) => {
                    setDetailedAddress(e.target.value);
                    if (errors.detailedAddress) setErrors((prev) => ({ ...prev, detailedAddress: '' }));
                  }}
                  placeholder={t('checkout.addressPlaceholder')}
                  className={`w-full bg-white text-primary text-xs sm:text-sm p-3.5 pe-10 rounded-xl border transition-all placeholder:text-on-surface-muted/60 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 ${
                    errors.detailedAddress
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-outline-variant hover:border-outline'
                  }`}
                />
                <MapPin size={16} className="absolute end-3.5 top-3.5 text-on-surface-muted pointer-events-none" />
              </div>
              {errors.detailedAddress && (
                <p className="text-xs text-red-600 font-medium">{errors.detailedAddress}</p>
              )}
            </div>

            {/* ملاحظات إضافية */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-primary">
                {t('checkout.notes')}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder={t('checkout.notesPlaceholder')}
                  className="w-full bg-white text-primary text-xs sm:text-sm px-4 py-3 pe-10 rounded-xl border border-outline-variant hover:border-outline focus:outline-none focus:border-secondary"
                />
                <FileText size={16} className="absolute end-3.5 top-1/2 -translate-y-1/2 text-on-surface-muted pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-cream border border-outline-variant/60 flex items-center gap-3 text-xs text-on-surface-variant">
            <ShieldCheck size={20} className="text-tertiary flex-shrink-0" />
            <p>
              {isRTL
                ? 'جميع المنتجات أصلية 100% ويتم تغليفها بعناية فائقة ضد الكسر والحرارة قبل تسليمها لشركة الشحن.'
                : 'All items are 100% authentic, safely packed with temperature & shock protection before dispatch.'}
            </p>
          </div>
        </div>

        {/* Right/Left Order Breakdown & Submit */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-outline-variant p-6 sm:p-8 shadow-soft-sm space-y-6 text-start sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/60">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-secondary" />
                <h2 className="text-base font-serif font-bold text-primary">{t('checkout.orderReview')}</h2>
              </div>
              <span className="text-xs font-bold text-primary">{items.length} {t('categoriesPage.productCount')}</span>
            </div>

            {/* Order Items Review */}
            <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar pe-1">
              {items.map((item) => {
                const price = item.product.discountPrice ?? item.product.price;
                const displayName =
                  language === 'en' && item.product.englishName
                    ? item.product.englishName
                    : item.product.name;

                return (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between gap-3 text-xs py-2 border-b border-outline-variant/40"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.product.images[0]}
                        alt=""
                        className="w-12 h-12 rounded-lg object-contain bg-oatmeal/50 p-1 border border-outline-variant/40 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] text-secondary font-semibold block">
                          {item.product.brand}
                        </span>
                        <p className="font-semibold text-primary truncate max-w-[170px]">
                          {displayName}
                        </p>
                        <span className="text-on-surface-muted text-[11px]">
                          {isRTL ? 'الكمية:' : 'Qty:'} {item.quantity} × {price} {t('common.egp')}
                        </span>
                      </div>
                    </div>

                    <span className="font-bold text-primary text-xs flex-shrink-0">
                      {price * item.quantity} {t('common.egp')}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 pt-2 border-t border-outline-variant/60 text-xs">
              <div className="flex justify-between text-on-surface-variant">
                <span>{t('cart.subtotal')}</span>
                <span className="font-semibold text-primary">{subtotal} {t('common.egp')}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-secondary font-semibold">
                  <span>{t('cart.discount')}</span>
                  <span>-{discount} {t('common.egp')}</span>
                </div>
              )}

              <div className="flex justify-between items-baseline pt-3 border-t border-outline-variant text-base font-bold text-primary">
                <span>{t('cart.total')}</span>
                <span className="text-2xl font-serif text-primary">{total} {t('common.egp')}</span>
              </div>
            </div>

            {submitError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium leading-relaxed">
                {submitError}
              </div>
            )}

            {/* Confirm Order Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full justify-between"
              isLoading={isSubmitting}
              icon={<ArrowIcon size={18} />}
            >
              <span>{isSubmitting ? t('checkout.processingOrder') : t('checkout.confirmOrder')}</span>
              <span className="font-bold">{total} {t('common.egp')}</span>
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-on-surface-muted pt-2">
              <Lock size={12} className="text-tertiary" />
              <span>{t('checkout.secureCheckoutGuarantee')}</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
