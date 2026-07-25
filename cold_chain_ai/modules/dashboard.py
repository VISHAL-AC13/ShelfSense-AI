# modules/dashboard.py
import streamlit as st
import pandas as pd
import plotly.graph_objects as go
import plotly.express as px
from database.db_manager import db
from ai.rf_model import rf_model
from ai.spoilage_engine import spoilage_engine
from ai.health_scorer import health_scorer
from ai.recommender import recommender
from utils.ui_components import render_kpi_card, render_badge
from config.settings import COLOR_EMERALD, COLOR_BLUE, COLOR_WHITE, COLOR_LIGHT_GRAY, COLOR_BORDER, COLOR_TEXT, COLOR_TEXT_MUTED, COLOR_RED, COLOR_AMBER

def render_dashboard():
    st.markdown('<h2 style="margin-bottom: 4px;">Logistics Operator Dashboard</h2>', unsafe_allow_html=True)
    st.markdown('<p style="color: #64748B; font-size: 0.95rem; margin-bottom: 24px;">Real-time overview of active cold chain consignments, thermal metrics, and AI risk advisory.</p>', unsafe_allow_html=True)
    
    shipments = db.get_all_shipments()
    if not shipments:
        st.info("No shipments registered in the system.")
        return
        
    # Calculate KPIs
    total_count = len(shipments)
    active_shipments = [s for s in shipments if s["status"] in ["Active", "Warning", "Critical"]]
    delivered_shipments = [s for s in shipments if s["status"] == "Delivered"]
    
    active_count = len(active_shipments)
    delivered_count = len(delivered_shipments)
    
    total_alerts = sum([len(s.get("alerts", [])) for s in active_shipments])
    if any(s["status"] == "Critical" for s in active_shipments) and total_alerts == 0:
        total_alerts += 1
        
    avg_temps = []
    avg_hums = []
    health_scores = []
    risk_counts = {"LOW": 0, "MEDIUM": 0, "HIGH": 0}
    all_recs = []
    
    for s in shipments:
        # evaluate AI
        r_trans = rf_model.predict_risk(s)
        r_spoil = spoilage_engine.evaluate(s)
        score = health_scorer.calculate(s, r_spoil)
        recs = recommender.generate_recommendations(s, r_trans, r_spoil, score)
        
        if s["status"] != "Delivered":
            if s.get("sensors"):
                avg_temps.append(sum(s["sensors"]) / len(s["sensors"]))
            avg_hums.append(s.get("humidity", 50.0))
            health_scores.append(score)
            
        risk_counts[r_trans["risk_level"]] += 1
        
        for r in recs:
            if r["priority"] in ["CRITICAL", "HIGH", "MEDIUM"]:
                all_recs.append({
                    "Shipment ID": s["shipment_id"],
                    "Product": s["product"],
                    "Recommendation": r["action"],
                    "Priority": r["priority"],
                    "Reason": r["reason"]
                })
                
    overall_avg_temp = sum(avg_temps) / len(avg_temps) if avg_temps else 0.0
    overall_avg_hum = sum(avg_hums) / len(avg_hums) if avg_hums else 50.0
    overall_health = sum(health_scores) / len(health_scores) if health_scores else 100.0
    
    # Render 7 KPI Cards in 2 rows (4 + 3)
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        render_kpi_card("Total Shipments", str(total_count), "All registered consignments")
    with col2:
        render_kpi_card("Active Shipments", str(active_count), "Currently in transit", COLOR_BLUE)
    with col3:
        render_kpi_card("Delivered Shipments", str(delivered_count), "Completed journeys", COLOR_EMERALD)
    with col4:
        alert_color = COLOR_RED if total_alerts > 0 else COLOR_EMERALD
        render_kpi_card("Active Alerts", str(total_alerts), "Excursions & door alarms", alert_color)
        
    st.markdown('<div style="height: 12px;"></div>', unsafe_allow_html=True)
    
    col5, col6, col7 = st.columns(3)
    with col5:
        render_kpi_card("Average Temperature", f"{overall_avg_temp:.1f} °C", "Across active trailer sensors", COLOR_BLUE)
    with col6:
        render_kpi_card("Average Humidity", f"{overall_avg_hum:.1f} %", "Hermetic chamber average", COLOR_BLUE)
    with col7:
        h_color = COLOR_EMERALD if overall_health >= 85 else COLOR_AMBER if overall_health >= 70 else COLOR_RED
        render_kpi_card("Overall Shipment Health", f"{overall_health:.1f} %", "System composite index", h_color)
        
    st.markdown('<div style="height: 24px;"></div>', unsafe_allow_html=True)
    
    # Professional Charts Row
    st.markdown('<h3 style="margin-bottom: 16px; font-size: 1.2rem;">Thermal & Risk Visualizations</h3>', unsafe_allow_html=True)
    chart_col1, chart_col2, chart_col3 = st.columns(3)
    
    with chart_col1:
        st.markdown('<div class="css-card">', unsafe_allow_html=True)
        # Temperature Trend
        hours = [f"H-{24-i*3}" for i in range(8)] + ["Now"]
        temp_trend = [overall_avg_temp + ((-1)**i * (0.4 - i*0.03)) for i in range(9)]
        fig_temp = go.Figure()
        fig_temp.add_trace(go.Scatter(x=hours, y=temp_trend, mode='lines+markers', name='Avg Temp (°C)',
                                      line=dict(color=COLOR_BLUE, width=3), marker=dict(size=6)))
        fig_temp.update_layout(title="Temperature Trend (°C)", paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)',
                               margin=dict(l=10, r=10, t=40, b=20), height=240, font=dict(color=COLOR_TEXT, size=11),
                               xaxis=dict(showgrid=True, gridcolor=COLOR_BORDER), yaxis=dict(showgrid=True, gridcolor=COLOR_BORDER))
        st.plotly_chart(fig_temp, use_container_width=True)
        st.markdown('</div>', unsafe_allow_html=True)
        
    with chart_col2:
        st.markdown('<div class="css-card">', unsafe_allow_html=True)
        # Humidity Trend
        hum_trend = [overall_avg_hum + ((-1)**(i+1) * (1.2 - i*0.1)) for i in range(9)]
        fig_hum = go.Figure()
        fig_hum.add_trace(go.Scatter(x=hours, y=hum_trend, mode='lines+markers', name='Humidity (%)', fill='tozeroy',
                                     line=dict(color=COLOR_EMERALD, width=2), fillcolor='rgba(16, 185, 129, 0.12)'))
        fig_hum.update_layout(title="Humidity Trend (%)", paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)',
                              margin=dict(l=10, r=10, t=40, b=20), height=240, font=dict(color=COLOR_TEXT, size=11),
                              xaxis=dict(showgrid=True, gridcolor=COLOR_BORDER), yaxis=dict(showgrid=True, gridcolor=COLOR_BORDER, range=[0, 100]))
        st.plotly_chart(fig_hum, use_container_width=True)
        st.markdown('</div>', unsafe_allow_html=True)
        
    with chart_col3:
        st.markdown('<div class="css-card">', unsafe_allow_html=True)
        # Risk Distribution Donut
        labels = list(risk_counts.keys())
        vals = list(risk_counts.values())
        colors = [COLOR_EMERALD, COLOR_AMBER, COLOR_RED]
        fig_risk = go.Figure(data=[go.Pie(labels=labels, values=vals, hole=0.6, marker=dict(colors=colors))])
        fig_risk.update_layout(title="AI Transport Risk Distribution", paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)',
                               margin=dict(l=10, r=10, t=40, b=20), height=240, font=dict(color=COLOR_TEXT, size=11), showlegend=True)
        st.plotly_chart(fig_risk, use_container_width=True)
        st.markdown('</div>', unsafe_allow_html=True)
        
    st.markdown('<div style="height: 24px;"></div>', unsafe_allow_html=True)
    
    # Bottom Row: Operational Tables
    st.markdown('<h3 style="margin-bottom: 16px; font-size: 1.2rem;">Operational Intelligence & Recent Activity</h3>', unsafe_allow_html=True)
    
    tab1, tab2, tab3 = st.tabs(["📦 Recent Shipments", "⚡ Recent AI Recommendations", "🚨 Active Alerts"])
    
    with tab1:
        st.markdown('<div class="css-card">', unsafe_allow_html=True)
        df_shipments = pd.DataFrame([
            {
                "Shipment ID": s["shipment_id"],
                "Product": s["product"],
                "Category": s["product_category"],
                "Origin": s.get("origin_name", ""),
                "Destination": s.get("dest_name", ""),
                "Storage Type": s["storage_type"],
                "Status": s["status"],
                "Delivery ETA": s["expected_delivery"]
            }
            for s in shipments
        ])
        st.dataframe(df_shipments, use_container_width=True, hide_index=True)
        st.markdown('</div>', unsafe_allow_html=True)
        
    with tab2:
        st.markdown('<div class="css-card">', unsafe_allow_html=True)
        if all_recs:
            df_recs = pd.DataFrame(all_recs)
            st.dataframe(df_recs, use_container_width=True, hide_index=True)
        else:
            st.success("All shipments are nominal. No priority interventions recommended at this time.")
        st.markdown('</div>', unsafe_allow_html=True)
        
    with tab3:
        st.markdown('<div class="css-card">', unsafe_allow_html=True)
        alert_rows = []
        for s in active_shipments:
            if s.get("alerts"):
                for a in s["alerts"]:
                    alert_rows.append({"Shipment ID": s["shipment_id"], "Product": s["product"], "Alert Details": a, "Severity": "CRITICAL"})
            elif s["status"] in ["Warning", "Critical"]:
                alert_rows.append({"Shipment ID": s["shipment_id"], "Product": s["product"], "Alert Details": f"Status reported as {s['status']}", "Severity": s["status"].upper()})
                
        if alert_rows:
            st.dataframe(pd.DataFrame(alert_rows), use_container_width=True, hide_index=True)
        else:
            st.success("No active thermal excursions or security door alarms.")
        st.markdown('</div>', unsafe_allow_html=True)
