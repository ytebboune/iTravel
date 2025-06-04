import { api } from './api';
import { 
  setSecureItem, 
  getSecureItem, 
  setSecureObject, 
  clearAuthStorage,
  getAuthData,
  STORAGE_KEYS 
} from './secureStorage';
import { store } from '../store/store';
import { setCredentials, clearAuth, updateTokens, updateLastActivity } from '../store/authSlice';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  username: string;
  avatar?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    username: string;
    emailVerified: boolean;
    avatar: string | null;
  };
  accessToken: string;
  refreshToken: string;
}

class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      await this.handleAuthResponse(response.data);
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  }

  public async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', data);
      await this.handleAuthResponse(response.data);
      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  public async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await this.clearAuth();
    }
  }

  public async refreshToken(): Promise<AuthResponse> {
    try {
      const refreshToken = await getSecureItem(STORAGE_KEYS.AUTH.REFRESH_TOKEN);
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post<AuthResponse>('/auth/refresh', { refreshToken });
      await this.handleAuthResponse(response.data);
      return response.data;
    } catch (error) {
      console.error('Token refresh error:', error);
      await this.clearAuth();
      throw error;
    }
  }

  public async verifyToken(): Promise<boolean> {
    try {
      const { accessToken } = await getAuthData();
      if (!accessToken) return false;

      await api.get('/auth/verify');
      store.dispatch(updateLastActivity());
      return true;
    } catch (error) {
      console.error('Token verification error:', error);
      return false;
    }
  }

  public async getStoredAuth(): Promise<AuthResponse | null> {
    try {
      const { accessToken, refreshToken, user, lastActivity } = await getAuthData();
      
      if (!accessToken || !refreshToken || !user) {
        return null;
      }

      // Vérifier si la session est expirée (30 minutes d'inactivité)
      if (lastActivity && Date.now() - lastActivity > 30 * 60 * 1000) {
        await this.clearAuth();
        return null;
      }

      return { accessToken, refreshToken, user };
    } catch (error) {
      console.error('Error getting stored auth:', error);
      return null;
    }
  }

  private async handleAuthResponse(data: AuthResponse): Promise<void> {
    const { user, accessToken, refreshToken } = data;

    // Stockage sécurisé
    await Promise.all([
      setSecureItem(STORAGE_KEYS.AUTH.ACCESS_TOKEN, accessToken),
      setSecureItem(STORAGE_KEYS.AUTH.REFRESH_TOKEN, refreshToken),
      setSecureObject(STORAGE_KEYS.AUTH.USER, user),
    ]);

    // Mise à jour du store Redux
    store.dispatch(setCredentials({
      user,
      accessToken,
      refreshToken,
    }));
  }

  private async clearAuth(): Promise<void> {
    await clearAuthStorage();
    store.dispatch(clearAuth());
  }
}

export const authService = AuthService.getInstance(); 