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

export async function getPosts() {
  const response = await authFetch(`${API_URL}/posts`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors de la récupération des posts');
  }
  return response.json();
}

export async function likePost(postId: string) {
  const response = await authFetch(`${API_URL}/posts/${postId}/like`, {
    method: 'POST',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors du like');
  }
  return response.json();
}

export async function unlikePost(postId: string) {
  const response = await authFetch(`${API_URL}/posts/${postId}/like`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors du unlike');
  }
  return response.json();
}

export async function commentPost(postId: string, content: string) {
  const response = await authFetch(`${API_URL}/posts/${postId}/comment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors de l\'ajout du commentaire');
  }
  return response.json();
} 