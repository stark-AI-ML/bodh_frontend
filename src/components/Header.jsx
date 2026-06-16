import React from "react";

const Header = ({ isLoggedIn, theme, toggleTheme, children }) => {
  return (
    <header className="header">
      <div className="logo" onClick={() => window.scrollTo(0, 0)}>
        <span className="logo-mark">⬢</span> Bodh<span className="logo-label">API</span>
      </div>
      <div className="header-right">
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle Theme">
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
        {children}
      </div>
    </header>
  );
};

export default Header;