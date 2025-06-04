import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAuthData, setSecureItem, STORAGE_KEYS } from '../services/secureStorage';

interface User {
  id: string;
  email: string;
  username: string;
  avatar: string | null;
  emailVerified: boolean;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  lastActivity: number | null;
}

// Récupérer l'état initial depuis le stockage
const getInitialState = async (): Promise<AuthState> => {
  try {
    const { accessToken, refreshToken, user, lastActivity } = await getAuthData();
    return {
      user,
      accessToken,
      refreshToken,
      isAuthenticated: !!(accessToken && user),
      loading: false,
      error: null,
      lastActivity,
    };
  } catch (error) {
    console.error('Error loading initial auth state:', error);
    return {
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      lastActivity: null,
    };
  }
};

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: true, // Commencer avec loading true
  error: null,
  lastActivity: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
        refreshToken: string;
      }>
    ) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.error = null;
      state.loading = false;
      state.lastActivity = Date.now();

      // Persister les données
      Promise.all([
        setSecureItem(STORAGE_KEYS.AUTH.ACCESS_TOKEN, accessToken),
        setSecureItem(STORAGE_KEYS.AUTH.REFRESH_TOKEN, refreshToken),
        setSecureItem(STORAGE_KEYS.AUTH.USER, JSON.stringify(user)),
        setSecureItem(STORAGE_KEYS.AUTH.LAST_ACTIVITY, Date.now().toString()),
      ]).catch(error => {
        console.error('Error persisting auth data:', error);
      });
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loading = false;
      state.lastActivity = null;

      // Nettoyer le stockage
      Promise.all([
        setSecureItem(STORAGE_KEYS.AUTH.ACCESS_TOKEN, ''),
        setSecureItem(STORAGE_KEYS.AUTH.REFRESH_TOKEN, ''),
        setSecureItem(STORAGE_KEYS.AUTH.USER, ''),
        setSecureItem(STORAGE_KEYS.AUTH.LAST_ACTIVITY, ''),
      ]).catch(error => {
        console.error('Error clearing auth data:', error);
      });
    },
    updateTokens: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
      }>
    ) => {
      const { accessToken, refreshToken } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.lastActivity = Date.now();

      // Persister les nouveaux tokens
      Promise.all([
        setSecureItem(STORAGE_KEYS.AUTH.ACCESS_TOKEN, accessToken),
        setSecureItem(STORAGE_KEYS.AUTH.REFRESH_TOKEN, refreshToken),
        setSecureItem(STORAGE_KEYS.AUTH.LAST_ACTIVITY, Date.now().toString()),
      ]).catch(error => {
        console.error('Error persisting new tokens:', error);
      });
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        // Persister les données utilisateur mises à jour
        setSecureItem(STORAGE_KEYS.AUTH.USER, JSON.stringify(state.user)).catch(error => {
          console.error('Error persisting updated user data:', error);
        });
      }
    },
    updateLastActivity: (state) => {
      state.lastActivity = Date.now();
      setSecureItem(STORAGE_KEYS.AUTH.LAST_ACTIVITY, Date.now().toString()).catch(error => {
        console.error('Error updating last activity:', error);
      });
    },
    initializeAuth: (state, action: PayloadAction<AuthState>) => {
      return { ...action.payload, loading: false };
    },
  },
});

export const {
  setCredentials,
  setLoading,
  setError,
  clearAuth,
  updateTokens,
  updateUser,
  updateLastActivity,
  initializeAuth,
} = authSlice.actions;

export default authSlice.reducer; 