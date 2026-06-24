import React, { useState, useEffect } from "react";
import { BASE_URL } from "../utils/api";

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

const ConsolePanel = ({ isLoggedIn, apiKey, onLoginRequired, baseUrl }) => {
  const [endpoint, setEndpoint] = useState("general/v1/today");
  const [params, setParams] = useState({ limit: "5" });
  const [responseHtml, setResponseHtml] = useState("Response will appear here…");
  const [loading, setLoading] = useState(false);
  const [localApiKey, setLocalApiKey] = useState(apiKey || "");

  useEffect(() => {
    if (apiKey) {
      setLocalApiKey(apiKey);
    }
  }, [apiKey]);

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
    if (!localApiKey.trim()) {
      setResponseHtml("<span class='json-error'>Please provide an API key.</span>");
      return;
    }

    setLoading(true);
    setResponseHtml("Loading...");

    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v.trim()) queryParams.append(k, v.trim());
    });

    // Handle baseUrl safely
    const cleanBaseUrl = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
    const url = `${cleanBaseUrl}/api/${endpoint}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localApiKey.trim()}`,
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
    <div className="console-panel">
      <div className="console-header">
        <strong>🧪 API Console</strong>
      </div>
      <div className="console-body">
        {(!isLoggedIn || !apiKey) && (
          <div className="console-alert">
            Please <a href="#" onClick={(e) => { e.preventDefault(); onLoginRequired(); }}>login</a> and generate an API key, or paste an existing one below for a quick demo.
          </div>
        )}

        <div className="param-group">
          <label>API Key</label>
          <input
            type="text"
            placeholder="Paste your API key here"
            value={localApiKey}
            onChange={(e) => setLocalApiKey(e.target.value)}
          />
        </div>

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