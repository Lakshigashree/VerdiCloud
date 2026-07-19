from flask import Flask, jsonify, request
from flask_cors import CORS
from optimizer import score_regions, find_best_region, detect_workload_automatically
from regions import REGIONS
import psutil
import time
from datetime import datetime

app = Flask(__name__)
CORS(app) 

# ========== REQUEST TRACKING ==========
request_count = 0
response_times = []
last_request_time = time.time()
requests_per_second = 0

@app.before_request
def before_request():
    global request_count, last_request_time, requests_per_second
    request_count += 1
    
    # Calculate requests per second
    elapsed = time.time() - last_request_time
    if elapsed >= 1:
        requests_per_second = request_count / elapsed
        request_count = 0
        last_request_time = time.time()

@app.after_request
def after_request(response):
    global response_times
    # Get request duration (you need to track start time)
    # This is simplified - for accurate tracking, use a decorator
    return response

# ========== METRICS ENDPOINT ==========
@app.route("/metrics", methods=["GET"])
def get_metrics():
    try:
        cpu = psutil.cpu_percent(interval=0.5)
        memory = psutil.virtual_memory().percent
        
        # Calculate average response time
        avg_response = sum(response_times) / len(response_times) if response_times else 0
        
        net_io = psutil.net_io_counters()
        
        return jsonify({
            "cpu_usage": cpu,
            "memory_usage": memory,
            "requests_per_sec": round(requests_per_second, 1),
            "response_time_ms": round(avg_response, 2),
            "active_nodes": 1,
            "bytes_sent": net_io.bytes_sent,
            "bytes_recv": net_io.bytes_recv,
            "timestamp": datetime.now().isoformat(),
            "source": "subsidiary_app"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ========== REST OF YOUR CODE ==========
@app.route("/", methods=["GET"])
def health():
    return jsonify({"status": "VerdiCloud AI Agent Active", "mode": "Inference"})

@app.route("/api/regions", methods=["GET"])
def get_regions():
    detected = detect_workload_automatically()
    scored = score_regions(REGIONS, detected)
    return jsonify({"success": True, "data": scored})

@app.route("/api/optimize", methods=["POST"])
def optimize():
    body = request.get_json(silent=True) or {}
    workload_data = body.get("input_payload") or body.get("payload", "")
    result = find_best_region(workload_data)
    return jsonify(result)

if __name__ == "__main__":
    print("✅ [PORT 4000]: VerdiCloud Backend is LIVE.")
    app.run(host="0.0.0.0", port=4000, debug=True)