import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  MapPin,
  MessageCircle,
  Clock,
  CheckCircle2,
  Droplets,
  Sun,
  Flame,
  Award,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { ProductCard } from '../../components/customer/ProductCard';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useTranslation } from '../../i18n';

export const HomePage: React.FC = () => {
  const { products, categories, brands, settings } = useAdminData();
  const { t, language, isRTL } = useTranslation();

  const bestSellers = products.filter((p) => p.isBestSeller && p.isActive).slice(0, 8);
  const newArrivals = products.filter((p) => p.isNew && p.isActive).slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Luxury Section from Stitch (screen_9.html & screen_11.html) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blush/60 via-cream to-background border-b border-outline-variant/60 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left/Right Text Content */}
            <div className="lg:col-span-7 space-y-6 text-start">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-secondary/30 text-xs font-semibold text-primary shadow-soft-sm">
                <Sparkles size={14} className="text-secondary" />
                <span>{t('hero.badge')}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-primary leading-tight">
                {t('hero.titleLine1')}{' '}
                <span className="text-secondary italic font-normal">{t('hero.titleLine2')}</span>
              </h1>

              <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed max-w-xl">
                {t('hero.subtitle')}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link to="/shop">
                  <Button
                    variant="primary"
                    size="lg"
                    icon={isRTL ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                  >
                    {t('hero.shopNow')}
                  </Button>
                </Link>

                <a
                  href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(t('common.whatsappDefaultMessage'))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="lg" icon={<MessageCircle size={18} />}>
                    {t('home.consultationButton')}
                  </Button>
                </a>
              </div>

              {/* Highlights Micro Grid */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-outline-variant/60 max-w-lg">
                <div>
                  <p className="text-xl sm:text-2xl font-serif font-bold text-primary">+150</p>
                  <p className="text-xs text-on-surface-muted mt-0.5">{t('hero.koreanOrigin')}</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-serif font-bold text-primary">12+</p>
                  <p className="text-xs text-on-surface-muted mt-0.5">{t('hero.testedApproved')}</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-serif font-bold text-primary">24h</p>
                  <p className="text-xs text-on-surface-muted mt-0.5">{t('hero.expressDelivery')}</p>
                </div>
              </div>
            </div>

            {/* Hero Visual Card / Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 shadow-soft-lg border border-outline-variant">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-oatmeal/60 p-6 flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80"
                    alt="Beauty of Joseon Sunscreen"
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                  <Badge
                    variant="secondary"
                    className="absolute top-4 end-4 shadow-sm"
                  >
                    {t('product.bestsellerBadge')} ⭐
                  </Badge>
                </div>

                <div className="mt-5 space-y-2 text-start">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-secondary">Beauty of Joseon</span>
                    <span className="text-xs font-bold text-tertiary-dark bg-tertiary-container px-2 py-0.5 rounded">
                      {t('common.korean')}
                    </span>
                  </div>
                  <h3 className="text-base font-serif font-bold text-primary">
                    {isRTL
                      ? 'واقي شمس الأرز العضوي والبروبيوتيك SPF50+'
                      : 'Relief Sun: Rice + Probiotics SPF50+'}
                  </h3>
                  <div className="flex items-center justify-between pt-2 border-t border-outline-variant/60">
                    <span className="text-lg font-bold text-primary">580 {t('common.egp')}</span>
                    <Link to="/product/prod-boj-sun">
                      <Button variant="primary" size="sm">
                        {isRTL ? 'تفاصيل المنتج' : 'View Details'}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Categories Horizontal Bar from Stitch */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8 pb-3 border-b border-outline-variant/60">
          <div>
            <h2 className="text-2xl font-serif font-bold text-primary">{t('home.curatedCategories')}</h2>
            <p className="text-xs sm:text-sm text-on-surface-muted mt-0.5">
              {t('home.curatedCategoriesSubtitle')}
            </p>
          </div>
          <Link
            to="/categories"
            className="text-xs font-bold text-primary hover:text-secondary flex items-center gap-1 transition-colors"
          >
            <span>{isRTL ? `عرض جميع الأقسام (${categories.length})` : `All Categories (${categories.length})`}</span>
            {isRTL ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="group bg-white rounded-2xl p-4 border border-outline-variant hover:border-secondary hover:shadow-card-lift transition-all duration-300 flex flex-col items-center text-center space-y-2.5"
            >
              <div className="w-12 h-12 rounded-xl bg-blush group-hover:bg-secondary text-primary group-hover:text-white flex items-center justify-center transition-colors">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-primary group-hover:text-secondary transition-colors">
                  {language === 'en' && cat.englishName ? cat.englishName : cat.name}
                </h3>
                <p className="text-[10px] text-on-surface-muted mt-0.5">
                  {cat.productCount} {t('categoriesPage.productCount')}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Bestsellers Products Section from Stitch */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8 pb-3 border-b border-outline-variant/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <span className="text-xs font-semibold text-secondary">
                {isRTL ? 'اختيارات العملاء الأولى' : 'Top Customer Picks'}
              </span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-primary">
              {t('home.bestSellers')}
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-primary hover:text-secondary flex items-center gap-1 transition-colors"
          >
            <span>{isRTL ? `عرض كل المنتجات (${products.length})` : `View All Products (${products.length})`}</span>
            {isRTL ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Glass Skin Routine Banner from Stitch (screen_9.html) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-primary text-white rounded-3xl p-8 md:p-12 shadow-soft-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4 text-start">
              <Badge variant="secondary" size="sm">
                {isRTL ? 'باقة متكاملة' : 'Complete Routine'}
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
                {isRTL
                  ? 'روتين الزجاج الكوري الشامل (Glass Skin Ritual)'
                  : 'Complete Korean Glass Skin Ritual'}
              </h2>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-xl">
                {isRTL
                  ? 'مجموعة مختارة بعناية لتحقيق بشرة نضرة، مرطبة بعمق وخالية من الشوائب والبهتان. تشمل غسول زيتي، تونر هارتليف المهدئ، إيسنس الحلزون وواقي شمس الأرز.'
                  : 'A meticulously curated set for deep hydration, radiant glass glow, and reinforced skin barrier. Featuring cleansing oil, soothing toner, snail essence, and rice sunscreen.'}
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <Link to="/shop">
                  <Button variant="secondary" size="md">
                    {isRTL ? 'اكتشفي منتجات الروتين' : 'Explore Routine Steps'}
                  </Button>
                </Link>
                <a
                  href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
                    isRTL ? 'أود طلب باقة روتين الزجاج الكوري' : 'I would like to inquire about the Glass Skin Ritual'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    size="md"
                    className="bg-transparent text-white border-white/40 hover:bg-white/10 hover:border-white"
                  >
                    {isRTL ? 'طلب عبر الواتساب مباشرة' : 'Order via WhatsApp'}
                  </Button>
                </a>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl bg-white/10 backdrop-blur-md p-4 flex items-center justify-center border border-white/20">
                <img
                  src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"
                  alt="Glass Skin Set"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. World Brands Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8 pb-3 border-b border-outline-variant/60">
          <div>
            <h2 className="text-2xl font-serif font-bold text-primary">
              {t('home.featuredBrands')}
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-muted mt-0.5">
              {t('home.featuredBrandsSubtitle')}
            </p>
          </div>
          <Link
            to="/brands"
            className="text-xs font-bold text-primary hover:text-secondary flex items-center gap-1 transition-colors"
          >
            <span>{isRTL ? `عرض جميع الماركات (${brands.length})` : `All Brands (${brands.length})`}</span>
            {isRTL ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              to={`/brand/${brand.slug}`}
              className="bg-white rounded-2xl p-5 border border-outline-variant hover:border-secondary hover:shadow-card-lift transition-all flex flex-col items-center justify-center text-center group"
            >
              <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-primary group-hover:bg-blush transition-colors mb-2">
                <Award size={18} className="text-secondary" />
              </div>
              <h3 className="text-xs font-bold text-primary group-hover:text-secondary transition-colors">
                {brand.name}
              </h3>
              <span className="text-[10px] text-tertiary-dark font-medium mt-1">
                {brand.origin === 'korean' ? t('common.authenticKorean') : t('common.authenticEuropean')}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. Physical Store Location & Muski Branch Showcase from Stitch (screen_11.html) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-outline-variant p-8 md:p-10 shadow-soft-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4 text-start">
              <Badge variant="sage" size="sm">
                {isRTL ? 'مقرنا الرئيسي' : 'Flagship Store'}
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary">
                {isRTL
                  ? 'تفضلي بزيارة فرعنا بالموسكي لمعاينة واختبار المنتجات مباشرة'
                  : 'Visit our flagship boutique in El Muski to test formulas in person'}
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                {isRTL
                  ? 'يسعدنا استقبالكِ في فرعنا بالقاهرة لتجربة القوام الأصلي والتأكد من الباركود وتاريخ الصلاحية بنفسك مع استشارة متخصصة لنوع بشرتكِ.'
                  : 'We are delighted to welcome you to our Cairo boutique to experience authentic textures, verify international barcodes, and receive personal skincare consultations.'}
              </p>

              <div className="space-y-2 pt-2 text-xs text-primary font-medium">
                <div className="flex items-center gap-2">
                  <MapPin size={15} className="text-secondary flex-shrink-0" />
                  <span><strong>{isRTL ? 'العنوان:' : 'Address:'}</strong> {isRTL ? settings.branchAddress : 'El Muski, Cairo - Egypt'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={15} className="text-tertiary flex-shrink-0" />
                  <span><strong>{isRTL ? 'المواعيد:' : 'Hours:'}</strong> {isRTL ? settings.workingHours : 'Daily 11:00 AM - 11:00 PM'}</span>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap gap-4 text-xs font-bold">
                <a
                  href={`tel:${settings.primaryPhone}`}
                  className="px-4 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-hover transition-colors inline-flex items-center gap-2"
                  dir="ltr"
                >
                  <span>{t('common.contactSiraj')}: {settings.primaryPhone}</span>
                </a>
                <a
                  href={`tel:${settings.secondaryPhone}`}
                  className="px-4 py-2.5 rounded-xl border border-outline-variant text-primary hover:bg-cream transition-colors inline-flex items-center gap-2"
                  dir="ltr"
                >
                  <span>{t('common.contactHassan')}: {settings.secondaryPhone}</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden bg-cream p-6 border border-outline-variant text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto text-secondary">
                  <ShieldCheck size={28} />
                </div>
                <h3 className="font-serif font-bold text-base text-primary">
                  {isRTL ? 'ضمان الأصالة والتجربة' : 'Authenticity & Experience Guarantee'}
                </h3>
                <p className="text-xs text-on-surface-muted leading-relaxed">
                  {isRTL
                    ? 'جميع المستحضرات أصلية 100% ومخزنة في بيئة مبردة للحفاظ على فاعلية المكونات النشطة.'
                    : 'All formulas are 100% authentic and stored in climate-controlled conditions to preserve active potency.'}
                </p>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 text-xs text-tertiary-dark font-semibold">
                    <CheckCircle2 size={14} />
                    <span>{isRTL ? 'متاح الدفع نقداً أو إلكترونياً داخل الفرع' : 'Cash & Electronic payment accepted in-store'}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
