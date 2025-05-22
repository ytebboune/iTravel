import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from '../locales/en';
import fr from '../locales/fr';
import { getSystemLanguage } from './getSystemLanguage';

const LANGUAGE_KEY = '@iTravel:language';

export const getStoredLanguage = async (): Promise<string> => {
  try {
    const language = await AsyncStorage.getItem(LANGUAGE_KEY);
    return language || 'fr';
  } catch {
    return 'fr';
  }
};

export const setStoredLanguage = async (language: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
  } catch (error) {
    console.error('Error saving language:', error);
  }
};

// Initialisation dynamique de la langue
(async () => {
  let initialLang = await getStoredLanguage();
  if (!initialLang) {
    const systemLang = getSystemLanguage();
    initialLang = systemLang === 'fr' ? 'fr' : 'en';
  }
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        fr: { translation: fr },
      },
      lng: initialLang,
      fallbackLng: 'fr',
      interpolation: {
        escapeValue: false,
      },
    });
})();

export const changeLanguage = async (language: string) => {
  await i18n.changeLanguage(language);
  await setStoredLanguage(language);
};

export default i18n; 