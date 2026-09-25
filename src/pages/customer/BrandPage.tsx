import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Award, Sparkles } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { ProductCard } from '../../components/customer/ProductCard';
import { Button } from '../../components/common/Button';
import { useTranslation } from '../../i18n';

export const BrandPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { brands, products } = useAdminData();
  const { t, isRTL } = useTranslation();

  const brand = brands.find((b) => b.slug === slug);
  const brandProducts = products.filter((p) => p.brandSlug === slug && p.isActive);

  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  if (!brand) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-primary">
          {isRTL ? 'الماركة غير موجودة' : 'Brand Not Found'}
        </h2>
        <Link to="/shop">
          <Button variant="primary" size="md">
            {t('product.backToShop')}
          </Button>
        </Link>
      </div>
    );
  }

  const originText = brand.origin === 'korean' ? t('common.authenticKorean') : t('common.authenticEuropean');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-on-surface-muted">
        <Link to="/" className="hover:text-primary transition-colors">{t('nav.home')}</Link>
        <ChevronIcon size={13} />
        <Link to="/shop" className="hover:text-primary transition-colors">{t('nav.shop')}</Link>
        <ChevronIcon size={13} />
        <span className="text-primary font-medium">{brand.name}</span>
      </nav>

      {/* Brand Header */}
      <div className="bg-gradient-to-r from-blush via-cream to-white rounded-3xl p-8 border border-outline-variant text-start">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-secondary/30 text-xs font-semibold text-primary">
            <Award size={14} className="text-secondary" />
            <span>{originText}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-primary">
            {isRTL ? `منتجات ${brand.name} الأصلية` : `Authentic ${brand.name} Products`}
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            {brand.description || (isRTL ? 'جميع منتجات الماركة مستوردة وأصلية 100% بالباركود.' : 'All formulas are 100% authentic and imported.')}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      {brandProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-outline-variant p-12 text-center space-y-3">
          <p className="text-sm text-on-surface-muted">
            {isRTL ? 'لا توجد منتجات مضافة لهذه الماركة حالياً.' : 'No products available for this brand yet.'}
          </p>
          <Link to="/shop">
            <Button variant="primary" size="sm">
              {t('common.viewAll')}
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {brandProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};
