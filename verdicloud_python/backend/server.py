from flask import Flask, jsonify, request
from flask_cors import CORS
from optimizer import score_regions, find_best_region, detect_workload_automatically
from regions import REGIONS

app = Flask(__name__)
# Crucial: This allows your React app on port 3000 to talk to Flask on port 4000
CORS(app) 

@app.route("/", methods=["GET"])
def health():
    return jsonify({"status": "VerdiCloud AI Agent Active", "mode": "Inference"})

@app.route("/api/regions", methods=["GET"])
def get_regions():
    # Default autonomous scoring for initial load
    detected = detect_workload_automatically()
    scored = score_regions(REGIONS, detected)
    return jsonify({"success": True, "data": scored})

@app.route("/api/optimize", methods=["POST"])
def optimize():
    body = request.get_json(silent=True) or {}
    
    # 1. Matches App.js: body.JSON.stringify({ input_payload: ... })
    # We check for 'input_payload' first, then 'payload' as a backup
    workload_data = body.get("input_payload") or body.get("payload", "")

    # 2. Call the optimizer (this returns the dict with 'success', 'best', 'reason', etc.)
    result = find_best_region(workload_data)
    
    # 3. Return the result directly. 
    # This ensures App.js sees: data.success, data.best, data.allScored, data.deploymentUrl
    return jsonify(result)

if __name__ == "__main__":
    print("✅ [PORT 4000]: VerdiCloud Backend is LIVE.")
    # Debug=True is great for development so it restarts when you save
    app.run(host="0.0.0.0", port=4000, debug=True)