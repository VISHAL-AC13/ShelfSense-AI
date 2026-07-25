import os
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import models
import ai_engine
import seed_data

DIST_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "cold_chain_web", "dist")

app = Flask(__name__, static_folder=DIST_DIR, static_url_path="")
CORS(app)

models.init_db()
if not models.get_all_shipments():
    seed_data.seed()

def enrich_shipment_with_ai(s):
    if not s:
        return None
    trans_risk = ai_engine.predict_transport_risk(s)
    spoil_risk = ai_engine.evaluate_spoilage_risk(s)
    health_score = ai_engine.calculate_health_score(s, spoil_risk)
    logistics = ai_engine.compute_logistics_metrics(s, spoil_risk)
    recs = ai_engine.generate_recommendations(s, trans_risk, spoil_risk, health_score)

    s["ai_eval"] = {
        "transport_risk": trans_risk,
        "spoilage_risk": spoil_risk,
        "health_score": health_score,
        "logistics": logistics,
        "recommendations": recs
    }
    return s

@app.route("/")
def serve_index():
    if os.path.exists(os.path.join(DIST_DIR, "index.html")):
        return send_from_directory(DIST_DIR, "index.html")
    return jsonify({"message": "ColdSense AI Tamil Nadu Backend Running. Run 'npm run build' in cold_chain_web to build frontend."}), 200

@app.route("/<path:path>")
def serve_static_files(path):
    if os.path.exists(os.path.join(DIST_DIR, path)):
        return send_from_directory(DIST_DIR, path)
    if os.path.exists(os.path.join(DIST_DIR, "index.html")):
        return send_from_directory(DIST_DIR, "index.html")
    return jsonify({"error": "File not found"}), 404

@app.route("/api/shipments", methods=["GET"])
def get_shipments():
    shipments = models.get_all_shipments()
    enriched = [enrich_shipment_with_ai(s) for s in shipments]
    return jsonify(enriched), 200

@app.route("/api/shipments/<shipment_id>", methods=["GET"])
def get_shipment(shipment_id):
    s = models.get_shipment_by_id(shipment_id)
    if not s:
        return jsonify({"error": "Shipment not found"}), 404
    return jsonify(enrich_shipment_with_ai(s)), 200

@app.route("/api/shipments", methods=["POST"])
def register_shipment():
    data = request.get_json()
    if not data or not data.get("shipment_id"):
        return jsonify({"error": "Missing shipment_id"}), 400

    models.insert_shipment(data)
    s = models.get_shipment_by_id(data["shipment_id"])
    return jsonify(enrich_shipment_with_ai(s)), 201

@app.route("/api/shipments/<shipment_id>/telemetry", methods=["POST"])
def update_telemetry(shipment_id):
    s = models.get_shipment_by_id(shipment_id)
    if not s:
        return jsonify({"error": "Shipment not found"}), 404

    data = request.get_json()
    new_sensors = data.get("sensors", s.get("sensors", []))
    new_hum = float(data.get("humidity", s.get("humidity", 75.0)))
    new_doors = int(data.get("door_openings", s.get("door_openings", 0)))

    profile = ai_engine.STORAGE_PROFILES.get(s.get("storage_type"), ai_engine.STORAGE_PROFILES["Fresh Fruits (Berries & Grapes)"])

    new_status = "Active"
    new_alerts = []

    crit_count = 0
    warn_count = 0
    for t in new_sensors:
        if t < profile["min_temp"] - 1.5 or t > profile["max_temp"] + 1.5:
            crit_count += 1
        elif t < profile["min_temp"] or t > profile["max_temp"]:
            warn_count += 1

    if crit_count > 0:
        new_status = "Critical"
        new_alerts.append(f"CRITICAL FOOD EXCURSION: {crit_count} thermal sensors exceeding protocol safety envelope in TN transit.")
    elif warn_count > 0:
        new_status = "Warning"
        new_alerts.append(f"ABNORMAL DRIFT WARNING: {warn_count} thermal sensors operating outside nominal food target.")

    if new_doors > profile["max_door_openings"]:
        new_status = "Critical"
        new_alerts.append(f"SECURITY VIOLATION: {new_doors} unauthorized door access events logged on TN highway.")

    if new_hum > 88.0 or new_hum < 40.0:
        if new_status != "Critical":
            new_status = "Warning"
        new_alerts.append(f"HUMIDITY ALARM: Relative humidity at {new_hum}% poses produce desiccation or mold rot risk.")

    if s.get("status") == "Delivered":
        new_status = "Delivered"
    elif "Recovering" in str(s.get("status", "")) and crit_count == 0:
        new_status = "Recovering -- Override Active"

    models.update_shipment(shipment_id, {
        "sensors": new_sensors,
        "humidity": new_hum,
        "door_openings": new_doors,
        "status": new_status,
        "alerts": new_alerts
    })

    updated = models.get_shipment_by_id(shipment_id)
    return jsonify(enrich_shipment_with_ai(updated)), 200

