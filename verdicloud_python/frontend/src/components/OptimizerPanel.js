import React, { useState } from "react";
import "./OptimizerPanel.css";

const WORKLOADS = [
  { value: "batch-data-processing", label: "Batch Data Processing" },
  { value: "ml-training", label: "ML Model Training" },
  { value: "web-serving", label: "Web Application Serving" },
  { value: "video-transcoding", label: "Video Transcoding" },
  { value: "database-backup", label: "Database Backup" },
  { value: "cdn-edge-caching", label: "CDN / Edge Caching" },
  { value: "scientific-compute", label: "Scientific Computing" },
];

function CarbonBadge({ value }) {
  if (value < 100) return <span className="badge badge-green">Low Carbon</span>;
  if (value < 300) return <span className="badge badge-amber">Moderate</span>;
  return <span className="badge badge-red">High Carbon</span>;
}

export default function OptimizerPanel({ onOptimize, optimizing, recommendation }) {
  const [workload, setWorkload] = useState("batch-data-processing");

  const handleSubmit = () => onOptimize(workload);
  const rec = recommendation?.recommendation;

  return (
    <div className="optimizer-panel fade-up">
      <div className="panel-header">
        <h2 className="panel-title">Workload Optimizer</h2>
        <p className="panel-subtitle">Select a workload to find the greenest region</p>
      </div>

      <div className="input-block">
        <label className="input-label">Workload Type</label>
        <select
          className="select"
          value={workload}
          onChange={(e) => setWorkload(e.target.value)}
        >
          {WORKLOADS.map((w) => (
            <option key={w.value} value={w.value}>{w.label}</option>
          ))}
        </select>
      </div>

      <button
        className={`optimize-btn ${optimizing ? "loading" : ""}`}
        onClick={handleSubmit}
        disabled={optimizing}
      >
        {optimizing ? (
          <>
            <span className="spinner" />
            Analyzing Regions…
          </>
        ) : (
          <>
            <span className="btn-icon">⚡</span>
            Optimize Workload
          </>
        )}
      </button>

      {rec && (
        <div className="result-card fade-up">
          <div className="result-header">
            <span className="result-label">Recommended Region</span>
            <CarbonBadge value={rec.carbonIntensity} />
          </div>

          <div className="result-name">{rec.name}</div>
          <div className="result-provider">{rec.provider} · {rec.id}</div>

          <div className="result-metrics">
            <div className="metric">
              <span className="metric-value" style={{ color: "var(--green)" }}>
                {rec.carbonIntensity}
              </span>
              <span className="metric-label">gCO₂/kWh</span>
            </div>
            <div className="metric-divider" />
            <div className="metric">
              <span className="metric-value">{rec.latency}ms</span>
              <span className="metric-label">Latency</span>
            </div>
            <div className="metric-divider" />
            <div className="metric">
              <span className="metric-value" style={{ color: "var(--green)" }}>
                {rec.renewable}%
              </span>
              <span className="metric-label">Renewable</span>
            </div>
          </div>

          <div className="result-reason">
            <span className="reason-icon">💡</span>
            <p>{recommendation.reason}</p>
          </div>
        </div>
      )}

      {!rec && !optimizing && (
        <div className="empty-state">
          <div className="empty-icon">🌿</div>
          <p>Run the optimizer to get your carbon-aware recommendation</p>
        </div>
      )}
    </div>
  );
}
