import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const AuthExampleCard = () => {
  const [tab, setTab] = useState("js");
  const [copied, setCopied] = useState(false);

  const codeSnippets = {
    js: `fetch("http://localhost:5000/api/general/v1/today", {
  method: "GET",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
  }
})
.then(response => response.json())
.then(data => console.log(data));`,
    python: `import requests

url = "http://localhost:5000/api/general/v1/today"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

response = requests.get(url, headers=headers)
print(response.json())`,
    curl: `curl -X GET "http://localhost:5000/api/general/v1/today" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeSnippets[tab]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="auth-card" id="auth-example">
      <div className="auth-card-header">
        <span className="auth-badge">Authentication</span>
        <span>Bearer Token</span>
      </div>
      <div className="auth-card-body">
        <p className="endpoint-desc" style={{ marginBottom: "20px" }}>
          To access BodhAPI, include your API Key in the <code>Authorization</code> header. Here's a quick example making a <code>GET</code> request:
        </p>
        <div className="lang-tabs">
          <button className={`lang-tab ${tab === "js" ? "active" : ""}`} onClick={() => setTab("js")}>JavaScript</button>
          <button className={`lang-tab ${tab === "python" ? "active" : ""}`} onClick={() => setTab("python")}>Python</button>
          <button className={`lang-tab ${tab === "curl" ? "active" : ""}`} onClick={() => setTab("curl")}>cURL</button>
        </div>
        <div className="code-wrap">
          <button className={`copy-code-btn ${copied ? "copied" : ""}`} onClick={handleCopy}>
            {copied ? "Copied!" : "Copy"}
          </button>
          <SyntaxHighlighter 
            language={tab === "js" ? "javascript" : tab === "python" ? "python" : "bash"} 
            style={dracula} 
            customStyle={{ margin: 0, padding: "20px", fontSize: "0.85rem", background: "#1E1E2E" }}
          >
            {codeSnippets[tab]}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

const EndpointCard = ({ id, method, path, description, params, example }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyPath = async () => {
    try {
      await navigator.clipboard.writeText(path);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="endpoint-card" id={id}>
      <div className="endpoint-header">
        <span className={`method-badge ${method.toLowerCase()}`}>{method}</span>
        <span className="endpoint-path">{path}</span>
        <button className="copy-btn" onClick={handleCopyPath} style={{ marginLeft: "auto" }}>
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <p className="endpoint-desc">{description}</p>
      {params && params.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Type</th>
              <th>Required</th>
            </tr>
          </thead>
          <tbody>
            {params.map((p, i) => (
              <tr key={i}>
                <td><code>{p.name}</code></td>
                <td>{p.type}</td>
                <td className={p.required === "yes" ? "param-required" : ""}>
                  {p.required === "yes" ? "Yes" : p.default}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div style={{ marginTop: "16px" }}>
        <h4 style={{ fontSize: "var(--text-xs)", textTransform: "uppercase", color: "var(--text-4)", marginBottom: "8px" }}>Example</h4>
        <pre>
          <code>{example}</code>
        </pre>
      </div>
    </div>
  );
};

const MainContent = () => {
  return (
    <main className="main" id="mainContent">
      <h1>📡 BodhAPI Documentation</h1>
      <p>High-performance REST API for Indian news intelligence. Base URL: <code>http://localhost:5000/api</code></p>

      <AuthExampleCard />

      <h2>General News</h2>
      <p>All general news endpoints cover every category unless filtered.</p>

      <EndpointCard
        id="general-today"
        method="GET"
        path="/general/v1/today"
        description="Today's news ordered by importance."
        params={[{ name: "limit", type: "number", default: "30" }]}
        example="GET /api/general/v1/today?limit=20"
      />
      <EndpointCard
        id="general-top"
        method="GET"
        path="/general/v1/top"
        description="High‑importance news (score ≥ 7) from last 3 days."
        params={[{ name: "limit", type: "number", default: "30" }]}
        example="GET /api/general/v1/top?limit=10"
      />
      <EndpointCard
        id="general-crime"
        method="GET"
        path="/general/v1/crime"
        description="Crime news by severity."
        params={[
          { name: "severity", type: "string", required: "yes" },
          { name: "limit", type: "number", default: "no" }
        ]}
        example="GET /api/general/v1/crime?severity=EXTREME&limit=15"
      />
      <EndpointCard
        id="general-sentiment"
        method="GET"
        path="/general/v1/sentiment"
        description="News by sentiment (Positive, Neutral, Negative)."
        params={[
          { name: "sentiment", type: "string", default: "Positive" },
          { name: "limit", type: "number", default: "30" }
        ]}
        example="GET /api/general/v1/sentiment?sentiment=Negative&limit=20"
      />
      <EndpointCard
        id="general-state"
        method="GET"
        path="/general/v1/state"
        description="News for a specific Indian state."
        params={[
          { name: "state", type: "string", required: "yes" },
          { name: "limit", type: "number", default: "no" }
        ]}
        example="GET /api/general/v1/state?state=Maharashtra&limit=25"
      />
      <EndpointCard
        id="general-entities"
        method="GET"
        path="/general/v1/entities"
        description="News mentioning a person or organization."
        params={[
          { name: "person", type: "string", default: "at least one" },
          { name: "organization", type: "string", default: "at least one" },
          { name: "limit", type: "number", default: "no" }
        ]}
        example="GET /api/general/v1/entities?person=Modi&organization=BJP"
      />
      <EndpointCard
        id="general-emergency"
        method="GET"
        path="/general/v1/emergency"
        description="News by emergency type."
        params={[
          { name: "type", type: "string", required: "yes" },
          { name: "limit", type: "number", default: "no" }
        ]}
        example="GET /api/general/v1/emergency?type=NATURAL_DISASTER"
      />
      <EndpointCard
        id="general-category"
        method="GET"
        path="/general/v1/category"
        description="News by category (Economy, Politics, etc.)."
        params={[
          { name: "category", type: "string", required: "yes" },
          { name: "limit", type: "number", default: "no" }
        ]}
        example="GET /api/general/v1/category?category=Politics"
      />
      <EndpointCard
        id="general-search"
        method="GET"
        path="/general/v1/search"
        description="Full‑text search on headlines (last 7 days)."
        params={[
          { name: "q", type: "string", required: "yes" },
          { name: "limit", type: "number", default: "no" }
        ]}
        example="GET /api/general/v1/search?q=trade+deal"
      />
      <EndpointCard
        id="general-tags"
        method="GET"
        path="/general/v1/tags"
        description="News by tag keyword."
        params={[
          { name: "tag", type: "string", required: "yes" },
          { name: "limit", type: "number", default: "no" }
        ]}
        example="GET /api/general/v1/tags?tag=AI"
      />

      <h2>Business News</h2>
      <p>Business endpoints filter Economy &amp; Infrastructure categories.</p>
      
      <EndpointCard
        id="business-today"
        method="GET"
        path="/business/v1/today"
        description="Today's business news."
        example="GET /api/business/v1/today?limit=20"
      />
      <EndpointCard
        id="business-top"
        method="GET"
        path="/business/v1/top"
        description="Top business news."
        example="GET /api/business/v1/top"
      />
      <EndpointCard
        id="business-tech"
        method="GET"
        path="/business/v1/tech"
        description="Tech specific business news."
        example="GET /api/business/v1/tech"
      />
      <EndpointCard
        id="business-finance"
        method="GET"
        path="/business/v1/finance"
        description="Finance specific business news."
        example="GET /api/business/v1/finance"
      />
      <EndpointCard
        id="business-sentiment"
        method="GET"
        path="/business/v1/sentiment"
        description="Business news by sentiment."
        example="GET /api/business/v1/sentiment?sentiment=Positive"
      />
      <EndpointCard
        id="business-state"
        method="GET"
        path="/business/v1/state"
        description="Business news for specific state."
        example="GET /api/business/v1/state?state=Karnataka"
      />
    </main>
  );
};

export default MainContent;
