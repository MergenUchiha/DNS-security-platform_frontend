import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Language, Translation } from './types';
import { en } from './locales/en';
import { ru } from './locales/ru';
import { tk } from './locales/tk';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translation;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const translations: Record<Language, Translation> = {
  en,
  ru,
  tk,
};

const STORAGE_KEY = 'dns-security-language';

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return (stored as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  };

  const t = translations[language];

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
};