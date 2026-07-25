// src/modules/RegisterShipment.jsx
import React, { useState } from "react";
import { Sparkles, CheckCircle2, Rocket, MapPin, Truck, User, Calendar, Apple } from "lucide-react";
import { STORAGE_PROFILES } from "../data/mockData";

export default function RegisterShipment({ onRegisterShipment, setActiveTab }) {
  const [formData, setFormData] = useState({
    shipment_id: "SHP-TN-" + Math.floor(1000 + Math.random() * 9000),
    product_category: "Fresh Vegetables",
    product: "Oddanchatram Keerai & Hill Carrots",
    storage_type: "Leafy Vegetables & Salads",
    vehicle_number: "TN-57-F-" + Math.floor(1000 + Math.random() * 9000),
    driver_name: "Vishal",
    origin_name: "Oddanchatram Vegetable Hub, TN",
    dest_name: "Koyambedu Market, Chennai, TN",
    origin_lat: 10.5015,
    origin_lon: 77.7479,
    dest_lat: 13.0694,
    dest_lon: 80.1948,
    expected_delivery: "2026-07-27 16:30"
  });

  const [successMsg, setSuccessMsg] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const profile = STORAGE_PROFILES[formData.storage_type] || STORAGE_PROFILES["Fresh Fruits (Berries & Grapes)"];
    const targetT = profile.target_temp;

    // Initialize 9 sensors with slight jitter around nominal target
    const initSensors = Array.from({ length: 9 }, () => parseFloat((targetT + (Math.random() * 0.4 - 0.2)).toFixed(1)));

    const newShipment = {
      ...formData,
      origin_lat: parseFloat(formData.origin_lat),
      origin_lon: parseFloat(formData.origin_lon),
      dest_lat: parseFloat(formData.dest_lat),
      dest_lon: parseFloat(formData.dest_lon),
      current_lat: parseFloat(formData.origin_lat),
      current_lon: parseFloat(formData.origin_lon),
      status: "Active",
      vehicle_status: "In Transit — Nominal Speed on NH44",
      travel_duration: "0 hours 20 mins",
      delay_hours: 0.0,
      progress_pct: 5,
      sensors: initSensors,
      humidity: 78.0,
      door_openings: 0,
      alerts: []
    };

    onRegisterShipment(newShipment);
    setSuccessMsg(`Food Consignment ${newShipment.shipment_id} (${newShipment.product}) registered! 9-Zone thermal sensor array initiated at ${targetT}°C.`);

    // Reset fields for next entry
    setFormData((prev) => ({
      ...prev,
      shipment_id: "SHP-TN-" + Math.floor(1000 + Math.random() * 9000),
      product: ""
    }));
  };

  const currentProfile = STORAGE_PROFILES[formData.storage_type] || STORAGE_PROFILES["Fresh Fruits (Berries & Grapes)"];

  return (
    <div className="clean-card" style={{ maxWidth: "920px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #E2E8F0", paddingBottom: "16px" }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", color: "#0F172A", display: "flex", alignItems: "center", gap: "10px" }}>
            <Apple color="#2563EB" /> Register New Shipment
          </h2>
          <p style={{ color: "#64748B", fontSize: "0.9rem", marginTop: "4px" }}>
            Enter shipment details to activate real-time tracking.
          </p>
        </div>
      </div>

      {successMsg && (
        <div style={{
          background: "#ECFDF5",
          border: "1px solid #059669",
          padding: "18px 24px",
          borderRadius: "14px",
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 4px 6px rgba(5, 150, 105, 0.08)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#059669" }}>
            <CheckCircle2 size={24} />
            <div>
              <strong style={{ fontSize: "1.05rem", color: "#0F172A" }}>✅ Shipment Registered Successfully!</strong>
              <p style={{ fontSize: "0.9rem", marginTop: "4px", color: "#475569" }}>{successMsg}</p>
            </div>
          </div>
          <button 
            className="btn-clean btn-emerald" 
            style={{ padding: "8px 18px", fontSize: "0.85rem", whiteSpace: "nowrap" }}
            onClick={() => setActiveTab("live")}
          >
            📡 Go to Live Monitoring ➔
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <h4 style={{ color: "#2563EB", marginBottom: "16px", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px" }}>
          1. Shipment Specifications
        </h4>
        <div className="grid-cols-2">
          <div className="form-group">
            <label className="form-label">Shipment ID *</label>
            <input 
              type="text" 
              className="form-input" 
              name="shipment_id" 
              value={formData.shipment_id} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Product Category *</label>
            <input 
              type="text" 
              className="form-input" 
              name="product_category" 
              value={formData.product_category} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>

        <div className="grid-cols-2">
          <div className="form-group">
            <label className="form-label">Product Name / Description *</label>
            <input 
              type="text" 
              className="form-input" 
              name="product" 
              value={formData.product} 
              onChange={handleChange} 
              placeholder="e.g. Ooty Strawberries" 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Storage Profile *</label>
            <select 
              className="form-select" 
              name="storage_type" 
              value={formData.storage_type} 
              onChange={handleChange}
            >
              {Object.keys(STORAGE_PROFILES).map((key) => (
                <option key={key} value={key}>
                  {key} ({STORAGE_PROFILES[key].min_temp}°C to {STORAGE_PROFILES[key].max_temp}°C)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Protocol Summary Card */}
        <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", padding: "14px 18px", borderRadius: "12px", marginBottom: "24px" }}>
          <strong style={{ color: "#1D4ED8", fontSize: "0.85rem", textTransform: "uppercase" }}>ℹ️ Active Safety Protocol:</strong>
          <div style={{ display: "flex", gap: "24px", marginTop: "6px", fontSize: "0.9rem", color: "#0F172A" }}>
            <span><strong>Target Temp:</strong> {currentProfile.target_temp} °C</span>
            <span><strong>Max Temp Ceiling:</strong> {currentProfile.max_temp} °C</span>
            <span><strong>Max Door Access:</strong> {currentProfile.max_door_openings} Events</span>
          </div>
          <p style={{ fontSize: "0.8rem", color: "#475569", marginTop: "4px" }}>{currentProfile.desc}</p>
        </div>

        <h4 style={{ color: "#2563EB", marginBottom: "16px", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px" }}>
          2. Transport & Routing
        </h4>
        <div className="grid-cols-2">
          <div className="form-group">
            <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Truck size={15} color="#2563EB" /> Vehicle Number *
            </label>
            <input 
              type="text" 
              className="form-input" 
              name="vehicle_number" 
              value={formData.vehicle_number} 
              onChange={handleChange} 
              placeholder="e.g. TN-57-F-3321" 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <User size={15} color="#2563EB" /> Driver Name *
            </label>
            <input 
              type="text" 
              className="form-input" 
              name="driver_name" 
              value={formData.driver_name} 
              onChange={handleChange} 
              placeholder="e.g. Vishal" 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <MapPin size={15} color="#059669" /> Origin (TN) *
            </label>
            <input 
              type="text" 
              className="form-input" 
              name="origin_name" 
              value={formData.origin_name} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <MapPin size={15} color="#E11D48" /> Destination (TN) *
            </label>
            <input 
              type="text" 
              className="form-input" 
              name="dest_name" 
              value={formData.dest_name} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Origin GPS (Lat, Lon)</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <input type="number" step="0.0001" className="form-input" name="origin_lat" value={formData.origin_lat} onChange={handleChange} />
              <input type="number" step="0.0001" className="form-input" name="origin_lon" value={formData.origin_lon} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Destination GPS (Lat, Lon)</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <input type="number" step="0.0001" className="form-input" name="dest_lat" value={formData.dest_lat} onChange={handleChange} />
              <input type="number" step="0.0001" className="form-input" name="dest_lon" value={formData.dest_lon} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="form-group" style={{ marginTop: "10px" }}>
          <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Calendar size={15} color="#D97706" /> Expected Delivery (ETA)
          </label>
          <input 
            type="text" 
            className="form-input" 
            name="expected_delivery" 
            value={formData.expected_delivery} 
            onChange={handleChange} 
            style={{ maxWidth: "420px" }}
          />
        </div>

        <div style={{ marginTop: "30px", borderTop: "1px solid #E2E8F0", paddingTop: "20px" }}>
          <button type="submit" className="btn-clean btn-primary" style={{ width: "100%", padding: "16px", fontSize: "1.05rem" }}>
            <Rocket size={20} /> Register Shipment & Activate Tracking
          </button>
        </div>
      </form>
    </div>
  );
}
