import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { getAccessToken } from '../../services/authService';

export default function MainLayout() {
  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = await getAccessToken();
        if (!accessToken) {
          console.log('No access token found, redirecting to login');
          router.replace('/(auth)/login');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        router.replace('/(auth)/login');
      }
    };
    checkAuth();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
      <Stack.Screen name="profile" />
    </Stack>
  );
} 