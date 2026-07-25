// src/modules/LiveMonitoring.jsx
import React, { useState, useEffect } from "react";
import { Activity, Sliders, AlertCircle, CheckCircle2, ShieldAlert, Thermometer, Droplets, Lock, Apple, Zap, Rocket } from "lucide-react";
import { STORAGE_PROFILES } from "../data/mockData";

export default function LiveMonitoring({ shipments, onUpdateTelemetry, onExecuteIntervention }) {
  const [selectedId, setSelectedId] = useState(shipments[0]?.shipment_id || "");
  const [simOpen, setSimOpen] = useState(false);

  const shipment = shipments.find((s) => s.shipment_id === selectedId) || shipments[0];
  const profile = STORAGE_PROFILES[shipment?.storage_type] || STORAGE_PROFILES["Fresh Fruits (Berries & Grapes)"];

  // Simulator Local State
  const [simS9, setSimSimS9] = useState(shipment?.sensors?.[8] ?? profile.target_temp);
  const [simHum, setSimHum] = useState(shipment?.humidity ?? 75.0);
  const [simDoors, setSimDoors] = useState(shipment?.door_openings ?? 0);

  useEffect(() => {
    if (shipment) {
      setSimSimS9(shipment.sensors?.[8] ?? profile.target_temp);
      setSimHum(shipment.humidity ?? 75.0);
      setSimDoors(shipment.door_openings ?? 0);
    }
  }, [selectedId, shipment]);

  if (!shipment) return <div style={{ color: "#0F172A" }}>No food consignments available.</div>;

  const handleApplySim = () => {
    const updatedSensors = [...(shipment.sensors || Array(9).fill(profile.target_temp))];
    updatedSensors[8] = parseFloat(simS9);

    onUpdateTelemetry(shipment.shipment_id, updatedSensors, parseFloat(simHum), parseInt(simDoors));
    alert(`✅ Telemetry Excursion Applied for ${shipment.shipment_id} (${shipment.product})!\nAI Spoilage Risk Models and Excursion Alarms have been recalculated.`);
  };

  const labels = [
    "Sensor 1 (Front Top)", "Sensor 2 (Front Mid)", "Sensor 3 (Front Bottom)",
    "Sensor 4 (Mid Top)", "Sensor 5 (Core Pallet Center)", "Sensor 6 (Mid Bottom)",
    "Sensor 7 (Rear Top)", "Sensor 8 (Rear Mid)", "Sensor 9 (Rear Bottom near doors)"
  ];

  const badgeClass = shipment.status === "Critical" ? "badge-critical" : shipment.status === "Warning" ? "badge-warning" : shipment.status.includes("Recovering") ? "badge-blue" : "badge-nominal";

  return (
    <div>
      {/* Top Bar Selector */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", color: "#0F172A", display: "flex", alignItems: "center", gap: "10px" }}>
            <Activity color="#2563EB" /> Real-Time 9-Zone Food Temperature Array
          </h2>
          <p style={{ color: "#64748B", fontSize: "0.9rem", marginTop: "4px" }}>
            Live thermal tracking across 9 multi-zone internal trailer sensors, humidity stability, and security door access.
          </p>
        </div>
        <div>
          <select 
            className="form-select" 
            style={{ width: "340px", fontWeight: 600, border: "2px solid #2563EB" }}
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            {shipments.map((s) => (
              <option key={s.shipment_id} value={s.shipment_id}>
                {s.shipment_id} // {s.product} ({s.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Status Overview Banner */}
      <div className="clean-card" style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
        <div className="grid-cols-4" style={{ marginBottom: 0 }}>
          <div>
            <div className="kpi-title">Transport Vehicle Status</div>
            <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#1D4ED8", marginTop: "4px" }}>
              {shipment.vehicle_status}
            </div>
          </div>
          <div>
            <div className="kpi-title">Food Safety Status</div>
            <div style={{ marginTop: "4px" }}>
              <span className={`status-badge ${badgeClass}`} style={{ fontSize: "0.85rem", padding: "6px 14px" }}>
                {shipment.status}
              </span>
            </div>
          </div>
          <div>
            <div className="kpi-title">Travel Duration</div>
            <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0F172A", marginTop: "4px" }}>
              {shipment.travel_duration}
            </div>
          </div>
          <div>
            <div className="kpi-title">Storage Protocol Envelope</div>
            <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0F172A", marginTop: "4px" }}>
              {shipment.storage_type}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#64748B" }}>
              ({profile.min_temp}°C to {profile.max_temp}°C)
            </div>
          </div>
        </div>
      </div>

      {/* ⚡ TIMELY INTERVENTION CONTROL DECK (The Solution Hero) */}
      <div className="clean-card" style={{ background: "#FFFFFF", border: "1px solid #CBD5E1", marginBottom: "28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", borderBottom: "1px solid #E2E8F0", paddingBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ background: "#F1F5F9", color: "#2563EB", padding: "6px 10px", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
              <Zap size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.2rem", color: "#0F172A", margin: 0 }}>Timely Intervention Control Deck — Instant Corrective Action</h3>
              <p style={{ fontSize: "0.82rem", color: "#64748B", margin: 0 }}>Dispatch automated commands to the refrigerated trailer IoT unit to counteract thermal excursions.</p>
            </div>
          </div>
          <span style={{ background: "#F1F5F9", color: "#334155", padding: "6px 14px", borderRadius: "6px", fontSize: "0.8rem", fontWeight: 600, border: "1px solid #CBD5E1" }}>1-CLICK RECOVERY</span>
        </div>

        <div className="grid-cols-3" style={{ marginBottom: 0 }}>
          <div style={{ background: "white", padding: "14px", borderRadius: "12px", border: "1px solid #FECDD3" }}>
            <h4 style={{ fontSize: "1rem", color: "#0F172A", marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
              ❄️ Thermal Compressor Override
            </h4>
            <p style={{ fontSize: "0.8rem", color: "#64748B", marginBottom: "12px" }}>
              Forces cooling compressor to super-chill by 1.5°C to offset warm door drafts or rear chamber drift.
            </p>
            <button 
              className="btn-clean btn-primary" 
              style={{ width: "100%", padding: "8px", fontSize: "0.82rem", background: "#E11D48" }}
              onClick={() => onExecuteIntervention(shipment.shipment_id, "Compressor Super-Chill Override Dispatched", "THERMAL_OVERRIDE")}
            >
              ⚡ Execute Thermal Override
            </button>
          </div>

          <div style={{ background: "white", padding: "14px", borderRadius: "12px", border: "1px solid #FDE68A" }}>
            <h4 style={{ fontSize: "1rem", color: "#0F172A", marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
              🛰️ Emergency Route Diversion
            </h4>
            <p style={{ fontSize: "0.8rem", color: "#64748B", marginBottom: "12px" }}>
              Reroutes vehicle to the nearest certified refrigerated food depot within 25 km to unload perishable cargo.
            </p>
            <button 
              className="btn-clean btn-emerald" 
              style={{ width: "100%", padding: "8px", fontSize: "0.82rem" }}
              onClick={() => onExecuteIntervention(shipment.shipment_id, "Emergency Rerouting to Nearest Cold Depot", "EMERGENCY_REROUTE")}
            >
              ⚡ Divert Route to Depot
            </button>
          </div>

          <div style={{ background: "white", padding: "14px", borderRadius: "12px", border: "1px solid #BFDBFE" }}>
            <h4 style={{ fontSize: "1rem", color: "#0F172A", marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
              📦 QC Shelf-Life Salvage Alert
            </h4>
            <p style={{ fontSize: "0.8rem", color: "#64748B", marginBottom: "12px" }}>
              Flags destination WMS for priority dock intake and immediate sensory quality evaluation upon arrival.
            </p>
            <button 
              className="btn-clean btn-primary" 
              style={{ width: "100%", padding: "8px", fontSize: "0.82rem", background: "#2563EB" }}
              onClick={() => onExecuteIntervention(shipment.shipment_id, "WMS Priority QC Intake Flag Activated", "QC_ALERT")}
            >
              ⚡ Flag Priority QC Intake
            </button>
          </div>
        </div>
      </div>

      {/* 9 Temperature Sensors Grid (3x3) */}
      <h3 style={{ margin: "28px 0 16px 0", fontSize: "1.25rem", color: "#0F172A", display: "flex", alignItems: "center", gap: "8px" }}>
        <Thermometer color="#2563EB" /> 9-Zone Refrigerated Trailer Thermal Array (°C)
      </h3>
      <div className="sensor-grid-3x3">
        {(shipment.sensors || Array(9).fill(profile.target_temp)).map((val, idx) => {
          let cardClass = "sensor-cell";
          let badge = <span className="status-badge badge-nominal">NOMINAL</span>;
          let valColor = "#0F172A";

          if (val < profile.min_temp - 1.5 || val > profile.max_temp + 1.5) {
            cardClass += " critical";
            badge = <span className="status-badge badge-critical">CRITICAL EXCURSION</span>;
            valColor = "#E11D48";
          } else if (val < profile.min_temp || val > profile.max_temp) {
            cardClass += " warning";
            badge = <span className="status-badge badge-warning">ABNORMAL DRIFT</span>;
            valColor = "#D97706";
          }

          let diff = (val - profile.target_temp).toFixed(1);
          let diffStr = diff > 0 ? `+${diff}°C` : `${diff}°C`;

          return (
            <div key={idx} className={cardClass}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#475569" }}>
                  {labels[idx] || `Sensor ${idx + 1}`}
                </span>
                {badge}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.8rem", fontWeight: 800, color: valColor }}>
                  {val.toFixed(1)} °C
                </span>
                <span style={{ fontSize: "0.78rem", color: "#64748B" }}>
                  Target: {profile.target_temp}°C ({diffStr})
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Atmospheric Humidity & Security */}
      <h3 style={{ margin: "28px 0 16px 0", fontSize: "1.25rem", color: "#0F172A", display: "flex", alignItems: "center", gap: "8px" }}>
        <Droplets color="#059669" /> Chamber Humidity & Security Door Access
      </h3>
      <div className="grid-cols-2">
        <div className="kpi-card" style={{ borderLeft: (40 <= shipment.humidity && shipment.humidity <= 88) ? "5px solid #059669" : "5px solid #D97706" }}>
          <div className="kpi-title" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Droplets size={16} color="#059669" /> Chamber Relative Humidity
          </div>
          <div className="kpi-value" style={{ color: (40 <= shipment.humidity && shipment.humidity <= 88) ? "#059669" : "#D97706" }}>
            {shipment.humidity ? shipment.humidity.toFixed(1) : "75.0"} %
          </div>
          <div className="kpi-subtitle" style={{ color: "#64748B" }}>
            {shipment.humidity > 88 ? "⚠️ High condensation & mold risk!" : shipment.humidity < 40 ? "⚠️ Produce wilting & desiccation risk!" : "✅ Optimal atmospheric preservation level"}
          </div>
        </div>

        <div className="kpi-card" style={{ borderLeft: shipment.door_openings <= profile.max_door_openings ? "5px solid #059669" : "5px solid #E11D48" }}>
          <div className="kpi-title" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Lock size={16} color={shipment.door_openings <= profile.max_door_openings ? "#059669" : "#E11D48"} /> Security Door Access Count
          </div>
          <div className="kpi-value" style={{ color: shipment.door_openings <= profile.max_door_openings ? "#059669" : "#E11D48" }}>
            {shipment.door_openings || 0} Events
          </div>
          <div className="kpi-subtitle" style={{ color: "#64748B" }}>
            {shipment.door_openings <= profile.max_door_openings 
              ? `✅ Within protocol allowance (Limit: ${profile.max_door_openings})` 
              : `🚨 VIOLATION: Exceeds limit (${profile.max_door_openings})! Increases warm air influx.`}
          </div>
        </div>
      </div>

      {/* Interactive IoT Telemetry Simulator */}
      <div className="clean-card" style={{ marginTop: "32px", border: "1px solid #BFDBFE", background: "#F8FAFC" }}>
        <div 
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
          onClick={() => setSimOpen(!simOpen)}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Sliders size={22} color="#2563EB" />
            <div>
              <h4 style={{ fontSize: "1.15rem", color: "#0F172A" }}>🎛️ Real-Time Telemetry Excursion Simulator (Interactive Demo Control)</h4>
              <p style={{ fontSize: "0.82rem", color: "#64748B" }}>Simulate live IoT thermal drift or unauthorized door access to test the Timely Intervention Engine.</p>
            </div>
          </div>
          <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#2563EB" }}>{simOpen ? "−" : "+"}</span>
        </div>

        {simOpen && (
          <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #E2E8F0" }}>
            <p style={{ fontSize: "0.9rem", color: "#475569", marginBottom: "24px" }}>
              Adjust range sliders below to simulate severe environmental conditions on <strong>Sensor 9 (Rear Bottom near doors)</strong>. Clicking apply immediately triggers Spoilage Alarms and activates the Timely Intervention Deck!
            </p>

            <div className="grid-cols-3">
              <div>
                <label className="form-label" style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Simulate Sensor 9 Temp</span>
                  <strong style={{ color: "#2563EB" }}>{simS9} °C</strong>
                </label>
                <input 
                  type="range" 
                  className="clean-range-slider" 
                  min="-30" max="35" step="0.5" 
                  value={simS9} 
                  onChange={(e) => setSimSimS9(e.target.value)} 
                />
              </div>

              <div>
                <label className="form-label" style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Simulate Chamber Humidity</span>
                  <strong style={{ color: "#059669" }}>{simHum} %</strong>
                </label>
                <input 
                  type="range" 
                  className="clean-range-slider" 
                  min="20" max="95" step="1" 
                  value={simHum} 
                  onChange={(e) => setSimHum(e.target.value)} 
                />
              </div>

              <div>
                <label className="form-label" style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Simulate Door Openings</span>
                  <strong style={{ color: "#D97706" }}>{simDoors} Events</strong>
                </label>
                <input 
                  type="number" 
                  className="form-input" 
                  min="0" max="25" 
                  value={simDoors} 
                  onChange={(e) => setSimDoors(e.target.value)} 
                />
              </div>
            </div>

            <div style={{ marginTop: "24px", textAlign: "right" }}>
              <button className="btn-clean btn-primary" onClick={handleApplySim}>
                ⚡ Apply Live Food Telemetry Excursion
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
