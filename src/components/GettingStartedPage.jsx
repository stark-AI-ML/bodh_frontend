import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

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

const GettingStartedPage = ({ apiKey, onClose }) => {
  const [tab, setTab] = useState("js");
  const [showKey, setShowKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const examples = getCodeExamples(apiKey);

  const maskKey = (key) => {
    if (!key || key.length < 10) return key || "";
    return `${key.slice(0, 8)}${"•".repeat(16)}${key.slice(-6)}`;
  };

  const handleCopyKey = async () => {
    if (!apiKey) return;
    try {
      await navigator.clipboard.writeText(apiKey);
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
        {/* Back button */}
        <button className="gs-back-btn" onClick={onClose}>
          ← Back to Docs
        </button>

        {/* Hero */}
        <div className="gs-hero">
          <div className="gs-hero-badge">
            <span>✓</span> API Key Generated
          </div>
          <h1>You're all set! 🎉</h1>
          <p>
            Your API key is ready. Use it in the <code>Authorization</code>{" "}
            header to authenticate your requests to BodhAPI.
          </p>
        </div>

        {/* Key Card */}
        <div className="gs-key-card">
          <div className="gs-key-card-header">
            <span className="gs-key-card-title">Your API Key</span>
            <button
              className="gs-key-toggle"
              onClick={() => setShowKey(!showKey)}
            >
              {showKey ? "🙈 Hide" : "👁 Reveal"}
            </button>
          </div>
          <div className="gs-key-value">
            <span className="key-text">
              {showKey ? apiKey : maskKey(apiKey)}
            </span>
            <button
              className={`key-copy-btn ${copiedKey ? "copied" : ""}`}
              onClick={handleCopyKey}
              title="Copy API Key"
            >
              {copiedKey ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}>
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Step 1: Install / Setup */}
        <div className="gs-section">
          <h3 className="gs-section-title">
            <span className="step-number">1</span>
            Add Your Key to the Request
          </h3>
          <p className="gs-section-desc">
            Include your API key in the <code>Authorization</code> header as a
            Bearer token.
          </p>

          {/* Tabs */}
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

          {/* Code Block */}
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

        {/* Step 2 */}
        <div className="gs-section">
          <h3 className="gs-section-title">
            <span className="step-number">2</span>
            Make Your First Request
          </h3>
          <p className="gs-section-desc">
            Run the code above to fetch today's top Indian news. The response
            returns a JSON array of news articles with headlines, categories,
            sentiment scores, and more.
          </p>
        </div>

        {/* Step 3 */}
        <div className="gs-section">
          <h3 className="gs-section-title">
            <span className="step-number">3</span>
            Explore the API
          </h3>
          <p className="gs-section-desc">
            Browse all available endpoints in the documentation — filter by
            state, sentiment, category, entities, and more. Use the built-in API
            Console to test endpoints live.
          </p>
        </div>

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
