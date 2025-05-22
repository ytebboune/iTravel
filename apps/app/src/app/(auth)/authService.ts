// Service d'authentification pour le front Expo/React Native
// Utilise fetch pour communiquer avec l'API NestJS

import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3000'; // À adapter selon ton environnement
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors de la connexion');
  }
  const data = await response.json(); // { accessToken, refreshToken, user }
  await AsyncStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
  await AsyncStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
  return data;
}

export async function register(username: string, email: string, password: string) {
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
  await AsyncStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
  await AsyncStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
  return data;
}

export async function refreshToken() {
  const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) throw new Error('Aucun refreshToken');
  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  if (!response.ok) {
    throw new Error('Session expirée');
  }
  const data = await response.json(); // { accessToken, refreshToken }
  await AsyncStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
  await AsyncStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
  return data;
}

export async function getAccessToken() {
  return AsyncStorage.getItem(ACCESS_TOKEN_KEY);
}

export async function logout() {
  await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
  await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
  // Tu peux aussi appeler un endpoint de logout côté back si besoin
  return Promise.resolve();
}

// Utilitaire pour fetch avec gestion auto du refresh
export async function authFetch(input: RequestInfo, init: RequestInit = {}) {
  let accessToken = await getAccessToken();
  const headers = {
    ...(init.headers || {}),
    Authorization: accessToken ? `Bearer ${accessToken}` : '',
    'Content-Type': 'application/json',
  };
  let response = await fetch(input, { ...init, headers });
  if (response.status === 401) {
    try {
      const refreshed = await refreshToken();
      accessToken = refreshed.accessToken;
      const retryHeaders = {
        ...headers,
        Authorization: `Bearer ${accessToken}`,
      };
      response = await fetch(input, { ...init, headers: retryHeaders });
    } catch (e) {
      await logout();
      throw new Error('Session expirée, veuillez vous reconnecter');
    }
  }
  return response;
} 