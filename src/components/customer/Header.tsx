import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Phone, Menu, X, Sparkles, MessageCircle, MapPin, ArrowLeft, ArrowRight, Globe } from 'lucide-react';
import { Logo } from '../common/Logo';
import { useCart } from '../../context/CartContext';
import { useAdminData } from '../../context/AdminDataContext';
import { useTranslation } from '../../i18n';
import { trackSearch } from '../../services/analyticsService';
import { logSearchEvent } from '../../services/apiService';
import { Product } from '../../types';

export const Header: React.FC = () => {
  const { totalItems, setIsCartDrawerOpen } = useCart();
  const { settings, products } = useAdminData();
  const { t, language, isRTL, toggleLanguage } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [liveResults, setLiveResults] = useState<Product[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Live Instant Search with Debounce
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setLiveResults([]);
      setIsSearchOpen(false);
      return;
    }

    const timer = setTimeout(() => {
      const matched = products
        .filter((p) => p.isActive)
        .filter((p) => {
          const nameMatch = p.name.toLowerCase().includes(q);
          const engMatch = p.englishName?.toLowerCase().includes(q);
          const brandMatch = p.brand.toLowerCase().includes(q);
          const skuMatch = p.sku?.toLowerCase().includes(q);
          const catMatch = p.category.toLowerCase().includes(q);
          return nameMatch || engMatch || brandMatch || skuMatch || catMatch;
        })
        .slice(0, 6);

      setLiveResults(matched);
      setIsSearchOpen(true);

      if (q.length >= 2) {
        trackSearch(searchQuery, matched.length);
        logSearchEvent(searchQuery, matched.length);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery, products]);

  // Close live dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSelectProduct = (productId: string) => {
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
    setSearchQuery('');
    navigate(`/product/${productId}`);
  };

  const navLinks = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.shop'), path: '/shop' },
    { label: t('nav.categories'), path: '/categories' },
    { label: t('nav.brands'), path: '/brands' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Top Announcement Bar */}
      <div className="bg-primary text-white text-[11px] sm:text-[12px] py-1.5 sm:py-2 px-3 sm:px-4 border-b border-primary-hover/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center sm:justify-between gap-1.5 sm:gap-2 text-center sm:text-start">
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-white/90 w-full sm:w-auto">
            <Sparkles size={13} className="text-secondary flex-shrink-0" />
            <span className="leading-snug break-words">{t('common.topBarAnnouncement')}</span>
          </div>
          <div className="flex items-center justify-center sm:justify-end gap-3 sm:gap-4 text-[11px] sm:text-xs flex-wrap w-full sm:w-auto">
            <a
              href={`tel:${settings.primaryPhone}`}
              className="inline-flex items-center gap-1.5 text-white/80 hover:text-white transition-colors"
            >
              <Phone size={11} className="text-secondary flex-shrink-0" />
              <span className="inline-flex items-center gap-1">
                <span>{t('common.contactSiraj')}:</span>
                <span dir="ltr" className="font-mono">{settings.primaryPhone}</span>
              </span>
            </a>
            <span className="text-white/30 hidden sm:inline">|</span>
            <a
              href={`tel:${settings.secondaryPhone}`}
              className="hidden sm:inline-flex items-center gap-1.5 text-white/80 hover:text-white transition-colors"
            >
              <Phone size={11} className="text-secondary flex-shrink-0" />
              <span className="inline-flex items-center gap-1">
                <span>{t('common.contactHassan')}:</span>
                <span dir="ltr" className="font-mono">{settings.secondaryPhone}</span>
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-cream/95 backdrop-blur-md border-b border-outline-variant/80 shadow-soft-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="min-w-0 flex-shrink flex items-center focus:outline-none rounded-lg"
            aria-label="Lovely SkinCare Home"
          >
            <Logo
              size="md"
              className="w-[130px] min-[360px]:w-[145px] min-[390px]:w-[165px] min-[430px]:w-[185px] md:w-[220px] h-auto flex-shrink-0"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-primary">
            {navLinks.map((link) => {
              const isActive =
                location.pathname === link.path ||
                (link.path === '/categories' && location.pathname.startsWith('/category')) ||
                (link.path === '/brands' && location.pathname.startsWith('/brand'));
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`transition-colors duration-200 hover:text-secondary relative py-1 ${
                    isActive ? 'text-secondary font-semibold' : ''
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-secondary rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Search Bar with Instant Live Results Dropdown */}
          <div ref={searchContainerRef} className="hidden lg:flex flex-1 max-w-md mx-4 relative">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim() && setIsSearchOpen(true)}
                  placeholder={t('search.placeholder')}
                  className={`w-full bg-white text-primary text-xs px-4 py-2.5 rounded-full border border-outline-variant focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 transition-all placeholder:text-on-surface-muted/70 ${
                    isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
                  }`}
                />
                <button
                  type="submit"
                  className={`absolute top-1/2 -translate-y-1/2 text-on-surface-muted hover:text-primary transition-colors ${
                    isRTL ? 'right-3' : 'left-3'
                  }`}
                >
                  <Search size={16} />
                </button>
              </div>
            </form>

            {/* Live Search Results Dropdown */}
            {isSearchOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-outline-variant/60 overflow-hidden z-50 animate-scale-up">
                {liveResults.length > 0 ? (
                  <div>
                    <div className="px-4 py-2 bg-surface-container-low text-[11px] font-semibold text-on-surface-variant flex items-center justify-between border-b border-outline-variant/40">
                      <span>{t('search.instantResults')} ({liveResults.length})</span>
                      <span className="text-[10px] text-on-surface-muted">{t('search.clickToPreview')}</span>
                    </div>
                    <div className="divide-y divide-outline-variant/30 max-h-80 overflow-y-auto">
                      {liveResults.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => handleSelectProduct(product.id)}
                          className="p-3 hover:bg-cream/50 cursor-pointer flex items-center gap-3 transition-colors"
                        >
                          <img
                            src={product.images[0] || 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=200&q=80'}
                            alt={product.name}
                            className="w-12 h-12 rounded-xl object-cover border border-outline-variant/50 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-primary truncate">
                              {language === 'en' && product.englishName ? product.englishName : product.name}
                            </p>
                            <p className="text-[11px] text-on-surface-muted truncate">
                              {product.brand} • {product.category}
                            </p>
                          </div>
                          <div className="flex-shrink-0 text-start">
                            <span className="text-xs font-bold text-secondary font-mono">
                              {product.discountPrice || product.price} {t('common.egp')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handleSearchSubmit}
                      className="w-full py-2.5 px-4 bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors flex items-center justify-center gap-2"
                    >
                      <span>{t('search.viewAllResults')} &quot;{searchQuery}&quot;</span>
                      {isRTL ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                    </button>
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-on-surface-muted">
                    <p>{t('search.noResults')} &quot;{searchQuery}&quot;</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions: Language Switcher, WhatsApp & Cart */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            {/* Language Switcher Pill */}
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full text-xs font-semibold bg-white/80 hover:bg-white text-primary border border-outline-variant/60 shadow-soft-sm hover:border-secondary/40 transition-all active:scale-95 cursor-pointer flex-shrink-0"
              title={language === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
              aria-label="Language Switcher"
            >
              <Globe size={13} className="text-secondary sm:w-3.5 sm:h-3.5 flex-shrink-0" />
              <span className="font-sans font-bold text-[11px] sm:text-xs leading-none">{language === 'ar' ? 'EN' : 'عربي'}</span>
            </button>

            {/* WhatsApp Consultation */}
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(t('common.whatsappDefaultMessage'))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-tertiary/10 text-tertiary-dark hover:bg-tertiary/20 rounded-full border border-tertiary/20 transition-all flex-shrink-0"
            >
              <MessageCircle size={14} className="text-tertiary" />
              <span>{t('common.whatsappConsultation')}</span>
            </a>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2 sm:p-2.5 text-primary hover:bg-white/80 rounded-full border border-outline-variant/60 transition-all shadow-sm flex-shrink-0"
              aria-label={t('nav.cart')}
            >
              <ShoppingBag size={18} className="sm:w-5 sm:h-5" />
              {totalItems > 0 && (
                <span className={`absolute -top-1 w-4 h-4 sm:w-5 sm:h-5 bg-secondary text-white text-[10px] sm:text-[11px] font-bold rounded-full flex items-center justify-center animate-fade-in shadow-sm ${
                  isRTL ? '-left-1' : '-right-1'
                }`}>
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 sm:p-2 text-primary md:hidden rounded-lg hover:bg-surface-container-low transition-colors flex-shrink-0 focus:outline-none"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X size={20} className="sm:w-[22px] sm:h-[22px]" /> : <Menu size={20} className="sm:w-[22px] sm:h-[22px]" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-outline-variant bg-cream px-4 pt-3 pb-6 space-y-4 animate-fade-in">
            {/* Mobile Search */}
            <div ref={mobileSearchRef} className="relative">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim() && setIsSearchOpen(true)}
                  placeholder={t('search.mobilePlaceholder')}
                  className={`w-full bg-white text-primary text-xs px-4 py-2.5 rounded-full border border-outline-variant focus:outline-none focus:border-secondary ${
                    isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
                  }`}
                />
                <button
                  type="submit"
                  className={`absolute top-1/2 -translate-y-1/2 text-on-surface-muted ${
                    isRTL ? 'right-3' : 'left-3'
                  }`}
                >
                  <Search size={16} />
                </button>
              </form>

              {/* Mobile Search Results */}
              {isSearchOpen && searchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-outline-variant/60 overflow-hidden z-50">
                  {liveResults.length > 0 ? (
                    <div className="divide-y divide-outline-variant/30 max-h-60 overflow-y-auto">
                      {liveResults.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => handleSelectProduct(product.id)}
                          className="p-2.5 hover:bg-cream/50 cursor-pointer flex items-center gap-2.5"
                        >
                          <img
                            src={product.images[0] || 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=150&q=80'}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-primary truncate">
                              {language === 'en' && product.englishName ? product.englishName : product.name}
                            </p>
                            <p className="text-[10px] text-on-surface-muted truncate">{product.brand}</p>
                          </div>
                          <span className="text-xs font-bold text-secondary font-mono flex-shrink-0">
                            {product.discountPrice || product.price} {t('common.egp')}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-on-surface-muted">
                      {t('search.noResults')}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-2 pt-2 border-t border-outline-variant/50">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-primary hover:bg-white rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 text-xs font-semibold text-tertiary-dark bg-tertiary-container rounded-lg transition-colors flex items-center justify-between"
              >
                <span>{t('nav.adminDashboard')}</span>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded-full">Admin</span>
              </Link>
            </div>

            <div className="pt-3 border-t border-outline-variant/50 text-xs text-on-surface-muted flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <MapPin size={13} className="text-secondary flex-shrink-0" />
                <span className="truncate">{settings.branchAddress}</span>
              </div>
              <button
                onClick={toggleLanguage}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white text-primary border border-outline-variant shadow-soft-sm hover:border-secondary/40 flex-shrink-0 cursor-pointer"
              >
                <Globe size={13} className="text-secondary flex-shrink-0" />
                <span>{language === 'ar' ? 'English' : 'العربية'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
