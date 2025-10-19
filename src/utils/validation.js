/**
 * Utilitaires de validation pour les formulaires
 */

/**
 * Valide une adresse email
 * @param {string} email - L'email à valider
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return {
      isValid: false,
      error: "L'email ne peut pas être vide"
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Veuillez entrer une adresse email valide'
    };
  }

  return {
    isValid: true,
    error: ''
  };
};

/**
 * Valide un mot de passe
 * @param {string} password - Le mot de passe à valider
 * @param {Object} options - Options de validation
 * @returns {Object} - { isValid: boolean, error: string, strength: string }
 */
export const validatePassword = (password, options = {}) => {
  const {
    minLength = 6,
    requireUppercase = false,
    requireLowercase = false,
    requireNumbers = false,
    requireSpecialChars = false,
  } = options;

  if (!password || password.trim() === '') {
    return {
      isValid: false,
      error: 'Le mot de passe ne peut pas être vide',
      strength: 'none'
    };
  }

  if (password.length < minLength) {
    return {
      isValid: false,
      error: `Le mot de passe doit contenir au moins ${minLength} caractères`,
      strength: 'weak'
    };
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    return {
      isValid: false,
      error: 'Le mot de passe doit contenir au moins une majuscule',
      strength: 'weak'
    };
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    return {
      isValid: false,
      error: 'Le mot de passe doit contenir au moins une minuscule',
      strength: 'weak'
    };
  }

  if (requireNumbers && !/\d/.test(password)) {
    return {
      isValid: false,
      error: 'Le mot de passe doit contenir au moins un chiffre',
      strength: 'medium'
    };
  }

  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      isValid: false,
      error: 'Le mot de passe doit contenir au moins un caractère spécial',
      strength: 'medium'
    };
  }

  // Calcul de la force du mot de passe
  let strength = 'weak';
  if (password.length >= 8) {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const criteriaCount = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

    if (criteriaCount >= 3 && password.length >= 12) {
      strength = 'strong';
    } else if (criteriaCount >= 2) {
      strength = 'medium';
    }
  }

  return {
    isValid: true,
    error: '',
    strength
  };
};

/**
 * Valide un champ requis
 * @param {any} value - La valeur à valider
 * @param {string} fieldName - Le nom du champ
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validateRequired = (value, fieldName = 'Ce champ') => {
  if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
    return {
      isValid: false,
      error: `${fieldName} est requis`
    };
  }

  return {
    isValid: true,
    error: ''
  };
};

/**
 * Valide un nombre
 * @param {any} value - La valeur à valider
 * @param {Object} options - Options de validation
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validateNumber = (value, options = {}) => {
  const { min, max, fieldName = 'Ce champ' } = options;

  const numValue = Number(value);

  if (isNaN(numValue)) {
    return {
      isValid: false,
      error: `${fieldName} doit être un nombre`
    };
  }

  if (min !== undefined && numValue < min) {
    return {
      isValid: false,
      error: `${fieldName} doit être supérieur ou égal à ${min}`
    };
  }

  if (max !== undefined && numValue > max) {
    return {
      isValid: false,
      error: `${fieldName} doit être inférieur ou égal à ${max}`
    };
  }

  return {
    isValid: true,
    error: ''
  };
};

/**
 * Valide une URL
 * @param {string} url - L'URL à valider
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validateUrl = (url) => {
  if (!url || url.trim() === '') {
    return {
      isValid: false,
      error: "L'URL ne peut pas être vide"
    };
  }

  try {
    new URL(url);
    return {
      isValid: true,
      error: ''
    };
  } catch {
    return {
      isValid: false,
      error: 'Veuillez entrer une URL valide'
    };
  }
};

/**
 * Obtient la couleur correspondant à la force du mot de passe
 * @param {string} strength - La force du mot de passe ('weak', 'medium', 'strong')
 * @returns {string} - La couleur correspondante
 */
export const getPasswordStrengthColor = (strength) => {
  switch (strength) {
    case 'weak':
      return '#DC3545'; // Rouge
    case 'medium':
      return '#FFC107'; // Jaune/Orange
    case 'strong':
      return '#28A745'; // Vert
    default:
      return '#666666'; // Gris
  }
};

/**
 * Obtient le label correspondant à la force du mot de passe
 * @param {string} strength - La force du mot de passe
 * @returns {string} - Le label correspondant
 */
export const getPasswordStrengthLabel = (strength) => {
  switch (strength) {
    case 'weak':
      return 'Faible';
    case 'medium':
      return 'Moyen';
    case 'strong':
      return 'Fort';
    default:
      return '';
  }
};
