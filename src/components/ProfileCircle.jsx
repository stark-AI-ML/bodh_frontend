import React, { useEffect, useState } from "react";

const GoogleIcon = () => (
  <svg className="g-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const ProfileCircle = ({ baseUrl, onClick, user, hasApiKey }) => {
  const [animateIn, setAnimateIn] = useState(false);
  const [imgFailed, setImgFailed] = useState(false); // Track image load status

  useEffect(() => {
    if (user) {
      const t = setTimeout(() => setAnimateIn(true), 100);
      return () => clearTimeout(t);
    }
  }, [user]);

  if (!user) {
    return (
      <button
        className="google-signin-btn"
        onClick={() => (window.location.href = `${baseUrl}auth/google`)}
        id="google-signin"
      >
        <GoogleIcon />
        <span className="g-label">Sign in with Google</span>
      </button>
    );
  }

  const initials = user?.display_name
    ? user.display_name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <div
      className="profile-wrapper"
      onClick={onClick}
      title="Account & API Key"
      style={animateIn ? {} : { opacity: 0, transform: "scale(0)" }}
    >
      <div className="ring" />
      
      {/* If picture exists AND hasn't failed, show image. Otherwise, show SVG. */}
      {user.picture && !imgFailed ? (
        <img
          src={user.picture}
          alt={user.display_name}
          className="profile-img"
          referrerPolicy="no-referrer" // Fixes the Google 403 Forbidden issue
          onError={() => setImgFailed(true)} // Triggers React to render the fallback
        />
      ) : (
        <svg className="profile-img" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="12" fill="var(--surface)" />
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="var(--accent)"
            fontSize="12"
          >
            {initials}
          </text>
        </svg>
      )}

      {hasApiKey && <span className="profile-status-dot" />}
    </div>
  );
};

export default ProfileCircle;