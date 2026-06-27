import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import ConsolePanel from './components/ConsolePanel';
import ProfileCircle from './components/ProfileCircle';
import AccountModal from './components/AccountModal';
import GettingStartedPage from './components/GettingStartedPage';
import { authFetch } from './utils/authFetch';
import { BASE_URL, ROUTES, url } from './utils/api';
import './App.css';

// Helper: try chrome.storage.local first, fall back to localStorage
const persistUser = (data) => {
  try {
    localStorage.setItem('bodh_user', JSON.stringify(data));
  } catch {}
  try {
    if (window.chrome?.storage?.local) {
      window.chrome.storage.local.set({ bodh_user: data });
    }
  } catch {}
};

const clearPersistedUser = () => {
  try {
    localStorage.removeItem('bodh_user');
  } catch {}
  try {
    if (window.chrome?.storage?.local) {
      window.chrome.storage.local.remove('bodh_user');
    }
  } catch {}
};

const getCachedUser = () => {
  try {
    const cached = localStorage.getItem('bodh_user');
    if (cached) return JSON.parse(cached);
  } catch {}
  return null;
};

// API Keys cache — persisted in localStorage, only refreshed on page load
const getCachedKeys = () => {
  try {
    const cached = localStorage.getItem('bodh_api_keys');
    if (cached) {
      const parsed = JSON.parse(cached);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch {}
  return [];
};

const persistKeys = (keys) => {
  try {
    localStorage.setItem('bodh_api_keys', JSON.stringify(keys));
  } catch {}
};

const clearCachedKeys = () => {
  try {
    localStorage.removeItem('bodh_api_keys');
  } catch {}
};

const safeJson = async (res) => {
  try {
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await res.json();
    }
  } catch (err) {
    console.error('Failed to parse JSON:', err);
  }
  return null;
};

// Converts image URL to Base64 so we don't spam Google servers (avoids 429)
const cacheImageAsBase64 = async (url) => {
  if (!url || url.startsWith('data:')) return url;
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => resolve(url);
      reader.readAsDataURL(blob);
    });
  } catch {
    return url;
  }
};

