# database/db_manager.py
import json
import os
import pymongo
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from config.settings import MONGO_URI, MONGO_DB_NAME, LOCAL_JSON_FALLBACK_PATH, STORAGE_PROFILES

SEED_SHIPMENTS = [
    {
        "shipment_id": "SHP-1042",
        "product_category": "Pharmaceuticals",
        "product": "Pfizer mRNA Oncology Bio-Vials",
        "origin_name": "Basel Pharma Hub, CH",
        "origin_lat": 47.5596,
        "origin_lon": 7.5886,
        "dest_name": "Frankfurt Airport Depot, DE",
        "dest_lat": 50.1109,
        "dest_lon": 8.6821,
        "current_lat": 49.0069,
        "current_lon": 8.4037,
        "vehicle_number": "CRY-8821-EX",
        "driver_name": "Marcus Vance",
        "storage_type": "Cryogenic -70°C",
        "expected_delivery": "2026-07-26 16:30",
        "status": "Active",
        "vehicle_status": "In Transit - Nominal Speed",
        "travel_duration": "4 hours 15 mins",
        "delay_hours": 0.0,
        "progress_pct": 68,
        "sensors": [-70.2, -70.1, -69.8, -70.0, -70.3, -70.1, -69.9, -70.0, -69.7],
        "humidity": 38.5,
        "door_openings": 0,
        "alerts": []
    },
    {
        "shipment_id": "SHP-2089",
        "product_category": "Seafood",
        "product": "Premium Norwegian Salmon Fillets",
        "origin_name": "Bergen Marine Terminal, NO",
        "origin_lat": 60.3913,
        "origin_lon": 5.3221,
        "dest_name": "Hamburg Port Cold Store, DE",
        "dest_lat": 53.5511,
        "dest_lon": 9.9937,
        "current_lat": 56.1629,
        "current_lon": 10.2039,
        "vehicle_number": "FRZ-4029-DE",
        "driver_name": "Elena Rostova",
        "storage_type": "Deep Freeze -20°C",
        "expected_delivery": "2026-07-26 22:00",
        "status": "Warning",
        "vehicle_status": "Stopped at Customs",
        "travel_duration": "12 hours 40 mins",
        "delay_hours": 3.5,
        "progress_pct": 52,
        "sensors": [-20.1, -19.8, -20.2, -19.9, -20.0, -19.7, -18.2, -17.8, -15.4],
        "humidity": 64.2,
        "door_openings": 4,
        "alerts": ["Abnormal thermal spike in Sensor 9 (Rear Bottom near doors): -15.4°C (Target -20°C)", "Door opening threshold exceeded (4 events)"]
    },
    {
        "shipment_id": "SHP-3015",
        "product_category": "Dairy",
        "product": "Organic Raw Milk & Artisan Cheese",
        "origin_name": "Zurich Alpine Farms, CH",
        "origin_lat": 47.3769,
        "origin_lon": 8.5417,
        "dest_name": "Milan Distribution Center, IT",
        "dest_lat": 45.4642,
        "dest_lon": 9.1900,
        "current_lat": 46.0037,
        "current_lon": 8.9511,
        "vehicle_number": "CHL-1102-CH",
        "driver_name": "David Chen",
        "storage_type": "Chilled +2°C to +8°C",
        "expected_delivery": "2026-07-25 18:00",
        "status": "Active",
        "vehicle_status": "In Transit - High Speed",
        "travel_duration": "2 hours 50 mins",
        "delay_hours": 0.0,
        "progress_pct": 85,
        "sensors": [4.2, 4.3, 4.1, 4.5, 4.4, 4.2, 4.6, 4.3, 4.4],
        "humidity": 55.0,
        "door_openings": 1,
        "alerts": []
    },
    {
        "shipment_id": "SHP-4050",
        "product_category": "Pharmaceuticals",
        "product": "Insulin Glargine Pen Cartridges",
        "origin_name": "Lyon Bio-Factory, FR",
        "origin_lat": 45.7640,
        "origin_lon": 4.8357,
        "dest_name": "Geneva University Hospital, CH",
        "dest_lat": 46.2044,
        "dest_lon": 6.1432,
        "current_lat": 46.2044,
        "current_lon": 6.1432,
        "vehicle_number": "MED-9930-FR",
        "driver_name": "Sophie Martin",
        "storage_type": "Chilled +2°C to +8°C",
        "expected_delivery": "2026-07-25 11:00",
        "status": "Delivered",
        "vehicle_status": "Unloaded at Depot",
        "travel_duration": "2 hours 10 mins",
        "delay_hours": 0.0,
        "progress_pct": 100,
        "sensors": [5.0, 5.1, 4.9, 5.0, 5.0, 5.2, 5.1, 5.0, 5.1],
        "humidity": 48.0,
        "door_openings": 2,
        "alerts": []
    },
    {
        "shipment_id": "SHP-5092",
        "product_category": "Meat & Poultry",
        "product": "Prime Aged Beef Quarters",
        "origin_name": "Vienna Central Abattoir, AT",
        "origin_lat": 48.2082,
        "origin_lon": 16.3738,
        "dest_name": "Munich Butcher Syndicate, DE",
        "dest_lat": 48.1351,
        "dest_lon": 11.5820,
        "current_lat": 48.2500,
        "current_lon": 13.0450,
        "vehicle_number": "MET-7741-AT",
        "driver_name": "Johann Klaus",
        "storage_type": "Deep Freeze -20°C",
        "expected_delivery": "2026-07-26 08:00",
        "status": "Critical",
        "vehicle_status": "Idling at Highway Rest Stop",
        "travel_duration": "6 hours 10 mins",
        "delay_hours": 5.2,
        "progress_pct": 40,
        "sensors": [-19.5, -19.2, -18.9, -17.5, -16.8, -15.2, -14.1, -12.5, -10.8],
        "humidity": 78.4,
        "door_openings": 5,
        "alerts": ["CRITICAL THERMAL EXCURSION: Multiple sensors exceeding -18°C tolerance!", "Severe compressor lag detected in rear cooling zone", "Door opening count (5) critical"]
    }
]

