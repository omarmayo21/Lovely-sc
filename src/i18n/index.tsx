import React, { createContext, useContext, useState, useEffect } from 'react';
import { ar } from './ar';
import { en } from './en';

export type Language = 'ar' | 'en';
export type Direction = 'rtl' | 'ltr';

interface LanguageContextType {
  language: Language;
  dir: Direction;
  isRTL: boolean;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const translations = { ar, en };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'lovely_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved === 'ar' || saved === 'en') {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'ar'; // Default Arabic
  });

  const dir: Direction = language === 'ar' ? 'rtl' : 'ltr';
  const isRTL = language === 'ar';

  // Synchronize HTML lang and dir attributes whenever language changes
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // ignore
    }
  }, [language, dir]);

  const setLanguage = (newLang: Language) => {
    if (newLang === 'ar' || newLang === 'en') {
      setLanguageState(newLang);
    }
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  /**
   * Safe nested key resolution helper: t('hero.titleLine1')
   */
  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let current: any = translations[language];

    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        // Fallback to Arabic if missing in English
        let fallback: any = translations['ar'];
        for (const fbKey of keys) {
          if (fallback && typeof fallback === 'object' && fbKey in fallback) {
            fallback = fallback[fbKey];
          } else {
            fallback = null;
            break;
          }
        }
        current = fallback || key;
        break;
      }
    }

    if (typeof current !== 'string') {
      return key;
    }

    // Replace template parameters like {amount}
    if (params) {
      return Object.entries(params).reduce((str, [paramKey, paramValue]) => {
        return str.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramValue));
      }, current);
    }

    return current;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        dir,
        isRTL,
        setLanguage,
        toggleLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const useTranslation = () => {
  const { t, language, dir, isRTL, toggleLanguage, setLanguage } = useLanguage();
  return { t, language, dir, isRTL, toggleLanguage, setLanguage };
};
