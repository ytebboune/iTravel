// Utilitaire pour choisir dynamiquement le background des écrans d'auth
import { ImageSourcePropType } from 'react-native';

export function getAuthBackgroundImage(windowWidth: number, windowHeight: number): ImageSourcePropType {
  const isLandscape = windowWidth > windowHeight;
  // Desktop
  if (windowWidth >= 1024) {
    return require('../assets/images/background-login/desktop_large.png');
  }
  // Tablet
  if (windowWidth >= 768) {
    return isLandscape
      ? require('../assets/images/background-login/tablette_paysage.png')
      : require('../assets/images/background-login/tablette_portrait.png');
  }
  // Mobile
  return isLandscape
    ? require('../assets/images/background-login/test_mobile_portrait.png')
    : require('../assets/images/background-login/test_mobile_portrait.png');
} 