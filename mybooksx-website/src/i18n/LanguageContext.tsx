import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';
import type { Language, Translations } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('mybooksx_lang');
      if (saved === 'hi' || saved === 'en') {
        return saved;
      }
    } catch (e) {
      // localStorage unavailable fallback
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('mybooksx_lang', lang);
    } catch (e) {
      // Ignore storage errors
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = language === 'hi' 
      ? 'MyBooksX | कस्टम सॉफ़्टवेयर और डिजिटल इंजीनियरिंग' 
      : 'MyBooksX | Custom Software & Digital Engineering';
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
