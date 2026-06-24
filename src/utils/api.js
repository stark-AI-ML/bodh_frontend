// ─────────────────────────────────────────────
//  API Configuration — Single source of truth
// ─────────────────────────────────────────────

// export const BASE_URL = 'https://localhost:5000';
export const BASE_URL = 'https://bodhapi.online';
// All backend route paths in one place.
// If a route is wrong, fix it here — every component picks it up.
export const ROUTES = {
  // Auth
  AUTH_ME: '/auth/me',
  AUTH_GOOGLE: '/auth/google',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_GENERATE_KEY: '/auth/generate-key',
  REFRESH: '/refresh',

  // API Keys
  GET_CURRENT_KEYS: '/api/getCurrentKeys',
  REMOVE_KEY: '/api/removeKey',
};

// Helper: returns full URL for a route
export const url = (route) => `${BASE_URL}${route}`;
