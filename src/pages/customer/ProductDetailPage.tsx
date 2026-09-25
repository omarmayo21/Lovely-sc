import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Check,
  ShieldCheck,
  Sparkles,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Share2,
  Plus,
  Minus,
  MessageCircle,
  Truck,
  Droplets,
  Sun,
  Flame,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { useCart } from '../../context/CartContext';
import { RatingStars } from '../../components/common/RatingStars';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { ProductCard } from '../../components/customer/ProductCard';
import { trackViewItem } from '../../services/analyticsService';
import { SEO } from '../../components/common/SEO';
import { useTranslation } from '../../i18n';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, settings } = useAdminData();
  const { addToCart, items } = useCart();
  const { t, language, isRTL } = useTranslation();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === id || p.slug === id);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'routine' | 'howToUse' | 'fullInci'>('ingredients');
  const [isCopied, setIsCopied] = useState(false);

  // Track view_item event on load
  useEffect(() => {
    if (product) {
      trackViewItem(product);
    }
  }, [product?.id]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-primary">{t('product.notFound')}</h2>
        <p className="text-xs text-on-surface-muted">{t('product.notFoundDesc')}</p>
        <Link to="/shop">
          <Button variant="primary" size="md">
            {t('product.backToShop')}
          </Button>
        </Link>
      </div>
    );
  }

  const displayName = language === 'en' && product.englishName ? product.englishName : product.name;
  const isInCart = items.some((item) => item.product.id === product.id);
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const price = product.discountPrice ?? product.price;

  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.categorySlug === product.categorySlug || p.brandSlug === product.brandSlug))
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: displayName,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <SEO title={displayName} description={product.description} image={product.images[0]} />
      {/* Breadcrumb from Stitch (screen_8.html) */}
      <nav className="flex items-center gap-2 text-xs text-on-surface-muted flex-wrap">
        <Link to="/" className="hover:text-primary transition-colors">{t('nav.home')}</Link>
        <ChevronIcon size={13} />
        <Link to="/shop" className="hover:text-primary transition-colors">{t('nav.shop')}</Link>
        <ChevronIcon size={13} />
        <Link to={`/category/${product.categorySlug}`} className="hover:text-primary transition-colors">
          {product.category}
        </Link>
        <ChevronIcon size={13} />
        <span className="text-primary font-medium truncate max-w-xs">{displayName}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left/Right Media Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square bg-oatmeal/60 rounded-3xl overflow-hidden p-8 border border-outline-variant flex items-center justify-center">
            {hasDiscount && (
              <Badge variant="secondary" className="absolute top-4 end-4 z-10 shadow-sm">
                {isRTL ? 'خصم خاص' : 'Special Offer'}
              </Badge>
            )}
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={displayName}
              className="w-full h-full object-contain mix-blend-multiply transition-all duration-300"
            />
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl bg-oatmeal/40 border p-2 overflow-hidden transition-all ${
                    selectedImageIndex === idx
                      ? 'border-secondary ring-2 ring-secondary/20 scale-105'
                      : 'border-outline-variant/60 hover:border-outline'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions */}
        <div className="lg:col-span-6 space-y-6 text-start">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Link
                to={`/brand/${product.brandSlug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blush text-primary text-xs font-semibold hover:bg-secondary hover:text-white transition-colors border border-secondary/30"
              >
                <span>{product.brand}</span>
              </Link>
              <button
                onClick={handleShare}
                className="p-2 text-on-surface-muted hover:text-primary rounded-lg hover:bg-surface-container-low transition-colors"
                title={t('product.share')}
              >
                <Share2 size={16} />
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-primary leading-snug">
              {displayName}
            </h1>
            {language === 'ar' && product.englishName && (
              <p className="text-xs text-on-surface-muted italic font-sans" dir="ltr">
                {product.englishName}
              </p>
            )}
          </div>

          {/* Ratings & Stock */}
          <div className="flex flex-wrap items-center gap-4 py-2 border-y border-outline-variant/60 text-xs">
            <RatingStars rating={product.rating} reviewsCount={product.reviewsCount} size={15} />
            <span className="text-outline-variant">|</span>
            {product.stock <= 0 ? (
              <div className="flex items-center gap-1.5 text-red-600 font-bold">
                <span className="w-2 h-2 rounded-full bg-red-600" />
                <span>{t('product.outOfStock')}</span>
              </div>
            ) : product.stock === 1 ? (
              <div className="flex items-center gap-1.5 text-amber-700 font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>{isRTL ? 'متبقي عبوة واحدة فقط بالمخزون!' : 'Only 1 item left in stock!'}</span>
              </div>
            ) : product.stock <= 5 ? (
              <div className="flex items-center gap-1.5 text-amber-700 font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>{isRTL ? `متبقي ${product.stock} عبوات فقط بالمخزون` : `Only ${product.stock} left in stock`}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-tertiary-dark font-medium">
                <Check size={14} className="text-tertiary" />
                <span>{t('product.inStock')} ({product.stock})</span>
              </div>
            )}
            {product.volume && (
              <>
                <span className="text-outline-variant">|</span>
                <span className="text-on-surface-muted font-semibold">{t('product.volume')} {product.volume}</span>
              </>
            )}
          </div>

          {/* Price Box */}
          <div className="bg-cream/70 rounded-2xl p-4 border border-outline-variant/60 flex items-center justify-between">
            <div>
              <span className="text-xs text-on-surface-muted block">{isRTL ? 'السعر الحالي:' : 'Current Price:'}</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-serif font-bold text-primary">{price}</span>
                <span className="text-xs font-semibold text-primary">{t('common.currency')} ({t('common.egp')})</span>
                {hasDiscount && (
                  <span className="text-xs text-on-surface-muted line-through ms-2">
                    {product.price} {t('common.egp')}
                  </span>
                )}
              </div>
            </div>
            <span className="text-xs font-bold text-tertiary-dark bg-tertiary-container px-3 py-1.5 rounded-xl border border-tertiary/20">
              {isRTL ? 'أصلي 100% بالباركود' : '100% Verified Barcode'}
            </span>
          </div>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            {product.description}
          </p>

          {/* Add to Cart & Quantity Stepper */}
          <div className="space-y-3 pt-2">
            {product.stock <= 0 ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold text-center">
                  {isRTL
                    ? 'هذا المنتج غير متوفر حالياً بالمخزون. يمكنكِ طلبه للتوفير الخاص عبر الواتساب.'
                    : 'This product is currently out of stock. You may request special procurement via WhatsApp.'}
                </div>
                <a
                  href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
                    `مرحباً، أود الاستفسار عن موعد توفر المستحضر: ${displayName}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-tertiary/40 bg-tertiary-container/40 text-tertiary-dark hover:bg-tertiary/20 text-xs font-semibold transition-colors"
                >
                  <MessageCircle size={16} />
                  <span>{isRTL ? 'طلب توفير المستحضر عبر الواتساب' : 'Request Item on WhatsApp'}</span>
                </a>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  {/* Stepper */}
                  <div className="flex items-center border border-outline-variant rounded-xl bg-white p-1 shadow-sm">
                    <button
                      type="button"
                      disabled={quantity <= 1}
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className={`p-2 text-primary transition-colors ${
                        quantity <= 1
                          ? 'opacity-30 cursor-not-allowed'
                          : 'hover:text-secondary hover:bg-surface-container-low rounded-lg'
                      }`}
                      aria-label="Decrease"
                    >
                      <Minus size={15} />
                    </button>
                    <span className="px-4 text-sm font-bold text-primary min-w-[36px] text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      disabled={quantity >= product.stock}
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      className={`p-2 text-primary transition-colors ${
                        quantity >= product.stock
                          ? 'opacity-30 cursor-not-allowed'
                          : 'hover:text-secondary hover:bg-surface-container-low rounded-lg'
                      }`}
                      aria-label="Increase"
                    >
                      <Plus size={15} />
                    </button>
                  </div>

                  {/* Add Button */}
                  <Button
                    onClick={handleAddToCart}
                    variant="primary"
                    size="lg"
                    className="flex-1"
                    icon={isInCart ? <Check size={18} /> : <ShoppingBag size={18} />}
                  >
                    {isInCart
                      ? t('product.addedToCart')
                      : `${t('product.addToCart')} (${price * quantity} ${t('common.egp')})`}
                  </Button>
                </div>

                {quantity >= product.stock && (
                  <p className="text-[11px] text-amber-700 font-medium">
                    {isRTL
                      ? `وصلتِ للحد الأقصى المتاح بالمخزون حالياً (${product.stock} عبوة).`
                      : `Maximum available stock reached (${product.stock} units).`}
                  </p>
                )}

                {/* Quick WhatsApp Order */}
                <a
                  href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
                    `مرحباً، أود طلب المنتج: ${displayName} (عدد: ${quantity})`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-tertiary/40 bg-tertiary-container/40 text-tertiary-dark hover:bg-tertiary/20 text-xs font-semibold transition-colors"
                >
                  <MessageCircle size={16} />
                  <span>{t('product.consultOnWhatsApp')}</span>
                </a>
              </>
            )}
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-outline-variant/60 text-[11px] text-on-surface-variant">
            <div className="flex items-center gap-2 bg-surface-container-low/60 p-2.5 rounded-xl">
              <Truck size={16} className="text-secondary flex-shrink-0" />
              <span>{isRTL ? 'شحن سريع خلال 24 - 48 ساعة' : 'Fast 24-48h Delivery'}</span>
            </div>
            <div className="flex items-center gap-2 bg-surface-container-low/60 p-2.5 rounded-xl">
              <MapPin size={16} className="text-tertiary flex-shrink-0" />
              <span>{isRTL ? 'متاح الاستلام من فرع الموسكي' : 'Muski Branch Pickup'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Formulation & Ritual Tabs from Stitch (screen_8.html) */}
      <section className="bg-white rounded-3xl border border-outline-variant p-6 sm:p-10 shadow-soft-sm space-y-6 text-start">
        {/* Tabs Header */}
        <div className="flex flex-wrap gap-2 border-b border-outline-variant/60 pb-3">
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ingredients'
                ? 'bg-primary text-white shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            {t('product.activeIngredients')}
          </button>
          <button
            onClick={() => setActiveTab('routine')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'routine'
                ? 'bg-primary text-white shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            {isRTL ? 'طقس العناية والترتيب' : 'Routine Step'}
          </button>
          <button
            onClick={() => setActiveTab('howToUse')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'howToUse'
                ? 'bg-primary text-white shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            {t('product.howToUse')}
          </button>
          {product.ingredients && (
            <button
              onClick={() => setActiveTab('fullInci')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'fullInci'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              {t('product.inciList')}
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="pt-2 text-xs sm:text-sm leading-relaxed text-on-surface-variant">
          {activeTab === 'ingredients' && (
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-base text-primary">
                {isRTL ? 'المكونات النقية الفعالة' : 'Key Active Ingredients'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {product.keyIngredients?.map((ing, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-cream border border-outline-variant/60 space-y-1">
                    <Sparkles size={16} className="text-secondary mb-1" />
                    <h4 className="font-bold text-xs text-primary">{ing}</h4>
                    <p className="text-[11px] text-on-surface-muted">
                      {isRTL ? 'عنصر نشط ونقي مستورد أصلي' : 'Pure active imported ingredient'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'routine' && (
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-base text-primary">
                {isRTL
                  ? 'طقس العناية الصباحي والمسائي (Routine Steps)'
                  : 'Daily Skincare Sequence & Ritual'}
              </h3>
              <p className="text-xs text-on-surface-muted">
                {isRTL
                  ? 'الترتيب الصحيح لاستخدام هذا المستحضر في روتينكِ اليومي:'
                  : 'Recommended step order for this formula in your daily routine:'}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant text-xs">
                  1. {t('home.cleanse')}
                </div>
                <span>{isRTL ? '←' : '→'}</span>
                <div className="px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant text-xs">
                  2. {t('home.tone')}
                </div>
                <span>{isRTL ? '←' : '→'}</span>
                <div className={`px-4 py-2.5 rounded-xl border text-xs font-bold ${
                  product.routineStep === 'treat' ? 'bg-secondary text-white border-secondary' : 'bg-surface-container-low border-outline-variant'
                }`}>
                  3. {t('home.treat')}
                </div>
                <span>{isRTL ? '←' : '→'}</span>
                <div className={`px-4 py-2.5 rounded-xl border text-xs font-bold ${
                  product.routineStep === 'moisturize' ? 'bg-secondary text-white border-secondary' : 'bg-surface-container-low border-outline-variant'
                }`}>
                  4. {t('home.moisturize')}
                </div>
                <span>{isRTL ? '←' : '→'}</span>
                <div className={`px-4 py-2.5 rounded-xl border text-xs font-bold ${
                  product.routineStep === 'protect' ? 'bg-secondary text-white border-secondary' : 'bg-surface-container-low border-outline-variant'
                }`}>
                  5. {t('home.protect')}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'howToUse' && (
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-base text-primary">{t('product.howToUse')}</h3>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                {product.howToUse ||
                  (isRTL
                    ? 'ضعي كمية مناسبة على بشرة نظيفة ووزعيها بلطف حتى تمتصها البشرة تماماً.'
                    : 'Apply an appropriate amount to clean skin and pat gently until fully absorbed.')}
              </p>
            </div>
          )}

          {activeTab === 'fullInci' && (
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-base text-primary">{t('product.inciList')}</h3>
              <p className="text-xs text-on-surface-muted leading-relaxed font-mono bg-surface-container-low p-4 rounded-xl border border-outline-variant/60" dir="ltr">
                {product.ingredients}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Complementary Products Section */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/60">
            <h2 className="text-xl font-serif font-bold text-primary">
              {t('product.relatedProducts')}
            </h2>
            <Link to="/shop" className="text-xs font-bold text-secondary hover:underline flex items-center gap-1">
              <span>{t('common.viewAll')}</span>
              {isRTL ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
