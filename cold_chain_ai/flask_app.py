# flask_app.py
import io
import random
from datetime import datetime, timedelta
from flask import Flask, render_template, jsonify, request, send_file
from database.db_manager import db
from ai.rf_model import rf_model
from ai.spoilage_engine import spoilage_engine
from ai.health_scorer import health_scorer
from ai.recommender import recommender
from utils.pdf_generator import generate_shipment_pdf
from config.settings import STORAGE_PROFILES, APP_TITLE, APP_SUBTITLE

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html", title=APP_TITLE, subtitle=APP_SUBTITLE, use_mongo=db.use_mongo)

@app.route("/api/storage_profiles", methods=["GET"])
def get_storage_profiles():
    return jsonify({"success": True, "profiles": STORAGE_PROFILES})

@app.route("/api/shipments", methods=["GET"])
def get_shipments():
    shipments = db.get_all_shipments()
    augmented = []
    for s in shipments:
        r_trans = rf_model.predict_risk(s)
        r_spoil = spoilage_engine.evaluate(s)
        score = health_scorer.calculate(s, r_spoil)
        recs = recommender.generate_recommendations(s, r_trans, r_spoil, score)
        profile = STORAGE_PROFILES.get(s["storage_type"], STORAGE_PROFILES["Chilled +2°C to +8°C"])
        
        # Ensure 9 sensors
        sensors = s.get("sensors", [profile["target_temp"]] * 9)
        while len(sensors) < 9:
            sensors.append(profile["target_temp"])
        s["sensors"] = sensors
        
        augmented.append({
            "data": s,
            "ai": {
                "transport_risk": r_trans,
                "spoilage_risk": r_spoil,
                "health_score": score,
                "recommendations": recs
            },
            "profile": profile
        })
    return jsonify({"success": True, "count": len(augmented), "shipments": augmented, "use_mongo": db.use_mongo})

@app.route("/api/shipments/<shipment_id>", methods=["GET"])
def get_shipment(shipment_id):
    s = db.get_shipment_by_id(shipment_id)
    if not s:
        return jsonify({"success": False, "message": "Shipment not found"}), 404
        
    r_trans = rf_model.predict_risk(s)
    r_spoil = spoilage_engine.evaluate(s)
    score = health_scorer.calculate(s, r_spoil)
    recs = recommender.generate_recommendations(s, r_trans, r_spoil, score)
    profile = STORAGE_PROFILES.get(s["storage_type"], STORAGE_PROFILES["Chilled +2°C to +8°C"])
    
    return jsonify({
        "success": True,
        "shipment": {
            "data": s,
            "ai": {
                "transport_risk": r_trans,
                "spoilage_risk": r_spoil,
                "health_score": score,
                "recommendations": recs
            },
            "profile": profile
        }
    })

