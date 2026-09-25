import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAdminData } from '../../context/AdminDataContext';
import { Button } from '../../components/common/Button';
import { ProductCard } from '../../components/customer/ProductCard';
import { useTranslation } from '../../i18n';

export const CartPage: React.FC = () => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    discount,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const { products } = useAdminData();
  const { t, language, isRTL } = useTranslation();
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ success: boolean; text: string } | null>(null);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = await applyCoupon(couponInput);
    setCouponMessage({ success: res.success, text: res.message });
  };

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  // Cross-sell products
  const crossSellProducts = products
    .filter((p) => !items.some((item) => item.product.id === p.id) && p.isActive)
    .slice(0, 3);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-cream flex items-center justify-center mx-auto text-secondary">
          <ShoppingBag size={36} />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-serif font-bold text-primary">{t('cart.emptyTitle')}</h1>
          <p className="text-xs sm:text-sm text-on-surface-muted max-w-md mx-auto">
            {t('cart.emptySubtitle')}
          </p>
        </div>
        <Link to="/shop">
          <Button variant="primary" size="lg" icon={<ArrowIcon size={18} />}>
            {t('cart.startShopping')}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="border-b border-outline-variant/60 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-primary">
            {t('cart.title')}
          </h1>
          <p className="text-xs text-on-surface-muted mt-1">
            {isRTL
              ? 'راجعي المنتجات والكميات قبل الانتقال إلى خطوة إتمام الطلب'
              : 'Review your items and quantities before proceeding to checkout'}
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-red-600 hover:underline font-semibold flex items-center gap-1"
        >
          <Trash2 size={14} />
          <span>{isRTL ? 'تفريغ السلة بالكامل' : 'Clear All Items'}</span>
        </button>
      </div>

      {/* Main Grid: Items Table + Summary Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-outline-variant overflow-hidden shadow-sm">
            <div className="divide-y divide-outline-variant/60">
              {items.map((item) => {
                const price = item.product.discountPrice ?? item.product.price;
                const displayName =
                  language === 'en' && item.product.englishName
                    ? item.product.englishName
                    : item.product.name;

                return (
                  <div
                    key={item.product.id}
                    className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-start"
                  >
                    {/* Image & Info */}
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <img
                        src={item.product.images[0]}
                        alt={displayName}
                        className="w-20 h-20 object-contain rounded-xl bg-oatmeal/50 p-2 border border-outline-variant/60 flex-shrink-0"
                      />
                      <div className="min-w-0 space-y-1">
                        <span className="text-[11px] font-semibold text-secondary">
                          {item.product.brand}
                        </span>
                        <Link
                          to={`/product/${item.product.id}`}
                          className="block text-sm font-semibold text-primary hover:text-secondary line-clamp-2 leading-snug"
                        >
                          {displayName}
                        </Link>
                        <span className="text-xs text-on-surface-muted block">
                          {isRTL ? 'سعر العبوة:' : 'Unit Price:'} <strong>{price} {t('common.egp')}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Stepper & Total */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-outline-variant/40">
                      <div className="flex items-center gap-3">
                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-outline-variant rounded-xl bg-surface-container-low p-1">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1.5 hover:text-secondary text-primary transition-colors"
                            aria-label="Decrease"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 text-xs font-bold text-primary min-w-[28px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            disabled={item.quantity >= item.product.stock}
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                Math.min(item.product.stock, item.quantity + 1)
                              )
                            }
                            className={`p-1.5 transition-colors ${
                              item.quantity >= item.product.stock
                                ? 'opacity-30 cursor-not-allowed text-on-surface-muted'
                                : 'hover:text-secondary text-primary'
                            }`}
                            aria-label="Increase"
                            title={
                              item.quantity >= item.product.stock
                                ? t('product.piecesLeft')
                                : 'Increase'
                            }
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {item.quantity >= item.product.stock && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                            Max ({item.product.stock})
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        {/* Total for item */}
                        <div className="text-start font-bold text-sm text-primary min-w-[70px]">
                          {price * item.quantity} {t('common.egp')}
                        </div>

                        {/* Delete */}
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-on-surface-muted hover:text-red-600 p-2 transition-colors rounded-lg hover:bg-surface-container-low"
                          title={t('cart.removeItem')}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <Link to="/shop">
              <Button variant="outline" size="sm" icon={<ArrowIcon size={15} />}>
                {t('cart.continueShopping')}
              </Button>
            </Link>
          </div>
        </div>

        {/* Order Summary Card from Stitch (screen_4.html) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-outline-variant p-6 shadow-soft-sm space-y-6 text-start sticky top-24">
            <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/60">
              <Sparkles size={18} className="text-secondary" />
              <h2 className="text-base font-serif font-bold text-primary">{t('cart.orderSummary')}</h2>
            </div>

            {/* Coupon Code Input */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-primary">
                {t('cart.couponCode')}
              </label>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-tertiary-container/60 border border-tertiary/30 text-xs">
                  <div className="flex items-center gap-2 text-tertiary-dark font-bold">
                    <CheckCircle2 size={16} />
                    <span>{appliedCoupon.code} (-{appliedCoupon.discountPercentage}%)</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-red-600 hover:underline font-semibold text-[11px]"
                  >
                    {t('cart.removeCoupon')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="LOVELY10"
                    className="flex-1 bg-surface-container-low text-xs text-primary px-3.5 py-2.5 rounded-xl border border-outline-variant focus:outline-none focus:border-secondary"
                  />
                  <Button type="submit" variant="secondary" size="sm">
                    {t('cart.applyCoupon')}
                  </Button>
                </form>
              )}
              {couponMessage && (
                <p className={`text-[11px] font-medium ${couponMessage.success ? 'text-emerald-600' : 'text-red-600'}`}>
                  {couponMessage.text}
                </p>
              )}
            </div>

            {/* Calculations */}
            <div className="space-y-2.5 pt-4 border-t border-outline-variant/60 text-xs">
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
                <span className="text-xl font-serif text-primary">{total} {t('common.egp')}</span>
              </div>
            </div>

            {/* Proceed to Checkout Button */}
            <Button
              onClick={() => navigate('/checkout')}
              variant="primary"
              size="lg"
              className="w-full justify-between"
              icon={<ArrowIcon size={18} />}
            >
              <span>{t('cart.checkout')}</span>
              <span className="font-bold">{total} {t('common.egp')}</span>
            </Button>

            {/* Security Guarantee */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-on-surface-muted pt-2 border-t border-outline-variant/50">
              <ShieldCheck size={14} className="text-tertiary" />
              <span>{t('checkout.cashOnDelivery')} • {t('checkout.secureCheckoutGuarantee')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cross-Sell Recommendations from Stitch (screen_4.html) */}
      {crossSellProducts.length > 0 && (
        <section className="pt-8 border-t border-outline-variant/60 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif font-bold text-primary">
              {isRTL ? 'منتجات مكملة ومحبوبة لسلتكِ ✨' : 'Recommended Skincare Additions ✨'}
            </h2>
            <Link to="/shop" className="text-xs font-bold text-secondary hover:underline flex items-center gap-1">
              <span>{t('common.viewAll')}</span>
              {isRTL ? <ArrowLeft size={12} /> : <ArrowRight size={12} />}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {crossSellProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
