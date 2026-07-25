# config/settings.py
import os

# ==========================================
# STRICT COLOR PALETTE (Light Theme Only)
# ==========================================
COLOR_EMERALD = "#10B981"      # Primary success / healthy / active
COLOR_BLUE = "#2563EB"         # Secondary primary / headers / charts
COLOR_WHITE = "#FFFFFF"        # Pure white card background
COLOR_LIGHT_GRAY = "#F8FAFC"   # Page background & subtle table fills
COLOR_BORDER = "#E2E8F0"       # Clean rounded card borders
COLOR_TEXT = "#0F172A"         # High contrast dark text
COLOR_TEXT_MUTED = "#64748B"   # Subtitles and table headers
COLOR_RED = "#EF4444"          # Abnormal sensor alerts / High risk
COLOR_AMBER = "#F59E0B"        # Warnings / Medium risk

# ==========================================
# DATABASE CONFIGURATION
# ==========================================
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
MONGO_DB_NAME = "cold_chain_db"
LOCAL_JSON_FALLBACK_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "local_db.json")

# ==========================================
# COLD CHAIN STORAGE PROFILES & TOLERANCES
# ==========================================
STORAGE_PROFILES = {
    "Cryogenic -70°C": {
        "target_temp": -70.0,
        "min_temp": -75.0,
        "max_temp": -65.0,
        "max_door_openings": 1,
        "description": "Ultra-low temperature storage for specialized mRNA vaccines and biological samples."
    },
    "Deep Freeze -20°C": {
        "target_temp": -20.0,
        "min_temp": -24.0,
        "max_temp": -16.0,
        "max_door_openings": 2,
        "description": "Frozen preservation for frozen seafood, meats, and plasma consignments."
    },
    "Chilled +2°C to +8°C": {
        "target_temp": 5.0,
        "min_temp": 2.0,
        "max_temp": 8.0,
        "max_door_openings": 3,
        "description": "Standard cold chain profile for insulin, biologics, dairy, and perishables."
    },
    "Controlled Ambient +15°C to +25°C": {
        "target_temp": 20.0,
        "min_temp": 15.0,
        "max_temp": 25.0,
        "max_door_openings": 5,
        "description": "Controlled ambient storage for general pharmaceuticals and sensitive electronics."
    }
}

# ==========================================
# APP CONSTANTS
# ==========================================
APP_TITLE = "AI Powered Cold Chain Management & Decision Support System"
APP_SUBTITLE = "Logistics Operator Telemetry & Risk Advisory Platform"
