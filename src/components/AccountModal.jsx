import React, { useState } from "react";

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const maskKey = (key) => {
  if (!key || key.length < 10) return key || "";
  return `${key.slice(0, 8)}${"•".repeat(12)}${key.slice(-6)}`;
};

const AccountModal = ({
  onClose,
  baseUrl,
  user,
  apiKey,
  onApiKeyGenerated,
  onLogout,
  onOpenGettingStarted,
}) => {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmRegen, setConfirmRegen] = useState(false);
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 200);
  };

  const handleCopy = async () => {
    if (!apiKey) return;
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const generateKey = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/auth/generate-key`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.apiKey) {
        onApiKeyGenerated(data.apiKey);
      }
    } catch (err) {
      console.error("Failed to generate key:", err);
    } finally {
      setLoading(false);
      setConfirmRegen(false);
    }
  };

  const handleRegenerate = () => {
    setConfirmRegen(true);
  };

  const handleLogout = () => {
    onLogout();
    handleClose();
  };

  if (!user) return null;

  return (
    <div className={`modal-backdrop ${closing ? "closing" : ""}`} onClick={handleClose}>
      <div className="account-modal" onClick={(e) => e.stopPropagation()}>
        {/* Confirm Regenerate Overlay */}
        {confirmRegen && (
          <div className="confirm-overlay">
            <p>
              <strong>Regenerate API Key?</strong>
              <br />
              Your current key will stop working immediately.
            </p>
            <div className="confirm-actions">
              <button className="confirm-cancel" onClick={() => setConfirmRegen(false)}>
                Cancel
              </button>
              <button className="confirm-danger" onClick={generateKey} disabled={loading}>
                {loading ? "Generating…" : "Yes, Regenerate"}
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="account-modal-header">
          <button className="modal-close-btn" onClick={handleClose}>
            ✕
          </button>
        </div>

        {/* Profile */}
        <div className="account-profile">
          <div className="account-avatar-wrap">
            <div className="account-avatar-ring" />
            <img src={user.picture} alt={user.display_name} className="account-avatar" />
          </div>
          <div className="account-name">{user.display_name}</div>
          <div className="account-email">
            <span className="account-email-dot" />
            {user.email}
          </div>
        </div>

        {/* API Key Section */}
        {apiKey ? (
          <div className="account-key-section">
            <div className="key-section-header">
              <span className="key-section-title">API Key</span>
              <span className="key-status-badge">
                <span className="status-dot" />
                Active
              </span>
            </div>

            <div className="key-display-box">
              <span className="key-text">{maskKey(apiKey)}</span>
              <button
                className={`key-copy-btn ${copied ? "copied" : ""}`}
                onClick={handleCopy}
                title="Copy to clipboard"
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
              </button>
            </div>

            <div className="key-actions">
              <button className="key-action-btn secondary" onClick={handleRegenerate}>
                ↻ Regenerate
              </button>
              <button
                className="key-action-btn primary"
                onClick={onOpenGettingStarted}
              >
                Quick Start →
              </button>
            </div>
          </div>
        ) : (
          <div className="no-key-state">
            <div className="no-key-icon">🔑</div>
            <div className="no-key-title">Generate Your API Key</div>
            <p className="no-key-desc">
              Get your personal API key to start making authenticated requests to BodhAPI endpoints.
            </p>
            <button
              className="generate-key-btn"
              onClick={generateKey}
              disabled={loading}
            >
              {loading ? (
                "Generating…"
              ) : (
                <>
                  <span>⚡</span> Generate API Key
                </>
              )}
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="account-modal-footer">
          <button className="signout-btn" onClick={handleLogout}>
            ← Sign Out
          </button>
          {apiKey && (
            <button className="quickstart-link" onClick={onOpenGettingStarted}>
              View Quick Start →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountModal;