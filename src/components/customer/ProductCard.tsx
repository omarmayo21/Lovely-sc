import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, Check } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { RatingStars } from '../common/RatingStars';
import { useTranslation } from '../../i18n';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, items } = useCart();
  const { t, language, isRTL } = useTranslation();
  const isInCart = items.some((item) => item.product.id === product.id);

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - (product.discountPrice ?? 0)) / product.price) * 100)
    : 0;

  const displayName = language === 'en' && product.englishName ? product.englishName : product.name;

  return (
    <div className="group bg-white rounded-2xl border border-outline-variant hover:border-secondary/50 hover:shadow-card-lift transition-all duration-300 flex flex-col overflow-hidden text-start card-hover-effect">
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] bg-oatmeal/60 overflow-hidden flex items-center justify-center p-4">
        {hasDiscount && (
          <span className="absolute top-3 end-3 z-10 bg-secondary text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
            {isRTL ? `خصم ${discountPercent}%` : `-${discountPercent}%`}
          </span>
        )}
        {product.isNew && !hasDiscount && (
          <span className="absolute top-3 end-3 z-10 bg-tertiary text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
            {t('product.newBadge')} ✨
          </span>
        )}
        {product.volume && (
          <span className="absolute bottom-2.5 end-3 z-10 bg-white/90 backdrop-blur-sm text-primary text-[10px] font-semibold px-2 py-0.5 rounded-md border border-outline-variant/60">
            {product.volume}
          </span>
        )}
        <Link to={`/product/${product.id}`} className="w-full h-full flex items-center justify-center">
          <img
            src={product.images[0]}
            alt={displayName}
            loading="lazy"
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
      </div>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Brand Tag */}
          <div className="flex items-center justify-between mb-1.5">
            <Link
              to={`/brand/${product.brandSlug}`}
              className="text-[11px] font-semibold text-secondary hover:underline"
            >
              {product.brand}
            </Link>
            <RatingStars rating={product.rating} showText={false} size={12} />
          </div>

          {/* Product Title */}
          <Link to={`/product/${product.id}`} className="block group-hover:text-secondary transition-colors">
            <h3 className="font-medium text-sm text-primary line-clamp-2 leading-snug">
              {displayName}
            </h3>
          </Link>
        </div>

        {/* Pricing & Add to Cart Button */}
        <div className="pt-2 border-t border-outline-variant/40 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-primary">
                {product.discountPrice ?? product.price}
              </span>
              <span className="text-[11px] text-on-surface-muted font-medium">
                {t('common.egp')}
              </span>
            </div>
            {hasDiscount && (
              <span className="text-[11px] text-on-surface-muted line-through">
                {product.price} {t('common.egp')}
              </span>
            )}
          </div>

          {product.stock <= 0 ? (
            <span className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1.5 rounded-xl">
              {t('product.outOfStock')}
            </span>
          ) : (
            <button
              onClick={() => addToCart(product)}
              className={`p-2.5 rounded-xl border transition-all duration-200 flex items-center justify-center ${
                isInCart
                  ? 'bg-tertiary-container text-tertiary-dark border-tertiary/30'
                  : 'bg-primary text-white border-transparent hover:bg-primary-hover hover:scale-105'
              }`}
              title={isInCart ? t('product.addedToCart') : t('product.addToCart')}
              aria-label={t('product.addToCart')}
            >
              {isInCart ? <Check size={16} /> : <ShoppingBag size={16} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
