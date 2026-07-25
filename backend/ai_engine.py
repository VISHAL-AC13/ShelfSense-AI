import math
import json

STORAGE_PROFILES = {
  "Fresh Fruits (Berries & Grapes)": {
    "target_temp": 1.0, "min_temp": 0.0, "max_temp": 3.0, "max_door_openings": 3, "base_shelf_life_hrs": 72.0,
    "desc": "Strict low temperature protocol to prevent mold, softening, and fungal decay in Nilgiri strawberries and grapes."
  },
  "Leafy Vegetables & Salads": {
    "target_temp": 2.5, "min_temp": 1.0, "max_temp": 4.5, "max_door_openings": 4, "base_shelf_life_hrs": 54.0,
    "desc": "High humidity and cool thermal envelope to prevent wilting, moisture loss, and heat damage in Keerai and spinach."
  },
  "Tropical Fruits (Bananas & Mangoes)": {
    "target_temp": 13.5, "min_temp": 12.0, "max_temp": 15.0, "max_door_openings": 5, "base_shelf_life_hrs": 120.0,
    "desc": "Controlled cool envelope to prevent chilling injury, peel discoloration, and premature ripening in Poovan bananas and Salem mangoes."
  },
  "Fresh Seafood & Sushi Grade Fish": {
    "target_temp": -1.0, "min_temp": -2.5, "max_temp": 0.5, "max_door_openings": 2, "base_shelf_life_hrs": 40.0,
    "desc": "Sub-zero chilling near freezing point to halt enzymatic degradation and histamine formation in Vanjaram and prawns."
  },
  "Prime Dairy & Cheese": {
    "target_temp": 4.0, "min_temp": 2.0, "max_temp": 6.0, "max_door_openings": 4, "base_shelf_life_hrs": 96.0,
    "desc": "Nominal chilled storage to prevent whey separation and fermentation in Aavin milk, butter, and paneer."
  },
  "Frozen Meats & Poultry": {
    "target_temp": -19.0, "min_temp": -22.0, "max_temp": -16.0, "max_door_openings": 2, "base_shelf_life_hrs": 240.0,
    "desc": "Deep freeze envelope to maintain protein integrity, prevent freezer burn, and halt all microbial activity."
  }
}

TN_EMERGENCY_DEPOTS = [
    {"name": "Erode Aavin & Cold Hub, TN", "lat": 11.3410, "lon": 77.7172, "highway": "NH544"},
    {"name": "Salem Steel Plant Road Cold Depot, TN", "lat": 11.6643, "lon": 78.1460, "highway": "NH44"},
    {"name": "Oddanchatram Agri Cold Storage, TN", "lat": 10.5015, "lon": 77.7479, "highway": "NH83"},
    {"name": "Madurai Ring Road Cold Facility, TN", "lat": 9.9252, "lon": 78.1198, "highway": "NH744"},
    {"name": "Coimbatore Ukkadam Cold Terminal, TN", "lat": 10.9925, "lon": 76.9614, "highway": "NH544"},
    {"name": "Koyambedu Logistics Cold Hub, Chennai, TN", "lat": 13.0694, "lon": 80.1948, "highway": "NH48"}
]

def calculate_haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371.0 # km
    dLat = math.radians(lat2 - lat1)
    dLon = math.radians(lon2 - lon1)
    a = (math.sin(dLat / 2) * math.sin(dLat / 2) +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dLon / 2) * math.sin(dLon / 2))
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 1)

def find_nearest_tn_depot(curr_lat, curr_lon, ignore_name=""):
    best_depot = TN_EMERGENCY_DEPOTS[0]
    min_dist = 9999.0
    for depot in TN_EMERGENCY_DEPOTS:
        if ignore_name and ignore_name.lower() in depot["name"].lower():
            continue
        dist = calculate_haversine_distance(curr_lat, curr_lon, depot["lat"], depot["lon"])
        if dist < min_dist:
            min_dist = dist
            best_depot = depot
    return best_depot, min_dist

def predict_transport_risk(shipment):
    delay_hours = float(shipment.get("delay_hours", 0.0))
    door_openings = int(shipment.get("door_openings", 0))
    sensors = shipment.get("sensors", [])
    storage_type = shipment.get("storage_type", "Fresh Fruits (Berries & Grapes)")
    profile = STORAGE_PROFILES.get(storage_type, STORAGE_PROFILES["Fresh Fruits (Berries & Grapes)"])

    avg_temp = sum(sensors) / len(sensors) if sensors else profile["target_temp"]
    temp_dev = abs(avg_temp - profile["target_temp"])

    risk_val = (delay_hours * 22.0) + (door_openings * 14.0) + (temp_dev * 18.0)

    if risk_val > 65:
        return {
            "risk_level": "HIGH",
            "confidence": 94.5,
            "probabilities": {"LOW": 5, "MEDIUM": 15, "HIGH": 80}
        }
    elif risk_val > 30:
        return {
            "risk_level": "MEDIUM",
            "confidence": 88.2,
            "probabilities": {"LOW": 15, "MEDIUM": 65, "HIGH": 20}
        }
    else:
        return {
            "risk_level": "LOW",
            "confidence": 97.8,
            "probabilities": {"LOW": 85, "MEDIUM": 12, "HIGH": 3}
        }

