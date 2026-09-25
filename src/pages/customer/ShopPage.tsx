import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  SlidersHorizontal,
  X,
  Search,
  Sparkles,
  ArrowUpDown,
  RotateCcw,
  Check,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { ProductCard } from '../../components/customer/ProductCard';
import { Button } from '../../components/common/Button';
import { useTranslation } from '../../i18n';

export const ShopPage: React.FC = () => {
  const { products, categories, brands } = useAdminData();
  const { t, language, dir, isRTL } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL State & Filter State
  const initialCategory = searchParams.get('category') || 'all';
  const initialBrand = searchParams.get('brand') || 'all';
  const initialSearch = searchParams.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [selectedSkinType, setSelectedSkinType] = useState<string>('all');
  const [selectedRoutineStep, setSelectedRoutineStep] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [sortBy, setSortBy] = useState<string>('default');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
    const br = searchParams.get('brand');
    if (br) setSelectedBrand(br);
    const q = searchParams.get('q');
    if (q) setSearchQuery(q);
  }, [searchParams]);

  const skinTypes = [
    { key: 'all', label: t('shop.all') },
    { key: 'all_skin', label: isRTL ? 'جميع أنواع البشرة' : 'All Skin Types' },
    { key: 'sensitive', label: isRTL ? 'البشرة الحساسة' : 'Sensitive Skin' },
    { key: 'acne', label: isRTL ? 'البشرة المعرضة للحبوب' : 'Acne-Prone Skin' },
    { key: 'dry', label: isRTL ? 'البشرة الجافة' : 'Dry Skin' },
    { key: 'oily', label: isRTL ? 'البشرة الدهنية' : 'Oily Skin' },
  ];

  const routineSteps = [
    { value: 'all', label: t('shop.all') },
    { value: 'cleanse', label: t('home.cleanse') },
    { value: 'tone', label: t('home.tone') },
    { value: 'treat', label: t('home.treat') },
    { value: 'moisturize', label: t('home.moisturize') },
    { value: 'protect', label: t('home.protect') },
  ];

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => p.isActive)
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'all' && p.categorySlug !== selectedCategory) {
          return false;
        }
        // Brand filter
        if (selectedBrand !== 'all' && p.brandSlug !== selectedBrand) {
          return false;
        }
        // Skin Type filter
        if (selectedSkinType !== 'all') {
          if (!p.skinType) return false;
          const match = p.skinType.some(
            (st) =>
              st.includes(selectedSkinType) ||
              (selectedSkinType === 'sensitive' && (st.includes('حساسة') || st.toLowerCase().includes('sensitive'))) ||
              (selectedSkinType === 'acne' && (st.includes('حبوب') || st.toLowerCase().includes('acne'))) ||
              (selectedSkinType === 'dry' && (st.includes('جافة') || st.toLowerCase().includes('dry'))) ||
              (selectedSkinType === 'oily' && (st.includes('دهنية') || st.toLowerCase().includes('oily')))
          );
          if (!match) return false;
        }
        // Routine Step filter
        if (selectedRoutineStep !== 'all' && p.routineStep !== selectedRoutineStep) {
          return false;
        }
        // Price filter
        const price = p.discountPrice ?? p.price;
        if (price > maxPrice) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = p.name.toLowerCase().includes(q);
          const matchEng = p.englishName?.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchSku = p.sku?.toLowerCase().includes(q);
          const matchCategory = p.category.toLowerCase().includes(q);
          const matchIngredients = p.ingredients?.toLowerCase().includes(q);
          if (!matchName && !matchEng && !matchBrand && !matchSku && !matchCategory && !matchIngredients) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        const priceA = a.discountPrice ?? a.price;
        const priceB = b.discountPrice ?? b.price;

        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        return 0; // default
      });
  }, [
    products,
    selectedCategory,
    selectedBrand,
    selectedSkinType,
    selectedRoutineStep,
    maxPrice,
    searchQuery,
    sortBy,
  ]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSelectedSkinType('all');
    setSelectedRoutineStep('all');
    setMaxPrice(1000);
    setSearchQuery('');
    setSortBy('default');
    setSearchParams({});
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedBrand !== 'all' ||
    selectedSkinType !== 'all' ||
    selectedRoutineStep !== 'all' ||
    maxPrice < 1000 ||
    searchQuery !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner from Stitch (screen_5.html) */}
      <div className="bg-gradient-to-r from-blush/80 via-cream to-white rounded-3xl p-6 sm:p-10 border border-outline-variant text-start">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-semibold text-secondary flex items-center gap-1.5">
            <Sparkles size={14} />
            <span>{t('shop.originalGuaranteed')}</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-primary">
            {t('shop.title')}
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            {t('shop.subtitle')}
          </p>
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 bg-white rounded-2xl border border-outline-variant p-6 space-y-6 text-start sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/60">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-secondary" />
              <h2 className="text-sm font-bold text-primary">{t('shop.filters')}</h2>
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-[11px] text-secondary hover:underline font-medium flex items-center gap-1"
              >
                <RotateCcw size={12} />
                <span>{t('shop.resetFilters')}</span>
              </button>
            )}
          </div>

          {/* Categories Filter */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-primary">{t('shop.categories')}</h3>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-start px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                  selectedCategory === 'all'
                    ? 'bg-primary text-white font-bold'
                    : 'text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                <span>{t('shop.allCategories')}</span>
                <span className="text-[10px] opacity-75">{products.length}</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-start px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    selectedCategory === cat.slug
                      ? 'bg-primary text-white font-bold'
                      : 'text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  <span>{language === 'en' && cat.englishName ? cat.englishName : cat.name}</span>
                  <span className="text-[10px] opacity-75">{cat.productCount}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="space-y-2.5 pt-4 border-t border-outline-variant/60">
            <h3 className="text-xs font-bold text-primary">{t('shop.brands')}</h3>
            <div className="max-h-48 overflow-y-auto space-y-1 custom-scrollbar pe-1">
              <button
                onClick={() => setSelectedBrand('all')}
                className={`w-full text-start px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  selectedBrand === 'all'
                    ? 'bg-secondary text-white font-bold'
                    : 'text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                {t('shop.allBrands')}
              </button>
              {brands.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBrand(b.slug)}
                  className={`w-full text-start px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    selectedBrand === b.slug
                      ? 'bg-secondary text-white font-bold'
                      : 'text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  <span>{b.name}</span>
                  <span className="text-[10px] text-tertiary-dark">{b.origin === 'korean' ? '🇰🇷' : '🇫🇷'}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3 pt-4 border-t border-outline-variant/60">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-primary">{t('shop.maxPrice')}</span>
              <span className="font-bold text-secondary">{maxPrice} {t('common.egp')}</span>
            </div>
            <input
              type="range"
              min="150"
              max="1000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-secondary cursor-pointer"
            />
          </div>

          {/* Skin Type */}
          <div className="space-y-2.5 pt-4 border-t border-outline-variant/60">
            <h3 className="text-xs font-bold text-primary">{t('shop.skinType')}</h3>
            <div className="flex flex-wrap gap-1.5">
              {skinTypes.map((st) => (
                <button
                  key={st.key}
                  onClick={() => setSelectedSkinType(st.key)}
                  className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                    selectedSkinType === st.key
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-on-surface-variant border-outline-variant hover:border-secondary'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content: Search Bar, Sorting, Active Filter Chips, Grid */}
        <div className="lg:col-span-9 space-y-6">
          {/* Controls Bar */}
          <div className="bg-white rounded-2xl border border-outline-variant p-4 flex flex-wrap items-center justify-between gap-4">
            {/* Search in Catalog */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search.shopPlaceholder')}
                className="w-full bg-surface-container-low text-xs text-primary px-4 py-2.5 pe-9 rounded-xl border border-outline-variant focus:outline-none focus:border-secondary"
              />
              <Search size={15} className="absolute end-3 top-1/2 -translate-y-1/2 text-on-surface-muted" />
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden px-3.5 py-2 rounded-xl border border-outline-variant text-xs font-medium text-primary flex items-center gap-2 bg-surface-container-low"
            >
              <SlidersHorizontal size={14} />
              <span>{t('shop.filterCount')} ({filteredProducts.length})</span>
            </button>

            {/* Sort Dropdown & Count */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-on-surface-muted hidden sm:inline">
                {filteredProducts.length} {t('shop.productsCount')}
              </span>

              <div className="flex items-center gap-1.5 text-xs text-primary">
                <ArrowUpDown size={14} className="text-on-surface-muted" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-surface-container-low border border-outline-variant rounded-xl px-3 py-2 text-xs text-primary focus:outline-none focus:border-secondary cursor-pointer"
                >
                  <option value="default">{t('shop.defaultSort')}</option>
                  <option value="newest">{t('shop.newest')}</option>
                  <option value="rating">{t('shop.rating')}</option>
                  <option value="price-asc">{t('shop.priceAsc')}</option>
                  <option value="price-desc">{t('shop.priceDesc')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-on-surface-muted text-[11px]">{t('shop.activeFilters')}</span>
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-blush text-primary px-2.5 py-1 rounded-full border border-secondary/30">
                  <span>{t('shop.categoryFilter')} {categories.find((c) => c.slug === selectedCategory)?.name}</span>
                  <button onClick={() => setSelectedCategory('all')}>
                    <X size={12} />
                  </button>
                </span>
              )}
              {selectedBrand !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-blush text-primary px-2.5 py-1 rounded-full border border-secondary/30">
                  <span>{t('shop.brandFilter')} {brands.find((b) => b.slug === selectedBrand)?.name}</span>
                  <button onClick={() => setSelectedBrand('all')}>
                    <X size={12} />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 bg-blush text-primary px-2.5 py-1 rounded-full border border-secondary/30">
                  <span>"{searchQuery}"</span>
                  <button onClick={() => setSearchQuery('')}>
                    <X size={12} />
                  </button>
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-[11px] text-red-600 hover:underline font-semibold pe-2"
              >
                {t('shop.resetFilters')}
              </button>
            </div>
          )}

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-outline-variant p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-cream flex items-center justify-center mx-auto text-secondary">
                <Search size={24} />
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-primary">
                  {t('shop.noProductsFound')}
                </h3>
                <p className="text-xs text-on-surface-muted mt-1 max-w-sm mx-auto">
                  {t('shop.tryAdjustingFilters')}
                </p>
              </div>
              <Button onClick={resetFilters} variant="primary" size="sm">
                {t('common.viewAll')}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex" dir={dir}>
          <div
            className="fixed inset-0 bg-primary/40 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-white h-full p-6 overflow-y-auto space-y-6 z-10 text-start">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
              <h2 className="text-sm font-bold text-primary">{t('shop.filters')}</h2>
              <button onClick={() => setIsMobileFilterOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-primary">{t('shop.categories')}</h3>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setIsMobileFilterOpen(false);
                  }}
                  className={`w-full text-start px-3 py-2 rounded-lg text-xs ${
                    selectedCategory === 'all' ? 'bg-primary text-white font-bold' : 'text-on-surface-variant'
                  }`}
                >
                  {t('shop.allCategories')}
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCategory(c.slug);
                      setIsMobileFilterOpen(false);
                    }}
                    className={`w-full text-start px-3 py-2 rounded-lg text-xs ${
                      selectedCategory === c.slug ? 'bg-primary text-white font-bold' : 'text-on-surface-variant'
                    }`}
                  >
                    {language === 'en' && c.englishName ? c.englishName : c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div className="space-y-2 pt-4 border-t border-outline-variant">
              <h3 className="text-xs font-bold text-primary">{t('shop.brands')}</h3>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                <button
                  onClick={() => {
                    setSelectedBrand('all');
                    setIsMobileFilterOpen(false);
                  }}
                  className={`w-full text-start px-3 py-1.5 rounded-lg text-xs ${
                    selectedBrand === 'all' ? 'bg-secondary text-white font-bold' : 'text-on-surface-variant'
                  }`}
                >
                  {t('shop.allBrands')}
                </button>
                {brands.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setSelectedBrand(b.slug);
                      setIsMobileFilterOpen(false);
                    }}
                    className={`w-full text-start px-3 py-1.5 rounded-lg text-xs ${
                      selectedBrand === b.slug ? 'bg-secondary text-white font-bold' : 'text-on-surface-variant'
                    }`}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={() => setIsMobileFilterOpen(false)}
              variant="primary"
              className="w-full mt-6"
            >
              {t('common.viewAll')} ({filteredProducts.length})
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
