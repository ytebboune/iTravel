import { authFetch } from '../(auth)/authService';

export async function getProfile() {
  const response = await authFetch('http://localhost:3000/users/profile');
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors de la récupération du profil');
  }
  return response.json();
} 