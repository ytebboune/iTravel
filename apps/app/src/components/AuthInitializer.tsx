import { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { getAuthData } from '../services/secureStorage';
import { initializeAuth } from '../store/authSlice';
import { api } from '../services/api';
import { Platform } from 'react-native';
import * as Device from 'expo-device';

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    username: string;
    emailVerified: boolean;
    avatar: string | null;
  };
}

interface AuthState {
  user: any | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  lastActivity: number | null;
}

// Fonction pour obtenir le user agent
const getUserAgent = () => {
  const deviceInfo = {
    platform: Platform.OS,
    version: Platform.Version,
    model: Device.modelName,
    brand: Device.brand,
  };
  return `${deviceInfo.platform} ${deviceInfo.version} - ${deviceInfo.brand} ${deviceInfo.model}`;
};

export function AuthInitializer() {
  const dispatch = useDispatch();
  const [isInitializing, setIsInitializing] = useState(true);

  const initializeAuthState = useCallback(async () => {
    console.log('Starting auth initialization...');
    let authState: AuthState = {
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      loading: true,
      error: null,
      lastActivity: null,
    };

    try {
      const { accessToken, refreshToken, user, lastActivity } = await getAuthData();
      console.log('Auth data retrieved:', { 
        hasAccessToken: !!accessToken, 
        hasRefreshToken: !!refreshToken, 
        hasUser: !!user 
      });

      if (!accessToken || !refreshToken || !user) {
        console.log('No valid auth data found, initializing as not authenticated');
        authState = {
          ...authState,
          loading: false,
        };
        dispatch(initializeAuth(authState));
        return;
      }

      try {
        console.log('Verifying access token...');
        await api.get('/auth/verify');
        console.log('Access token is valid');
        
        authState = {
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          loading: false,
          error: null,
          lastActivity,
        };
      } catch (error) {
        console.log('Access token invalid, attempting refresh...');
        try {
          const response = await api.post<TokenResponse>('/auth/refresh', { 
            refreshToken,
            userAgent: getUserAgent(),
          });
          const { accessToken: newAccessToken, refreshToken: newRefreshToken, user: newUser } = response.data;
          console.log('Token refresh successful');
          
          authState = {
            user: newUser,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            isAuthenticated: true,
            loading: false,
            error: null,
            lastActivity: Date.now(),
          };
        } catch (refreshError) {
          console.log('Token refresh failed:', refreshError);
          authState = {
            ...authState,
            loading: false,
            isAuthenticated: false,
          };
        }
      }
    } catch (error) {
      console.log('Error during auth initialization:', error);
      authState = {
        ...authState,
        loading: false,
        isAuthenticated: false,
      };
    } finally {
      console.log('Auth initialization completed');
      dispatch(initializeAuth(authState));
      setIsInitializing(false);
    }
  }, [dispatch]);

  useEffect(() => {
    console.log('AuthInitializer mounted');
    initializeAuthState();
  }, [dispatch, initializeAuthState]);

  return null;
}