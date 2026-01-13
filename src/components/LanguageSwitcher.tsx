import { Globe } from 'lucide-react';
import { useI18n } from '../i18n';
import type { Language } from '../i18n/types';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useI18n();

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'tk', name: 'Türkmençe', flag: '🇹🇲' },
  ];

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 px-4 py-2 glass rounded-lg hover:bg-white/10 transition-colors">
        <Globe className="w-5 h-5 text-cyber-blue" />
        <span className="text-white text-sm">
          {languages.find((l) => l.code === language)?.flag}
        </span>
      </button>

      {/* Dropdown */}
      <div className="absolute right-0 mt-2 w-48 glass rounded-lg border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`
              w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors
              ${
                language === lang.code
                  ? 'bg-cyber-blue/20 text-cyber-blue'
                  : 'text-gray-300 hover:bg-white/10'
              }
              first:rounded-t-lg last:rounded-b-lg
            `}
          >
            <span className="text-2xl">{lang.flag}</span>
            <span className="text-sm font-medium">{lang.name}</span>
            {language === lang.code && (
              <span className="ml-auto text-cyber-blue">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;