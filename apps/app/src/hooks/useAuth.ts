import { useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCredentials, setLoading, setError, clearAuth } from '@/store/authSlice';
import { authService } from '@/services/auth.service';
import { useRouter } from 'expo-router';

export interface RegisterData {
  email: string;
  password: string;
  username: string;
  avatar?: string;
}

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const { isAuthenticated, loading, error } = useAppSelector(state => state.auth);

  const handleError = useCallback((err: any) => {
    if (err.code === 'ECONNABORTED' || err.message === 'Network Error') {
      return 'Erreur de connexion. Veuillez vérifier votre connexion internet.';
    }
    if (err.response?.status === 401) {
      return 'Identifiants invalides';
    }
    if (err.response?.status === 400) {
      return err.response?.data?.message || 'Données invalides';
    }
    return err.response?.data?.message || err.message || 'Une erreur est survenue';
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsProcessing(true);
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await authService.login({ email, password });
      
      dispatch(setCredentials({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken
      }));

      router.replace('/(tabs)');
      return true;
    } catch (err: any) {
      const errorMessage = handleError(err);
      dispatch(setError(errorMessage));
      return false;
    } finally {
      setIsProcessing(false);
      dispatch(setLoading(false));
    }
  }, [dispatch, router, handleError]);

  const register = useCallback(async (data: RegisterData) => {
    try {
      setIsProcessing(true);
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await authService.register(data);
      
      dispatch(setCredentials({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken
      }));

      router.replace('/(tabs)');
      return true;
    } catch (err: any) {
      const errorMessage = handleError(err);
      dispatch(setError(errorMessage));
      return false;
    } finally {
      setIsProcessing(false);
      dispatch(setLoading(false));
    }
  }, [dispatch, router, handleError]);

  const logout = useCallback(async () => {
    try {
      setIsProcessing(true);
      dispatch(setLoading(true));
      await authService.logout();
      dispatch(clearAuth());
      router.replace('/(auth)/login');
    } catch (err: any) {
      console.error('Logout error:', err);
      // On force la déconnexion même en cas d'erreur
      dispatch(clearAuth());
      router.replace('/(auth)/login');
    } finally {
      setIsProcessing(false);
      dispatch(setLoading(false));
    }
  }, [dispatch, router]);

  const clearError = useCallback(() => {
    dispatch(setError(null));
  }, [dispatch]);

  return {
    login,
    register,
    logout,
    clearError,
    isAuthenticated,
    loading,
    error,
    isProcessing
  };
}; 