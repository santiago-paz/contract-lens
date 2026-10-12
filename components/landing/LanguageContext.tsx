'use client';

import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';

import { translations, type Language, type Translations } from './translations';

/** The visitor's pick, so a German browser can still ask for English and keep it. proxy.ts reads it. */
export const LANGUAGE_COOKIE = 'cl_lang';

interface LanguageContextType {
  language: Language;
  t: Translations;
  /** Where the landing lives in a language. */
  hrefFor: (lang: Language) => string;
  /** Remembers a pick before the link is followed. */
  remember: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const HREF: Record<Language, string> = { en: '/', de: '/de' };

/**
 * The language comes from the route: `/` is English, `/de` is German, and the
 * server renders the right one. There is no client-side switch to flash.
 */
export function LanguageProvider({ language, children }: { language: Language; children: ReactNode }) {
  // Keep the document language in step with the page so screen readers pick the
  // right voice; restore the app default when leaving the landing.
  useEffect(() => {
    document.documentElement.lang = language;
    return () => {
      document.documentElement.lang = 'en';
    };
  }, [language]);

  const value = useMemo<LanguageContextType>(
    () => ({
      language,
      t: translations[language],
      hrefFor: (lang) => HREF[lang],
      remember: (lang) => {
        document.cookie = `${LANGUAGE_COOKIE}=${lang}; path=/; max-age=31536000; samesite=lax`;
      },
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
