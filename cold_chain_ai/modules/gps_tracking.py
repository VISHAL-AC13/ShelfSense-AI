# modules/gps_tracking.py
import streamlit as st
import streamlit.components.v1 as components
import math
from database.db_manager import db
from config.settings import COLOR_EMERALD, COLOR_BLUE, COLOR_WHITE, COLOR_BORDER, COLOR_TEXT, COLOR_TEXT_MUTED
from utils.ui_components import render_kpi_card

def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371.0  # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 1)

def render_gps_tracking():
    st.markdown('<h2 style="margin-bottom: 4px;">Real-Time GPS Tracking & Route Telemetry</h2>', unsafe_allow_html=True)
    st.markdown('<p style="color: #64748B; font-size: 0.95rem; margin-bottom: 24px;">Interactive satellite vector map plotting consignment origin, destination terminal, current refrigerated transport coordinates, and route completion milestones.</p>', unsafe_allow_html=True)
    
    shipments = db.get_all_shipments()
    if not shipments:
        st.info("No shipments available for GPS tracking.")
        return
        
    shipment_ids = [f"{s['shipment_id']} // {s['product']} ({s.get('origin_name','')} ➔ {s.get('dest_name','')})" for s in shipments]
    selected_idx = st.selectbox("Select Active Consignment Route", range(len(shipment_ids)), format_func=lambda i: shipment_ids[i])
    s = shipments[selected_idx]
    
    orig_lat = s.get("origin_lat", 47.5596)
    orig_lon = s.get("origin_lon", 7.5886)
    dest_lat = s.get("dest_lat", 50.1109)
    dest_lon = s.get("dest_lon", 8.6821)
    curr_lat = s.get("current_lat", orig_lat)
    curr_lon = s.get("current_lon", orig_lon)
    
    rem_dist = haversine_distance(curr_lat, curr_lon, dest_lat, dest_lon)
    tot_dist = haversine_distance(orig_lat, orig_lon, dest_lat, dest_lon)
    progress_pct = s.get("progress_pct", 50)
    
    # Interactive Leaflet Map HTML
    map_html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8" />
        <title>Leaflet Map</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
            body {{ padding: 0; margin: 0; }}
            #map {{ height: 400px; width: 100%; border-radius: 12px; border: 1px solid #CBD5E1; }}
        </style>
    </head>
    <body>
        <div id="map"></div>
        <script>
            var orig = [{orig_lat}, {orig_lon}];
            var dest = [{dest_lat}, {dest_lon}];
            var curr = [{curr_lat}, {curr_lon}];
            
            var map = L.map('map').setView(curr, 6);
            
            L.tileLayer('https://{{s}}.basemaps.cartocdn.com/rastertiles/voyager/{{z}}/{{x}}/{{y}}{{r}}.png', {{
                maxZoom: 18,
                attribution: '&copy; OpenStreetMap &copy; CARTO'
            }}).addTo(map);
            
            // Custom icons
            var origIcon = L.divIcon({{
                className: 'custom-pin',
                html: '<div style="background-color: #3B82F6; color: white; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">ORIGIN</div>',
                iconSize: [60, 24],
                iconAnchor: [30, 12]
            }});
            
            var destIcon = L.divIcon({{
                className: 'custom-pin',
                html: '<div style="background-color: #10B981; color: white; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">DESTINATION</div>',
                iconSize: [80, 24],
                iconAnchor: [40, 12]
            }});
            
            var truckIcon = L.divIcon({{
                className: 'custom-pin',
                html: '<div style="background-color: #0F172A; color: #10B981; padding: 6px 10px; border-radius: 20px; font-size: 12px; font-weight: 800; border: 2px solid #10B981; box-shadow: 0 4px 8px rgba(0,0,0,0.3);">🚛 VEHICLE ({s["vehicle_number"]})</div>',
                iconSize: [130, 30],
                iconAnchor: [65, 15]
            }});
            
            L.marker(orig, {{icon: origIcon}}).addTo(map).bindPopup("<b>Origin:</b> {s.get('origin_name','')}");
            L.marker(dest, {{icon: destIcon}}).addTo(map).bindPopup("<b>Destination:</b> {s.get('dest_name','')}");
            L.marker(curr, {{icon: truckIcon}}).addTo(map).bindPopup("<b>Current Position:</b> {s['status']} ({progress_pct}% complete)");
            
            // Polyline route
            var latlngs = [orig, curr, dest];
            var polyline = L.polyline(latlngs, {{color: '#2563EB', weight: 4, opacity: 0.8, dashArray: '8, 8'}}).addTo(map);
            
            map.fitBounds(polyline.getBounds(), {{padding: [40, 40]}});
        </script>
    </body>
    </html>
    """
    
    st.markdown('<div class="css-card" style="padding: 10px;">', unsafe_allow_html=True)
    components.html(map_html, height=415)
    st.markdown('</div>', unsafe_allow_html=True)
    
    st.markdown('<div style="height: 16px;"></div>', unsafe_allow_html=True)
    
    # Route Telemetry & Progress
    st.markdown('<h3 style="margin-bottom: 16px; font-size: 1.15rem;">Route Milestones & Navigation Telemetry</h3>', unsafe_allow_html=True)
    
    col1, col2, col3 = st.columns(3)
    with col1:
        render_kpi_card("Origin Terminal", s.get("origin_name", "Basel Hub"), f"Coordinates: {orig_lat}, {orig_lon}", COLOR_BLUE)
    with col2:
        render_kpi_card("Destination Terminal", s.get("dest_name", "Frankfurt Depot"), f"Coordinates: {dest_lat}, {dest_lon}", COLOR_EMERALD)
    with col3:
        render_kpi_card("Current Vehicle Position", f"{curr_lat}, {curr_lon}", f"Status: {s.get('vehicle_status', 'In Transit')}", COLOR_TEXT)
        
    st.markdown('<div style="height: 12px;"></div>', unsafe_allow_html=True)
    
    col4, col5, col6 = st.columns(3)
    with col4:
        render_kpi_card("Estimated Delivery (ETA)", s.get("expected_delivery", "2026-07-26 14:00"), f"Total Route Distance: {tot_dist} km", COLOR_BLUE)
    with col5:
        render_kpi_card("Remaining Distance", f"{rem_dist} km", f"Direct Haversine trajectory", COLOR_TEXT)
    with col6:
        render_kpi_card("Travel Route Progress", f"{progress_pct} %", "Consignment journey completion", COLOR_EMERALD)
        
    st.markdown('<div style="height: 12px;"></div>', unsafe_allow_html=True)
    st.progress(progress_pct / 100.0)
