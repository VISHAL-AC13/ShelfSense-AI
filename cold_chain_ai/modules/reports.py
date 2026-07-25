# modules/reports.py
import streamlit as st
import pandas as pd
from database.db_manager import db
from ai.rf_model import rf_model
from ai.spoilage_engine import spoilage_engine
from ai.health_scorer import health_scorer
from ai.recommender import recommender
from utils.pdf_generator import generate_shipment_pdf
from config.settings import COLOR_EMERALD, COLOR_BLUE, COLOR_WHITE, COLOR_RED, COLOR_AMBER, COLOR_BORDER, COLOR_TEXT, COLOR_TEXT_MUTED
from utils.ui_components import render_kpi_card, render_badge

def render_reports():
    st.markdown('<h2 style="margin-bottom: 4px;">Regulatory Audit & Compliance Reports</h2>', unsafe_allow_html=True)
    st.markdown('<p style="color: #64748B; font-size: 0.95rem; margin-bottom: 24px;">Generate, inspect, and export certified PDF audit documentation for FDA/EMA compliance, customs clearance, and insurance verification.</p>', unsafe_allow_html=True)
    
    shipments = db.get_all_shipments()
    if not shipments:
        st.info("No shipments available for reporting.")
        return
        
    shipment_ids = [f"{s['shipment_id']} // {s['product']} ({s['status']})" for s in shipments]
    selected_idx = st.selectbox("Select Consignment for Official Audit Report Generation", range(len(shipment_ids)), format_func=lambda i: shipment_ids[i])
    s = shipments[selected_idx]
    
    # Run AI evaluations
    r_trans = rf_model.predict_risk(s)
    r_spoil = spoilage_engine.evaluate(s)
    score = health_scorer.calculate(s, r_spoil)
    recs = recommender.generate_recommendations(s, r_trans, r_spoil, score)
    
    # Generate PDF in memory
    pdf_bytes = generate_shipment_pdf(s, r_trans, r_spoil, score, recs)
    
    # Download Button Banner
    st.markdown('<div class="css-card" style="background-color: #EFF6FF; border: 1px solid #BFDBFE; display: flex; justify-content: space-between; align-items: center;">', unsafe_allow_html=True)
    col_d1, col_d2 = st.columns([3, 1])
    with col_d1:
        st.markdown(f"""
        <div style="color: #1E40AF;">
            <strong style="font-size: 1.1rem;">📄 Official Executive PDF Report Ready for Export</strong><br>
            <span style="font-size: 0.85rem;">Includes digital verification checksum, 9-zone thermal telemetry array, ML risk metrics, and recommended action plan.</span>
        </div>
        """, unsafe_allow_html=True)
    with col_d2:
        file_name = f"ColdChain_Audit_Report_{s['shipment_id']}.pdf"
        st.download_button(
            label="⬇️ Download PDF Report",
            data=pdf_bytes,
            file_name=file_name,
            mime="application/pdf",
            type="primary",
            use_container_width=True
        )
    st.markdown('</div>', unsafe_allow_html=True)
    
    st.markdown('<div style="height: 16px;"></div>', unsafe_allow_html=True)
    
    # On-Screen Report Preview
    st.markdown('<h3 style="margin-bottom: 16px; font-size: 1.15rem;">Interactive Report Preview</h3>', unsafe_allow_html=True)
    
    with st.expander("🔍 Section 1: Consignment Logistics Manifest", expanded=True):
        c1, c2, c3 = st.columns(3)
        with c1:
            st.markdown(f"**Shipment ID:** {s['shipment_id']}<br>**Category:** {s['product_category']}<br>**Product:** {s['product']}", unsafe_allow_html=True)
        with c2:
            st.markdown(f"**Origin:** {s.get('origin_name','')}<br>**Destination:** {s.get('dest_name','')}<br>**Vehicle:** {s.get('vehicle_number','')}", unsafe_allow_html=True)
        with c3:
            st.markdown(f"**Driver:** {s.get('driver_name','')}<br>**Storage Profile:** {s['storage_type']}<br>**ETA:** {s.get('expected_delivery','')}", unsafe_allow_html=True)
            
    with st.expander("🔍 Section 2: 9-Zone Thermal & Environmental Array", expanded=True):
        sensors = s.get("sensors", [0.0]*9)
        avg_s = sum(sensors)/len(sensors) if sensors else 0.0
        min_s = min(sensors) if sensors else 0.0
        max_s = max(sensors) if sensors else 0.0
        hum = s.get("humidity", 50.0)
        doors = s.get("door_openings", 0)
        
        sc1, sc2, sc3, sc4 = st.columns(4)
        with sc1:
            render_kpi_card("Avg Sensor Temp", f"{avg_s:.1f} °C", "9-zone mean", COLOR_BLUE)
        with sc2:
            render_kpi_card("Thermal Envelope", f"{min_s:.1f} to {max_s:.1f} °C", "Min / Max peak", COLOR_TEXT)
        with sc3:
            render_kpi_card("Relative Humidity", f"{hum:.1f} %", "Hermetic chamber", COLOR_EMERALD if 30<=hum<=70 else COLOR_AMBER)
        with sc4:
            render_kpi_card("Security Access", f"{doors} Openings", "Door sensor events", COLOR_EMERALD if doors<=3 else COLOR_RED)
            
    with st.expander("🔍 Section 3 & 4: AI Risk Audit & Reasoning", expanded=True):
        ac1, ac2, ac3 = st.columns(3)
        with ac1:
            render_kpi_card("Transport Risk (ML)", r_trans["risk_level"], f"{r_trans['confidence']}% Confidence", COLOR_RED if r_trans["risk_level"]=="HIGH" else COLOR_AMBER if r_trans["risk_level"]=="MEDIUM" else COLOR_EMERALD)
        with ac2:
            render_kpi_card("Spoilage Risk (Rules)", r_spoil["spoilage_risk"], f"Severity: {r_spoil['risk_score']} / 10", COLOR_RED if r_spoil["spoilage_risk"]=="HIGH" else COLOR_AMBER if r_spoil["spoilage_risk"]=="MEDIUM" else COLOR_EMERALD)
        with ac3:
            render_kpi_card("Shipment Health Index", f"{score} / 100 %", "System composite score", COLOR_EMERALD if score>=85 else COLOR_AMBER if score>=70 else COLOR_RED)
            
        st.markdown('<div style="height: 12px;"></div>', unsafe_allow_html=True)
        st.markdown("**Detailed Spoilage Reasoning Evaluation:**")
        for idx, r_text in enumerate(r_spoil["reasons"]):
            st.markdown(f"- <strong>Reason #{idx+1}:</strong> {r_text}", unsafe_allow_html=True)
            
    with st.expander("🔍 Section 5: Prescriptive Operational Action Plan", expanded=True):
        if recs:
            for rec in recs:
                st.markdown(f"**[{rec['priority']}] Action: {rec['action']}** — *{rec['reason']}*")
        else:
            st.success("All parameters nominal. Continue transport.")
