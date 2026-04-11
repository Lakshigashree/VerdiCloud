import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import OptimizerPanel from "./components/OptimizerPanel";
import RegionsTable from "./components/RegionsTable";
import CarbonChart from "./components/CarbonChart";
import "./App.css";

export default function App() {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [optimizing, setOptimizing] = useState(false);

  useEffect(() => {
    fetch("/api/regions")
      .then((r) => r.json())
      .then((d) => {
        setRegions(d.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to connect to backend. Make sure the server is running on port 4000.");
        setLoading(false);
      });
  }, []);

  const handleOptimize = async (workloadType) => {
    setOptimizing(true);
    setRecommendation(null);
    try {
      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workloadType }),
      });
      const data = await res.json();
      if (data.success) {
        setRecommendation(data);
        setRegions(data.allScored);
      }
    } catch {
      setError("Optimization request failed.");
    }
    setOptimizing(false);
  };

  return (
    <div className="app">
      <Header />
      <main className="main">
        {error && <div className="error-banner">{error}</div>}

        <div className="top-grid">
          <OptimizerPanel
            onOptimize={handleOptimize}
            optimizing={optimizing}
            recommendation={recommendation}
          />
          <CarbonChart regions={regions} loading={loading} highlighted={recommendation?.recommendation?.id} />
        </div>

        <RegionsTable
          regions={regions}
          loading={loading}
          highlightedId={recommendation?.recommendation?.id}
        />
      </main>
    </div>
  );
}
