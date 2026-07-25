# ai/recommender.py
from config.settings import STORAGE_PROFILES

class RecommenderEngine:
    @staticmethod
    def generate_recommendations(shipment, transport_eval, spoilage_eval, health_score):
        profile = STORAGE_PROFILES.get(shipment["storage_type"], STORAGE_PROFILES["Chilled +2°C to +8°C"])
        target = profile["target_temp"]
        max_t = profile["max_temp"]
        max_doors = profile["max_door_openings"]
        
        sensors = shipment.get("sensors", [target] * 9)
        doors = shipment.get("door_openings", 0)
        delay = float(shipment.get("delay_hours", 0.0))
        
        recs = []
        
        # Check thermal excursions
        high_sensors = [i+1 for i, v in enumerate(sensors) if v > max_t]
        if len(high_sensors) >= 3 or (max(sensors) - max_t > 2.0):
            recs.append({
                "action": "Unload immediately",
                "priority": "CRITICAL",
                "reason": f"Severe thermal breakdown detected across {len(high_sensors)} sensors (Peak temp: {max(sensors):.1f}°C vs limit {max_t}°C). Immediate transfer to facility cold storage required to prevent complete biological consignment loss."
            })
            recs.append({
                "action": "Inspect refrigeration system",
                "priority": "HIGH",
                "reason": "Compressor or primary cryogenic coolant loop failure suspected due to rapid multi-sensor thermal stratification."
            })
        elif len(high_sensors) > 0 or (max(sensors) > target + 1.0):
            recs.append({
                "action": "Increase refrigeration",
                "priority": "HIGH",
                "reason": f"Sensor temperature ({max(sensors):.1f}°C) is drifting toward upper threshold ({max_t}°C). Boost compressor output by +15% to restore equilibrium."
            })
            
        # Check door openings
        if doors > max_doors:
            recs.append({
                "action": "Reduce door openings",
                "priority": "MEDIUM",
                "reason": f"Door access count ({doors} events) exceeds protocol tolerance ({max_doors}). Instruct driver and depot staff to maintain hermetic seal until final unloading."
            })
            
        # Check delays
        if delay > 2.0:
            recs.append({
                "action": "Reroute or prioritize unloading",
                "priority": "HIGH",
                "reason": f"Schedule delay of {delay:.1f} hours depleting onboard battery cooling endurance. Prioritize dock assignment at destination."
            })
            
        # If nominal
        if not recs or (transport_eval["risk_level"] == "LOW" and spoilage_eval["spoilage_risk"] == "LOW"):
            recs.append({
                "action": "Continue transport",
                "priority": "NOMINAL",
                "reason": f"All telemetry parameters nominal (Health Index: {health_score}%). Vehicle operating at optimal thermal envelope for {shipment['storage_type']}."
            })
            
        return recs

recommender = RecommenderEngine()
