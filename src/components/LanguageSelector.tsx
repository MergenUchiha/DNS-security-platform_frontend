import React from 'react';
import { Globe } from 'lucide-react';
import { useI18n, type Language } from '../i18n';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useI18n();

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'tk', label: 'Türkmençe', flag: '🇹🇲' },
  ];

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-all border border-slate-700/50">
        <Globe className="w-4 h-4 text-blue-400" />
        <span className="text-sm text-slate-300">
          {languages.find(l => l.code === language)?.flag}
        </span>
      </button>
      
      <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-xl border border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-slate-700/50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
              language === lang.code ? 'bg-blue-500/20 text-blue-400' : 'text-slate-300'
            }`}
          >
            <span className="text-xl">{lang.flag}</span>
            <span className="text-sm">{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};