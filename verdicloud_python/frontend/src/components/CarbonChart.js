import React from "react";
import "./CarbonChart.css";

// Updated helper to return CSS classes instead of raw color values
function getCarbonClass(value) {
  if (value < 100) return "fill-green";
  if (value < 300) return "fill-amber";
  return "fill-red";
}

// Helper for text color classes to match the legend
function getTextColorClass(value) {
  if (value < 100) return "legend-green";
  if (value < 300) return "legend-amber";
  return "legend-red";
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

  // Calculate max for percentage scaling
  const maxCarbon = Math.max(...regions.map((r) => r.carbonIntensity), 1);

  return (
    <div className="chart-card fade-up">
      <div className="chart-header">
        <h2 className="chart-title">Carbon Intensity by Region</h2>
        <span className="chart-unit">gCO₂eq/kWh</span>
      </div>

      <div className="chart-legend">
        <span className="legend-item legend-green">
          <span className="legend-dot fill-green"></span> Low (&lt;100)
        </span>
        <span className="legend-item legend-amber">
          <span className="legend-dot fill-amber"></span> Moderate (100–300)
        </span>
        <span className="legend-item legend-red">
          <span className="legend-dot fill-red"></span> High (&gt;300)
        </span>
      </div>

      <div className="chart-bars">
        {regions
          .slice()
          .sort((a, b) => a.carbonIntensity - b.carbonIntensity)
          .map((r, i) => {
            const pct = (r.carbonIntensity / maxCarbon) * 100;
            const isHighlighted = r.id === highlighted;
            const carbonClass = getCarbonClass(r.carbonIntensity);
            const textClass = getTextColorClass(r.carbonIntensity);

            return (
              <div
                key={r.id}
                className={`bar-row ${isHighlighted ? "highlighted" : ""}`}
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <div className="bar-label" title={r.name}>
                  <span className="bar-region">{r.name}</span>
                  <span className="bar-provider">{r.provider}</span>
                  {isHighlighted && <span className="best-tag">OPTIMIZED</span>}
                </div>

                <div className="bar-track">
                  <div
                    className={`bar-fill ${carbonClass}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <span className={`bar-value ${textClass}`}>
                  {r.carbonIntensity}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
}