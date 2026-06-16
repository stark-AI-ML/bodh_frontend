import React, { useState, useEffect } from "react";

const paramConfig = {
  "general/v1/today": ["limit"],
  "general/v1/top": ["limit"],
  "general/v1/crime": ["severity", "limit"],
  "general/v1/sentiment": ["sentiment", "limit"],
  "general/v1/state": ["state", "limit"],
  "general/v1/entities": ["person", "organization", "limit"],
  "general/v1/emergency": ["type", "limit"],
  "general/v1/category": ["category", "limit"],
  "general/v1/search": ["q", "limit"],
  "general/v1/tags": ["tag", "limit"],
  "business/v1/today": ["limit"],
  "business/v1/top": ["limit"],
  "business/v1/tech": ["limit"],
  "business/v1/finance": ["limit"],
  "business/v1/sentiment": ["sentiment", "limit"],
  "business/v1/state": ["state", "limit"],
};

const highlightJSON = (obj) => {
  let json = JSON.stringify(obj, null, 2);
  json = json.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  
  json = json.replace(/("(?:[^"\\]|\\.)*")/g, function (match) {
    if (/^\s*"/.test(match) && /":\s*/.test(json.substring(json.indexOf(match) + match.length))) {
      return '<span class="json-key">' + match + '</span>';
    }
    return '<span class="json-string">' + match + '</span>';
  });
  
  json = json.replace(/\b(-?\d+\.?\d*([eE][+-]?\d+)?)\b/g, '<span class="json-number">$1</span>');
  json = json.replace(/\b(true|false)\b/g, '<span class="json-boolean">$1</span>');
  json = json.replace(/\bnull\b/g, '<span class="json-null">null</span>');
  return json;
};

const ConsolePanel = ({ open, onClose, isLoggedIn, apiKey, onLoginRequired, baseUrl }) => {
  const [endpoint, setEndpoint] = useState("general/v1/today");
  const [params, setParams] = useState({ limit: "5" });
  const [responseHtml, setResponseHtml] = useState("Response will appear here…");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Reset params when endpoint changes
    const fields = paramConfig[endpoint] || ["limit"];
    const initialParams = {};
    fields.forEach((f) => {
      initialParams[f] = f === "limit" ? "5" : "";
    });
    setParams(initialParams);
  }, [endpoint]);

  const handleParamChange = (field, value) => {
    setParams((prev) => ({ ...prev, [field]: value }));
  };

  const handleSend = async () => {
    if (!isLoggedIn) {
      onLoginRequired();
      return;
    }

    setLoading(true);
    setResponseHtml("Loading...");

    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v.trim()) queryParams.append(k, v.trim());
    });

    // Handle baseUrl safely
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const url = `${cleanBaseUrl}/api/${endpoint}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      });
      
      const data = await res.json();
      const fullResponse = { request: url, status: res.status, ...data };
      setResponseHtml(highlightJSON(fullResponse));
    } catch (err) {
      const errorResponse = { request: url, error: err.message || "Failed to fetch" };
      setResponseHtml(highlightJSON(errorResponse));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`console-panel ${open ? "open" : ""}`}>
      <div className="console-header">
        <strong>🧪 API Console</strong>
        <button className="btn-icon" onClick={onClose}>✕</button>
      </div>
      <div className="console-body">
        <div className="param-group">
          <label>Endpoint</label>
          <select value={endpoint} onChange={(e) => setEndpoint(e.target.value)}>
            {Object.keys(paramConfig).map((ep) => (
              <option key={ep} value={ep}>
                {ep.includes('general') ? 'General' : 'Business'} {ep.replace(/^(general|business)\/v1/, '')}
              </option>
            ))}
          </select>
        </div>

        {paramConfig[endpoint]?.map((field) => (
          <div className="param-group" key={field}>
            <label>{field}</label>
            <input
              type="text"
              placeholder={field}
              value={params[field] || ""}
              onChange={(e) => handleParamChange(field, e.target.value)}
            />
          </div>
        ))}

        <button className="console-send-btn" onClick={handleSend} disabled={loading}>
          {loading ? "Sending..." : "🚀 Send Request"}
        </button>

        <div 
          className="response-area" 
          dangerouslySetInnerHTML={{ __html: responseHtml }}
        />
      </div>
    </div>
  );
};

export default ConsolePanel;