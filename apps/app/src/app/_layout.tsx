import React, { useEffect, useState, useCallback } from 'react';
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
import { router, useSegments } from 'expo-router'
import { Platform, View, ActivityIndicator } from 'react-native'
import { AuthInitializer } from '../components/AuthInitializer'
import { getAuthData } from '../services/secureStorage'

function LoadingScreen() {
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: '#ffffff'
    }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}

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
        <AuthInitializer />
        <AuthOrApp />
      </PersistGate>
    </Provider>
  );
}

function AuthOrApp() {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const isLoading = useAppSelector(state => state.auth.loading);
  const segments = useSegments();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleNavigation = useCallback(async (targetPath: string) => {
    if (isNavigating) return;
    
    try {
      console.log('Navigating to:', targetPath);
      setIsNavigating(true);
      await router.replace(targetPath);
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setIsNavigating(false);
    }
  }, [isNavigating]);

  useEffect(() => {
    if (isLoading) return;

    const checkAuth = async () => {
      try {
        const { accessToken } = await getAuthData();
        const isRootPath = segments.length === 0;

        // Ne rediriger que si on est sur la route racine
        if (isRootPath) {
          if (accessToken) {
            handleNavigation('/(tabs)');
          } else {
            handleNavigation('/(auth)/login');
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      }
    };

    checkAuth();
  }, [isAuthenticated, segments, isLoading, handleNavigation]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <LanguageProvider>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen 
            name="(auth)" 
            options={{ 
              headerShown: false,
              animation: 'none'
            }} 
          />
          <Stack.Screen 
            name="(tabs)" 
            options={{ 
              headerShown: false,
              animation: 'none'
            }} 
          />
        </Stack>
      </ThemeProvider>
    </LanguageProvider>
  );
} 