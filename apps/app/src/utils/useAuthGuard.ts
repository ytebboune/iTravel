import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAppSelector } from '@/store/hooks';

export function useAuthGuard() {
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated]);
} 