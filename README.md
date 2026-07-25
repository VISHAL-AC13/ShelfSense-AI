# ShelfSense AI -- Tamil Nadu Cold Chain Intelligence & Decision Support System

## 🌟 Executive Summary
**ShelfSense AI** is an enterprise-grade **AI-Powered Cold Chain Logistics & Timely Decision Support System** engineered specifically for Tamil Nadu's agri-food and perishables sector (fruits, vegetables, dairy, seafood, and frozen meats). 

While conventional cold chain tracking systems act as passive monitors that merely display GPS coordinates and temperature alerts after spoilage has already occurred, **ShelfSense AI** operates as an **active autonomous decision support system**. It continuously ingests live multi-zone thermal sensor telemetry, relative humidity metrics, security door opening counts, and highway traffic congestion data to predict biological spoilage **before** it happens. When risks arise, the system generates prescriptive **1-Click Timely Interventions**—including automated geodesic GPS route diversions to certified emergency cold storage facilities across Tamil Nadu.

---

## 🚀 Core Prototype Capabilities & Features

### 1. 🤖 AI Spoilage Prediction & Risk Explainability Engine
* **Dynamic Risk Scoring**: The Python AI backend (`ai_engine.py`) continuously computes a biological **Spoilage Risk Score (0.0 to 10.0)** for every consignment based on thermal drift, humidity anomalies, and transit time.
* **Plain-English Explainability**: Instead of presenting raw numbers, the AI generates human-readable diagnostic rationales (e.g., *"THERMAL DRIFT WARNING: Rear chamber sensors operating near +0.9°C ceiling on Madurai highway"* or *"SECURITY VIOLATION: 6 door access events logged near Karur"*).
* **Multi-Tier Risk Classification**: Automatically categorizes consignments into `NOMINAL`, `MODERATE`, `HIGH`, and `CRITICAL` risk envelopes.

### 2. ⚡ Timely Interventions & 1-Click Action Hub
* **Automated Decision Support**: Recommends immediate, actionable solutions tailored to the exact failure mode (e.g., `⚡ Emergency Route Diversion to Nearest TN Cold Depot`, `Adjust Rear Refrigeration Output to -2.0°C`, or `Dispatch Express Maintenance Team`).
* **Instant State Synchronization**: Clicking an intervention triggers a live REST API mutation (`POST /api/shipments/<id>/intervene`). The backend immediately re-evaluates the consignment, recalculates logistics, and updates the SQLite database in real time.

### 3. 🗺️ Dynamic GPS Tracking & Autonomous Emergency Rerouting
* **Interactive Leaflet Mapping**: Tracks fleet vehicles live across major Tamil Nadu highway corridors (NH44, NH48, NH85, NH544, NH744).
* **Geodesic Depot Rerouting (Haversine Algorithm)**: When a thermal emergency occurs, triggering a route diversion instructs the AI engine to calculate the exact geodesic distance to 6 certified emergency cold storage depots across Tamil Nadu:
  1. *Erode Aavin & Cold Hub, TN* (NH544)
  2. *Salem Steel Plant Road Cold Depot, TN* (NH44)
  3. *Oddanchatram Agri Cold Storage, TN* (NH83)
  4. *Madurai Ring Road Cold Facility, TN* (NH744)
  5. *Coimbatore Ukkadam Cold Terminal, TN* (NH544)
  6. *Koyambedu Logistics Cold Hub, Chennai, TN* (NH48)
* The system automatically re-points the vehicle's destination coordinates in the SQLite database to the nearest depot, updates the map marker, draws a red emergency diversion trajectory, and recalculates remaining transit hours!

### 4. 🚦 Real-Time Highway Traffic & Biological Shelf-Life Telemetry
* **Corridor Congestion Intelligence**: Classifies live highway transit conditions (`Heavy Traffic Congestion on Highway`, `Moderate Slowdown on Highway Corridor`, or `Nominal Highway Cruising Velocity -- Clear Traffic Flow`) and applies delay penalties.
* **Biological Shelf-Life Modeling**: Calculates the remaining viable biological shelf-life for perishable cargo (e.g., Nilgiri Strawberries, Salem Mangoes, Thoothukudi Seer Fish) by deducting degradation time caused by thermal excursions and highway traffic bottlenecks.

### 5. 📑 Quality Assurance & Compliance Audit PDF Export
* **1-Click Compliance Reporting**: Generates certified, professional PDF audit documents using `jsPDF` for food quality inspections and record-keeping.
* **Comprehensive Documentation**: Contains full consignment manifests, multi-zone thermal array tables, anomaly diagnostics, digital verification checksums, and sign-off by Quality Assurance officers.

### 6. 🏢 Tamil Nadu Logistics Corridors & Professional UI Design
* **100% Tamil Nadu Ecosystem**: All agricultural origin hubs (Ooty, Theni, Thoothukudi, Oddanchatram, Erode) and destination markets (Koyambedu, Madurai Central, Coimbatore Ukkadam, Trichy Gandhi Market) model real supply chain corridors in Tamil Nadu.
* **Authentic Operational Roles**: Modeled with realistic driver profiles and role-based portal access (Operations Admin, Logistics Manager, Quality Inspector).
* **Modern Executive Aesthetic**: Designed with a clean, professional interface (`#FFFFFF` cards with `#CBD5E1` slate borders and `#2563EB` royal blue accents), prioritizing readability and quick data ingestion over distracting animations.

---

## 🏗️ System Architecture & File Structure

The workspace is organized into a clean Full-Stack architecture:

```text
p:\newfood\
├── backend\                   # Python Flask REST API & SQLite Database
│   ├── app.py                 # Flask server, API routes & static React file server
│   ├── ai_engine.py           # ML Spoilage risk score & Haversine rerouting engine
│   ├── models.py              # SQLite database schema & SQL query wrapper
│   ├── seed_data.py           # Initializer for the 5 Tamil Nadu consignments
│   ├── coldsense_ai_tn.db     # SQLite database file
│   └── requirements.txt       # Python dependencies (Flask, Flask-CORS)
│
├── cold_chain_web\            # React + Vite Frontend Web Application
│   ├── src\
│   │   ├── components\        # Navbar, Sidebar & layout components
│   │   ├── modules\           # Fleet Dashboard, Register, Live Monitoring, AI Interventions, GPS & Reports
│   │   ├── services\          # REST API client connecting to Flask endpoints
│   │   └── data\mockData.js   # Storage profiles & backup definitions
│   ├── dist\                  # Compiled production static bundle served by Flask
│   └── package.json           # Node dependencies (Vite, React, Leaflet, jsPDF, Lucide)
│
├── Dockerfile                 # Multi-stage production container build
└── render.yaml                # Cloud deployment configuration for Render.com
```

---

## ⚡ Quick Start & Execution Guide

### Running the Integrated Production Server
The entire application (both Python API backend and React UI) runs from a single unified server:

1. Open your terminal in PowerShell or Command Prompt.
2. Navigate to the backend directory and launch the server:
   ```powershell
   cd p:\newfood\backend
   python app.py
   ```
3. Open your web browser and access: **[http://localhost:5000](http://localhost:5000)**
   * The Flask server automatically serves the compiled **ShelfSense AI** frontend interface while handling all REST API communications in real time!
