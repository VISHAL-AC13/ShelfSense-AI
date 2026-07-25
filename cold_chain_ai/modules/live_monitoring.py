# modules/live_monitoring.py
import streamlit as st
from database.db_manager import db
from config.settings import STORAGE_PROFILES, COLOR_EMERALD, COLOR_BLUE, COLOR_WHITE, COLOR_RED, COLOR_AMBER, COLOR_BORDER, COLOR_TEXT
from utils.ui_components import render_kpi_card, render_sensor_card, render_badge

def render_live_monitoring():
    st.markdown('<h2 style="margin-bottom: 4px;">Live Telemetry & Condition Monitoring</h2>', unsafe_allow_html=True)
    st.markdown('<p style="color: #64748B; font-size: 0.95rem; margin-bottom: 24px;">Real-time thermal tracking across 9 multi-zone internal trailer sensors, atmospheric humidity, and door security access.</p>', unsafe_allow_html=True)
    
    shipments = db.get_all_shipments()
    if not shipments:
        st.info("No shipments available for monitoring.")
        return
        
    shipment_ids = [f"{s['shipment_id']} // {s['product']} ({s['storage_type']})" for s in shipments]
    selected_idx = st.selectbox("Select Active Consignment Manifest", range(len(shipment_ids)), format_func=lambda i: shipment_ids[i])
    s = shipments[selected_idx]
    
    profile = STORAGE_PROFILES.get(s["storage_type"], STORAGE_PROFILES["Chilled +2°C to +8°C"])
    target_t = profile["target_temp"]
    min_t = profile["min_temp"]
    max_t = profile["max_temp"]
    max_doors = profile["max_door_openings"]
    
    # Status Banner
    st.markdown('<div class="css-card" style="background-color: #F8FAFC; border: 1px solid #CBD5E1;">', unsafe_allow_html=True)
    b_col1, b_col2, b_col3, b_col4 = st.columns(4)
    with b_col1:
        st.markdown(f"**Vehicle Status:**<br><span style='color: {COLOR_BLUE}; font-weight: 700;'>{s.get('vehicle_status', 'In Transit')}</span>", unsafe_allow_html=True)
    with b_col2:
        stat_color = COLOR_RED if s["status"] == "Critical" else COLOR_AMBER if s["status"] == "Warning" else COLOR_EMERALD
        st.markdown(f"**Consignment Status:**<br><span style='color: {stat_color}; font-weight: 800;'>{s['status']}</span>", unsafe_allow_html=True)
    with b_col3:
        st.markdown(f"**Travel Duration:**<br><span style='color: {COLOR_TEXT}; font-weight: 700;'>{s.get('travel_duration', '3 hours')}</span>", unsafe_allow_html=True)
    with b_col4:
        st.markdown(f"**Storage Profile:**<br><span style='color: {COLOR_TEXT}; font-weight: 700;'>{s['storage_type']}</span> <span style='font-size:0.75rem; color:#64748B;'>({min_t}°C to {max_t}°C)</span>", unsafe_allow_html=True)
    st.markdown('</div>', unsafe_allow_html=True)
    
    st.markdown('<div style="height: 16px;"></div>', unsafe_allow_html=True)
    
    # 9 Temperature Sensors Grid (3x3 Layout)
    st.markdown('<h3 style="margin-bottom: 16px; font-size: 1.15rem;">9-Zone Trailer Thermal Array (°C)</h3>', unsafe_allow_html=True)
    
    sensors = s.get("sensors", [target_t] * 9)
    while len(sensors) < 9:
        sensors.append(target_t)
        
    sensor_labels = [
        "Sensor 1 (Front Top)", "Sensor 2 (Front Mid)", "Sensor 3 (Front Bottom)",
        "Sensor 4 (Mid Top)", "Sensor 5 (Core Center)", "Sensor 6 (Mid Bottom)",
        "Sensor 7 (Rear Top)", "Sensor 8 (Rear Mid)", "Sensor 9 (Rear Bottom near doors)"
    ]
    
    # Row 1: Front
    r1_c1, r1_c2, r1_c3 = st.columns(3)
    with r1_c1:
        render_sensor_card(sensor_labels[0], sensors[0], target_t, min_t, max_t)
    with r1_c2:
        render_sensor_card(sensor_labels[1], sensors[1], target_t, min_t, max_t)
    with r1_c3:
        render_sensor_card(sensor_labels[2], sensors[2], target_t, min_t, max_t)
        
    # Row 2: Mid
    r2_c1, r2_c2, r2_c3 = st.columns(3)
    with r2_c1:
        render_sensor_card(sensor_labels[3], sensors[3], target_t, min_t, max_t)
    with r2_c2:
        render_sensor_card(sensor_labels[4], sensors[4], target_t, min_t, max_t)
    with r2_c3:
        render_sensor_card(sensor_labels[5], sensors[5], target_t, min_t, max_t)
        
    # Row 3: Rear
    r3_c1, r3_c2, r3_c3 = st.columns(3)
    with r3_c1:
        render_sensor_card(sensor_labels[6], sensors[6], target_t, min_t, max_t)
    with r3_c2:
        render_sensor_card(sensor_labels[7], sensors[7], target_t, min_t, max_t)
    with r3_c3:
        render_sensor_card(sensor_labels[8], sensors[8], target_t, min_t, max_t)
        
    st.markdown('<div style="height: 16px;"></div>', unsafe_allow_html=True)
    
    # Environmental & Security Access
    st.markdown('<h3 style="margin-bottom: 16px; font-size: 1.15rem;">Atmospheric Humidity & Security Door Access</h3>', unsafe_allow_html=True)
    env_c1, env_c2 = st.columns(2)
    
    with env_c1:
        hum = s.get("humidity", 50.0)
        hum_subtitle = "Nominal atmospheric stability" if 30 <= hum <= 70 else "High condensation risk!" if hum > 70 else "Dry compressor risk!"
        hum_color = COLOR_EMERALD if 30 <= hum <= 70 else COLOR_AMBER
        render_kpi_card("Chamber Relative Humidity", f"{hum:.1f} %", hum_subtitle, hum_color)
        
    with env_c2:
        doors = s.get("door_openings", 0)
        door_subtitle = f"Within profile protocol (Limit: {max_doors})" if doors <= max_doors else f"VIOLATION: Exceeds profile limit ({max_doors})!"
        door_color = COLOR_EMERALD if doors <= max_doors else COLOR_RED
        render_kpi_card("Door Opening Count", f"{doors} Events", door_subtitle, door_color)
        
    st.markdown('<div style="height: 24px;"></div>', unsafe_allow_html=True)
    
    # Real-time Telemetry Simulator for Demo
    with st.expander("🎛️ Real-Time Telemetry Excursion Simulator (Interactive Demo Control)"):
        st.markdown("<p style='font-size: 0.85rem; color: #64748B;'>Adjust sliders below to simulate live IoT thermal drift or unauthorized door openings. Clicking Update will immediately recalculate AI risk models across the entire platform.</p>", unsafe_allow_html=True)
        
        sim_col1, sim_col2, sim_col3 = st.columns(3)
        with sim_col1:
            new_s9 = st.slider("Simulate Sensor 9 (Rear Bottom) Temp (°C)", min_value=float(target_t - 15.0), max_value=float(target_t + 20.0), value=float(sensors[8]), step=0.5)
        with sim_col2:
            new_hum = st.slider("Simulate Chamber Humidity (%)", min_value=10.0, max_value=95.0, value=float(s.get("humidity", 50.0)), step=1.0)
        with sim_col3:
            new_doors = st.number_input("Simulate Door Opening Count", min_value=0, max_value=20, value=int(s.get("door_openings", 0)), step=1)
            
        if st.button("⚡ Apply Live IoT Telemetry Update", type="primary"):
            new_sensors_list = list(sensors)
            new_sensors_list[8] = new_s9
            
            # Determine new status
            if new_s9 > max_t + 2.0 or new_doors > max_doors + 2:
                new_stat = "Critical"
                alerts = [f"CRITICAL EXCURSION: Sensor 9 reported {new_s9}°C (Limit {max_t}°C)"]
            elif new_s9 > max_t or new_doors > max_doors:
                new_stat = "Warning"
                alerts = [f"Abnormal telemetry warning on Sensor 9 ({new_s9}°C)"]
            else:
                new_stat = "Active"
                alerts = []
                
            db.update_shipment_telemetry(s["shipment_id"], new_sensors_list, new_hum, new_doors, new_stat, alerts)
            st.success(f"Telemetry updated for {s['shipment_id']}! AI Risk models recalculated.")
            st.rerun()
