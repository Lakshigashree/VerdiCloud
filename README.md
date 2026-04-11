# 🌿 VerdiCloud – Intelligent Carbon-Aware Workload Optimizer

## 🚀 Overview

VerdiCloud is a smart cloud optimization platform that selects the most carbon-efficient region for executing workloads. It uses a Machine Learning model to predict carbon intensity in real-time and combines it with system latency to make intelligent decisions.

---

## 🎯 Key Features

* 🌍 Carbon-aware workload optimization
* 🤖 AI-based carbon intensity prediction
* ⚡ Real-time region scoring and selection
* 📊 Interactive dashboard (frontend)
* 🧠 Multi-agent system design

---

## 🏗️ Tech Stack

**Frontend:** HTML, CSS, JavaScript
**Backend:** Python (Flask)
**AI/ML:** Scikit-learn (Random Forest), Pandas, Joblib
**Architecture:** Multi-Agent System
**Data:** CSV Dataset

---

## 🧠 System Architecture

The system follows a **multi-agent architecture**:

* **Training Agent** → Trains ML model using historical dataset
* **Prediction Agent** → Predicts real-time carbon intensity
* **Optimization Agent** → Scores regions and selects best option

---

## ⚙️ How It Works

1. User selects workload type from dashboard
2. Frontend sends request to backend API
3. AI model predicts current carbon intensity
4. Regions are dynamically updated based on prediction
5. Scoring algorithm calculates optimal region
6. Best region is returned and displayed

---

## 🧮 Optimization Logic

* Uses weighted scoring:

```bash
Score = 0.7(Carbon) + 0.3(Latency)
```

* Applies Min-Max Normalization for fair comparison

---

## 📡 API Endpoints

### 🔹 GET /api/regions

Returns all regions with updated carbon intensity and scores

---

### 🔹 POST /api/optimize

**Input:**

```json
{
  "workloadType": "Batch"
}
```

**Output:**

* Best region
* Reason for selection
* All scored regions

---

## 🤖 Machine Learning Model

* Algorithm: Random Forest Regressor
* Input Features:

  * Hour of the day
  * Day of the week
* Output:

  * Predicted carbon intensity (g/kWh)

---

## 📂 Project Structure

```bash
backend/
│── server.py
│── optimizer.py
│── trainer.py
│── regions.py
│── carbon_model.pkl
│── energy_consumption_grid.csv

frontend/
│── index.html
│── style.css
│── script.js
```

---

## ▶️ How to Run

### 1. Install dependencies

```bash
pip install flask flask-cors pandas scikit-learn joblib
```

### 2. Train the model

```bash
python trainer.py
```

### 3. Start backend server

```bash
python server.py
```

### 4. Open frontend

* Open `index.html` in browser

---

## 🌱 Real-World Impact

* Reduces carbon footprint of cloud workloads
* Promotes sustainable computing
* Helps organizations meet environmental goals

---

## 🏆 Future Enhancements

* Real-time carbon APIs integration
* Automatic workload shifting (autonomous mode)
* Cloud provider integration (AWS, Azure, GCP)
* Advanced ML models for prediction