def evaluate_spoilage_risk(shipment):
    sensors = shipment.get("sensors", [])
    storage_type = shipment.get("storage_type", "Fresh Fruits (Berries & Grapes)")
    humidity = float(shipment.get("humidity", 75.0))
    door_openings = int(shipment.get("door_openings", 0))
    profile = STORAGE_PROFILES.get(storage_type, STORAGE_PROFILES["Fresh Fruits (Berries & Grapes)"])

    if not sensors:
        sensors = [profile["target_temp"]] * 9

    max_temp = max(sensors)
    min_temp = min(sensors)
    temp_diff_high = max_temp - profile["max_temp"]
    temp_diff_low = profile["min_temp"] - min_temp

    reasons = []
    score = 1.0

    if temp_diff_high > 1.5:
        score += 5.5
        reasons.append(f"CRITICAL THERMAL EXCURSION: Peak temperature reached {max_temp:.1f}°C, exceeding protocol ceiling ({profile['max_temp']}°C). Accelerates enzymatic decay.")
    elif temp_diff_high > 0:
        score += 3.2
        reasons.append(f"ABNORMAL DRIFT WARNING: Sensor reading {max_temp:.1f}°C is above target envelope ({profile['max_temp']}°C).")

    if temp_diff_low > 1.0:
        score += 4.0
        reasons.append(f"CHILLING HAZARD: Minimum temperature dropped to {min_temp:.1f}°C, risking cellular frost damage.")

    if door_openings > profile["max_door_openings"]:
        score += 2.5
        reasons.append(f"SECURITY VIOLATION: {door_openings} door openings logged on TN highway (Limit: {profile['max_door_openings']}).")

    if humidity > 88.0:
        score += 1.8
        reasons.append(f"HIGH HUMIDITY ALARM: Relative humidity at {humidity}% creates condensation rot risk.")
    elif humidity < 40.0:
        score += 1.5
        reasons.append(f"LOW HUMIDITY ALARM: Relative humidity at {humidity}% causes rapid moisture loss and wilting.")

    if not reasons:
        reasons.append("All 9-zone thermal sensors, humidity levels, and security door access strictly comply with nominal FSSAI Tamil Nadu tolerances.")

    score = min(10.0, round(score, 1))
    risk_label = "HIGH" if score >= 6.5 else "MEDIUM" if score >= 3.2 else "LOW"
    return {
        "spoilage_risk": risk_label,
        "risk_score": score,
        "reasons": reasons
    }

def calculate_health_score(shipment, spoil_risk):
    if shipment.get("status") == "Delivered":
        return 100
    base_score = 100.0
    penalty = float(spoil_risk["risk_score"]) * 8.5
    delay_hours = float(shipment.get("delay_hours", 0.0))
    penalty += delay_hours * 4.0
    return max(10, min(100, int(round(base_score - penalty))))

def compute_logistics_metrics(shipment, spoil_risk):
    storage_type = shipment.get("storage_type", "Fresh Fruits (Berries & Grapes)")
    profile = STORAGE_PROFILES.get(storage_type, STORAGE_PROFILES["Fresh Fruits (Berries & Grapes)"])
    
    base_shelf_life = profile.get("base_shelf_life_hrs", 72.0)
    delay_hrs = float(shipment.get("delay_hours", 0.0))
    spoil_score = float(spoil_risk["risk_score"])
    
    # Calculate remaining shelf life in hours
    # Each point of spoilage score over 1.0 accelerates shelf life loss by 15%
    degradation_factor = 1.0 + max(0.0, (spoil_score - 1.0) * 0.15)
    rem_shelf_life = max(2.0, round((base_shelf_life / degradation_factor) - (delay_hrs * 1.5), 1))
    
    # Traffic calculation based on delay and current location
    curr_lat = float(shipment.get("current_lat", 11.0))
    if delay_hrs > 1.0:
        traffic_status = f"Heavy Traffic Congestion on Highway (+{delay_hrs} hrs delay)"
        traffic_level = "HEAVY"
    elif delay_hrs > 0.0:
        traffic_status = f"Moderate Slowdown on Highway Corridor (+{delay_hrs} hrs delay)"
        traffic_level = "MODERATE"
    else:
        traffic_status = "Nominal Highway Cruising Velocity -- Clear Traffic Flow"
        traffic_level = "CLEAR"
        
    return {
        "remaining_shelf_life_hrs": rem_shelf_life,
        "traffic_status": traffic_status,
        "traffic_level": traffic_level,
        "base_shelf_life_hrs": base_shelf_life
    }

def generate_recommendations(shipment, trans_risk, spoil_risk, health_score):
    recs = []
    score = spoil_risk["risk_score"]
    dest_name = shipment.get("dest_name", "Koyambedu Chennai Market")

    if score >= 6.5:
        recs.append({
            "priority": "CRITICAL",
            "action": "⚡ Emergency Route Diversion to Nearest TN Cold Depot",
            "reason": "Severe thermal drift and microbial spoilage risk detected on highway. Immediately divert vehicle to nearest certified Tamil Nadu cold storage within 25 km."
        })
        recs.append({
            "priority": "CRITICAL",
            "action": "⚡ Override Compressor (-1.5°C Super-Chill)",
            "reason": "Force refrigeration unit compressor to drop setpoint by 1.5°C immediately to counteract warm ambient air influx."
        })
    elif score >= 3.2:
        recs.append({
            "priority": "HIGH",
            "action": "⚡ Flag WMS Priority QC Unloading at Destination",
            "reason": f"Elevated operational stress detected. Alert {dest_name} warehouse dock managers for immediate priority unloading and sensory QC check upon arrival."
        })
        recs.append({
            "priority": "HIGH",
            "action": "⚡ Dispatch Thermal Drift Alert to Driver",
            "reason": "Notify driver to verify trailer rear door seal integrity and check cooling unit airflow vents."
        })
    else:
        recs.append({
            "priority": "NOMINAL",
            "action": "⚡ Maintain Automated Highway Cruising & Telemetry Logging",
            "reason": "All food preservation parameters are nominal. Continue standard 15-minute IoT telemetry reporting interval."
        })

    return recs
