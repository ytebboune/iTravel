import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '@/stores/auth-store';

export function NavigationGuard({ children }: { children: React.ReactNode }) {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Rediriger vers la page d'accueil si l'utilisateur est authentifié
      router.replace('/(main)');
    }
  }, [isAuthenticated, segments]);

  return <>{children}</>;
} 