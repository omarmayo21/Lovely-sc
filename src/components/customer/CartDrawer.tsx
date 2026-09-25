import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Button } from '../common/Button';
import { useTranslation } from '../../i18n';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    removeFromCart,
    updateQuantity,
    totalItems,
    subtotal,
    discount,
    total,
  } = useCart();
  const { t, language, dir, isRTL } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isCartDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartDrawerOpen]);

  if (!isCartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in" dir={dir}>
      <div
        className="absolute inset-0 bg-primary/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className={`fixed inset-y-0 ${isRTL ? 'left-0' : 'right-0'} max-w-full flex ${isRTL ? 'pl-0 animate-slide-right' : 'pr-0 animate-slide-left'}`}>
        <div className={`w-screen max-w-md bg-white ${isRTL ? 'border-r' : 'border-l'} border-outline-variant shadow-2xl flex flex-col`}>
          {/* Header */}
          <div className="p-5 border-b border-outline-variant/60 flex items-center justify-between bg-cream/50">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-secondary" />
              <h2 className="text-base font-serif font-bold text-primary">
                {t('cart.title')} ({totalItems})
              </h2>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 text-on-surface-muted hover:text-primary hover:bg-white rounded-lg transition-colors"
              aria-label={t('common.cancel')}
            >
              <X size={18} />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 text-on-surface-muted">
                <div className="w-16 h-16 rounded-full bg-cream flex items-center justify-center text-secondary">
                  <ShoppingBag size={28} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-primary">{t('cart.emptyTitle')}</h3>
                  <p className="text-xs text-on-surface-muted mt-1">
                    {t('cart.emptySubtitle')}
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigate('/shop');
                  }}
                  variant="primary"
                  size="sm"
                >
                  {t('cart.startShopping')}
                </Button>
              </div>
            ) : (
              items.map((item) => {
                const price = item.product.discountPrice ?? item.product.price;
                const displayName =
                  language === 'en' && item.product.englishName
                    ? item.product.englishName
                    : item.product.name;

                return (
                  <div
                    key={item.product.id}
                    className="flex gap-3.5 p-3 rounded-xl border border-outline-variant/60 bg-surface-container-low/40"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={displayName}
                      className="w-16 h-16 object-contain rounded-lg bg-white p-1 border border-outline-variant/40 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-semibold text-secondary block">
                          {item.product.brand}
                        </span>
                        <Link
                          to={`/product/${item.product.id}`}
                          onClick={() => setIsCartDrawerOpen(false)}
                          className="text-xs font-medium text-primary hover:text-secondary line-clamp-1"
                        >
                          {displayName}
                        </Link>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Stepper */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center border border-outline-variant rounded-lg bg-white">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 hover:text-secondary text-primary transition-colors"
                              aria-label="Decrease"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="px-2 text-xs font-bold text-primary min-w-[24px] text-center">
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
                              className={`p-1 transition-colors ${
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
                              <Plus size={13} />
                            </button>
                          </div>

                          {item.quantity >= item.product.stock && (
                            <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                              Max
                            </span>
                          )}
                        </div>

                        {/* Price & Delete */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-primary">
                            {price * item.quantity} {t('common.egp')}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-on-surface-muted hover:text-red-600 transition-colors p-1"
                            title={t('cart.removeItem')}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-outline-variant/60 bg-cream/30 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-on-surface-variant">
                  <span>{t('cart.subtotal')}</span>
                  <span className="font-semibold text-primary">{subtotal} {t('common.egp')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-secondary">
                    <span>{t('cart.discount')}</span>
                    <span className="font-semibold">-{discount} {t('common.egp')}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-primary pt-2 border-t border-outline-variant/50">
                  <span>{t('cart.total')}</span>
                  <span className="text-base text-primary">{total} {t('common.egp')}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigate('/checkout');
                  }}
                  variant="primary"
                  className="w-full justify-between"
                  icon={isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                >
                  <span>{t('cart.checkout')}</span>
                  <span className="font-bold">{total} {t('common.egp')}</span>
                </Button>

                <Button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigate('/cart');
                  }}
                  variant="outline"
                  className="w-full text-xs"
                >
                  {t('cart.title')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
