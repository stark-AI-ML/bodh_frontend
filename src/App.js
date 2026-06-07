import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import ConsolePanel from "./components/ConsolePanel";
import LoginModal from "./components/LoginModal";
import "./App.css";

const BASE_URL = "http://localhost:5000/api";

const App = () => {
  const [theme, setTheme] = useState(localStorage.getItem("bodh_theme") || "dark");
  const [apiKey, setApiKey] = useState(localStorage.getItem("bodh_api_key") || null);
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("bodh_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const isLoggedIn = !!apiKey;

  const handleLogout = () => {
    localStorage.removeItem("bodh_api_key");
    setApiKey(null);
  };

  return (
    <div className="app">
      <Header
        isLoggedIn={isLoggedIn}
        apiKey={apiKey}
        onLoginClick={() => setLoginModalOpen(true)}
        onLogout={handleLogout}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      
      <Sidebar />
      <MainContent />

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
        onLoginRequired={() => setLoginModalOpen(true)}
        baseUrl={BASE_URL}
      />

      {loginModalOpen && (
        <LoginModal
          onClose={() => setLoginModalOpen(false)}
          setApiKey={(key) => {
            setApiKey(key);
            localStorage.setItem("bodh_api_key", key);
          }}
          baseUrl={BASE_URL}
        />
      )}
    </div>
  );
};

export default App;
