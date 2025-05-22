import { Platform, NativeModules } from 'react-native';
import * as Localization from 'expo-localization';

export const getSystemLanguage = (): string => {
  // Sur web, on utilise la langue du navigateur
  if (Platform.OS === 'web') {
    return navigator.language.split('-')[0];
  }

  // Sur mobile, on utilise expo-localization
  return Localization.locale.split('-')[0];
}; 