@app.route("/api/shipments/register", methods=["POST"])
def register_shipment():
    payload = request.get_json()
    if not payload:
        return jsonify({"success": False, "message": "Invalid JSON payload"}), 400
        
    required_fields = ["shipment_id", "product_category", "product", "storage_type", "origin_name", "dest_name", "vehicle_number", "driver_name"]
    for field in required_fields:
        if not payload.get(field):
            return jsonify({"success": False, "message": f"Missing required field: {field}"}), 400
            
    storage_type = payload["storage_type"]
    profile = STORAGE_PROFILES.get(storage_type, STORAGE_PROFILES["Chilled +2°C to +8°C"])
    target_t = profile["target_temp"]
    
    # Initialize 9 sensors with minor jitter
    init_sensors = [round(target_t + random.uniform(-0.3, 0.3), 1) for _ in range(9)]
    
    expected_delivery = payload.get("expected_delivery", (datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d 14:00"))
    
    new_shipment = {
        "shipment_id": payload["shipment_id"],
        "product_category": payload["product_category"],
        "product": payload["product"],
        "origin_name": payload["origin_name"],
        "origin_lat": float(payload.get("origin_lat", 47.5596)),
        "origin_lon": float(payload.get("origin_lon", 7.5886)),
        "dest_name": payload["dest_name"],
        "dest_lat": float(payload.get("dest_lat", 50.1109)),
        "dest_lon": float(payload.get("dest_lon", 8.6821)),
        "current_lat": float(payload.get("origin_lat", 47.5596)),
        "current_lon": float(payload.get("origin_lon", 7.5886)),
        "vehicle_number": payload["vehicle_number"],
        "driver_name": payload["driver_name"],
        "storage_type": storage_type,
        "expected_delivery": expected_delivery,
        "status": "Active",
        "vehicle_status": "In Transit - Nominal Speed",
        "travel_duration": "0 hours 15 mins",
        "delay_hours": 0.0,
        "progress_pct": 5,
        "sensors": init_sensors,
        "humidity": 48.0,
        "door_openings": 0,
        "alerts": []
    }
    
    success = db.save_shipment(new_shipment)
    if success:
        return jsonify({"success": True, "message": f"Consignment {new_shipment['shipment_id']} registered successfully!", "shipment": new_shipment}), 201
    else:
        return jsonify({"success": False, "message": "Failed to save consignment to database."}), 500

@app.route("/api/telemetry/update", methods=["POST"])
def update_telemetry():
    payload = request.get_json()
    if not payload or "shipment_id" not in payload:
        return jsonify({"success": False, "message": "Missing shipment_id in payload"}), 400
        
    shipment_id = payload["shipment_id"]
    s = db.get_shipment_by_id(shipment_id)
    if not s:
        return jsonify({"success": False, "message": "Shipment not found"}), 404
        
    profile = STORAGE_PROFILES.get(s["storage_type"], STORAGE_PROFILES["Chilled +2°C to +8°C"])
    max_t = profile["max_temp"]
    max_doors = profile["max_door_openings"]
    
    sensors = list(s.get("sensors", [profile["target_temp"]] * 9))
    if "sensor9" in payload:
        sensors[8] = float(payload["sensor9"])
    if "sensors" in payload and isinstance(payload["sensors"], list):
        sensors = [float(v) for v in payload["sensors"]][:9]
        
    humidity = float(payload.get("humidity", s.get("humidity", 50.0)))
    doors = int(payload.get("door_openings", s.get("door_openings", 0)))
    
    # Check status and generate alerts
    alerts = []
    new_stat = "Active"
    
    high_sensors = [i+1 for i, v in enumerate(sensors) if v > max_t]
    if len(high_sensors) >= 2 or sensors[8] > max_t + 2.0 or doors > max_doors + 2:
        new_stat = "Critical"
        if sensors[8] > max_t:
            alerts.append(f"CRITICAL EXCURSION: Sensor 9 reported {sensors[8]:.1f}°C (Limit {max_t}°C)")
        if doors > max_doors:
            alerts.append(f"CRITICAL DOOR VIOLATION: {doors} events recorded (Limit {max_doors})")
    elif len(high_sensors) > 0 or doors > max_doors:
        new_stat = "Warning"
        if sensors[8] > max_t:
            alerts.append(f"Abnormal telemetry warning on Sensor 9 ({sensors[8]:.1f}°C)")
        if doors > max_doors:
            alerts.append(f"Door opening warning ({doors} events vs limit {max_doors})")
            
    success = db.update_shipment_telemetry(shipment_id, sensors, humidity, doors, new_stat, alerts)
    if success:
        return jsonify({"success": True, "message": f"Telemetry updated for {shipment_id}", "status": new_stat, "alerts": alerts})
    else:
        return jsonify({"success": False, "message": "Failed to update telemetry"}), 500

@app.route("/api/reports/download/<shipment_id>", methods=["GET"])
def download_report(shipment_id):
    s = db.get_shipment_by_id(shipment_id)
    if not s:
        return jsonify({"success": False, "message": "Shipment not found"}), 404
        
    r_trans = rf_model.predict_risk(s)
    r_spoil = spoilage_engine.evaluate(s)
    score = health_scorer.calculate(s, r_spoil)
    recs = recommender.generate_recommendations(s, r_trans, r_spoil, score)
    
    pdf_bytes = generate_shipment_pdf(s, r_trans, r_spoil, score, recs)
    
    return send_file(
        io.BytesIO(pdf_bytes),
        mimetype="application/pdf",
        as_attachment=True,
        download_name=f"ColdChain_Audit_Report_{shipment_id}.pdf"
    )

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
