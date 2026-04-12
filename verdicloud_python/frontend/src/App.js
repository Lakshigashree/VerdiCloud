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

  // Initial load of regions
  useEffect(() => {
    fetch("/api/regions")
      .then((r) => r.json())
      .then((d) => {
        setRegions(d.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Backend Connection Error: Ensure server.py is running on port 4000.");
        setLoading(false);
      });
  }, []);

  /**
   * handleOptimize:
   * Fixed the JSON body key to 'input_payload' to match your Python find_best_region(input_payload)
   */
  const handleOptimize = async (payloadMetadata = "") => {
    setOptimizing(true);
    setRecommendation(null);
    setError(null);

    try {
      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // IMPORTANT: Backend expects 'input_payload' 
        body: JSON.stringify({ input_payload: payloadMetadata }),
      });
      
      const data = await res.json();
      
      // Checking for 'best' key which comes from your Python dictionary return
      if (data.best) {
        setRecommendation(data);
        setRegions(data.allScored);
      } else {
        setError("Optimization failed: Backend did not return a valid recommendation.");
      }
    } catch (err) {
      setError("Network error: Could not connect to optimization engine.");
    } finally {
      setOptimizing(false);
    }
  };

  return (
    /* The 'scanning' class is added dynamically when optimizing to trigger the CSS animation */
    <div className={`app ${optimizing ? "is-optimizing scanning-overlay" : ""}`}>
      <Header />
      <main className="main">
        {error && <div className="error-banner">⚠️ {error}</div>}

        <div className="top-grid">
          <OptimizerPanel
            onOptimize={handleOptimize}
            optimizing={optimizing}
            /* recommendation object now contains:
               .best (The winning region)
               .detectedWorkload (The AI discovery result)
               .deploymentUrl (The Live NEXUS Link)
            */
            recommendation={recommendation}
          />
          <CarbonChart 
            regions={regions} 
            loading={loading} 
            highlighted={recommendation?.best?.id} 
          />
        </div>

        <RegionsTable
          regions={regions}
          loading={loading}
          highlightedId={recommendation?.best?.id}
        />
      </main>
    </div>
  );
}