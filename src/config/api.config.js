/**
 * API Configuration
 * Gère automatiquement les URLs backend selon l'environnement
 */

const ENV = import.meta.env.MODE || 'development';

const API_CONFIG = {
  development: {
    BASE_URL: 'http://localhost:3007',
    TIMEOUT: 10000,
  },
  production: {
    BASE_URL: 'https://www.krisscode.fr/recette',
    TIMEOUT: 15000,
  }
};

// Configuration active selon l'environnement
const config = API_CONFIG[ENV] || API_CONFIG.development;

export const API_BASE_URL = config.BASE_URL;
export const API_TIMEOUT = config.TIMEOUT;

// Helper pour construire les URLs d'endpoints
export const buildUrl = (endpoint) => {
  // Enlever le slash initial si présent
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

// URLs des endpoints principaux
export const ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  AUTH_ME: '/auth/me',
  AUTH_VERIFY_EMAIL: '/auth/verify-email',

  // Recipes
  RECIPES_ALL: '/recipes/all',
  RECIPES_FILTER: '/recipes/filter',
  RECIPES_UPLOAD: '/recipes/upload',
  RECIPES_BY_ID: (id) => `/recipes/${id}`,
  RECIPES_CALORIES: (id) => `/recipes/${id}/calories`,

  // Ingredients
  INGREDIENTS: '/ingredients',
  INGREDIENTS_BY_ID: (id) => `/ingredients/${id}`,

  // Categories
  CATEGORIES: '/categories',
  CATEGORIES_BY_ID: (id) => `/categories/${id}`,

  // Calendar
  CALENDAR_ADD: '/calendar/add',
  CALENDAR_USER: '/calendar/user',
  CALENDAR_EVENTS: '/calendar',
  CALENDAR_INGREDIENTS_PRICES: '/calendar/ingredients/prices',
  CALENDAR_DELETE: (id) => `/calendar/delete/${id}`,
};

export default {
  API_BASE_URL,
  API_TIMEOUT,
  ENDPOINTS,
  buildUrl,
};