@app.route("/api/shipments/<shipment_id>/intervene", methods=["POST"])
def execute_intervention(shipment_id):
    s = models.get_shipment_by_id(shipment_id)
    if not s:
        return jsonify({"error": "Shipment not found"}), 404

    data = request.get_json()
    title = data.get("intervention_title", "Automated IoT Intervention")
    int_type = data.get("intervention_type", "THERMAL_OVERRIDE")

    profile = ai_engine.STORAGE_PROFILES.get(s.get("storage_type"), ai_engine.STORAGE_PROFILES["Fresh Fruits (Berries & Grapes)"])
    updated_sensors = list(s.get("sensors", []))

    if int_type in ("THERMAL_OVERRIDE", "EMERGENCY_REROUTE") or "Override" in title or "Super-Chill" in title:
        for i, val in enumerate(updated_sensors):
            diff = val - profile["target_temp"]
            if abs(diff) > 0.5:
                updated_sensors[i] = round(val - (diff * 0.7), 1)

    current_alerts = s.get("alerts", [])
    new_alerts = [f"⚡ TIMELY INTERVENTION EXECUTED: {title}. Automated IoT command dispatched to TN truck!"]
    for a in current_alerts:
        if "CRITICAL FOOD EXCURSION" not in a:
            new_alerts.append(a)

    updates = {
        "sensors": updated_sensors,
        "status": "Recovering -- Override Active",
        "vehicle_status": f"⚡ Intervention Active: {title}",
        "alerts": new_alerts
    }

    # If Emergency Reroute or Route Diversion, calculate nearest TN depot!
    if int_type == "EMERGENCY_REROUTE" or "Reroute" in title or "Divert" in title or "Depot" in title:
        curr_lat = float(s.get("current_lat", 11.0))
        curr_lon = float(s.get("current_lon", 78.0))
        best_depot, min_dist = ai_engine.find_nearest_tn_depot(curr_lat, curr_lon, s.get("origin_name", ""))
        
        updates["dest_name"] = best_depot["name"]
        updates["dest_lat"] = best_depot["lat"]
        updates["dest_lon"] = best_depot["lon"]
        updates["status"] = "Recovering -- Rerouted"
        updates["vehicle_status"] = f"🚨 Rerouted to {best_depot['name']} via {best_depot['highway']} ({min_dist} km rem)"
        updates["travel_duration"] = f"Approx {round(min_dist / 45.0, 1)} hrs rem"

    models.update_shipment(shipment_id, updates)

    updated = models.get_shipment_by_id(shipment_id)
    return jsonify(enrich_shipment_with_ai(updated)), 200

@app.route("/api/demo/reset", methods=["POST"])
def reset_demo():
    seed_data.seed()
    shipments = models.get_all_shipments()
    enriched = [enrich_shipment_with_ai(s) for s in shipments]
    return jsonify({"message": "Restored 5 default Tamil Nadu consignments in SQLite!", "shipments": enriched}), 200

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"[OK] Starting ColdSense AI Full-Stack Python Backend on http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=True)
