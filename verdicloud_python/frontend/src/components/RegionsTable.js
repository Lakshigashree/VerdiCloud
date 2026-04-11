import React, { useState } from "react";
import "./RegionsTable.css";

function carbonColor(value) {
  if (value < 100) return "green";
  if (value < 300) return "amber";
  return "red";
}

function latencyColor(value) {
  if (value < 70) return "green";
  if (value < 140) return "amber";
  return "red";
}

function ScoreBar({ score }) {
  const pct = Math.round((1 - score) * 100);
  return (
    <div className="score-bar-wrap">
      <div className="score-bar-track">
        <div className="score-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="score-num">{score.toFixed(3)}</span>
    </div>
  );
}

export default function RegionsTable({ regions, loading, highlightedId }) {
  const [sortKey, setSortKey] = useState("score");
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (key) => {
    if (sortKey === key) setSortAsc((v) => !v);
    else { setSortKey(key); setSortAsc(true); }
  };

  const sorted = [...regions].sort((a, b) => {
    const av = a[sortKey] ?? 0;
    const bv = b[sortKey] ?? 0;
    return sortAsc ? av - bv : bv - av;
  });

  const SortIcon = ({ col }) => (
    <span className={`sort-icon ${sortKey === col ? "active" : ""}`}>
      {sortKey === col ? (sortAsc ? "↑" : "↓") : "↕"}
    </span>
  );

  return (
    <div className="table-card fade-up">
      <div className="table-header">
        <div>
          <h2 className="table-title">All Cloud Regions</h2>
          <p className="table-sub">Click column headers to sort · Score = 0.7×carbon + 0.3×latency (normalized, lower = better)</p>
        </div>
        <span className="region-count">{regions.length} regions</span>
      </div>

      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>Region</th>
              <th>Provider</th>
              <th className="sortable" onClick={() => handleSort("carbonIntensity")}>
                Carbon <span className="th-unit">gCO₂/kWh</span> <SortIcon col="carbonIntensity" />
              </th>
              <th className="sortable" onClick={() => handleSort("latency")}>
                Latency <span className="th-unit">ms</span> <SortIcon col="latency" />
              </th>
              <th className="sortable" onClick={() => handleSort("renewable")}>
                Renewable % <SortIcon col="renewable" />
              </th>
              <th className="sortable" onClick={() => handleSort("score")}>
                Efficiency Score <SortIcon col="score" />
              </th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? [...Array(6)].map((_, i) => (
                  <tr key={i} className="skeleton-row">
                    {[...Array(6)].map((_, j) => (
                      <td key={j}><div className="skeleton-cell" /></td>
                    ))}
                  </tr>
                ))
              : sorted.map((r, i) => {
                  const isHighlighted = r.id === highlightedId;
                  const cColor = carbonColor(r.carbonIntensity);
                  const lColor = latencyColor(r.latency);
                  return (
                    <tr
                      key={r.id}
                      className={isHighlighted ? "highlighted-row" : ""}
                      style={{ animationDelay: `${i * 0.03}s` }}
                    >
                      <td>
                        <div className="region-cell">
                          {isHighlighted && <span className="star">★</span>}
                          <div>
                            <div className="region-name">{r.name}</div>
                            <div className="region-id">{r.id}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="provider-tag">{r.provider}</span>
                      </td>
                      <td>
                        <span className={`pill pill-${cColor}`}>{r.carbonIntensity}</span>
                      </td>
                      <td>
                        <span className={`pill pill-${lColor}`}>{r.latency}</span>
                      </td>
                      <td>
                        <span className="renewable-val">{r.renewable}%</span>
                        <div className="renewable-track">
                          <div
                            className="renewable-fill"
                            style={{ width: `${r.renewable}%` }}
                          />
                        </div>
                      </td>
                      <td>
                        {r.score !== undefined ? (
                          <ScoreBar score={r.score} />
                        ) : (
                          <span className="no-score">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
