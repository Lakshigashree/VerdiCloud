import React from "react";
import "./CarbonChart.css";

function carbonColor(value) {
  if (value < 100) return "var(--green-dim)";
  if (value < 300) return "var(--amber)";
  return "var(--red-dim)";
}

export default function CarbonChart({ regions, loading, highlighted }) {
  if (loading) {
    return (
      <div className="chart-card">
        <div className="chart-header">
          <h2 className="chart-title">Carbon Intensity by Region</h2>
          <span className="chart-unit">gCO₂eq/kWh</span>
        </div>
        <div className="chart-loading">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton-bar" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      </div>
    );
  }

  const maxCarbon = Math.max(...regions.map((r) => r.carbonIntensity));

  return (
    <div className="chart-card fade-up">
      <div className="chart-header">
        <h2 className="chart-title">Carbon Intensity by Region</h2>
        <span className="chart-unit">gCO₂eq/kWh</span>
      </div>

      <div className="chart-legend">
        <span className="legend-item legend-green">● Low (&lt;100)</span>
        <span className="legend-item legend-amber">● Moderate (100–300)</span>
        <span className="legend-item legend-red">● High (&gt;300)</span>
      </div>

      <div className="chart-bars">
        {regions
          .slice()
          .sort((a, b) => a.carbonIntensity - b.carbonIntensity)
          .map((r, i) => {
            const pct = (r.carbonIntensity / maxCarbon) * 100;
            const isHighlighted = r.id === highlighted;
            return (
              <div
                key={r.id}
                className={`bar-row ${isHighlighted ? "highlighted" : ""}`}
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <div className="bar-label" title={r.name}>
                  <span className="bar-region">{r.name}</span>
                  <span className="bar-provider">{r.provider}</span>
                </div>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${pct}%`,
                      background: carbonColor(r.carbonIntensity),
                      boxShadow: isHighlighted
                        ? `0 0 12px ${carbonColor(r.carbonIntensity)}60`
                        : "none",
                    }}
                  />
                  <span
                    className="bar-value"
                    style={{ color: carbonColor(r.carbonIntensity) }}
                  >
                    {r.carbonIntensity}
                  </span>
                </div>
                {isHighlighted && <span className="best-tag">BEST</span>}
              </div>
            );
          })}
      </div>
    </div>
  );
}
