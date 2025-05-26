// Constantes de l'application
export const API_URL = process.env.API_URL || 'http://192.168.1.195:3000';
export const APP_URL = process.env.APP_URL || 'http://localhost:4200';

// Messages d'erreur
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Non autorisé',
  FORBIDDEN: 'Accès interdit',
  NOT_FOUND: 'Ressource non trouvée',
  INTERNAL_ERROR: 'Erreur interne du serveur',
} as const; 