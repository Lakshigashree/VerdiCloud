# Mock cloud region data
# carbon_intensity: gCO2eq/kWh (lower is better)
# latency: ms (lower is better)

REGIONS = [
    {"id": "us-west-2",       "name": "US West (Oregon)",           "provider": "AWS",   "carbonIntensity": 120, "latency": 45,  "renewable": 92},
    {"id": "eu-north-1",      "name": "EU North (Stockholm)",       "provider": "AWS",   "carbonIntensity": 18,  "latency": 110, "renewable": 98},
    {"id": "eu-west-1",       "name": "EU West (Ireland)",          "provider": "AWS",   "carbonIntensity": 220, "latency": 95,  "renewable": 58},
    {"id": "ap-southeast-1",  "name": "Asia Pacific (Singapore)",   "provider": "AWS",   "carbonIntensity": 410, "latency": 30,  "renewable": 20},
    {"id": "us-central1",     "name": "US Central (Iowa)",          "provider": "GCP",   "carbonIntensity": 80,  "latency": 60,  "renewable": 90},
    {"id": "europe-north1",   "name": "EU North (Finland)",         "provider": "GCP",   "carbonIntensity": 12,  "latency": 130, "renewable": 99},
    {"id": "asia-east1",      "name": "Asia East (Taiwan)",         "provider": "GCP",   "carbonIntensity": 510, "latency": 25,  "renewable": 12},
    {"id": "canadacentral",   "name": "Canada Central (Toronto)",   "provider": "Azure", "carbonIntensity": 30,  "latency": 70,  "renewable": 96},
    {"id": "brazilsouth",     "name": "Brazil South (São Paulo)",   "provider": "Azure", "carbonIntensity": 95,  "latency": 180, "renewable": 75},
    {"id": "australiaeast",   "name": "Australia East (Sydney)",    "provider": "Azure", "carbonIntensity": 620, "latency": 200, "renewable": 28},
]
