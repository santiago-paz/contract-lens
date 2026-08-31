'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { translations } from './translations';

type Language = 'en' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  // Keep the document language in sync with the toggle so screen readers
  // switch pronunciation; restore the app default when leaving the landing.
  useEffect(() => {
    document.documentElement.lang = language;
    return () => {
      document.documentElement.lang = 'en';
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
