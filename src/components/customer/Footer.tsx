import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, ShieldCheck, Sparkles, Truck, CheckCircle2, Clock, MessageCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { Logo } from '../common/Logo';
import { useAdminData } from '../../context/AdminDataContext';
import { useTranslation } from '../../i18n';

export const Footer: React.FC = () => {
  const { settings, categories, brands } = useAdminData();
  const { t, language, isRTL } = useTranslation();

  return (
    <footer className="bg-white border-t border-outline-variant text-primary mt-20">
      {/* Trust & Guarantee Banner from Stitch */}
      <div className="border-b border-outline-variant/60 bg-cream/40 py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5 p-3">
            <div className="w-12 h-12 rounded-xl bg-blush flex items-center justify-center text-secondary flex-shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-primary">
                {isRTL ? 'أصالة 100% مضمونة' : '100% Authenticity Guaranteed'}
              </h4>
              <p className="text-xs text-on-surface-muted mt-0.5">
                {isRTL ? 'وارد مباشر من كوريا وفرنسا بالباركود الأصلي' : 'Directly imported from Korea & France with barcode verification'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3">
            <div className="w-12 h-12 rounded-xl bg-tertiary-container flex items-center justify-center text-tertiary flex-shrink-0">
              <MapPin size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-primary">
                {isRTL ? 'فرع ومعاينة حقيقية' : 'Physical Flagship Store'}
              </h4>
              <p className="text-xs text-on-surface-muted mt-0.5">
                {isRTL ? 'فرعنا بالموسكي القاهرة متاح للمعاينة والتجربة' : 'Visit our boutique in El Muski, Cairo to test products'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-primary">
                {isRTL ? 'توصيل لكافة المحافظات' : 'Nationwide Fast Shipping'}
              </h4>
              <p className="text-xs text-on-surface-muted mt-0.5">
                {isRTL ? 'تغليف آمن ومبرد مع الشحن السريع' : 'Secure packaging with express 24-48h dispatch'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
              <Sparkles size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-primary">
                {isRTL ? 'استشارة مجانية للبشرة' : 'Expert Skin Consultation'}
              </h4>
              <p className="text-xs text-on-surface-muted mt-0.5">
                {isRTL ? 'نساعدكِ في اختيار الروتين والمنتج الأنسب لبشرتك' : 'Personalized routine guidance via WhatsApp directly'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Story */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="lg" />
            <p className="text-xs text-on-surface-variant leading-relaxed max-w-sm">
              {t('footer.aboutText')}
            </p>
            <div className="pt-2 text-xs text-on-surface-muted space-y-1">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-secondary flex-shrink-0" />
                <span>{isRTL ? settings.branchAddress : 'El Muski, Cairo - Egypt'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-tertiary flex-shrink-0" />
                <span>{t('footer.workingHours')} {isRTL ? settings.workingHours : 'Daily 11:00 AM - 11:00 PM'}</span>
              </div>
            </div>
          </div>

          {/* Quick Shop Categories */}
          <div>
            <h4 className="text-sm font-semibold font-serif text-primary mb-4 pb-1 border-b border-outline-variant/60">
              {t('footer.categories')}
            </h4>
            <ul className="space-y-2.5 text-xs text-on-surface-variant">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link to={`/category/${cat.slug}`} className="hover:text-secondary transition-colors">
                    {language === 'en' && cat.englishName ? cat.englishName : cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/categories" className="text-secondary font-medium hover:underline flex items-center gap-1">
                  <span>{isRTL ? 'جميع الأقسام والتصنيفات' : 'All Collections'}</span>
                  {isRTL ? <ArrowLeft size={12} /> : <ArrowRight size={12} />}
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Brands */}
          <div>
            <h4 className="text-sm font-semibold font-serif text-primary mb-4 pb-1 border-b border-outline-variant/60">
              {isRTL ? 'أشهر الماركات' : 'Top Brands'}
            </h4>
            <ul className="space-y-2.5 text-xs text-on-surface-variant">
              {brands.slice(0, 5).map((brand) => (
                <li key={brand.id}>
                  <Link to={`/brand/${brand.slug}`} className="hover:text-secondary transition-colors">
                    {brand.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/brands" className="text-secondary font-medium hover:underline flex items-center gap-1">
                  <span>{isRTL ? 'استكشفي جميع الماركات' : 'Explore All Brands'}</span>
                  {isRTL ? <ArrowLeft size={12} /> : <ArrowRight size={12} />}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Branch Management */}
          <div>
            <h4 className="text-sm font-semibold font-serif text-primary mb-4 pb-1 border-b border-outline-variant/60">
              {t('footer.contactInfo')}
            </h4>
            <div className="space-y-3 text-xs text-on-surface-variant">
              <div>
                <p className="text-[11px] text-on-surface-muted">
                  {isRTL ? 'إدارة المبيعات والفرع:' : 'Store & Sales Management:'}
                </p>
                <a href={`tel:${settings.primaryPhone}`} className="font-semibold text-primary block mt-0.5 hover:text-secondary" dir="ltr">
                  {t('common.contactSiraj')}: {settings.primaryPhone}
                </a>
                <a href={`tel:${settings.secondaryPhone}`} className="font-semibold text-primary block mt-0.5 hover:text-secondary" dir="ltr">
                  {t('common.contactHassan')}: {settings.secondaryPhone}
                </a>
              </div>
              <div className="pt-2">
                <a
                  href={`https://wa.me/${settings.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-tertiary text-white font-medium hover:bg-tertiary-hover transition-colors w-full justify-center"
                >
                  <MessageCircle size={15} />
                  <span>{t('common.whatsappConsultation')}</span>
                </a>
              </div>
              <div className="pt-2 border-t border-outline-variant/60">
                <Link to="/admin" className="text-[11px] text-on-surface-muted hover:text-primary transition-colors flex items-center justify-between">
                  <span>{t('nav.adminDashboard')}</span>
                  <span>⚙️</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="mt-12 pt-6 border-t border-outline-variant/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-on-surface-muted gap-3">
          <p>© 2026 {t('footer.rightsReserved')}</p>
          <p className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-tertiary" />
            <span>{isRTL ? 'منتجات أصلية مصرحة 100% في جمهورية مصر العربية' : '100% Verified Authentic Products in Egypt'}</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
