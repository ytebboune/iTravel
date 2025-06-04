import axios from 'axios';
import { API_URL } from '../constants';
import { 
  getSecureItem, 
  setSecureItem, 
  clearAuthStorage,
  STORAGE_KEYS 
} from './secureStorage';
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

interface ApiConfig {
  headers?: Record<string, string>;
  _retry?: boolean;
}

// Création de l'instance axios
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 secondes de timeout
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

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

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  async (config: any) => {
    const token = await getSecureItem(STORAGE_KEYS.AUTH.ACCESS_TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Ajouter le user agent à chaque requête
    config.headers['User-Agent'] = getUserAgent();
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  async (error: any) => {
    const originalRequest = error.config;

    // Ne pas tenter de refresh sur les routes d'authentification
    if (originalRequest.url === '/auth/login' || originalRequest.url === '/auth/register') {
      // Propager l'erreur telle quelle pour les routes d'authentification
      return Promise.reject(error);
    }

    // Ne pas retenter si c'est déjà une requête de refresh
    if (originalRequest.url === '/auth/refresh') {
      return Promise.reject(error);
    }

    // Gestion des erreurs de timeout
    if (error.code === 'ECONNABORTED') {
      error.message = 'La requête a expiré. Veuillez réessayer.';
      return Promise.reject(error);
    }

    // Gestion des erreurs réseau
    if (!error.response) {
      error.message = 'Erreur de connexion. Veuillez vérifier votre connexion internet.';
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await getSecureItem(STORAGE_KEYS.AUTH.REFRESH_TOKEN);
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await api.post<TokenResponse>('/auth/refresh', { 
          refreshToken,
          userAgent: getUserAgent(),
        });
        
        const { accessToken, refreshToken: newRefreshToken, user } = response.data;

        await Promise.all([
          setSecureItem(STORAGE_KEYS.AUTH.ACCESS_TOKEN, accessToken),
          setSecureItem(STORAGE_KEYS.AUTH.REFRESH_TOKEN, newRefreshToken),
          setSecureItem(STORAGE_KEYS.AUTH.USER, JSON.stringify(user)),
        ]);

        processQueue(null, accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError: any) {
        processQueue(refreshError, null);
        await clearAuthStorage();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Gestion des erreurs avec messages
    if (error.response) {
      const errorMessage = error.response.data?.message || error.response.data?.error || 'Une erreur est survenue';
      error.message = errorMessage;
    }

    return Promise.reject(error);
  }
);

export async function getProfile() {
  try {
    const response = await api.get('/users/profile');
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || 'Erreur lors de la récupération du profil');
  }
}

export async function getPosts() {
  try {
    const response = await api.get('/posts');
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || 'Erreur lors de la récupération des posts');
  }
}

export async function likePost(postId: string) {
  try {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || 'Erreur lors du like du post');
  }
}

export async function unlikePost(postId: string) {
  try {
    const response = await api.delete(`/posts/${postId}/like`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || 'Erreur lors du unlike du post');
  }
}

export async function commentPost(postId: string, content: string) {
  try {
    const response = await api.post(`/posts/${postId}/comment`, { content });
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || 'Erreur lors de l\'ajout du commentaire');
  }
}

export async function getActiveSessions() {
  try {
    const response = await api.get('/auth/sessions');
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || 'Erreur lors de la récupération des sessions');
  }
}

export async function logoutSession(sessionId: string) {
  try {
    const response = await api.delete(`/auth/sessions/${sessionId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || 'Erreur lors de la déconnexion de la session');
  }
}

export async function logoutAllSessions() {
  try {
    const response = await api.delete('/auth/sessions');
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || 'Erreur lors de la déconnexion de toutes les sessions');
  }
} 