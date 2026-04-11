from flask import Flask, jsonify, request
from flask_cors import CORS
from optimizer import score_regions, find_best_region
from regions import REGIONS

app = Flask(__name__)
CORS(app)


@app.route("/", methods=["GET"])
def health():
    return jsonify({"status": "VerdiCloud API is running", "version": "1.0.0"})


@app.route("/api/regions", methods=["GET"])
def get_regions():
    scored = score_regions(REGIONS)
    return jsonify({"success": True, "data": scored})


@app.route("/api/optimize", methods=["POST"])
def optimize():
    body = request.get_json(silent=True) or {}
    workload_type = body.get("workloadType", "").strip()

    if not workload_type:
        return jsonify({"success": False, "error": "workloadType is required"}), 400

    result = find_best_region(workload_type)
    return jsonify({
        "success": True,
        "recommendation": result["best"],
        "reason": result["reason"],
        "allScored": result["allScored"],
    })


if __name__ == "__main__":
    print("✅ VerdiCloud Python backend running at http://localhost:4000")
    app.run(host="0.0.0.0", port=4000, debug=True)
