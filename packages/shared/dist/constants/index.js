"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_MESSAGES = exports.APP_URL = exports.API_URL = void 0;
// Constantes de l'application
exports.API_URL = process.env.API_URL || 'http://192.168.1.195:3000';
exports.APP_URL = process.env.APP_URL || 'http://localhost:4200';
// Messages d'erreur
exports.ERROR_MESSAGES = {
    UNAUTHORIZED: 'Non autorisé',
    FORBIDDEN: 'Accès interdit',
    NOT_FOUND: 'Ressource non trouvée',
    INTERNAL_ERROR: 'Erreur interne du serveur',
};
