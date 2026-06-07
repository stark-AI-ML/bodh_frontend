import React, { useState } from "react";

const Sidebar = () => {
  const [active, setActive] = useState("");

  const handleClick = (hash) => {
    setActive(hash);
  };

  return (
    <aside className="sidebar">
      <nav>
        <div className="section-title">General News</div>
        <a href="#general-today" className={active === "#general-today" ? "active" : ""} onClick={() => handleClick("#general-today")}>GET /today</a>
        <a href="#general-top" className={active === "#general-top" ? "active" : ""} onClick={() => handleClick("#general-top")}>GET /top</a>
        <a href="#general-crime" className={active === "#general-crime" ? "active" : ""} onClick={() => handleClick("#general-crime")}>GET /crime</a>
        <a href="#general-sentiment" className={active === "#general-sentiment" ? "active" : ""} onClick={() => handleClick("#general-sentiment")}>GET /sentiment</a>
        <a href="#general-state" className={active === "#general-state" ? "active" : ""} onClick={() => handleClick("#general-state")}>GET /state</a>
        <a href="#general-entities" className={active === "#general-entities" ? "active" : ""} onClick={() => handleClick("#general-entities")}>GET /entities</a>
        <a href="#general-emergency" className={active === "#general-emergency" ? "active" : ""} onClick={() => handleClick("#general-emergency")}>GET /emergency</a>
        <a href="#general-category" className={active === "#general-category" ? "active" : ""} onClick={() => handleClick("#general-category")}>GET /category</a>
        <a href="#general-search" className={active === "#general-search" ? "active" : ""} onClick={() => handleClick("#general-search")}>GET /search</a>
        <a href="#general-tags" className={active === "#general-tags" ? "active" : ""} onClick={() => handleClick("#general-tags")}>GET /tags</a>
        
        <div className="section-title">Business News</div>
        <a href="#business-today" className={active === "#business-today" ? "active" : ""} onClick={() => handleClick("#business-today")}>GET /today</a>
        <a href="#business-top" className={active === "#business-top" ? "active" : ""} onClick={() => handleClick("#business-top")}>GET /top</a>
        <a href="#business-tech" className={active === "#business-tech" ? "active" : ""} onClick={() => handleClick("#business-tech")}>GET /tech</a>
        <a href="#business-finance" className={active === "#business-finance" ? "active" : ""} onClick={() => handleClick("#business-finance")}>GET /finance</a>
        <a href="#business-sentiment" className={active === "#business-sentiment" ? "active" : ""} onClick={() => handleClick("#business-sentiment")}>GET /sentiment</a>
        <a href="#business-state" className={active === "#business-state" ? "active" : ""} onClick={() => handleClick("#business-state")}>GET /state</a>
      </nav>
    </aside>
  );
};

export default Sidebar;