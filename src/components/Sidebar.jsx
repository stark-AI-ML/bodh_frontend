import React, { useState } from "react";

const Sidebar = () => {
  const [active, setActive] = useState("");

  const handleClick = (hash) => {
    setActive(hash);
  };

  const NavLink = ({ href, method, path }) => (
    <a href={href} className={active === href ? "active" : ""} onClick={() => handleClick(href)}>
      <span className={`method-tag ${method.toLowerCase()}`}>{method}</span>
      <span className="endpoint-name">{path}</span>
    </a>
  );

  return (
    <aside className="sidebar">
      <nav>
        <div className="section-title">General News</div>
        <NavLink href="#general-today" method="GET" path="/today" />
        <NavLink href="#general-top" method="GET" path="/top" />
        <NavLink href="#general-crime" method="GET" path="/crime" />
        <NavLink href="#general-sentiment" method="GET" path="/sentiment" />
        <NavLink href="#general-state" method="GET" path="/state" />
        <NavLink href="#general-entities" method="GET" path="/entities" />
        <NavLink href="#general-emergency" method="GET" path="/emergency" />
        <NavLink href="#general-category" method="GET" path="/category" />
        <NavLink href="#general-search" method="GET" path="/search" />
        <NavLink href="#general-tags" method="GET" path="/tags" />
        
        <div className="section-title">Business News</div>
        <NavLink href="#business-today" method="GET" path="/today" />
        <NavLink href="#business-top" method="GET" path="/top" />
        <NavLink href="#business-tech" method="GET" path="/tech" />
        <NavLink href="#business-finance" method="GET" path="/finance" />
        <NavLink href="#business-sentiment" method="GET" path="/sentiment" />
        <NavLink href="#business-state" method="GET" path="/state" />
      </nav>
    </aside>
  );
};

export default Sidebar;