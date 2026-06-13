import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import ConsolePanel from './components/ConsolePanel';
import ProfileCircle from './components/ProfileCircle';
import AccountModal from './components/AccountModal';
import GettingStartedPage from './components/GettingStartedPage';
import './App.css';

const BASE_URL = 'http://localhost:3000/';

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

const App = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem('bodh_theme') || 'dark'
  );
  const [user, setUser] = useState(null);
  const [apiKey, setApiKey] = useState(null);
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [gettingStartedOpen, setGettingStartedOpen] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  // 🌙 Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('bodh_theme', theme);
  }, [theme]);

  // 🔐 Fetch session user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${BASE_URL}/auth/me`, {
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setApiKey(data.apiKey || null);
          persistUser(data);
        } else {
          // fallback cache
          const cached = getCachedUser();
          if (cached) {
            setUser(cached);
            setApiKey(cached.apiKey || null);
          }
        }
      } catch {
        const cached = getCachedUser();
        if (cached) {
          setUser(cached);
          setApiKey(cached.apiKey || null);
        }
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLogout = async () => {
    try {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {}

    clearPersistedUser();
    setUser(null);
    setApiKey(null);
  };

  const handleApiKeyGenerated = (newKey) => {
    setApiKey(newKey);
    // Update cached user
    if (user) {
      const updated = { ...user, apiKey: newKey };
      setUser(updated);
      persistUser(updated);
    }
  };

  const handleOpenGettingStarted = () => {
    setAccountOpen(false);
    setTimeout(() => setGettingStartedOpen(true), 200);
  };

  const isLoggedIn = !!user;

  // Don't render anything until we know the auth state
  if (loadingUser) return null;

  return (
    <div className="app">
      <Header isLoggedIn={isLoggedIn} theme={theme} toggleTheme={toggleTheme}>
        <ProfileCircle
          baseUrl={BASE_URL}
          onClick={() => setAccountOpen(true)}
          user={user}
          hasApiKey={!!apiKey}
        />
      </Header>

      <Sidebar />
      <MainContent />

      {/* Console */}
      <button
        className="console-toggle"
        onClick={() => setConsoleOpen(!consoleOpen)}
        title="API Console"
      >
        ⌨️
      </button>

      <ConsolePanel
        open={consoleOpen}
        onClose={() => setConsoleOpen(false)}
        isLoggedIn={isLoggedIn}
        apiKey={apiKey}
        onLoginRequired={() =>
          (window.location.href = `${BASE_URL}/auth/google`)
        }
        baseUrl={BASE_URL}
      />

      {/* Account Modal */}
      {accountOpen && (
        <AccountModal
          onClose={() => setAccountOpen(false)}
          baseUrl={BASE_URL}
          user={user}
          apiKey={apiKey}
          onApiKeyGenerated={handleApiKeyGenerated}
          onLogout={handleLogout}
          onOpenGettingStarted={handleOpenGettingStarted}
        />
      )}

      {/* Getting Started Overlay */}
      {gettingStartedOpen && (
        <GettingStartedPage
          apiKey={apiKey}
          onClose={() => setGettingStartedOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
