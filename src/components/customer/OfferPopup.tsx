import React, { useState, useEffect } from 'react';
import { X, Sparkles, ArrowLeft, ArrowRight, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Offer } from '../../types';
import { useAdminData } from '../../context/AdminDataContext';
import { useTranslation } from '../../i18n';

export const OfferPopup: React.FC = () => {
  const { offers } = useAdminData();
  const { t, dir, isRTL } = useTranslation();
  const [activeOffer, setActiveOffer] = useState<Offer | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!offers || offers.length === 0) return;

    // Find the first active valid offer
    const now = new Date();
    const validOffer = offers.find((o) => {
      if (!o.isActive) return false;
      if (o.startDate && new Date(o.startDate) > now) return false;
      if (o.endDate && new Date(o.endDate) < now) return false;
      return true;
    });

    if (!validOffer) return;

    // Check if dismissed in this session
    const isDismissed = sessionStorage.getItem(`lovely_offer_dismissed_${validOffer.id}`);
    if (!isDismissed) {
      setActiveOffer(validOffer);
      // Small delay for smooth entry
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [offers]);

  const handleClose = () => {
    setIsOpen(false);
    if (activeOffer) {
      sessionStorage.setItem(`lovely_offer_dismissed_${activeOffer.id}`, 'true');
    }
  };

  if (!isOpen || !activeOffer) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto box-border"
      dir={dir}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-primary/60 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal Dialog with Viewport Protection & Internal Scroll */}
      <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-[calc(100vw-24px)] max-w-lg max-h-[calc(100dvh-24px)] sm:max-h-[calc(100vh-32px)] flex flex-col overflow-hidden border border-outline-variant/40 z-10 animate-scale-up box-border my-auto">
        {/* Close Button - Accessible with 44px touch target on mobile */}
        <button
          onClick={handleClose}
          className="absolute top-2.5 start-2.5 sm:top-4 sm:start-4 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 backdrop-blur-md text-on-surface hover:bg-white hover:text-secondary flex items-center justify-center shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-secondary/40"
          aria-label={t('offerPopup.closeAria')}
        >
          <X size={16} className="sm:w-[18px] sm:h-[18px]" />
        </button>

        {/* Offer Banner Image if present */}
        {activeOffer.imageUrl && (
          <div className="relative h-36 sm:h-52 md:h-56 w-full flex-shrink-0 overflow-hidden bg-surface-container-low">
            <img
              src={activeOffer.imageUrl}
              alt={activeOffer.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-black/30" />

            {activeOffer.discountText && (
              <div className="absolute bottom-2.5 end-2.5 sm:bottom-4 sm:end-4 inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-secondary text-white text-[11px] sm:text-xs font-bold shadow-lg">
                <Tag size={12} className="sm:w-[13px] sm:h-[13px]" />
                <span>{activeOffer.discountText}</span>
              </div>
            )}
          </div>
        )}

        {/* Offer Details with Smooth Internal Scroll if Content is Tall */}
        <div className="p-4 sm:p-6 md:p-8 space-y-3 sm:space-y-4 overflow-y-auto flex-1 custom-scrollbar text-start">
          {!activeOffer.imageUrl && activeOffer.discountText && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-bold">
              <Sparkles size={14} />
              <span>{activeOffer.discountText}</span>
            </div>
          )}

          <div className="space-y-1.5 sm:space-y-2">
            <h3 className="text-base sm:text-xl md:text-2xl font-bold font-serif text-primary leading-snug break-words">
              {activeOffer.title}
            </h3>
            {activeOffer.description && (
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed break-words">
                {activeOffer.description}
              </p>
            )}
          </div>

          {/* Action Buttons - Always Visible and Tappable */}
          <div className="pt-2 sm:pt-3 flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {activeOffer.linkUrl ? (
              <Link
                to={activeOffer.linkUrl}
                onClick={handleClose}
                className="flex-1 btn-primary min-h-[44px] py-2.5 sm:py-3.5 px-4 sm:px-6 rounded-xl sm:rounded-2xl flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all"
              >
                <span>{t('offerPopup.shopOfferNow')}</span>
                {isRTL ? <ArrowLeft size={15} className="sm:w-4 sm:h-4" /> : <ArrowRight size={15} className="sm:w-4 sm:h-4" />}
              </Link>
            ) : (
              <Link
                to="/shop"
                onClick={handleClose}
                className="flex-1 btn-primary min-h-[44px] py-2.5 sm:py-3.5 px-4 sm:px-6 rounded-xl sm:rounded-2xl flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all"
              >
                <span>{t('offerPopup.browseProducts')}</span>
                {isRTL ? <ArrowLeft size={15} className="sm:w-4 sm:h-4" /> : <ArrowRight size={15} className="sm:w-4 sm:h-4" />}
              </Link>
            )}
            <button
              onClick={handleClose}
              className="min-h-[44px] px-3 sm:px-4 py-2 text-xs text-on-surface-muted hover:text-on-surface font-semibold transition-colors flex-shrink-0 flex items-center justify-center"
            >
              {t('offerPopup.later')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
