import React from "react";

const Header = ({ isLoggedIn, theme, toggleTheme, children }) => {
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
        <button className="theme-btn" onClick={toggleTheme}>
          {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>
        {children}
      </div>
    </header>
  );
};

export default Header;