import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import authReducer from './authSlice';

// Clé constante pour le stockage Redux
const REDUX_STORAGE_KEY = 'itravel_redux_persist';

// Configuration du stockage en fonction de la plateforme
const storage = Platform.select({
  web: {
    getItem: async (key: string) => {
      try {
        const value = localStorage.getItem(key);
        return value;
      } catch (error) {
        console.error('Error getting persisted state:', error);
        return null;
      }
    },
    setItem: async (key: string, value: string) => {
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.error('Error setting persisted state:', error);
      }
    },
    removeItem: async (key: string) => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('Error removing persisted state:', error);
      }
    },
  },
  default: {
    getItem: async (key: string) => {
      try {
        // On utilise toujours la clé fixe pour SecureStore
        const value = await SecureStore.getItemAsync(REDUX_STORAGE_KEY);
        if (!value) return null;
        try {
          return JSON.parse(value);
        } catch (e) {
          console.error('Error parsing persisted state:', e);
          return null;
        }
      } catch (error) {
        console.error('Error getting persisted state:', error);
        return null;
      }
    },
    setItem: async (key: string, value: any) => {
      try {
        // On sérialise la valeur en JSON avant de la stocker
        const serializedValue = JSON.stringify(value);
        await SecureStore.setItemAsync(REDUX_STORAGE_KEY, serializedValue);
      } catch (error) {
        console.error('Error setting persisted state:', error);
      }
    },
    removeItem: async (key: string) => {
      try {
        // On utilise toujours la clé fixe pour SecureStore
        await SecureStore.deleteItemAsync(REDUX_STORAGE_KEY);
      } catch (error) {
        console.error('Error removing persisted state:', error);
      }
    },
  },
});

// Configuration de redux-persist
const persistConfig = {
  key: REDUX_STORAGE_KEY,
  storage,
  // Désactiver la sérialisation automatique car nous gérons manuellement
  serialize: false,
  deserialize: false,
};

const persistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 