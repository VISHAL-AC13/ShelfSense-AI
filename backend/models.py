import sqlite3
import json
import os

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "coldsense_ai_tn.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS shipments (
            shipment_id TEXT PRIMARY KEY,
            product_category TEXT,
            product TEXT,
            storage_type TEXT,
            vehicle_number TEXT,
            driver_name TEXT,
            origin_name TEXT,
            dest_name TEXT,
            origin_lat REAL,
            origin_lon REAL,
            dest_lat REAL,
            dest_lon REAL,
            current_lat REAL,
            current_lon REAL,
            status TEXT,
            vehicle_status TEXT,
            travel_duration TEXT,
            delay_hours REAL,
            progress_pct INTEGER,
            sensors TEXT,
            humidity REAL,
            door_openings INTEGER,
            alerts TEXT,
            expected_delivery TEXT
        )
    """)
    conn.commit()
    conn.close()

def row_to_dict(row):
    if not row:
        return None
    d = dict(row)
    try:
        d["sensors"] = json.loads(d["sensors"]) if d["sensors"] else []
    except Exception:
        d["sensors"] = []
    try:
        d["alerts"] = json.loads(d["alerts"]) if d["alerts"] else []
    except Exception:
        d["alerts"] = []
    return d

def get_all_shipments():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM shipments")
    rows = cursor.fetchall()
    conn.close()
    return [row_to_dict(r) for r in rows]

def get_shipment_by_id(shipment_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM shipments WHERE shipment_id = ?", (shipment_id,))
    row = cursor.fetchone()
    conn.close()
    return row_to_dict(row)

def insert_shipment(s):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT OR REPLACE INTO shipments (
            shipment_id, product_category, product, storage_type, vehicle_number, driver_name,
            origin_name, dest_name, origin_lat, origin_lon, dest_lat, dest_lon,
            current_lat, current_lon, status, vehicle_status, travel_duration,
            delay_hours, progress_pct, sensors, humidity, door_openings, alerts, expected_delivery
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        s["shipment_id"], s.get("product_category", ""), s.get("product", ""), s.get("storage_type", ""),
        s.get("vehicle_number", ""), s.get("driver_name", ""), s.get("origin_name", ""), s.get("dest_name", ""),
        float(s.get("origin_lat", 0.0)), float(s.get("origin_lon", 0.0)), float(s.get("dest_lat", 0.0)), float(s.get("dest_lon", 0.0)),
        float(s.get("current_lat", 0.0)), float(s.get("current_lon", 0.0)), s.get("status", "Active"), s.get("vehicle_status", ""),
        s.get("travel_duration", ""), float(s.get("delay_hours", 0.0)), int(s.get("progress_pct", 0)),
        json.dumps(s.get("sensors", [])), float(s.get("humidity", 75.0)), int(s.get("door_openings", 0)),
        json.dumps(s.get("alerts", [])), s.get("expected_delivery", "")
    ))
    conn.commit()
    conn.close()

def update_shipment(shipment_id, updates):
    conn = get_connection()
    cursor = conn.cursor()
    
    fields = []
    values = []
    for k, v in updates.items():
        fields.append(f"{k} = ?")
        if k in ("sensors", "alerts"):
            values.append(json.dumps(v))
        else:
            values.append(v)
            
    values.append(shipment_id)
    query = f"UPDATE shipments SET {', '.join(fields)} WHERE shipment_id = ?"
    cursor.execute(query, values)
    conn.commit()
    conn.close()

def clear_all_shipments():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM shipments")
    conn.commit()
    conn.close()
