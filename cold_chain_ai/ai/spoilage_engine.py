# ai/spoilage_engine.py
from config.settings import STORAGE_PROFILES

class SpoilageEngine:
    @staticmethod
    def evaluate(shipment):
        profile = STORAGE_PROFILES.get(shipment["storage_type"], STORAGE_PROFILES["Chilled +2°C to +8°C"])
        target = profile["target_temp"]
        min_t = profile["min_temp"]
        max_t = profile["max_temp"]
        max_doors = profile["max_door_openings"]
        
        sensors = shipment.get("sensors", [target] * 9)
        humidity = shipment.get("humidity", 50.0)
        doors = shipment.get("door_openings", 0)
        delay = float(shipment.get("delay_hours", 0.0))
        
        reasons = []
        risk_score = 0
        
        # 1. Temperature check
        exceeded_sensors = []
        for idx, val in enumerate(sensors):
            if val > max_t:
                exceeded_sensors.append((idx + 1, val))
            elif val < min_t:
                exceeded_sensors.append((idx + 1, val))
                
        if len(exceeded_sensors) >= 3:
            risk_score += 3
            ex_str = ", ".join([f"S{i} ({v:.1f}°C)" for i, v in exceeded_sensors[:3]])
            reasons.append(f"Severe thermal excursion across {len(exceeded_sensors)} sensors [{ex_str}] outside [{min_t}°C to {max_t}°C] range.")
        elif len(exceeded_sensors) > 0:
            risk_score += 2
            ex_str = ", ".join([f"S{i} ({v:.1f}°C)" for i, v in exceeded_sensors])
            reasons.append(f"Thermal deviation detected on sensor(s): {ex_str} exceeding safe tolerance for {shipment['storage_type']}.")
        else:
            reasons.append(f"All 9 thermal sensors operating within nominal profile range [{min_t}°C to {max_t}°C].")
            
        # 2. Door Openings check
        if doors > max_doors + 2:
            risk_score += 3
            reasons.append(f"Critical door access violation: {doors} opening events recorded during transit (Profile limit: {max_doors}). Causes rapid internal thermal stratification.")
        elif doors > max_doors:
            risk_score += 1
            reasons.append(f"Elevated door opening count ({doors} events vs limit of {max_doors}) accelerating moisture ingress.")
        else:
            reasons.append(f"Door opening count ({doors}) is compliant with {shipment['storage_type']} protocol.")
            
        # 3. Humidity check
        if humidity > 75.0:
            risk_score += 1
            reasons.append(f"High atmospheric humidity ({humidity:.1f}%) risks surface condensation and packaging compromise.")
        elif humidity < 25.0:
            risk_score += 1
            reasons.append(f"Low humidity ({humidity:.1f}%) indicates dry compressor strain.")
        else:
            reasons.append(f"Hermetic chamber humidity ({humidity:.1f}%) within optimal storage envelope.")
            
        # 4. Delay check
        if delay > 4.0:
            risk_score += 2
            reasons.append(f"Severe transit delay of {delay:.1f} hours depleting auxiliary battery and cooling reserves.")
        elif delay > 1.5:
            risk_score += 1
            reasons.append(f"Moderate schedule delay ({delay:.1f} hours) increasing cumulative product thermal exposure.")
        else:
            reasons.append(f"Transport schedule on time (Delay: {delay:.1f} hrs).")
            
        # Determine classification
        if risk_score >= 4:
            spoilage_risk = "HIGH"
        elif risk_score >= 2:
            spoilage_risk = "MEDIUM"
        else:
            spoilage_risk = "LOW"
            
        return {
            "spoilage_risk": spoilage_risk,
            "reasons": reasons,
            "risk_score": risk_score
        }

spoilage_engine = SpoilageEngine()
