# ai/rf_model.py
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from config.settings import STORAGE_PROFILES

class TransportRiskModel:
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100, max_depth=8, random_state=42)
        self.is_trained = False
        self._train_initial_model()

    def _train_initial_model(self):
        # Generate realistic historical cold chain transport dataset for training
        np.random.seed(42)
        n_samples = 800
        
        # Features: [temp_max_deviation, humidity_deviation, door_openings, delay_hours, travel_hours, storage_severity]
        # storage_severity: 4=Cryo (-70), 3=Deep Freeze (-20), 2=Chilled (+5), 1=Ambient (+20)
        
        temp_dev = np.random.exponential(scale=1.2, size=n_samples)
        hum_dev = np.random.normal(loc=0.0, scale=8.0, size=n_samples)
        doors = np.random.poisson(lam=1.5, size=n_samples)
        delays = np.random.exponential(scale=1.0, size=n_samples)
        travel = np.random.uniform(low=2.0, high=36.0, size=n_samples)
        severity = np.random.choice([1, 2, 3, 4], size=n_samples, p=[0.2, 0.4, 0.3, 0.1])
        
        X = np.column_stack([temp_dev, np.abs(hum_dev), doors, delays, travel, severity])
        
        # Target classification logic for training data ground truth:
        # 0 = LOW risk, 1 = MEDIUM risk, 2 = HIGH risk
        y = np.zeros(n_samples, dtype=int)
        
        for i in range(n_samples):
            score = (temp_dev[i] * 1.8) + (doors[i] * 0.7) + (delays[i] * 0.9) + (severity[i] * 0.4)
            if temp_dev[i] > 3.0 or doors[i] >= 5 or delays[i] > 4.5 or score > 7.5:
                y[i] = 2  # HIGH
            elif temp_dev[i] > 1.2 or doors[i] >= 3 or delays[i] > 2.0 or score > 3.8:
                y[i] = 1  # MEDIUM
            else:
                y[i] = 0  # LOW
                
        self.model.fit(X, y)
        self.is_trained = True

    def _get_storage_severity(self, storage_type):
        if "Cryogenic" in storage_type:
            return 4
        elif "Deep Freeze" in storage_type:
            return 3
        elif "Chilled" in storage_type:
            return 2
        else:
            return 1

    def predict_risk(self, shipment):
        if not self.is_trained:
            self._train_initial_model()
            
        profile = STORAGE_PROFILES.get(shipment["storage_type"], STORAGE_PROFILES["Chilled +2°C to +8°C"])
        target_t = profile["target_temp"]
        
        # Calculate features from current shipment
        sensors = shipment.get("sensors", [target_t] * 9)
        max_dev = max([abs(t - target_t) for t in sensors]) if sensors else 0.0
        
        hum_dev = abs(shipment.get("humidity", 50.0) - 50.0)
        doors = shipment.get("door_openings", 0)
        delay = float(shipment.get("delay_hours", 0.0))
        
        # Parse travel duration string approx hours
        dur_str = shipment.get("travel_duration", "4 hours")
        travel_hrs = 4.0
        try:
            parts = dur_str.split()
            for idx, p in enumerate(parts):
                if "hour" in p and idx > 0:
                    travel_hrs = float(parts[idx-1])
        except Exception:
            travel_hrs = 4.0
            
        severity = self._get_storage_severity(shipment["storage_type"])
        
        X_test = np.array([[max_dev, hum_dev, doors, delay, travel_hrs, severity]])
        
        pred_class = self.model.predict(X_test)[0]
        probs = self.model.predict_proba(X_test)[0]
        confidence = probs[pred_class] * 100.0
        
        risk_map = {0: "LOW", 1: "MEDIUM", 2: "HIGH"}
        return {
            "risk_level": risk_map[pred_class],
            "confidence": round(confidence, 1),
            "probabilities": {
                "LOW": round(probs[0] * 100, 1),
                "MEDIUM": round(probs[1] * 100, 1),
                "HIGH": round(probs[2] * 100, 1)
            }
        }

# Global singleton model
rf_model = TransportRiskModel()
