import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Platform, Animated, View, Text } from 'react-native';
import { useLanguage } from '@/providers/LanguageProvider';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const BADGE_COLORS = { fr: '#E53935', en: '#1976D2' };

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();
  const [scale] = useState(new Animated.Value(1));
  const [glow, setGlow] = useState(false);

  const handlePress = async () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
    const newLang = language === 'fr' ? 'en' : 'fr';
    await setLanguage(newLang);
  };

  // Badge overlay
  const Badge = () => (
    <View style={[styles.badge, { backgroundColor: BADGE_COLORS[language] }]}> 
      <Text style={styles.badgeText}>{language.toUpperCase()}</Text>
    </View>
  );

  // Dégradé radial web + ombre + contour bleu clair
  const webGradient = Platform.OS === 'web' ? {
    background: 'radial-gradient(circle at 70% 30%, #e3f2fd 60%, #fff 100%)',
    boxShadow: glow ? '0 0 12px 3px #90caf9' : '0 2px 12px 0 rgba(33,150,243,0.10)',
    border: '1.5px solid #90caf9',
    transition: 'box-shadow 0.2s',
  } : {};

  // Couleur de l'icône : bleu sur web, blanc sur mobile
  const globeColor = Platform.OS === 'web' ? '#1976D2' : '#fff';

  return (
    <Animated.View style={[styles.container, { transform: [{ scale }] }]}> 
      <View style={[styles.glass, webGradient, glow && styles.glow]}
        onMouseEnter={() => setGlow(true)}
        onMouseLeave={() => setGlow(false)}
      >
        {Platform.OS === 'web' ? null : (
          <BlurView intensity={50} tint="light" style={StyleSheet.absoluteFill} />
        )}
        <TouchableOpacity
          style={styles.button}
          onPress={handlePress}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel={t('common.languageSelector', { language: language === 'fr' ? 'English' : 'Français' })}
          onPressIn={() => setGlow(true)}
          onPressOut={() => setGlow(false)}
        >
          <Ionicons name="globe-outline" size={22} color={globeColor} />
          <Badge />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const SIZE = 44;
const BADGE_SIZE = 15;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.select({ ios: 38, android: 28, default: 14 }),
    right: 14,
    zIndex: 1000,
  },
  glass: {
    borderRadius: SIZE / 2,
    width: SIZE,
    height: SIZE,
    overflow: 'hidden',
    backgroundColor: Platform.OS === 'web' ? undefined : 'rgba(255,255,255,0.18)',
    borderWidth: Platform.OS === 'web' ? 0 : 1.5,
    borderColor: Platform.OS === 'web' ? 'transparent' : '#90caf9',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1976D2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 6,
    elevation: 6,
  },
  glow: {
    shadowColor: '#90caf9',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  button: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    bottom: 3,
    right: 3,
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    backgroundColor: '#1976D2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.13,
    shadowRadius: 1,
    elevation: 1,
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 8.5,
    letterSpacing: 0.5,
  },
}); 