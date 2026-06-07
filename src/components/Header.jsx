import React from "react";

const Header = ({ isLoggedIn, apiKey, onLoginClick, onLogout, theme, toggleTheme }) => {
  return (
    <header className="header">
      <div className="logo" onClick={() => window.scrollTo(0, 0)}>
        <span>बो</span> BodhAPI
      </div>
      <div className="header-right">
        {!isLoggedIn && (
          <div className="request-badge">
            <span className="count">Free Tier</span> (No Key)
          </div>
        )}
        <div className="user-area" onClick={isLoggedIn ? onLogout : onLoginClick} title={isLoggedIn ? "Click to logout" : "Click to sign in"}>
          <div className="avatar-circle">
            {isLoggedIn ? "🔑" : "?"}
          </div>
          <span className="api-key-display">
            {isLoggedIn ? `...${apiKey.slice(-6)}` : "Sign in / Get Key"}
          </span>
        </div>
        <button className="theme-btn" onClick={toggleTheme}>
          {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>
    </header>
  );
};

export default Header;
