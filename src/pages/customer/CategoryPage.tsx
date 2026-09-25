import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { ProductCard } from '../../components/customer/ProductCard';
import { Button } from '../../components/common/Button';
import { useTranslation } from '../../i18n';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { categories, products } = useAdminData();
  const { t, language, isRTL } = useTranslation();

  const category = categories.find((c) => c.slug === slug);
  const categoryProducts = products.filter((p) => p.categorySlug === slug && p.isActive);

  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-primary">
          {isRTL ? 'القسم غير موجود' : 'Category Not Found'}
        </h2>
        <Link to="/shop">
          <Button variant="primary" size="md">
            {t('product.backToShop')}
          </Button>
        </Link>
      </div>
    );
  }

  const displayName = language === 'en' && category.englishName ? category.englishName : category.name;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-on-surface-muted">
        <Link to="/" className="hover:text-primary transition-colors">{t('nav.home')}</Link>
        <ChevronIcon size={13} />
        <Link to="/shop" className="hover:text-primary transition-colors">{t('nav.shop')}</Link>
        <ChevronIcon size={13} />
        <span className="text-primary font-medium">{displayName}</span>
      </nav>

      {/* Category Header */}
      <div className="bg-gradient-to-r from-blush via-cream to-white rounded-3xl p-8 border border-outline-variant text-start">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-semibold text-secondary flex items-center gap-1.5">
            <Sparkles size={14} />
            <span>{category.englishName || 'SkinCare Collection'}</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-primary">
            {displayName}
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            {category.description || (isRTL ? 'أفضل المستحضرات المختارة بعناية لحماية وتغذية بشرتك.' : 'Carefully formulated skincare products.')}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      {categoryProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-outline-variant p-12 text-center space-y-3">
          <p className="text-sm text-on-surface-muted">
            {isRTL ? 'لا توجد منتجات مضافة لهذا القسم حالياً.' : 'No products available in this category yet.'}
          </p>
          <Link to="/shop">
            <Button variant="primary" size="sm">
              {t('common.viewAll')}
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categoryProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};
