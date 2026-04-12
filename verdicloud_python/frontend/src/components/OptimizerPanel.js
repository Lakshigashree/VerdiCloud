import React from "react";
import "./OptimizerPanel.css";

function CarbonBadge({ value }) {
  if (value < 100) return <span className="badge badge-green">Low Carbon</span>;
  if (value < 300) return <span className="badge badge-amber">Moderate</span>;
  return <span className="badge badge-red">High Carbon</span>;
}

export default function OptimizerPanel({ onOptimize, optimizing, recommendation }) {
  
  // This triggers the autonomous detection by sending a specific payload
  const handleAutonomousDeploy = () => {
    // String containing "NEXUS" and "SLA" to trigger the specific detection logic in Python
    onOptimize("NEXUS_SLA_SWARM_REMEDIATION_TASK");
  };

  // The backend returns the winning region in the 'best' key
  const best = recommendation?.best;
  
  // Fallback link in case the backend variable is ever empty
  const liveLink = recommendation?.deploymentUrl || "https://nexus-system-r06t.onrender.com/";

  return (
    <div className={`optimizer-panel fade-up ${optimizing ? "is-scanning" : ""}`}>
      <div className="panel-header">
        <h2 className="panel-title">Workload Optimizer</h2>
        <p className="panel-subtitle">
          {optimizing ? "AI Agent scanning metadata..." : "Autonomous Discovery Layer Active"}
        </p>
      </div>

      <div className="input-block">
        <label className="input-label">Detected Signature</label>
        <div className="workload-badge">
          <span className="dot"></span>
          <span>
            {optimizing ? "Scanning..." : 
             recommendation ? recommendation.detectedWorkload : "Awaiting Payload"}
          </span>
        </div>
      </div>

      <button
        className={`optimize-btn ${optimizing ? "loading" : ""}`}
        onClick={handleAutonomousDeploy}
        disabled={optimizing}
      >
        {optimizing ? (
          <>
            <span className="spinner" />
            Parsing Metadata...
          </>
        ) : (
          <>
            <span className="btn-icon">⚡</span>
            Deploy Autonomous Workload
          </>
        )}
      </button>

      {best && (
        <div className="result-card fade-up">
          <div className="result-header">
            <span className="result-label">Optimized Destination</span>
            <CarbonBadge value={best.carbonIntensity} />
          </div>

          <div className="result-name">{best.name}</div>
          <div className="result-provider">{best.provider} · {best.id}</div>

          <div className="result-metrics">
            <div className="metric">
              <span className="metric-value" style={{ color: "var(--green)" }}>
                {best.carbonIntensity}
              </span>
              <span className="metric-label">gCO₂/kWh</span>
            </div>
            <div className="metric-divider" />
            <div className="metric">
              <span className="metric-value">{best.latency}ms</span>
              <span className="metric-label">Latency</span>
            </div>
            <div className="metric-divider" />
            <div className="metric">
              <span className="metric-value" style={{ color: "var(--green)" }}>
                {best.renewable}%
              </span>
              <span className="metric-label">Renewable</span>
            </div>
          </div>

          <div className="result-reason">
            <span className="reason-icon">💡</span>
            <p>{recommendation.reason}</p>
          </div>

          {/* --- FIXED: LINK TO YOUR LIVE NEXUS SYSTEM --- */}
          <a 
            href={liveLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="nexus-link-btn"
          >
            🚀 Open Live Nexus Dashboard
          </a>
        </div>
      )}

      {!best && !optimizing && (
        <div className="empty-state">
          <div className="empty-icon">🌿</div>
          <p>Click deploy to trigger autonomous workload shifting</p>
        </div>
      )}
    </div>
  );
}