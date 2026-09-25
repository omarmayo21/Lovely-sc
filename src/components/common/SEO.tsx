import React, { useEffect } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { useLanguage } from '../../i18n';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export const SEO: React.FC<SEOProps> = ({ title, description, image, url }) => {
  const { settings } = useAdminData();
  const { language } = useLanguage();

  useEffect(() => {
    const isEn = language === 'en';

    // 1. Document Title
    const defaultTitle = isEn
      ? 'Lovely SkinCare | 100% Authentic Korean & European Skincare'
      : settings.siteTitle || 'Lovely SkinCare | منتجات العناية بالبشرة الكورية والأوروبية الأصلية';

    const finalTitle = title ? `${title} | Lovely SkinCare` : defaultTitle;
    document.title = finalTitle;

    // 2. Meta Description
    const defaultDesc = isEn
      ? 'Lovely SkinCare Boutique - 100% authentic Korean and European skincare in Cairo, Egypt. Fast nationwide delivery.'
      : settings.metaDescription || 'متجر لافلي سكين كير الأول لمنتجات العناية بالبشرة الكورية والأوروبية الأصلية 100% في مصر - فرع الموسكي - القاهرة.';

    const metaDesc = description || defaultDesc;
    let descTag = document.querySelector('meta[name="description"]');
    if (!descTag) {
      descTag = document.createElement('meta');
      descTag.setAttribute('name', 'description');
      document.head.appendChild(descTag);
    }
    descTag.setAttribute('content', metaDesc);

    // 3. Open Graph Tags
    const ogImage =
      image ||
      settings.defaultOgImage ||
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1200&q=80';

    const setMetaTag = (attr: string, value: string, content: string) => {
      let tag = document.querySelector(`meta[${attr}="${value}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, value);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setMetaTag('property', 'og:title', finalTitle);
    setMetaTag('property', 'og:description', metaDesc);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:type', 'website');
    if (url) {
      setMetaTag('property', 'og:url', url);
    }

    // 4. Google Site Verification if configured
    if (settings.googleVerificationCode) {
      setMetaTag('name', 'google-site-verification', settings.googleVerificationCode);
    }
  }, [title, description, image, url, settings, language]);

  return null;
};
