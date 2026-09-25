import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Sun,
  Droplets,
  ShieldCheck,
  Flame,
  Heart,
  ArrowLeft,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { Button } from '../../components/common/Button';
import { useTranslation } from '../../i18n';

export const CategoriesPage: React.FC = () => {
  const { categories, products } = useAdminData();
  const { t, language, isRTL } = useTranslation();

  // Helper to map category icons
  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'sunscreen':
        return <Sun size={24} className="text-amber-600" />;
      case 'serums':
        return <Sparkles size={24} className="text-secondary" />;
      case 'toners':
        return <Droplets size={24} className="text-sky-600" />;
      case 'moisturizers':
        return <ShieldCheck size={24} className="text-emerald-600" />;
      case 'cleansers':
        return <Flame size={24} className="text-orange-600" />;
      default:
        return <Heart size={24} className="text-rose-500" />;
    }
  };

  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 text-start">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-on-surface-muted">
        <Link to="/" className="hover:text-primary transition-colors">
          {t('nav.home')}
        </Link>
        <ChevronIcon size={13} />
        <Link to="/shop" className="hover:text-primary transition-colors">
          {t('nav.shop')}
        </Link>
        <ChevronIcon size={13} />
        <span className="text-primary font-medium">{t('categoriesPage.title')}</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blush/90 via-cream to-white rounded-3xl p-6 sm:p-10 border border-outline-variant text-start shadow-soft-sm">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-secondary/30 text-xs font-semibold text-primary">
            <Layers size={14} className="text-secondary" />
            <span>{isRTL ? 'طقوس العناية المتكاملة بالبشرة' : 'Complete Skincare Rituals'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-primary">
            {t('categoriesPage.title')}
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            {t('categoriesPage.subtitle')}
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const categoryProductsCount = products.filter(
            (p) => p.categorySlug === cat.slug && p.isActive
          ).length;
          const displayName = language === 'en' && cat.englishName ? cat.englishName : cat.name;

          return (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="group bg-white rounded-3xl border border-outline-variant p-6 sm:p-8 hover:border-secondary hover:shadow-card-lift transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                {/* Icon & Count Badge */}
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-cream group-hover:bg-blush border border-outline-variant/60 flex items-center justify-center transition-colors shadow-soft-sm">
                    {getCategoryIcon(cat.slug)}
                  </div>
                  <span className="text-xs font-bold text-tertiary-dark bg-tertiary-container px-3 py-1 rounded-full border border-tertiary/20">
                    {categoryProductsCount || cat.productCount} {t('categoriesPage.productCount')}
                  </span>
                </div>

                {/* Title & English Subtitle */}
                <div>
                  <h2 className="text-lg sm:text-xl font-serif font-bold text-primary group-hover:text-secondary transition-colors">
                    {displayName}
                  </h2>
                  {language === 'ar' && cat.englishName && (
                    <p className="text-xs text-on-surface-muted font-sans mt-0.5" dir="ltr">
                      {cat.englishName}
                    </p>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed line-clamp-3">
                  {cat.description || (isRTL ? 'مجموعة مختارة بعناية لحماية ونضارة بشرتك.' : 'Carefully formulated products for glowing skin.')}
                </p>
              </div>

              {/* Action Button Link */}
              <div className="pt-4 border-t border-outline-variant/60 flex items-center justify-between text-xs font-bold text-primary group-hover:text-secondary transition-colors">
                <span>{t('categoriesPage.exploreCategory')}</span>
                <ArrowIcon size={16} className={`transform ${isRTL ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'} transition-transform`} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Fast CTA */}
      <div className="bg-white rounded-3xl border border-outline-variant p-8 text-center space-y-4 shadow-soft-sm">
        <h3 className="text-lg font-serif font-bold text-primary">
          {t('home.consultationTitle')}
        </h3>
        <p className="text-xs sm:text-sm text-on-surface-muted max-w-lg mx-auto">
          {t('home.consultationSubtitle')}
        </p>
        <Link to="/shop">
          <Button variant="primary" size="md" icon={<ArrowIcon size={16} />}>
            {t('common.viewAll')}
          </Button>
        </Link>
      </div>
    </div>
  );
};
