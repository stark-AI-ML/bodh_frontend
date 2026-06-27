import React, { useState } from "react";
import { authFetch } from "../utils/authFetch";
import { showToast } from "../utils/toast";
import { url, ROUTES } from "../utils/api";



const getPrefix = (key) => {
  if (!key) return "";
  return key.length > 21 ? key.substring(0, 21) + "..." : key;
};

const AccountModal = ({
  onClose,
  baseUrl,
  user,
  latestKey, // { name, key (prefix), expiresAt } — from cached /getCurrentKeys
  onApiKeyGenerated,
  onLogout,
  onOpenUsage,
  onReloginRequired,
}) => {
  const [loading, setLoading] = useState(false);

  const [closing, setClosing] = useState(false);

  // Generation state
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 200);
  };



  const startGenerate = () => {
    setShowNamePrompt(true);
    setNewKeyName("");
  };

  const cancelGenerate = () => {
    setShowNamePrompt(false);
    setNewKeyName("");
  };

  const confirmGenerateKey = async (e) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    setLoading(true);
    try {
      const { res, relogin } = await authFetch(url(ROUTES.AUTH_GENERATE_KEY), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName.trim() }),
      });

      if (relogin) { onReloginRequired(); return; }

      if (res && res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          if (data.apiKey) {
            // Pass full key to App.js so Usage page can show it once
            onApiKeyGenerated(data.apiKey, {
              name: newKeyName.trim(),
              key: getPrefix(data.apiKey),
              expiresAt: data.expiresAt || null,
              lastUsed: "Never",
            });
            setShowNamePrompt(false);
            // Open Usage page so user can copy the full key
            onOpenUsage();
          }
        } else {
          console.error("Generate key failed: Response is not JSON");
        }
      } else if (res && res.status === 403) {
        const errorData = await res.json().catch(() => ({}));
        const errMsg = errorData.message || errorData.error || "";
        if (errMsg.includes("number of api_keys exceeded")) {
          showToast("API Key limit exceeded. Please delete an existing key or upgrade your plan.", "error");
        } else {
          showToast(errMsg || "Access denied. Failed to generate key.", "error");
        }
      } else if (res) {
        const errorData = await res.json().catch(() => ({}));
        showToast(errorData.message || errorData.error || "An error occurred while generating the key.", "error");
      }
    } catch (err) {
      console.error("Failed to generate key:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    onLogout();
    handleClose();
  };

  if (!user) return null;

  return (
    <div className={`modal-backdrop ${closing ? "closing" : ""}`} onClick={handleClose}>
      <div className="account-modal" onClick={(e) => e.stopPropagation()}>

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

        {/* API Key Section — latest key only */}
        {latestKey ? (
          <div className="account-key-section">
            <div className="key-section-header">
              <span className="key-section-title">Active API Key</span>
              <span className="key-status-badge">
                <span className="status-dot" />
                Active
              </span>
            </div>

            <div className="key-display-box">
              <div className="key-info">
                <span className="key-name-label">{latestKey.name || "API Key"}</span>
                <span className="key-text">{getPrefix(latestKey.key)}</span>
              </div>

            </div>

            <div className="key-actions">
              <button className="key-action-btn secondary" onClick={startGenerate}>
                + New Key
              </button>
              <button className="key-action-btn primary" onClick={onOpenUsage}>
                View Usage →
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
            <button className="generate-key-btn" onClick={startGenerate}>
              ⚡ Create API Key
            </button>
          </div>
        )}

        {/* Inline Name Prompt */}
        {showNamePrompt && (
          <div className="account-key-section" style={{ paddingTop: latestKey ? 0 : undefined }}>
            <form className="generate-key-form" onSubmit={confirmGenerateKey}>
              <input
                type="text"
                placeholder="Key Name (e.g., My Web App)"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                autoFocus
                disabled={loading}
              />
              <div className="generate-form-actions">
                <button type="button" className="btn-cancel" onClick={cancelGenerate} disabled={loading}>
                  Cancel
                </button>
                <button type="submit" className="btn-create" disabled={!newKeyName.trim() || loading}>
                  {loading ? "Creating…" : "Create Key"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Footer */}
        <div className="account-modal-footer">
          <button className="signout-btn" onClick={handleLogout}>
            ← Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountModal;