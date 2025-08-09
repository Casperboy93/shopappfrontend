import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaGlobe, FaChevronDown } from 'react-icons/fa';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇲🇦' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[2];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
    
    // Update document direction for Arabic
    if (languageCode === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = languageCode;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-sm font-medium text-white/80 hover:text-golden-300 transition-colors duration-200 rounded-lg hover:bg-golden-500/10 min-w-0"
      >
        <FaGlobe className="text-golden-400 text-base sm:text-sm flex-shrink-0" />
        <span className="text-lg sm:text-base">{currentLanguage.flag}</span>
        <span className="hidden lg:inline text-sm truncate">{currentLanguage.name}</span>
        <FaChevronDown className={`transition-transform duration-200 text-xs sm:text-sm flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-dark-900 border border-golden-600/30 rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="py-1">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => changeLanguage(language.code)}
                className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 text-sm transition-colors duration-200 ${
                  i18n.language === language.code
                    ? 'bg-golden-500/20 text-golden-400'
                    : 'text-white/80 hover:bg-golden-500/10 hover:text-golden-300'
                }`}
              >
                <span className="text-base sm:text-lg flex-shrink-0">{language.flag}</span>
                <span className="truncate">{language.name}</span>
                {i18n.language === language.code && (
                  <span className="ml-auto text-golden-400 flex-shrink-0">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}