const App = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem('bodh_theme') || 'dark'
  );
  const [user, setUser] = useState(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [usageOpen, setUsageOpen] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  // All keys from /getCurrentKeys — cached in localStorage
  const [allKeys, setAllKeys] = useState(getCachedKeys());

  // Freshly generated full key — only lives in memory, never persisted
  const [newlyGeneratedKey, setNewlyGeneratedKey] = useState(null);

  // 🌙 Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('bodh_theme', theme);
  }, [theme]);

  // 🔐 Fetch session user + keys on page load only
  useEffect(() => {
    const init = async () => {
      // 1. Fetch user
      try {
        const { res, relogin } = await authFetch(url(ROUTES.AUTH_ME));

        if (relogin || (res && res.status === 401)) {
          // Definitely logged out, clear cache
          clearPersistedUser();
          setUser(null);
        } else if (!res || !res.ok) {
          // Network error or server error — try cache
          const cached = getCachedUser();
          if (cached) setUser(cached);
        } else {
          const data = await safeJson(res);
          if (data) {
            setUser(data);
            persistUser(data);
            
            if (data.picture && typeof data.picture === 'string' && data.picture.startsWith('http')) {
              // Fetch the Google image asynchronously so we don't block the UI loading
              cacheImageAsBase64(data.picture).then(base64Str => {
                if (base64Str !== data.picture) {
                  const updatedUser = { ...data, picture: base64Str };
                  setUser(updatedUser);
                  persistUser(updatedUser);
                }
              }).catch(() => {});
            }
          } else {
            // Response was OK but not JSON — fallback
            const cached = getCachedUser();
            if (cached) setUser(cached);
          }
        }
      } catch {
        const cached = getCachedUser();
        if (cached) setUser(cached);
      }

      // We have the user state, stop the loading screen immediately!
      setLoadingUser(false);

      // 2. Fetch keys (only on page load — not on every modal open)
      // This happens in the background, we don't need to block the UI for it
      try {
        const { res } = await authFetch(url(ROUTES.GET_CURRENT_KEYS));

        if (res && res.status === 401) {
          clearCachedKeys();
          setAllKeys([]);
        } else if (res && res.ok) {
          const data = await safeJson(res);
          if (data) {
            let keys = [];
            if (Array.isArray(data)) {
              keys = data;
            } else if (Array.isArray(data.keys)) {
              keys = data.keys;
            }
            setAllKeys(keys);
            persistKeys(keys);
          }
        }
      } catch {}
    };

    init();
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLogout = async () => {
    try {
      await fetch(url(ROUTES.AUTH_LOGOUT), {
        method: 'POST',
        credentials: 'include',
      });
    } catch {}

    clearPersistedUser();
    clearCachedKeys();
    setUser(null);
    setAllKeys([]);
    setNewlyGeneratedKey(null);
  };

  const handleApiKeyGenerated = (fullKey, keyMeta) => {
    // Defensive check
    if (!fullKey || !keyMeta || typeof keyMeta !== 'object') return;
    
    // fullKey = the full secret string (only held in memory)
    // keyMeta = { name, key (prefix), expiresAt, lastUsed }
    setNewlyGeneratedKey(fullKey);

    // Update the cached keys list
    setAllKeys((prev) => {
      const prevKeys = Array.isArray(prev) ? prev : [];
      const updated = [keyMeta, ...prevKeys].filter(k => k && typeof k === 'object');
      persistKeys(updated);
      return updated;
    });
  };

  const handleApiKeyDeleted = (deletedKeyPrefix) => {
    if (!deletedKeyPrefix) return;
    setAllKeys((prev) => {
      const prevKeys = Array.isArray(prev) ? prev : [];
      const updated = prevKeys.filter((k) => k && typeof k === 'object' && k.key !== deletedKeyPrefix);
      persistKeys(updated);
      return updated;
    });
  };

  const handleOpenUsage = () => {
    setAccountOpen(false);
    setTimeout(() => setUsageOpen(true), 200);
  };

  const handleCloseUsage = () => {
    // When user closes the usage page, the full key is gone forever
    setNewlyGeneratedKey(null);
    setUsageOpen(false);
  };

  const handleReloginRequired = () => {
    // Session is fully dead — clear everything and force re-login
    clearPersistedUser();
    clearCachedKeys();
    setUser(null);
    setAllKeys([]);
    setAccountOpen(false);
    // Optionally redirect to login (Commented out per user request)
    // window.location.href = url(ROUTES.AUTH_GOOGLE);
  };

  const isLoggedIn = !!user;
  const latestKey =
    Array.isArray(allKeys) && allKeys.length > 0 ? allKeys[0] : null;

  // Don't render anything until we know the auth state
  if (loadingUser) return null;

  return (
    <div className="app">
      <Header isLoggedIn={isLoggedIn} theme={theme} toggleTheme={toggleTheme}>
        <ProfileCircle
          baseUrl={BASE_URL + '/'}
          onClick={() => setAccountOpen(true)}
          user={user}
          hasApiKey={!!latestKey}
        />
      </Header>

      <Sidebar />
      <MainContent />

<<<<<<< HEAD
      {/* Persistent API Console */}
=======
>>>>>>> uiChange
      <ConsolePanel
        isLoggedIn={isLoggedIn}
        apiKey={latestKey?.key}
        onLoginRequired={() =>
          (window.location.href = url(ROUTES.AUTH_GOOGLE))
        }
        baseUrl={BASE_URL}
      />

      {/* Account Modal */}
      {accountOpen && (
        <AccountModal
          onClose={() => setAccountOpen(false)}
          baseUrl={BASE_URL}
          user={user}
          latestKey={latestKey}
          onApiKeyGenerated={handleApiKeyGenerated}
          onLogout={handleLogout}
          onOpenUsage={handleOpenUsage}
          onReloginRequired={handleReloginRequired}
        />
      )}

      {/* Usage Page */}
      {usageOpen && (
        <GettingStartedPage
          newlyGeneratedKey={newlyGeneratedKey}
          allKeys={allKeys}
          onClose={handleCloseUsage}
          baseUrl={BASE_URL}
          onKeyDeleted={handleApiKeyDeleted}
        />
      )}
    </div>
  );
};

export default App;
