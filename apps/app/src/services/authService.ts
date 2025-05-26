// Service d'authentification pour le front Expo/React Native
// Utilise fetch pour communiquer avec l'API NestJS

import { STORAGE_KEYS, getSecureItem, setSecureItem, removeSecureItem } from './secureStorage';
import { API_URL } from '../constants';
import { store } from '../store/store';
import { updateTokens, clearAuth } from '../store/authSlice';

// Cache pour éviter les refresh multiples
let refreshPromise: Promise<any> | null = null;

// Gestion des tokens
export async function getAccessToken() {
  const token = await getSecureItem(STORAGE_KEYS.AUTH.ACCESS_TOKEN);
  console.log('Access token retrieved:', token ? 'exists' : 'null');
  return token;
}

export async function getRefreshToken() {
  const token = await getSecureItem(STORAGE_KEYS.AUTH.REFRESH_TOKEN);
  console.log('Refresh token retrieved:', token ? 'exists' : 'null');
  return token;
}

export async function setTokens(accessToken: string, refreshToken: string) {
  try {
    console.log('Setting tokens...');
    await Promise.all([
      setSecureItem(STORAGE_KEYS.AUTH.ACCESS_TOKEN, accessToken),
      setSecureItem(STORAGE_KEYS.AUTH.REFRESH_TOKEN, refreshToken)
    ]);
    // Mettre à jour Redux
    store.dispatch(updateTokens({ accessToken, refreshToken }));
    console.log('Tokens set successfully');
  } catch (error) {
    console.error('Error setting tokens:', error);
    throw new Error('Failed to store authentication tokens');
  }
}

export async function clearTokens() {
  try {
    console.log('Clearing tokens...');
    await Promise.all([
      removeSecureItem(STORAGE_KEYS.AUTH.ACCESS_TOKEN),
      removeSecureItem(STORAGE_KEYS.AUTH.REFRESH_TOKEN)
    ]);
    // Mettre à jour Redux
    store.dispatch(clearAuth());
    console.log('Tokens cleared successfully');
  } catch (error) {
    console.error('Error clearing tokens:', error);
    throw new Error('Failed to clear authentication tokens');
  }
}

export async function login(email: string, password: string) {
  try {
    console.log('Attempting login to:', `${API_URL}/auth/login`);
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log('Login response:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de la connexion');
    }

    if (data.accessToken && data.refreshToken) {
      await setTokens(data.accessToken, data.refreshToken);
      return data;
    } else {
      throw new Error('Tokens manquants dans la réponse');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function register(username: string, email: string, password: string) {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de l\'inscription');
    }

    const data = await response.json();
    
    // Vérification que les tokens sont présents
    if (!data.accessToken || !data.refreshToken) {
      throw new Error('Tokens manquants dans la réponse');
    }

    // Stockage des tokens
    await setTokens(data.accessToken, data.refreshToken);
    
    return data;
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
}

export async function refreshToken() {
  try {
    console.log('Starting token refresh...');
    const refreshToken = await getRefreshToken();
    console.log('Refresh token retrieved:', refreshToken);

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    if (refreshPromise) {
      console.log('Using existing refresh promise');
      return refreshPromise;
    }

    console.log('Making refresh request to:', `${API_URL}/auth/refresh`);
    refreshPromise = fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    }).then(async (response) => {
      console.log('Refresh response status:', response.status);
      const data = await response.json();
      console.log('Refresh response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors du refresh du token');
      }

      if (data.accessToken) {
        console.log('New access token received:', data.accessToken);
        await setTokens(data.accessToken, data.refreshToken);
        return data;
      } else {
        throw new Error('Nouveau token manquant dans la réponse');
      }
    }).finally(() => {
      refreshPromise = null;
    });

    return refreshPromise;
  } catch (error) {
    console.error('Refresh token error:', error);
    await clearTokens();
    throw error;
  }
}

export async function logout() {
  try {
    console.log('Logging out...');
    await clearTokens();
    console.log('Logout successful');
    return Promise.resolve();
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

// Utilitaire pour fetch avec gestion auto du refresh
export async function authFetch(url: string, options: RequestInit = {}) {
  try {
    const accessToken = await getAccessToken();
    console.log('Making request with access token:', accessToken ? 'exists' : 'null');

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': accessToken ? `Bearer ${accessToken}` : '',
      },
    });

    if (response.status === 401) {
      console.log('Received 401, attempting token refresh...');
      try {
        await refreshToken();
        const newAccessToken = await getAccessToken();
        console.log('New access token obtained:', newAccessToken ? 'exists' : 'null');

        return fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': newAccessToken ? `Bearer ${newAccessToken}` : '',
          },
        });
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        throw refreshError;
      }
    }

    return response;
  } catch (error) {
    console.error('Auth fetch error:', error);
    throw error;
  }
}

export async function forgotPassword(email: string) {
  try {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la demande de réinitialisation');
    }

    return response.json();
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error;
  }
}

export async function resetPassword(token: string, newPassword: string) {
  try {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la réinitialisation du mot de passe');
    }

    return response;
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
} 