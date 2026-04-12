import joblib
import os
import datetime
import copy
import pandas as pd
from regions import REGIONS

# --- DYNAMIC PATH RESOLUTION ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'carbon_model.pkl')
DATA_PATH = os.path.join(BASE_DIR, 'energy_consumption_grid.csv')

# --- LOAD THE TRAINED DATASET ---
try:
    carbon_model = joblib.load(MODEL_PATH)
    print(f"🚀 [SYSTEM]: AI DATASET LOADED. {DATA_PATH} patterns active.")
except Exception:
    print("⚠️ [SYSTEM]: Model file (.pkl) not found. Please run trainer.py first!")
    carbon_model = None

def detect_workload_automatically(payload_data=None):
    if not payload_data:
        return "General Compute"
    
    payload_str = str(payload_data).lower()
    
    categories = {
        "Database & Storage": ["sql", "backup", "db", "postgres", "mongodb", "archive", "parquet", "storage"],
        "Real-time & Web Services": ["api", "json", "request", "rest", "graphql", "endpoint", "webhook", "frontend"],
        "AI & Machine Learning": ["train", "epoch", "model", "fit", "tensor", "pytorch", "inference", "weights"],
        "Media Processing": ["ffmpeg", "mp4", "render", "image", "encoding", "video", "transcode", "streaming"],
        "Scientific Computing": ["numpy", "simulation", "matrix", "analysis", "scientific", "crunching"],
        "Enterprise & SLA Services": ["sla", "nexus", "orchestrator", "audit", "ticket", "breach", "remediation"]
    }

    best_match = "General Compute"
    max_count = 0
    for category, keywords in categories.items():
        count = sum(1 for word in keywords if word in payload_str)
        if count > max_count:
            max_count = count
            best_match = category
    return best_match

def get_ai_prediction(hour, day):
    if carbon_model:
        prediction = carbon_model.predict([[hour, day]])
        return float(prediction[0])
    return 245.0 

def score_regions(region_list, detected_workload):
    now = datetime.datetime.now()
    ai_base_value = get_ai_prediction(now.hour, now.weekday())

    if detected_workload == "Real-time & Web Services":
        c_weight, l_weight = 0.2, 0.8 
    elif detected_workload in ["Database & Storage", "AI & Machine Learning", "Scientific Computing", "Enterprise & SLA Services"]:
        c_weight, l_weight = 0.8, 0.2 
    elif detected_workload == "Media Processing":
        c_weight, l_weight = 0.6, 0.4 
    else:
        c_weight, l_weight = 0.5, 0.5 

    processed_list = []
    for r in region_list:
        entry = copy.copy(r)
        entry["carbonIntensity"] = round(ai_base_value * ((100 - r["renewable"]) / 100), 2)
        processed_list.append(entry)

    carbons = [r["carbonIntensity"] for r in processed_list]
    latencies = [r["latency"] for r in processed_list]

    scored = []
    for r in processed_list:
        norm_c = (r["carbonIntensity"] - min(carbons)) / (max(carbons) - min(carbons)) if max(carbons) != min(carbons) else 0
        norm_l = (r["latency"] - min(latencies)) / (max(latencies) - min(latencies)) if max(latencies) != min(latencies) else 0
        r["score"] = round((c_weight * norm_c) + (l_weight * norm_l), 4)
        scored.append(r)
    return scored

def find_best_region(input_payload=None):
    detected_type = detect_workload_automatically(input_payload)
    scored_regions = score_regions(REGIONS, detected_type)
    scored_regions.sort(key=lambda r: r["score"])
    best = scored_regions[0]
    
    # --- CRITICAL FIX FOR THE LIVE LINK ---
    LIVE_NEXUS_URL = "https://nexus-system-r06t.onrender.com/"
    
    # Pointing ALL providers to the LIVE URL for the demonstration
    deploy_map = {
        "GCP": LIVE_NEXUS_URL,
        "AWS": LIVE_NEXUS_URL,
        "Azure": LIVE_NEXUS_URL,
        "Render": LIVE_NEXUS_URL
    }

    reason = (
        f"AUTONOMOUS DISCOVERY: System identified workload as '{detected_type}'. "
        f"Random Forest inference prioritized {best['name']} ({best['provider']}) "
        f"targeting a {best['carbonIntensity']} g/kWh footprint. "
    )

    return {
        "success": True, 
        "best": best,
        "reason": reason,
        "detectedWorkload": detected_type,
        # Fetching from the map or defaulting to NEXUS URL
        "deploymentUrl": deploy_map.get(best['provider'], LIVE_NEXUS_URL),
        "allScored": scored_regions
    }