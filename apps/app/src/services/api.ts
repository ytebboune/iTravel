import { authFetch } from './authService';
import { API_URL } from '../constants';

export async function getProfile() {
  const response = await authFetch(`${API_URL}/users/profile`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors de la récupération du profil');
  }
  return response.json();
} 