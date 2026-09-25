import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, ChevronLeft, ChevronRight, Sparkles, ArrowLeft, ArrowRight, Globe } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { Button } from '../../components/common/Button';
import { useTranslation } from '../../i18n';

export const BrandsPage: React.FC = () => {
  const { brands, products } = useAdminData();
  const { t, isRTL } = useTranslation();
  const [filterOrigin, setFilterOrigin] = useState<'all' | 'korean' | 'european'>('all');

  const filteredBrands = brands.filter((brand) => {
    if (filterOrigin === 'all') return true;
    return brand.origin === filterOrigin;
  });

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
        <span className="text-primary font-medium">{t('brandsPage.title')}</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blush/90 via-cream to-white rounded-3xl p-6 sm:p-10 border border-outline-variant text-start shadow-soft-sm">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-secondary/30 text-xs font-semibold text-primary">
            <Globe size={14} className="text-secondary" />
            <span>{isRTL ? 'وكلاء ومستوردون معتمدون' : 'Verified Importers & Boutique'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-primary">
            {t('brandsPage.title')}
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            {t('brandsPage.subtitle')}
          </p>
        </div>
      </div>

      {/* Origin Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        <button
          onClick={() => setFilterOrigin('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filterOrigin === 'all'
              ? 'bg-primary text-white shadow-sm'
              : 'bg-white text-on-surface-variant border border-outline-variant hover:bg-cream'
          }`}
        >
          {isRTL ? `جميع العلامات (${brands.length})` : `All Brands (${brands.length})`}
        </button>
        <button
          onClick={() => setFilterOrigin('korean')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            filterOrigin === 'korean'
              ? 'bg-primary text-white shadow-sm'
              : 'bg-white text-on-surface-variant border border-outline-variant hover:bg-cream'
          }`}
        >
          <span>{t('brandsPage.koreanBrands')}</span>
          <span className="text-[10px] opacity-80">
            ({brands.filter((b) => b.origin === 'korean').length})
          </span>
        </button>
        <button
          onClick={() => setFilterOrigin('european')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            filterOrigin === 'european'
              ? 'bg-primary text-white shadow-sm'
              : 'bg-white text-on-surface-variant border border-outline-variant hover:bg-cream'
          }`}
        >
          <span>{t('brandsPage.europeanBrands')}</span>
          <span className="text-[10px] opacity-80">
            ({brands.filter((b) => b.origin === 'european').length})
          </span>
        </button>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBrands.map((brand) => {
          const brandProductsCount = products.filter(
            (p) => p.brandSlug === brand.slug && p.isActive
          ).length;

          return (
            <Link
              key={brand.id}
              to={`/brand/${brand.slug}`}
              className="group bg-white rounded-3xl border border-outline-variant p-6 sm:p-8 hover:border-secondary hover:shadow-card-lift transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                {/* Header: Icon & Origin Badge */}
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-cream group-hover:bg-blush border border-outline-variant/60 flex items-center justify-center text-secondary transition-colors shadow-soft-sm">
                    <Award size={26} />
                  </div>
                  <span className="text-xs font-bold text-tertiary-dark bg-tertiary-container px-3 py-1 rounded-full border border-tertiary/20">
                    {brand.origin === 'korean' ? t('common.authenticKorean') : t('common.authenticEuropean')}
                  </span>
                </div>

                {/* Brand Name & Count */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary group-hover:text-secondary transition-colors">
                    {brand.name}
                  </h2>
                  <p className="text-xs text-secondary font-semibold mt-1">
                    {brandProductsCount || brand.productCount} {t('categoriesPage.productCount')}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed line-clamp-3">
                  {brand.description ||
                    (isRTL
                      ? 'علامة رائدة في العناية بالبشرة، منتجات أصلية 100% ومستوردة مباشرة.'
                      : 'Leading skincare brand, 100% authentic formulas imported directly.')}
                </p>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-outline-variant/60 flex items-center justify-between text-xs font-bold text-primary group-hover:text-secondary transition-colors">
                <span>{t('brandsPage.exploreBrand')}</span>
                <ArrowIcon size={16} className={`transform ${isRTL ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'} transition-transform`} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Muski Branch Note */}
      <div className="bg-cream/60 rounded-3xl border border-outline-variant p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-start">
        <div>
          <h3 className="font-serif font-bold text-base text-primary">
            {isRTL
              ? 'ترغبين في فحص ومعاينة الباركود الأصلي بنفسكِ؟'
              : 'Want to verify the international barcodes in person?'}
          </h3>
          <p className="text-xs text-on-surface-muted mt-1">
            {isRTL
              ? 'يسعدنا استقبالكِ في فرع Lovely SkinCare بالموسكي - القاهرة لتجربة القوام والتأكد من بلد المنشأ.'
              : 'We welcome you at our Lovely SkinCare flagship boutique in El Muski, Cairo to test textures and inspect origins.'}
          </p>
        </div>
        <Link to="/shop">
          <Button variant="primary" size="sm">
            {t('common.viewAll')}
          </Button>
        </Link>
      </div>
    </div>
  );
};
