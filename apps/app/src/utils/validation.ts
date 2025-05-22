export const validateEmail = (email: string): { isValid: boolean; message: string } => {
  if (!email) {
    return { isValid: false, message: 'L\'email est requis' };
  }

  // Vérifie la longueur totale
  if (email.length > 254) {
    return { isValid: false, message: 'L\'email ne doit pas dépasser 254 caractères' };
  }

  // Vérifie la longueur de la partie locale (avant @)
  const localPart = email.split('@')[0];
  if (localPart.length > 64) {
    return { isValid: false, message: 'La partie avant @ ne doit pas dépasser 64 caractères' };
  }

  // Regex plus stricte pour les caractères autorisés
  // - Avant @ : lettres, chiffres, points, tirets, underscores
  // - Après @ : lettres, chiffres, tirets, points
  // - Domaine : au moins 2 caractères après le dernier point
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Veuillez saisir une adresse email valide (exemple@domaine.com)' };
  }

  // Vérifie qu'il n'y a pas de points consécutifs
  if (email.includes('..')) {
    return { isValid: false, message: 'L\'email ne doit pas contenir de points consécutifs' };
  }

  // Vérifie que l'email ne commence ou ne finit pas par un point
  if (email.startsWith('.') || email.endsWith('.')) {
    return { isValid: false, message: 'L\'email ne doit pas commencer ou finir par un point' };
  }

  return { isValid: true, message: '' };
};

export const validateLoginPassword = (password: string): { isValid: boolean; message: string } => {
  if (!password) {
    return { isValid: false, message: 'Le mot de passe est requis' };
  }
  return { isValid: true, message: '' };
};

export const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (!password) {
    return { isValid: false, message: 'Le mot de passe est requis' };
  }
  if (password.length < 8) {
    return { isValid: false, message: 'Le mot de passe doit contenir au moins 8 caractères' };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Le mot de passe doit contenir au moins une majuscule' };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Le mot de passe doit contenir au moins une minuscule' };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Le mot de passe doit contenir au moins un chiffre' };
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return { isValid: false, message: 'Le mot de passe doit contenir au moins un caractère spécial' };
  }
  return { isValid: true, message: '' };
};

export const validateConfirmPassword = (password: string, confirmPassword: string): { isValid: boolean; message: string } => {
  if (!confirmPassword) {
    return { isValid: false, message: 'La confirmation du mot de passe est requise' };
  }
  if (password !== confirmPassword) {
    return { isValid: false, message: 'Les mots de passe ne correspondent pas' };
  }
  return { isValid: true, message: '' };
}; 