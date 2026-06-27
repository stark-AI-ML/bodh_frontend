import React from "react";

const BodhLogo = () => (
  <svg className="logo-mark" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L21 7.196v9.608L12 22l-9-5.196V7.196L12 2z" />
    <path d="M7 12c1.667-2.5 3.333-3.5 5-3.5s3.333 1 5 3.5c-1.667 2.5-3.333 3.5-5 3.5s-3.333-1-5-3.5z" />
    <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
  </svg>
);

const Header = ({ isLoggedIn, theme, toggleTheme, children }) => {
  return (
    <header className="header">
      <div className="logo" onClick={() => window.scrollTo(0, 0)}>
        <BodhLogo /> Bodh<span className="logo-label">API</span>
      </div>
      <div className="header-right">
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle Theme">
          {theme === "dark" ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          )}
        </button>
        {children}
      </div>
    </header>
  );
};

export default Header;