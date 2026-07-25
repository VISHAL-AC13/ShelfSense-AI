// src/modules/GpsTracking.jsx
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import { Navigation, MapPin, Truck, Compass, Clock, CheckCircle2, Apple, AlertTriangle, ShieldCheck } from "lucide-react";
import { STORAGE_PROFILES } from "../data/mockData";

// Haversine formula to compute great-circle distance in kilometers
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
}

// Custom Div Icons for clean map markers
const createCustomIcon = (emoji, bgColor) => {
  return L.divIcon({
    className: "custom-div-icon",
    html: `<div style="background: ${bgColor}; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 2px 6px rgba(0,0,0,0.2); border: 2px solid white;">${emoji}</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18]
  });
};

const originIcon = createCustomIcon("🟢", "#059669");
const destIcon = createCustomIcon("🏁", "#E11D48");
const truckIcon = createCustomIcon("🚚", "#2563EB");

export default function GpsTracking({ shipments, onExecuteIntervention }) {
  const [selectedId, setSelectedId] = useState(shipments[0]?.shipment_id || "");
  const shipment = shipments.find((s) => s.shipment_id === selectedId) || shipments[0];

  if (!shipment) return <div style={{ color: "#0F172A" }}>No food consignments available.</div>;

  const profile = STORAGE_PROFILES[shipment.storage_type] || STORAGE_PROFILES["Fresh Fruits (Berries & Grapes)"];
  const baseShelfLife = shipment.ai_eval?.logistics?.base_shelf_life_hrs || profile.base_shelf_life_hrs || 72.0;

  const originLat = parseFloat(shipment.origin_lat || 11.4102);
  const originLon = parseFloat(shipment.origin_lon || 76.6950);
  const destLat = parseFloat(shipment.dest_lat || 13.0694);
  const destLon = parseFloat(shipment.dest_lon || 80.1948);
  const currLat = parseFloat(shipment.current_lat || originLat);
  const currLon = parseFloat(shipment.current_lon || originLon);

  const totalDist = calculateDistance(originLat, originLon, destLat, destLon);
  const remDist = calculateDistance(currLat, currLon, destLat, destLon);
  const progressPct = shipment.progress_pct !== undefined ? shipment.progress_pct : Math.max(5, Math.min(100, Math.round(((totalDist - remDist) / totalDist) * 100)));

  // Center on Tamil Nadu (approx 10.8505, 78.7047) or midpoint
  const centerLat = (originLat + destLat) / 2;
  const centerLon = (originLon + destLon) / 2;

  const routePositions = [
    [originLat, originLon],
    [currLat, currLon],
    [destLat, destLon]
  ];

  const isRerouted = shipment.status.includes("Rerouted") || (shipment.vehicle_status && shipment.vehicle_status.includes("Rerouted"));

  // Traffic & Shelf Life from Python backend or fallback calculation
  let trafficStatus = shipment.ai_eval?.logistics?.traffic_status;
  let trafficLevel = shipment.ai_eval?.logistics?.traffic_level || "CLEAR";
  if (!trafficStatus) {
    if (shipment.delay_hours > 1.0) {
      trafficStatus = `Heavy Traffic Congestion on Highway (+${shipment.delay_hours} hrs delay)`;
      trafficLevel = "HEAVY";
    } else if (shipment.delay_hours > 0.0) {
      trafficStatus = `Moderate Slowdown on Highway Corridor (+${shipment.delay_hours} hrs delay)`;
      trafficLevel = "MODERATE";
    } else {
      trafficStatus = "Nominal Highway Cruising Velocity -- Clear Traffic Flow";
      trafficLevel = "CLEAR";
    }
  }

  let remShelfLife = shipment.ai_eval?.logistics?.remaining_shelf_life_hrs;
  if (!remShelfLife) {
    const delayHrs = parseFloat(shipment.delay_hours || 0.0);
    const meanT = (shipment.sensors && shipment.sensors.length > 0) ? sum(shipment.sensors)/shipment.sensors.length : profile.target_temp;
    const tempDev = Math.max(0, meanT - profile.max_temp);
    remShelfLife = Math.max(2.0, (baseShelfLife - (delayHrs * 1.5) - (tempDev * 8.0))).toFixed(1);
  }

  function sum(arr) { return arr.reduce((a, b) => a + b, 0); }

  return (
    <div>
      {/* Top Bar Selector */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontSize: "1.45rem", color: "#0F172A", display: "flex", alignItems: "center", gap: "10px", fontWeight: 600 }}>
            <Navigation color="#2563EB" /> Live GPS Route Tracking
          </h2>
          <p style={{ color: "#64748B", fontSize: "0.88rem", marginTop: "4px" }}>
            Live route tracking, traffic flow, and shelf-life telemetry.
          </p>
        </div>
        <div>
          <select 
            className="form-select" 
            style={{ width: "340px", fontWeight: 500, border: "1px solid #CBD5E1", borderRadius: "6px" }}
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            {shipments.map((s) => (
              <option key={s.shipment_id} value={s.shipment_id}>
                {s.shipment_id} // {s.product}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dynamic Route Diversion Alert Banner (When Rerouted) */}
      {isRerouted && (
        <div style={{
          background: "#FFFBEB",
          border: "1px solid #F59E0B",
          padding: "16px 20px",
          borderRadius: "8px",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <AlertTriangle size={24} color="#D97706" />
            <div>
              <strong style={{ color: "#92400E", fontSize: "0.95rem" }}>🚨 ROUTE DIVERSION ACTIVE</strong>
              <p style={{ color: "#B45309", fontSize: "0.85rem", margin: "2px 0 0 0" }}>
                Vehicle diverted to <strong>{shipment.dest_name}</strong> ({remDist} km remaining).
              </p>
            </div>
          </div>
          <span style={{ background: "#FEF3C7", color: "#92400E", padding: "6px 12px", borderRadius: "6px", fontSize: "0.8rem", fontWeight: 600, border: "1px solid #FDE68A" }}>
            RECALCULATED
          </span>
        </div>
      )}

      {/* Navigation Telemetry & Traffic Cards */}
      <div className="grid-cols-4" style={{ marginBottom: "20px" }}>
        <div className="kpi-card" style={{ borderLeft: "4px solid #2563EB" }}>
          <div className="kpi-title" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Compass size={16} color="#2563EB" /> Total Route Distance
          </div>
          <div className="kpi-value" style={{ color: "#0F172A", fontSize: "1.4rem" }}>{totalDist} km</div>
          <div className="kpi-subtitle">Highway Corridor</div>
        </div>

        <div className="kpi-card" style={{ borderLeft: isRerouted ? "4px solid #D97706" : "4px solid #059669" }}>
          <div className="kpi-title" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <MapPin size={16} color={isRerouted ? "#D97706" : "#059669"} /> Remaining Distance
          </div>
          <div className="kpi-value" style={{ color: isRerouted ? "#D97706" : "#0F172A", fontSize: "1.4rem" }}>{shipment.status === "Delivered" ? "0.0" : remDist} km</div>
          <div className="kpi-subtitle">To {shipment.dest_name}</div>
        </div>

        <div className="kpi-card" style={{ borderLeft: trafficLevel === "HEAVY" ? "4px solid #E11D48" : trafficLevel === "MODERATE" ? "4px solid #D97706" : "4px solid #059669" }}>
          <div className="kpi-title" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Clock size={16} color="#64748B" /> Highway Traffic Status
          </div>
          <div style={{ fontSize: "0.95rem", fontWeight: 600, color: trafficLevel === "HEAVY" ? "#E11D48" : trafficLevel === "MODERATE" ? "#D97706" : "#059669", marginTop: "6px" }}>
            {trafficLevel === "HEAVY" ? "Heavy Traffic Congestion" : trafficLevel === "MODERATE" ? "Moderate Slowdown" : "Clear Traffic Flow"}
          </div>
          <div className="kpi-subtitle" style={{ fontSize: "0.75rem", color: "#64748B" }}>
            {shipment.delay_hours > 0 ? `⚠️ Delay penalty: +${shipment.delay_hours} hrs` : "✅ Cruising at nominal speed"}
          </div>
        </div>

        <div className="kpi-card" style={{ borderLeft: parseFloat(remShelfLife) < 24 ? "4px solid #E11D48" : "4px solid #059669" }}>
          <div className="kpi-title" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <ShieldCheck size={16} color="#059669" /> Remaining Shelf-Life
          </div>
          <div className="kpi-value" style={{ color: parseFloat(remShelfLife) < 24 ? "#E11D48" : "#059669", fontSize: "1.4rem" }}>
            {remShelfLife} hrs
          </div>
          <div className="kpi-subtitle" style={{ color: "#64748B" }}>
            Base Allowance: {baseShelfLife} hrs
          </div>
        </div>
      </div>

      {/* Leaflet Map Container */}
      <div className="clean-card" style={{ padding: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", padding: "0 8px" }}>
          <span style={{ fontWeight: 600, color: "#0F172A", fontSize: "0.95rem" }}>🛰️ Live GPS Transit Map</span>
          <span style={{ fontSize: "0.85rem", color: "#475569", fontWeight: 500 }}>Vehicle: <strong>{shipment.vehicle_number}</strong> ({shipment.driver_name})</span>
        </div>

        <div className="map-container-clean" key={selectedId} style={{ border: "1px solid #E2E8F0", borderRadius: "8px", overflow: "hidden" }}>
          <MapContainer 
            center={[centerLat, centerLon]} 
            zoom={7} 
            style={{ width: "100%", height: "420px" }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Origin Marker */}
            <Marker position={[originLat, originLon]} icon={originIcon}>
              <Popup>
                <strong>🟢 Origin:</strong><br />{shipment.origin_name}<br />Lat: {originLat}, Lon: {originLon}
              </Popup>
            </Marker>

            {/* Destination Marker */}
            <Marker position={[destLat, destLon]} icon={destIcon}>
              <Popup>
                <strong>🏁 {isRerouted ? "Diverted Depot:" : "Destination:"}</strong><br />{shipment.dest_name}<br />Lat: {destLat}, Lon: {destLon}
              </Popup>
            </Marker>

            {/* Truck Current Marker */}
            <Marker position={[currLat, currLon]} icon={truckIcon}>
              <Popup>
                <strong>🚚 Refrigerated Truck</strong><br />
                <strong>Product:</strong> {shipment.product}<br />
                <strong>Vehicle:</strong> {shipment.vehicle_number}<br />
                <strong>Driver:</strong> {shipment.driver_name}<br />
                <strong>Status:</strong> {shipment.vehicle_status}<br />
                <strong>Traffic Flow:</strong> {trafficStatus}<br />
                <strong>Remaining Shelf-Life:</strong> {remShelfLife} hrs
              </Popup>
            </Marker>

            {/* Route Polyline */}
            <Polyline 
              positions={routePositions} 
              pathOptions={{ color: isRerouted ? "#D97706" : "#2563EB", weight: 4, dashArray: isRerouted ? "6, 6" : "10, 10" }} 
            />
          </MapContainer>
        </div>

        {/* Traffic corridor note */}
        <div style={{ marginTop: "12px", padding: "10px 14px", background: "#F8FAFC", borderRadius: "6px", border: "1px solid #E2E8F0", fontSize: "0.84rem", color: "#475569", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>ℹ️ <strong>Corridor Diagnostics:</strong> {trafficStatus}</span>
          <span style={{ color: "#64748B" }}>Expected Delivery: <strong>{shipment.expected_delivery || "In Transit"}</strong></span>
        </div>
      </div>
    </div>
  );
}
