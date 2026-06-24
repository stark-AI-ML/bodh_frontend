// Authenticated fetch utility with automatic token refresh
// Rate-limits refresh attempts to prevent infinite loops

import { url, ROUTES } from './api';

const REFRESH_URL = url(ROUTES.REFRESH);
let isRefreshing = false;
let refreshAttempts = 0;
let lastRefreshTime = 0;
const MAX_REFRESH_ATTEMPTS = 3;
const REFRESH_WINDOW_MS = 30000; // 30 seconds

const resetRefreshCounter = () => {
  const now = Date.now();
  if (now - lastRefreshTime > REFRESH_WINDOW_MS) {
    refreshAttempts = 0;
  }
};

const tryRefresh = async () => {
  resetRefreshCounter();

  if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
    // Too many refresh attempts in a short window — something is wrong
    return { success: false, relogin: true };
  }

  if (isRefreshing) {
    // Another refresh is already in progress — wait briefly
    await new Promise((r) => setTimeout(r, 1000));
    return { success: !isRefreshing, relogin: false };
  }

  isRefreshing = true;
  refreshAttempts++;
  lastRefreshTime = Date.now();

  try {
    const res = await fetch(REFRESH_URL, {
      method: 'POST',
      credentials: 'include',
      headers: { Accept: 'application/json' },
    });

    isRefreshing = false;

    if (res.ok) {
      return { success: true, relogin: false };
    }
    return { success: false, relogin: true };
  } catch {
    isRefreshing = false;
    return { success: false, relogin: false };
  }
};

/**
 * authFetch — drop-in replacement for fetch() that:
 *   1. Sends credentials: 'include' automatically
 *   2. On 401, attempts POST /refresh to renew the access token
 *   3. On success, retries the original request once
 *   4. Rate-limits refresh attempts (max 3 per 30s window)
 *   5. Returns { relogin: true } if the session is fully dead
 *
 * Usage:
 *   const { res, relogin } = await authFetch('/some/endpoint', { method: 'GET' });
 *   if (relogin) { // show re-login UI }
 *   if (res.ok) { // process data }
 */
export const authFetch = async (url, options = {}) => {
  const opts = {
    ...options,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...options.headers,
    },
  };

  try {
    let res = await fetch(url, opts);

    if (res.status === 401) {
      const { success, relogin } = await tryRefresh();

      if (relogin) {
        return { res, relogin: true };
      }

      if (success) {
        // Retry the original request with new token
        res = await fetch(url, opts);
      }
    }

    return { res, relogin: false };
  } catch (err) {
    // Network error
    return { res: null, relogin: false, error: err };
  }
};

export default authFetch;
