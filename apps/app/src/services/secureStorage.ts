import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Clés de stockage
export const STORAGE_KEYS = {
  LANGUAGE: 'itravel_language',
  AUTH: {
    ACCESS_TOKEN: 'itravel_access_token',
    REFRESH_TOKEN: 'itravel_refresh_token',
  },
  REDUX: 'itravel_redux_persist',
} as const;

// Types
export type StorageKey = 
  | typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS]
  | typeof STORAGE_KEYS.AUTH[keyof typeof STORAGE_KEYS.AUTH]
  | string; // Pour les clés dynamiques comme celles de redux-persist

// Fonctions de base
export async function setSecureItem(key: StorageKey, value: string): Promise<void> {
  if (!key || typeof key !== 'string') {
    throw new Error('Invalid key provided to SecureStore. Keys must be non-empty strings.');
  }

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
}

export async function getSecureItem(key: StorageKey): Promise<string | null> {
  if (!key || typeof key !== 'string') {
    throw new Error('Invalid key provided to SecureStore. Keys must be non-empty strings.');
  }

  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
}

export async function removeSecureItem(key: StorageKey): Promise<void> {
  if (!key || typeof key !== 'string') {
    throw new Error('Invalid key provided to SecureStore. Keys must be non-empty strings.');
  }

  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
}

// Fonctions pour les objets
export async function setSecureObject<T>(key: StorageKey, value: T): Promise<void> {
  if (!value) {
    await removeSecureItem(key);
    return;
  }
  const jsonValue = JSON.stringify(value);
  await setSecureItem(key, jsonValue);
}

export async function getSecureObject<T>(key: StorageKey): Promise<T | null> {
  const jsonValue = await getSecureItem(key);
  if (!jsonValue) return null;
  try {
    return JSON.parse(jsonValue) as T;
  } catch {
    return null;
  }
} 