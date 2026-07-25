# utils/ui_components.py
import streamlit as st
from config.settings import (
    COLOR_EMERALD, COLOR_BLUE, COLOR_WHITE, COLOR_LIGHT_GRAY,
    COLOR_BORDER, COLOR_TEXT, COLOR_TEXT_MUTED, COLOR_RED, COLOR_AMBER
)

def inject_custom_css():
    st.markdown(f"""
    <style>
        /* Main page background */
        .stApp {{
            background-color: {COLOR_LIGHT_GRAY};
            font-family: 'Inter', 'Segoe UI', Roboto, sans-serif;
            color: {COLOR_TEXT};
        }}
        
        /* Clean Header styling */
        h1, h2, h3, h4, h5, h6 {{
            color: {COLOR_TEXT} !important;
            font-weight: 700 !important;
        }}
        
        /* Sidebar styling */
        section[data-testid="stSidebar"] {{
            background-color: {COLOR_WHITE} !important;
            border-right: 1px solid {COLOR_BORDER} !important;
        }}
        
        /* Custom card styling */
        .css-card {{
            background-color: {COLOR_WHITE};
            border-radius: 12px;
            border: 1px solid {COLOR_BORDER};
            padding: 20px 24px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -1px rgba(0, 0, 0, 0.02);
            margin-bottom: 16px;
            transition: all 0.2s ease;
        }}
        .css-card:hover {{
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.03);
            border-color: #CBD5E1;
        }}
        
        /* KPI Counter Card */
        .kpi-card {{
            background-color: {COLOR_WHITE};
            border-radius: 12px;
            border: 1px solid {COLOR_BORDER};
            padding: 18px 20px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;
        }}
        .kpi-title {{
            font-size: 0.82rem;
            font-weight: 600;
            color: {COLOR_TEXT_MUTED};
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 8px;
        }}
        .kpi-value {{
            font-size: 1.8rem;
            font-weight: 800;
            color: {COLOR_TEXT};
            margin-bottom: 4px;
        }}
        .kpi-subtitle {{
            font-size: 0.78rem;
            font-weight: 600;
            color: {COLOR_EMERALD};
        }}
        
        /* Sensor Card */
        .sensor-card-normal {{
            background-color: {COLOR_WHITE};
            border-radius: 12px;
            border: 1px solid {COLOR_BORDER};
            border-left: 5px solid {COLOR_EMERALD};
            padding: 16px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
            margin-bottom: 12px;
        }}
        .sensor-card-warning {{
            background-color: #FFFBEB;
            border-radius: 12px;
            border: 1px solid #FDE68A;
            border-left: 5px solid {COLOR_AMBER};
            padding: 16px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
            margin-bottom: 12px;
        }}
        .sensor-card-critical {{
            background-color: #FEF2F2;
            border-radius: 12px;
            border: 1px solid #FECACA;
            border-left: 5px solid {COLOR_RED};
            padding: 16px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
            margin-bottom: 12px;
        }}
        
        /* Badge styling */
        .badge {{
            display: inline-block;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.04em;
        }}
        .badge-emerald {{ background-color: #D1FAE5; color: #065F46; border: 1px solid #A7F3D0; }}
        .badge-blue {{ background-color: #DBEAFE; color: #1E40AF; border: 1px solid #BFDBFE; }}
        .badge-amber {{ background-color: #FEF3C7; color: #92400E; border: 1px solid #FDE68A; }}
        .badge-red {{ background-color: #FEE2E2; color: #991B1B; border: 1px solid #FECACA; }}
        
        /* Buttons */
        div[data-testid="stButton"] button {{
            border-radius: 8px !important;
            font-weight: 600 !important;
            transition: all 0.2s ease !important;
        }}
    </style>
    """, unsafe_allow_html=True)

def render_kpi_card(title, value, subtitle="", subtitle_color=COLOR_EMERALD):
    st.markdown(f"""
    <div class="kpi-card">
        <div class="kpi-title">{title}</div>
        <div class="kpi-value">{value}</div>
        <div class="kpi-subtitle" style="color: {subtitle_color};">{subtitle}</div>
    </div>
    """, unsafe_allow_html=True)

def render_sensor_card(label, temp_val, target_val, min_val, max_val):
    if temp_val < min_val - 1.5 or temp_val > max_val + 1.5:
        card_class = "sensor-card-critical"
        status_badge = '<span class="badge badge-red">CRITICAL EXCURSION</span>'
        val_color = COLOR_RED
    elif temp_val < min_val or temp_val > max_val:
        card_class = "sensor-card-warning"
        status_badge = '<span class="badge badge-amber">ABNORMAL WARNING</span>'
        val_color = COLOR_AMBER
    else:
        card_class = "sensor-card-normal"
        status_badge = '<span class="badge badge-emerald">NOMINAL</span>'
        val_color = COLOR_EMERALD
        
    diff = temp_val - target_val
    diff_str = f"+{diff:.1f}°C" if diff > 0 else f"{diff:.1f}°C"
    
    st.markdown(f"""
    <div class="{card_class}">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <strong style="font-size: 0.9rem; color: {COLOR_TEXT};">{label}</strong>
            {status_badge}
        </div>
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <span style="font-size: 1.6rem; font-weight: 800; color: {val_color};">{temp_val:.1f}°C</span>
            <span style="font-size: 0.8rem; color: {COLOR_TEXT_MUTED};">Target: {target_val:.1f}°C ({diff_str})</span>
        </div>
    </div>
    """, unsafe_allow_html=True)

def render_badge(text, variant="emerald"):
    return f'<span class="badge badge-{variant}">{text}</span>'
