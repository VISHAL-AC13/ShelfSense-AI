# modules/ai_analysis.py
import streamlit as st
import plotly.graph_objects as go
from database.db_manager import db
from ai.rf_model import rf_model
from ai.spoilage_engine import spoilage_engine
from ai.health_scorer import health_scorer
from ai.recommender import recommender
from config.settings import COLOR_EMERALD, COLOR_BLUE, COLOR_WHITE, COLOR_RED, COLOR_AMBER, COLOR_BORDER, COLOR_TEXT, COLOR_TEXT_MUTED
from utils.ui_components import render_badge

def render_ai_analysis():
    st.markdown('<h2 style="margin-bottom: 4px;">AI Analysis & Risk Prediction Core</h2>', unsafe_allow_html=True)
    st.markdown('<p style="color: #64748B; font-size: 0.95rem; margin-bottom: 24px;">Advanced machine learning transport risk classification, rule-based biological spoilage inference, composite health scoring, and prescriptive operational recommendations.</p>', unsafe_allow_html=True)
    
    shipments = db.get_all_shipments()
    if not shipments:
        st.info("No consignments available for AI evaluation.")
        return
        
    shipment_ids = [f"{s['shipment_id']} // {s['product']} ({s['storage_type']})" for s in shipments]
    selected_idx = st.selectbox("Select Consignment for Deep AI Analysis", range(len(shipment_ids)), format_func=lambda i: shipment_ids[i])
    s = shipments[selected_idx]
    
    # Run AI evaluations
    r_trans = rf_model.predict_risk(s)
    r_spoil = spoilage_engine.evaluate(s)
    score = health_scorer.calculate(s, r_spoil)
    recs = recommender.generate_recommendations(s, r_trans, r_spoil, score)
    
    # Top Row: 3 Main AI Intelligence Cards
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.markdown('<div class="css-card" style="height: 100%; display: flex; flex-direction: column; justify-content: space-between;">', unsafe_allow_html=True)
        st.markdown('<div style="font-size: 0.8rem; font-weight: 700; color: #64748B; text-transform: uppercase;">1. Transport Risk (ML Model)</div>', unsafe_allow_html=True)
        st.markdown('<div style="font-size: 0.75rem; color: #3B82F6; font-weight: 600; margin-bottom: 8px;">Trained Random Forest Classifier</div>', unsafe_allow_html=True)
        
        t_level = r_trans["risk_level"]
        t_badge = "red" if t_level == "HIGH" else "amber" if t_level == "MEDIUM" else "emerald"
        t_color = COLOR_RED if t_level == "HIGH" else COLOR_AMBER if t_level == "MEDIUM" else COLOR_EMERALD
        
        st.markdown(f"""
        <div style="margin: 12px 0;">
            <span style="font-size: 2.2rem; font-weight: 800; color: {t_color};">{t_level}</span>
            <div style="font-size: 0.85rem; color: {COLOR_TEXT_MUTED}; margin-top: 4px;">Prediction Confidence: <strong>{r_trans['confidence']}%</strong></div>
        </div>
        """, unsafe_allow_html=True)
        
        probs = r_trans["probabilities"]
        st.markdown(f"""
        <div style="font-size: 0.75rem; color: #475569; background: #F8FAFC; padding: 8px 10px; border-radius: 6px; border: 1px solid #E2E8F0;">
            <strong>Class Probabilities:</strong><br>
            LOW: {probs['LOW']}% | MEDIUM: {probs['MEDIUM']}% | HIGH: {probs['HIGH']}%
        </div>
        """, unsafe_allow_html=True)
        st.markdown('</div>', unsafe_allow_html=True)
        
    with col2:
        st.markdown('<div class="css-card" style="height: 100%; display: flex; flex-direction: column; justify-content: space-between;">', unsafe_allow_html=True)
        st.markdown('<div style="font-size: 0.8rem; font-weight: 700; color: #64748B; text-transform: uppercase;">2. Spoilage Risk (Rule Engine)</div>', unsafe_allow_html=True)
        st.markdown('<div style="font-size: 0.75rem; color: #10B981; font-weight: 600; margin-bottom: 8px;">Multi-Parameter Thermal & Access Inference</div>', unsafe_allow_html=True)
        
        s_level = r_spoil["spoilage_risk"]
        s_color = COLOR_RED if s_level == "HIGH" else COLOR_AMBER if s_level == "MEDIUM" else COLOR_EMERALD
        
        st.markdown(f"""
        <div style="margin: 12px 0;">
            <span style="font-size: 2.2rem; font-weight: 800; color: {s_color};">{s_level}</span>
            <div style="font-size: 0.85rem; color: {COLOR_TEXT_MUTED}; margin-top: 4px;">Rule Severity Score: <strong>{r_spoil['risk_score']} / 10</strong></div>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown(f"""
        <div style="font-size: 0.75rem; color: #475569; background: #F8FAFC; padding: 8px 10px; border-radius: 6px; border: 1px solid #E2E8F0;">
            <strong>Evaluation Profile:</strong><br>
            {s['storage_type']} tolerance verification
        </div>
        """, unsafe_allow_html=True)
        st.markdown('</div>', unsafe_allow_html=True)
        
    with col3:
        st.markdown('<div class="css-card" style="height: 100%; padding: 12px 20px;">', unsafe_allow_html=True)
        st.markdown('<div style="font-size: 0.8rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 4px;">3. Shipment Health Score</div>', unsafe_allow_html=True)
        
        # Circular Gauge Plotly
        gauge_color = COLOR_EMERALD if score >= 85 else COLOR_AMBER if score >= 70 else COLOR_RED
        fig_gauge = go.Figure(go.Indicator(
            mode = "gauge+number",
            value = score,
            domain = {'x': [0, 1], 'y': [0, 1]},
            number = {'suffix': "%", 'font': {'size': 26, 'color': COLOR_TEXT, 'weight': 800}},
            gauge = {
                'axis': {'range': [0, 100], 'tickwidth': 1, 'tickcolor': COLOR_BORDER},
                'bar': {'color': gauge_color, 'thickness': 0.3},
                'bgcolor': "white",
                'borderwidth': 1,
                'bordercolor': COLOR_BORDER,
                'steps': [
                    {'range': [0, 69.9], 'color': '#FEE2E2'},
                    {'range': [70, 84.9], 'color': '#FEF3C7'},
                    {'range': [85, 100], 'color': '#D1FAE5'}
                ]
            }
        ))
        fig_gauge.update_layout(paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)', margin=dict(l=20, r=20, t=10, b=10), height=170)
        st.plotly_chart(fig_gauge, use_container_width=True)
        st.markdown('</div>', unsafe_allow_html=True)
        
    st.markdown('<div style="height: 20px;"></div>', unsafe_allow_html=True)
    
    # Detailed Reasoning Section (Explain WHY)
    st.markdown('<h3 style="margin-bottom: 12px; font-size: 1.15rem;">Explainability Engine: Why Was This Risk Calculated?</h3>', unsafe_allow_html=True)
    st.markdown('<div class="css-card" style="background-color: #FFFFFF; border-left: 5px solid #3B82F6;">', unsafe_allow_html=True)
    st.markdown('<div style="font-size: 0.9rem; font-weight: 700; color: #0F172A; margin-bottom: 10px;">🔍 Biological Spoilage & Thermal Deviation Reasoning:</div>', unsafe_allow_html=True)
    
    for idx, reason in enumerate(r_spoil["reasons"]):
        icon = "⚠️" if "exceed" in reason.lower() or "violation" in reason.lower() or "severe" in reason.lower() else "ℹ️" if "moderate" in reason.lower() else "✅"
        st.markdown(f"<div style='font-size: 0.88rem; color: #334155; margin-bottom: 6px; line-height: 1.4;'>{icon} <strong>Reason #{idx+1}:</strong> {reason}</div>", unsafe_allow_html=True)
        
    st.markdown('</div>', unsafe_allow_html=True)
    
    st.markdown('<div style="height: 20px;"></div>', unsafe_allow_html=True)
    
    # Actionable Recommendations Section
    st.markdown('<h3 style="margin-bottom: 12px; font-size: 1.15rem;">Actionable Strategic Recommendations</h3>', unsafe_allow_html=True)
    st.markdown('<p style="font-size: 0.88rem; color: #64748B; margin-bottom: 16px;">Prescriptive operational instructions generated by evaluating AI Transport Risk, Spoilage severity, and sensor array telemetry.</p>', unsafe_allow_html=True)
    
    for rec in recs:
        priority = rec["priority"]
        p_color = COLOR_RED if priority == "CRITICAL" else COLOR_AMBER if priority in ["HIGH", "MEDIUM"] else COLOR_EMERALD
        bg_col = "#FEF2F2" if priority == "CRITICAL" else "#FFFBEB" if priority in ["HIGH", "MEDIUM"] else "#F0FDF4"
        border_col = "#FECACA" if priority == "CRITICAL" else "#FDE68A" if priority in ["HIGH", "MEDIUM"] else "#BBF7D0"
        
        st.markdown(f"""
        <div style="background-color: {bg_col}; border: 1px solid {border_col}; border-left: 6px solid {p_color}; padding: 18px 22px; border-radius: 12px; margin-bottom: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 1.1rem; font-weight: 800; color: {COLOR_TEXT};">🚀 Action: {rec['action']}</span>
                <span style="background: {p_color}; color: white; font-size: 0.75rem; font-weight: 700; padding: 3px 10px; border-radius: 12px; text-transform: uppercase;">Priority: {priority}</span>
            </div>
            <div style="font-size: 0.9rem; color: #334155; background: rgba(255,255,255,0.7); padding: 10px 14px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.05); margin-top: 8px;">
                <strong style="color: {p_color};">💡 Reason for Recommendation:</strong><br>
                {rec['reason']}
            </div>
        </div>
        """, unsafe_allow_html=True)
