import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router'
import { ThemeProvider } from '../providers/theme-provider'
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter'
import { Manrope_700Bold, Manrope_800ExtraBold } from '@expo-google-fonts/manrope'
import { MontserratAlternates_700Bold } from '@expo-google-fonts/montserrat-alternates'
import * as ScreenOrientation from 'expo-screen-orientation'
import { LanguageProvider } from '../providers/LanguageProvider'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from '../store/store'
import { useAppSelector } from '@/store/hooks'
import { router, useSegments, usePathname } from 'expo-router'
import { Platform } from 'react-native'

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Inter': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'Manrope-Bold': Manrope_700Bold,
    'Manrope-ExtraBold': Manrope_800ExtraBold,
    'MontserratAlternates-Bold': MontserratAlternates_700Bold,
  })

  useEffect(() => {
    if (Platform.OS !== 'web') {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
      return () => {
        ScreenOrientation.unlockAsync();
      };
    }
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthOrApp />
      </PersistGate>
    </Provider>
  );
}

function AuthOrApp() {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const pathname = usePathname();

  // Corriger la détection des routes d'auth pour Expo Router web
  const isAuthRoute =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password' ||
    pathname.startsWith('/(auth)');

  console.log('AuthOrApp:', { isAuthenticated, pathname, isAuthRoute });

  useEffect(() => {
    if (!isAuthenticated && !isAuthRoute) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, isAuthRoute]);

  if (!isAuthenticated && !isAuthRoute) {
    return null;
  }

  return (
    <LanguageProvider>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(main)" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </LanguageProvider>
  );
} 