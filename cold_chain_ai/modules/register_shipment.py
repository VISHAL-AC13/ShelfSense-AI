# modules/register_shipment.py
import streamlit as st
import random
from datetime import datetime, timedelta
from database.db_manager import db
from config.settings import STORAGE_PROFILES, COLOR_EMERALD, COLOR_BLUE, COLOR_BORDER

def render_register_shipment():
    st.markdown('<h2 style="margin-bottom: 4px;">Register New Cold Chain Consignment</h2>', unsafe_allow_html=True)
    st.markdown('<p style="color: #64748B; font-size: 0.95rem; margin-bottom: 24px;">Enter logistics manifest parameters, storage profile tolerances, and transport assignment to initiate real-time telemetry monitoring.</p>', unsafe_allow_html=True)
    
    st.markdown('<div class="css-card">', unsafe_allow_html=True)
    
    with st.form("register_shipment_form", clear_on_submit=True):
        st.markdown('<h4 style="color: #0F172A; margin-bottom: 16px;">Consignment Specifications</h4>', unsafe_allow_html=True)
        col1, col2 = st.columns(2)
        
        with col1:
            default_id = f"SHP-{random.randint(6000, 9999)}"
            shipment_id = st.text_input("Shipment ID *", value=default_id, help="Unique logistics manifest identifier")
            category = st.selectbox("Product Category *", ["Pharmaceuticals", "Seafood", "Dairy", "Meat & Poultry", "Fresh Produce"])
            product = st.text_input("Product Name *", placeholder="e.g. Pfizer mRNA Bio-Vials, Atlantic Salmon Fillets")
            storage_type = st.selectbox("Storage Type / Thermal Profile *", list(STORAGE_PROFILES.keys()))
            
        with col2:
            vehicle_num = st.text_input("Vehicle Number *", placeholder="e.g. CRY-8821-EX, TRK-9902-DE")
            driver = st.text_input("Driver Name *", placeholder="e.g. Marcus Vance, Elena Rostova")
            expected_delivery = st.text_input("Expected Delivery Date & Time *", value=(datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d 14:00"))
            
        st.markdown('<hr style="border: none; border-top: 1px solid #E2E8F0; margin: 20px 0;">', unsafe_allow_html=True)
        st.markdown('<h4 style="color: #0F172A; margin-bottom: 16px;">Route & GPS Coordinates</h4>', unsafe_allow_html=True)
        
        col3, col4 = st.columns(2)
        with col3:
            origin_name = st.text_input("Origin Facility / City *", placeholder="e.g. Basel Pharma Hub, CH")
            origin_lat = st.number_input("Origin Latitude *", value=47.5596, format="%.4f")
            origin_lon = st.number_input("Origin Longitude *", value=7.5886, format="%.4f")
            
        with col4:
            dest_name = st.text_input("Destination Facility / City *", placeholder="e.g. Frankfurt Airport Depot, DE")
            dest_lat = st.number_input("Destination Latitude *", value=50.1109, format="%.4f")
            dest_lon = st.number_input("Destination Longitude *", value=8.6821, format="%.4f")
            
        st.markdown('<div style="height: 12px;"></div>', unsafe_allow_html=True)
        submit_btn = st.form_submit_button("🚀 Register & Activate Telemetry", type="primary", use_container_width=True)
        
    st.markdown('</div>', unsafe_allow_html=True)
    
    if submit_btn:
        if not shipment_id or not product or not origin_name or not dest_name or not vehicle_num or not driver:
            st.error("Please fill in all required (*) fields to register the consignment.")
            return
            
        profile = STORAGE_PROFILES[storage_type]
        target_t = profile["target_temp"]
        # initialize 9 sensors with slight realistic jitter around target
        init_sensors = [round(target_t + random.uniform(-0.3, 0.3), 1) for _ in range(9)]
        
        new_shipment = {
            "shipment_id": shipment_id,
            "product_category": category,
            "product": product,
            "origin_name": origin_name,
            "origin_lat": origin_lat,
            "origin_lon": origin_lon,
            "dest_name": dest_name,
            "dest_lat": dest_lat,
            "dest_lon": dest_lon,
            "current_lat": origin_lat,
            "current_lon": origin_lon,
            "vehicle_number": vehicle_num,
            "driver_name": driver,
            "storage_type": storage_type,
            "expected_delivery": expected_delivery,
            "status": "Active",
            "vehicle_status": "In Transit - Nominal Speed",
            "travel_duration": "0 hours 15 mins",
            "delay_hours": 0.0,
            "progress_pct": 5,
            "sensors": init_sensors,
            "humidity": 48.0,
            "door_openings": 0,
            "alerts": []
        }
        
        success = db.save_shipment(new_shipment)
        if success:
            st.success(f"✅ Consignment {shipment_id} ({product}) successfully registered into MongoDB and active telemetry array initiated!")
            st.markdown(f"""
            <div style="background-color: #D1FAE5; border: 1px solid #A7F3D0; padding: 16px; border-radius: 12px; margin-top: 16px; color: #065F46;">
                <strong>Consignment Active:</strong> 9 thermal sensors initialized at ~{target_t}°C. You can monitor this manifest in Live Monitoring, AI Analysis, and GPS Tracking.
            </div>
            """, unsafe_allow_html=True)
        else:
            st.error("Failed to save consignment data to storage.")
