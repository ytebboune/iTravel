import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Clés de stockage
export const STORAGE_KEYS = {
  LANGUAGE: 'itravel_language',
  AUTH: {
    ACCESS_TOKEN: 'itravel_access_token',
    REFRESH_TOKEN: 'itravel_refresh_token',
    USER: 'itravel_user',
    LAST_ACTIVITY: 'itravel_last_activity',
  },
  REDUX: 'itravel_redux_persist',
} as const;

// Types
export type StorageKey = 
  | typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS]
  | typeof STORAGE_KEYS.AUTH[keyof typeof STORAGE_KEYS.AUTH]
  | string;

// Fonctions de base
export async function setSecureItem(key: StorageKey, value: string): Promise<void> {
  if (!key || typeof key !== 'string') {
    throw new Error('Invalid key provided to SecureStore. Keys must be non-empty strings.');
  }

  try {
    if (Platform.OS === 'web') {
      if (!value) {
        localStorage.removeItem(key);
        return;
      }
      localStorage.setItem(key, value);
    } else {
      if (!value) {
        await SecureStore.deleteItemAsync(key);
        return;
      }
      await SecureStore.setItemAsync(key, value);
    }
  } catch (error) {
    console.error(`Error setting secure item ${key}:`, error);
    throw new Error(`Failed to store ${key}`);
  }
}

export async function getSecureItem(key: StorageKey): Promise<string | null> {
  if (!key || typeof key !== 'string') {
    throw new Error('Invalid key provided to SecureStore. Keys must be non-empty strings.');
  }

  try {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error(`Error getting secure item ${key}:`, error);
    return null;
  }
}

export async function removeSecureItem(key: StorageKey): Promise<void> {
  if (!key || typeof key !== 'string') {
    throw new Error('Invalid key provided to SecureStore. Keys must be non-empty strings.');
  }

  try {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  } catch (error) {
    console.error(`Error removing secure item ${key}:`, error);
    throw new Error(`Failed to remove ${key}`);
  }
}

// Fonctions pour les objets
export async function setSecureObject<T>(key: StorageKey, value: T): Promise<void> {
  if (!value) {
    await removeSecureItem(key);
    return;
  }
  try {
    const jsonValue = JSON.stringify(value);
    await setSecureItem(key, jsonValue);
  } catch (error) {
    console.error(`Error setting secure object ${key}:`, error);
    throw new Error(`Failed to store object ${key}`);
  }
}

export async function getSecureObject<T>(key: StorageKey): Promise<T | null> {
  try {
    const jsonValue = await getSecureItem(key);
    if (!jsonValue) return null;
    return JSON.parse(jsonValue) as T;
  } catch (error) {
    console.error(`Error getting secure object ${key}:`, error);
    return null;
  }
}

// Fonctions spécifiques pour l'authentification
export async function clearAuthStorage(): Promise<void> {
  try {
    await Promise.all([
      removeSecureItem(STORAGE_KEYS.AUTH.ACCESS_TOKEN),
      removeSecureItem(STORAGE_KEYS.AUTH.REFRESH_TOKEN),
      removeSecureItem(STORAGE_KEYS.AUTH.USER),
      removeSecureItem(STORAGE_KEYS.AUTH.LAST_ACTIVITY),
    ]);
  } catch (error) {
    console.error('Error clearing auth storage:', error);
    throw new Error('Failed to clear authentication data');
  }
}

export async function getAuthData(): Promise<{
  accessToken: string | null;
  refreshToken: string | null;
  user: any | null;
  lastActivity: number | null;
}> {
  try {
    const [accessToken, refreshToken, user, lastActivity] = await Promise.all([
      getSecureItem(STORAGE_KEYS.AUTH.ACCESS_TOKEN),
      getSecureItem(STORAGE_KEYS.AUTH.REFRESH_TOKEN),
      getSecureObject(STORAGE_KEYS.AUTH.USER),
      getSecureItem(STORAGE_KEYS.AUTH.LAST_ACTIVITY),
    ]);

    return {
      accessToken,
      refreshToken,
      user,
      lastActivity: lastActivity ? parseInt(lastActivity, 10) : null,
    };
  } catch (error) {
    console.error('Error getting auth data:', error);
    return {
      accessToken: null,
      refreshToken: null,
      user: null,
      lastActivity: null,
    };
  }
} 