import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredLanguage, changeLanguage } from '@/utils/i18n';
import { getSystemLanguage } from '@/utils/getSystemLanguage';

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => Promise<void>;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<string>('fr');

  useEffect(() => {
    const initLanguage = async () => {
      const storedLang = await getStoredLanguage();
      if (storedLang) {
        setLanguageState(storedLang);
      } else {
        // Si pas de langue stockée, on utilise la langue du système
        const systemLang = getSystemLanguage();
        // On ne garde que fr ou en
        const defaultLang = systemLang === 'fr' ? 'fr' : 'en';
        await changeLanguage(defaultLang);
        setLanguageState(defaultLang);
      }
    };
    initLanguage();
  }, []);

  const setLanguage = async (lang: string) => {
    await changeLanguage(lang);
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
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