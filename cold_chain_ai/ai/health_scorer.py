# ai/health_scorer.py
from config.settings import STORAGE_PROFILES

class HealthScorer:
    @staticmethod
    def calculate(shipment, spoilage_eval=None):
        profile = STORAGE_PROFILES.get(shipment["storage_type"], STORAGE_PROFILES["Chilled +2°C to +8°C"])
        target = profile["target_temp"]
        min_t = profile["min_temp"]
        max_t = profile["max_temp"]
        
        sensors = shipment.get("sensors", [target] * 9)
        doors = shipment.get("door_openings", 0)
        delay = float(shipment.get("delay_hours", 0.0))
        
        score = 100.0
        
        # Deduct for temperature deviations
        for val in sensors:
            if val > max_t:
                diff = val - max_t
                score -= (diff * 4.0)
            elif val < min_t:
                diff = min_t - val
                score -= (diff * 3.0)
            else:
                # minor drift from target
                drift = abs(val - target)
                score -= (drift * 0.3)
                
        # Deduct for door openings
        max_doors = profile["max_door_openings"]
        if doors > max_doors:
            score -= (doors - max_doors) * 6.0
            
        # Deduct for delays
        if delay > 0:
            score -= (delay * 3.5)
            
        # Deduct if spoilage risk is HIGH
        if spoilage_eval and spoilage_eval.get("spoilage_risk") == "HIGH":
            score -= 15.0
        elif spoilage_eval and spoilage_eval.get("spoilage_risk") == "MEDIUM":
            score -= 7.0
            
        # Ensure score is within 0-100
        score = max(0.0, min(100.0, score))
        return round(score, 1)

health_scorer = HealthScorer()
