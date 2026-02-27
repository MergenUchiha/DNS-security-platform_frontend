import { createContext, useContext, useState, ReactNode } from 'react';
import { Lang, translations, Translations } from '../i18n/translations';

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}

const LangContext = createContext<LangContextType>({
  lang: 'en',
  setLang: () => {},
  t: translations.en,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem('dns-lab-lang');
    return (saved as Lang) ?? 'en';
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('dns-lab-lang', l);
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t: translations[lang] as Translations }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
