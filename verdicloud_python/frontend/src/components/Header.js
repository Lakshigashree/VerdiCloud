import React from "react";
import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo">
          <span className="logo-icon">⬡</span>
          <div>
            <span className="logo-name">VerdiCloud</span>
            <span className="logo-tag">Carbon-Aware Optimizer</span>
          </div>
        </div>
        <div className="header-right">
          <span className="live-dot" />
          <span className="live-label">Live Scoring</span>
        </div>
      </div>
    </header>
  );
}
