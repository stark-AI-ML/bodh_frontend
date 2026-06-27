import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { authFetch } from "../utils/authFetch";
import { showToast } from "../utils/toast";
import { url, ROUTES } from "../utils/api";

const getCodeExamples = (apiKey) => {
  const key = apiKey || "YOUR_API_KEY";
  return {
    js: `fetch("https://api.bodh.dev/general/v1/today", {
  method: "GET",
  headers: {
    "Authorization": "Bearer ${key}",
    "Content-Type": "application/json"
  }
})
.then(res => res.json())
.then(data => console.log(data));`,
    python: `import requests

url = "https://api.bodh.dev/general/v1/today"
headers = {
    "Authorization": "Bearer ${key}",
    "Content-Type": "application/json"
}

response = requests.get(url, headers=headers)
print(response.json())`,
    curl: `curl -X GET "https://api.bodh.dev/general/v1/today" \\
  -H "Authorization: Bearer ${key}" \\
  -H "Content-Type: application/json"`,
  };
};

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
  </svg>
);

const formatDate = (dateStr) => {
  if (!dateStr) return "Never";
  const isoStr = dateStr.replace(" ", "T");
  const d = new Date(isoStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const getPrefix = (key) => {
  if (!key) return "";
  return key.length > 21 ? key.substring(0, 21) + "..." : key;
};

/**
 * GettingStartedPage — "Usage" page
 * 
 * Props:
 *   newlyGeneratedKey — the FULL key string, only present right after generation (one-time)
 *   allKeys           — array from localStorage cache of /getCurrentKeys
 *   onClose           — go back to docs
 */
const GettingStartedPage = ({ newlyGeneratedKey, allKeys = [], onClose, baseUrl, onKeyDeleted }) => {
  const [tab, setTab] = useState("js");
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);

  // Use full key in code examples only if freshly generated, otherwise placeholder
  const examples = getCodeExamples(newlyGeneratedKey);

  const handleDeleteKey = async (k) => {
    if (!window.confirm("Are you sure you want to delete this API key? This action cannot be undone.")) return;
    
    setIsDeleting(k.key);
    try {
      const { res } = await authFetch(url(ROUTES.REMOVE_KEY), {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prefixKey: k.name, key: k.key })
      });
      
      if (res && res.ok) {
        showToast("API key deleted successfully.", "success");
        onKeyDeleted(k.key);
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.message || data.error || "Failed to delete API key.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("An error occurred while deleting the key.", "error");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleCopyKey = async () => {
    if (!newlyGeneratedKey) return;
    try {
      await navigator.clipboard.writeText(newlyGeneratedKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } catch {}
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(examples[tab]);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {}
  };

  const langMap = {
    js: "javascript",
    python: "python",
    curl: "bash",
  };

  return (
    <div className="getting-started-overlay">
      <div className="gs-container">
        {/* Back */}
        <button className="gs-back-btn" onClick={onClose}>
          ← Back
        </button>

        {/* One-Time Key Copy — only shown if freshly generated */}
        {newlyGeneratedKey && (
          <div className="usage-key-section">
            <div className="usage-key-header">
              <div className="usage-key-badge">
                <span className="usage-badge-dot" />
                New Key Created
              </div>
            </div>

            <div className="usage-key-warning">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18,flexShrink:0}}>
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span>Copy your key now. <strong>It will not be shown again.</strong></span>
            </div>

            <div className="usage-key-display">
              <code className="usage-key-value">{newlyGeneratedKey}</code>
              <button
                className={`usage-copy-btn ${copiedKey ? "copied" : ""}`}
                onClick={handleCopyKey}
                title="Copy API Key"
              >
                {copiedKey ? (
                  <><CheckIcon /> Copied!</>
                ) : (
                  <><CopyIcon /> Copy</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Quick Usage — code examples */}
        <div className="usage-code-section">
          <h3 className="usage-section-title">Quick Usage</h3>
          <p className="usage-section-desc">
            Include your API key in the <code>Authorization</code> header as a Bearer token.
          </p>

          <div className="gs-code-tabs">
            {[
              { key: "js", label: "JavaScript" },
              { key: "python", label: "Python" },
              { key: "curl", label: "cURL" },
            ].map((t) => (
              <button
                key={t.key}
                className={`gs-code-tab ${tab === t.key ? "active" : ""}`}
                onClick={() => {
                  setTab(t.key);
                  setCopiedCode(false);
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="gs-code-block-wrap">
            <button
              className={`gs-copy-code-btn ${copiedCode ? "copied" : ""}`}
              onClick={handleCopyCode}
            >
              {copiedCode ? "✓ Copied!" : "Copy"}
            </button>
            <div className="syntax-block">
              <SyntaxHighlighter
                language={langMap[tab]}
                style={dracula}
                customStyle={{
                  margin: 0,
                  borderRadius: 0,
                  fontSize: "0.88rem",
                  padding: "20px",
                  background: "#1E1E2E"
                }}
              >
                {examples[tab]}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>

        {/* All Keys Table */}
        {Array.isArray(allKeys) && allKeys.length > 0 && (
          <div className="usage-keys-table-section">
            <h3 className="usage-section-title">Your API Keys</h3>
            <div className="api-key-table-container">
              <table className="api-key-table">
                <thead>
                  <tr>
                    <th>Key</th>
                    <th>Expires</th>
                    <th>Last Used</th>
                    <th style={{ width: '60px', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {allKeys.map((k, idx) => (
                    <tr key={idx} className="api-key-row">
                      <td className="col-key">
                        <div className="key-name">{k.name || "API Key"}</div>
                        <div className="key-prefix">{getPrefix(k.key)}</div>
                      </td>
                      <td className="col-expires">{formatDate(k.expiresAt)}</td>
                      <td className="col-lastused">{k.lastUsed || "Never"}</td>
                      <td className="col-actions" style={{ textAlign: 'center' }}>
                        <button
                          className="btn-icon delete-key-btn"
                          onClick={() => handleDeleteKey(k)}
                          disabled={isDeleting === k.key}
                          title="Delete Key"
                        >
                          {isDeleting === k.key ? <span className="spinner-small" /> : <TrashIcon />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="gs-bottom-cta">
          <button className="gs-docs-btn" onClick={onClose}>
            Go to Documentation →
          </button>
        </div>
      </div>
    </div>
  );
};

export default GettingStartedPage;
