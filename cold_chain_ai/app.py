# app.py
import streamlit as st
from config.settings import APP_TITLE, APP_SUBTITLE, COLOR_EMERALD, COLOR_BLUE, COLOR_WHITE, COLOR_LIGHT_GRAY, COLOR_BORDER, COLOR_TEXT
from utils.ui_components import inject_custom_css
from database.db_manager import db
from modules.dashboard import render_dashboard
from modules.register_shipment import render_register_shipment
from modules.live_monitoring import render_live_monitoring
from modules.ai_analysis import render_ai_analysis
from modules.gps_tracking import render_gps_tracking
from modules.reports import render_reports

# 1. Page Configuration
st.set_page_config(
    page_title="AI Cold Chain Decision Support",
    page_icon="❄️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# 2. Inject Custom Light Theme CSS
inject_custom_css()

# 3. Sidebar Navigation & Branding
with st.sidebar:
    st.markdown(f"""
    <div style="padding: 10px 0 20px 0; border-bottom: 1px solid {COLOR_BORDER}; margin-bottom: 20px;">
        <div style="font-size: 1.25rem; font-weight: 800; color: {COLOR_BLUE}; letter-spacing: -0.02em;">AETHER COLD CHAIN</div>
        <div style="font-size: 0.78rem; font-weight: 600; color: #64748B;">AI Decision Support System</div>
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown('<div style="font-size: 0.75rem; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">Logistics Modules</div>', unsafe_allow_html=True)
    
    nav_selection = st.radio(
        "Navigation",
        [
            "📊 1. Dashboard",
            "📝 2. Register Shipment",
            "📡 3. Live Monitoring",
            "🧠 4. AI Analysis",
            "🛰️ 5. GPS Tracking",
            "📑 6. Reports & Audit"
        ],
        label_visibility="collapsed"
    )
    
    st.markdown('<div style="height: 30px;"></div>', unsafe_allow_html=True)
    st.markdown(f'<div style="border-top: 1px solid {COLOR_BORDER}; padding-top: 16px;"></div>', unsafe_allow_html=True)
    
    # System Status Indicator
    db_status_badge = '<span style="color: #065F46; font-weight: 700;">🟢 MongoDB Active</span>' if db.use_mongo else '<span style="color: #1E40AF; font-weight: 700;">🔵 Local Storage Active</span>'
    st.markdown(f"""
    <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; padding: 12px; border-radius: 8px; font-size: 0.8rem; color: #475569;">
        <div style="margin-bottom: 4px;"><strong>Storage Core:</strong> {db_status_badge}</div>
        <div style="margin-bottom: 4px;"><strong>ML Engine:</strong> scikit-learn RF v1.3</div>
        <div style="font-size: 0.72rem; color: #94A3B8;">AETHER AI Core Build v2.4</div>
    </div>
    """, unsafe_allow_html=True)

# 4. Main Title Banner
st.markdown(f"""
<div style="background-color: {COLOR_WHITE}; border: 1px solid {COLOR_BORDER}; padding: 20px 28px; border-radius: 12px; margin-bottom: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); display: flex; justify-content: space-between; align-items: center;">
    <div>
        <h1 style="font-size: 1.65rem; margin: 0; padding: 0; color: {COLOR_TEXT};">{APP_TITLE}</h1>
        <div style="color: #64748B; font-size: 0.92rem; font-weight: 500; margin-top: 4px;">{APP_SUBTITLE}</div>
    </div>
    <div style="background-color: #ECFDF5; border: 1px solid #A7F3D0; color: #065F46; padding: 8px 16px; border-radius: 20px; font-size: 0.82rem; font-weight: 700;">
        ⚡ AI ADVISORY ONLINE
    </div>
</div>
""", unsafe_allow_html=True)

# 5. Route to Selected Module
if nav_selection == "📊 1. Dashboard":
    render_dashboard()
elif nav_selection == "📝 2. Register Shipment":
    render_register_shipment()
elif nav_selection == "📡 3. Live Monitoring":
    render_live_monitoring()
elif nav_selection == "🧠 4. AI Analysis":
    render_ai_analysis()
elif nav_selection == "🛰️ 5. GPS Tracking":
    render_gps_tracking()
elif nav_selection == "📑 6. Reports & Audit":
    render_reports()
