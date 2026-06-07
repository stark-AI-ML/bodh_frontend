import React from "react";

const EndpointCard = ({ id, method, path, description, params, example }) => (
  <div className="endpoint-card" id={id}>
    <div className="endpoint-header">
      <span className="method">{method}</span>
      <span className="path">{path}</span>
    </div>
    <p>{description}</p>
    {params && params.length > 0 && (
      <table>
        <thead>
          <tr>
            <th>Param</th>
            <th>Type</th>
            <th>Default/Required</th>
          </tr>
        </thead>
        <tbody>
          {params.map((p, i) => (
            <tr key={i}>
              <td>{p.name}</td>
              <td>{p.type}</td>
              <td className={p.required === "yes" ? "param-required" : ""}>
                {p.required || p.default}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
    <pre>
      <code>{example}</code>
    </pre>
  </div>
);

const MainContent = () => {
  return (
    <main className="main" id="mainContent">
      <h1>📡 BodhAPI Documentation</h1>
      <p>High-performance REST API for Indian news intelligence. Base URL: <code>http://localhost:5000/api</code></p>

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