class DatabaseManager:
    def __init__(self):
        self.use_mongo = False
        self.client = None
        self.db = None
        self.collection = None
        self._init_connection()

    def _init_connection(self):
        try:
            self.client = pymongo.MongoClient(MONGO_URI, serverSelectionTimeoutMS=1500)
            self.client.server_info()  # Trigger connection test
            self.db = self.client[MONGO_DB_NAME]
            self.collection = self.db["shipments"]
            self.use_mongo = True
            # Seed if empty
            if self.collection.count_documents({}) == 0:
                self.collection.insert_many(SEED_SHIPMENTS)
        except (ConnectionFailure, ServerSelectionTimeoutError, Exception) as e:
            self.use_mongo = False
            self._ensure_local_json_exists()

    def _ensure_local_json_exists(self):
        os.makedirs(os.path.dirname(LOCAL_JSON_FALLBACK_PATH), exist_ok=True)
        if not os.path.exists(LOCAL_JSON_FALLBACK_PATH):
            with open(LOCAL_JSON_FALLBACK_PATH, 'w', encoding='utf-8') as f:
                json.dump(SEED_SHIPMENTS, f, indent=2)

    def get_all_shipments(self):
        if self.use_mongo:
            try:
                shipments = list(self.collection.find({}, {"_id": 0}))
                return shipments
            except Exception:
                self.use_mongo = False
                return self.get_all_shipments()
        else:
            self._ensure_local_json_exists()
            with open(LOCAL_JSON_FALLBACK_PATH, 'r', encoding='utf-8') as f:
                return json.load(f)

    def get_shipment_by_id(self, shipment_id):
        all_s = self.get_all_shipments()
        for s in all_s:
            if s["shipment_id"] == shipment_id:
                return s
        return None

    def save_shipment(self, shipment_data):
        if self.use_mongo:
            try:
                # Check if exists to update or insert
                existing = self.collection.find_one({"shipment_id": shipment_data["shipment_id"]})
                if existing:
                    self.collection.update_one({"shipment_id": shipment_data["shipment_id"]}, {"$set": shipment_data})
                else:
                    self.collection.insert_one(shipment_data)
                return True
            except Exception:
                self.use_mongo = False
                return self.save_shipment(shipment_data)
        else:
            self._ensure_local_json_exists()
            with open(LOCAL_JSON_FALLBACK_PATH, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Update or append
            updated = False
            for i, s in enumerate(data):
                if s["shipment_id"] == shipment_data["shipment_id"]:
                    data[i] = shipment_data
                    updated = True
                    break
            if not updated:
                data.append(shipment_data)
                
            with open(LOCAL_JSON_FALLBACK_PATH, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2)
            return True

    def update_shipment_telemetry(self, shipment_id, new_sensors, new_humidity, new_doors, new_status=None, new_alerts=None):
        shipment = self.get_shipment_by_id(shipment_id)
        if not shipment:
            return False
        
        shipment["sensors"] = new_sensors
        shipment["humidity"] = new_humidity
        shipment["door_openings"] = new_doors
        if new_status:
            shipment["status"] = new_status
        if new_alerts is not None:
            shipment["alerts"] = new_alerts
            
        return self.save_shipment(shipment)

# Global singleton instance
db = DatabaseManager()
