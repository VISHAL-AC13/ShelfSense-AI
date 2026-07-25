// src/modules/Dashboard.jsx
import React, { useState } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from "chart.js";
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  AlertTriangle, 
  Thermometer, 
  Droplets, 
  HeartPulse, 
  Rocket,
  Apple,
  Zap,
  ShieldCheck,
  RefreshCw
} from "lucide-react";
import { predictTransportRisk, evaluateSpoilageRisk, calculateHealthScore, generateRecommendations } from "../utils/aiEngines";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

export default function Dashboard({ shipments, onSelectShipment, setActiveTab, onExecuteIntervention }) {
  const [activeTableTab, setActiveTableTab] = useState("recent");

  // Calculate KPIs
  const total = shipments.length;
  let active = 0, delivered = 0, alertsCount = 0;
  let tempSum = 0, tempCount = 0;
  let humSum = 0, humCount = 0;
  let healthSum = 0;
  let riskCounts = { LOW: 0, MEDIUM: 0, HIGH: 0 };
  let allRecs = [];
  let allAlerts = [];
  let urgentInterventions = [];

  shipments.forEach((s) => {
    if (s.status === "Delivered") delivered++;
    else active++;

    if (s.alerts && s.alerts.length > 0) alertsCount += s.alerts.length;
    else if (s.status === "Critical") alertsCount++;

    const rTrans = predictTransportRisk(s);
    const rSpoil = evaluateSpoilageRisk(s);
    const score = calculateHealthScore(s, rSpoil);
    const recs = generateRecommendations(s, rTrans, rSpoil, score);

    if (s.status !== "Delivered") {
      if (s.sensors && s.sensors.length > 0) {
        const mean = s.sensors.reduce((a, b) => a + b, 0) / s.sensors.length;
        tempSum += mean;
        tempCount++;
      }
      humSum += s.humidity || 75;
      humCount++;
      healthSum += score;
    }

    riskCounts[rTrans.risk_level]++;

    recs.forEach((r) => {
      if (["CRITICAL", "HIGH", "MEDIUM"].includes(r.priority)) {
        allRecs.push({
          id: s.shipment_id,
          product: s.product,
          priority: r.priority,
          action: r.action,
          reason: r.reason
        });
      }
    });

    if (s.status === "Critical" || s.status === "Warning" || rSpoil.risk_score >= 3.2) {
      if (!s.status.includes("Recovering")) {
        urgentInterventions.push({
          id: s.shipment_id,
          product: s.product,
          status: s.status,
          score: rSpoil.risk_score,
          reason: rSpoil.reasons[0] || "Abnormal condition drift"
        });
      }
    }

    if (s.alerts && s.alerts.length > 0) {
      s.alerts.forEach((a) => {
        allAlerts.push({ id: s.shipment_id, product: s.product, sev: "CRITICAL", text: a });
      });
    } else if (["Warning", "Critical"].includes(s.status)) {
      allAlerts.push({ id: s.shipment_id, product: s.product, sev: s.status.toUpperCase(), text: `Status reported as ${s.status}` });
    }
  });

  const avgTemp = tempCount > 0 ? (tempSum / tempCount).toFixed(1) : "2.0";
  const avgHum = humCount > 0 ? (humSum / humCount).toFixed(1) : "75.0";
  const avgHealth = active > 0 ? (healthSum / active).toFixed(0) : "100";

  // Chart Data
  const hours = ["H-21", "H-18", "H-15", "H-12", "H-9", "H-6", "H-3", "Now"];
  const tempData = {
    labels: hours,
    datasets: [
      {
        label: "Avg Produce Temp (°C)",
        data: hours.map((_, i) => parseFloat((parseFloat(avgTemp) + Math.sin(i) * 0.3).toFixed(1))),
        borderColor: "#2563EB",
        backgroundColor: "rgba(37, 99, 235, 0.1)",
        borderWidth: 3,
        tension: 0.35,
        fill: true,
        pointBackgroundColor: "#2563EB"
      }
    ]
  };

  const humData = {
    labels: hours,
    datasets: [
      {
        label: "Avg Chamber Humidity (%)",
        data: hours.map((_, i) => parseFloat((parseFloat(avgHum) + Math.cos(i) * 1.0).toFixed(1))),
        borderColor: "#059669",
        backgroundColor: "rgba(5, 150, 105, 0.1)",
        borderWidth: 3,
        tension: 0.35,
        fill: true,
        pointBackgroundColor: "#059669"
      }
    ]
  };

  const riskDonutData = {
    labels: ["Low Spoilage Risk", "Medium Spoilage Risk", "High Spoilage Risk"],
    datasets: [
      {
        data: [riskCounts.LOW, riskCounts.MEDIUM, riskCounts.HIGH],
        backgroundColor: ["#059669", "#D97706", "#E11D48"],
        borderColor: "#FFFFFF",
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0F172A",
        titleColor: "#FFFFFF",
        bodyColor: "#E2E8F0",
        borderColor: "#CBD5E1",
        borderWidth: 1
      }
    },
    scales: {
      x: { grid: { color: "#F1F5F9" }, ticks: { color: "#64748B", font: { size: 11 } } },
      y: { grid: { color: "#F1F5F9" }, ticks: { color: "#64748B", font: { size: 11 } } }
    }
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#475569", font: { size: 12 }, padding: 16, boxWidth: 12 }
      }
    }
  };

  const handleInspect = (id) => {
    onSelectShipment(id);
    setActiveTab("live");
  };

  return (
    <div>      {/* ⚡ THE CORE SOLUTION: Timely Intervention & Automated Action Center */}
      <div className="clean-card" style={{ background: "#FFFFFF", border: "1px solid #CBD5E1", marginBottom: "28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid #E2E8F0", paddingBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ background: "#F1F5F9", color: "#2563EB", padding: "8px", borderRadius: "10px", border: "1px solid #E2E8F0" }}>
              <Zap size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.25rem", color: "#0F172A", margin: 0 }}>Automated Interventions</h3>
              <p style={{ fontSize: "0.85rem", color: "#64748B", margin: 0, fontWeight: 500 }}>1-Click telemetry overrides and route diversions.</p>
            </div>
          </div>
          <span style={{ background: "#F1F5F9", color: "#334155", padding: "6px 14px", borderRadius: "6px", fontSize: "0.82rem", fontWeight: 600, border: "1px solid #CBD5E1" }}>
            ACTIVE INTERVENTION DECK
          </span>
        </div>

        {urgentInterventions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px", background: "white", borderRadius: "12px", border: "1px solid #A7F3D0", color: "#059669", fontWeight: 700, display: "flex", alignItems: "center", justify: "center", gap: "10px" }}>
            <ShieldCheck size={24} />
            <span>✅ All consignments nominal. No interventions required.</span>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: "0.9rem", color: "#475569", marginBottom: "14px", fontWeight: 600 }}>
              🚨 {urgentInterventions.length} consignment(s) require attention:
            </div>
            <div className="grid-cols-2" style={{ marginBottom: 0 }}>
              {urgentInterventions.map((u) => (
                <div key={u.id} style={{ background: "white", padding: "16px", borderRadius: "12px", border: "1px solid #FCA5A5", boxShadow: "0 4px 6px rgba(0,0,0,0.03)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <strong style={{ color: "#E11D48", fontSize: "1.05rem" }}>{u.id} // {u.product}</strong>
                    <span className="status-badge badge-critical">Score: {u.score} / 10</span>
                  </div>
                  <p style={{ fontSize: "0.82rem", color: "#64748B", marginBottom: "14px" }}>
                    <strong>Trigger:</strong> {u.reason}
                  </p>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <button 
                      className="btn-clean btn-primary" 
                      style={{ padding: "8px 14px", fontSize: "0.8rem", background: "#2563EB" }}
                      onClick={() => onExecuteIntervention(u.id, "Emergency Compressor Override (-1.5°C)", "THERMAL_OVERRIDE")}
                    >
                      ⚡ Override Compressor (-1.5°C)
                    </button>
                    <button 
                      className="btn-clean btn-emerald" 
                      style={{ padding: "8px 14px", fontSize: "0.8rem" }}
                      onClick={() => onExecuteIntervention(u.id, "Reroute to Nearest Agri-Hub Depot", "EMERGENCY_REROUTE")}
                    >
                      ⚡ Reroute to Depot
                    </button>
                    <button 
                      className="btn-clean btn-outline" 
                      style={{ padding: "8px 14px", fontSize: "0.8rem", borderColor: "#D97706", color: "#D97706" }}
                      onClick={() => onExecuteIntervention(u.id, "Priority QC Unloading Alert Dispatched", "QC_ALERT")}
                    >
                      ⚡ Flag QC Unloading
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid-cols-4">
        <div className="kpi-card">
          <div className="kpi-title" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Apple size={16} color="#2563EB" /> Total Consignments
          </div>
          <div className="kpi-value">{total}</div>
          <div className="kpi-subtitle">Monitored loads</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Truck size={16} color="#2563EB" /> Active In Transit
          </div>
          <div className="kpi-value" style={{ color: "#2563EB" }}>{active}</div>
          <div className="kpi-subtitle">Trucks en route</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <CheckCircle2 size={16} color="#059669" /> Delivered Foods
          </div>
          <div className="kpi-value" style={{ color: "#059669" }}>{delivered}</div>
          <div className="kpi-subtitle">Completed deliveries</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <AlertTriangle size={16} color={alertsCount > 0 ? "#E11D48" : "#059669"} /> Spoilage Excursions
          </div>
          <div className="kpi-value" style={{ color: alertsCount > 0 ? "#E11D48" : "#059669" }}>{alertsCount}</div>
          <div className="kpi-subtitle">
            {alertsCount > 0 ? "⚠️ Action required" : "✅ Optimal"}
          </div>
        </div>
      </div>

      {/* 3 Secondary KPI Cards */}
      <div className="grid-cols-3">
        <div className="kpi-card">
          <div className="kpi-title" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Thermometer size={16} color="#2563EB" /> Avg Produce Temp
          </div>
          <div className="kpi-value" style={{ color: "#2563EB" }}>{avgTemp} °C</div>
          <div className="kpi-subtitle">Active 9-zone sensors</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Droplets size={16} color="#059669" /> Avg Chamber Humidity
          </div>
          <div className="kpi-value" style={{ color: "#059669" }}>{avgHum} %</div>
          <div className="kpi-subtitle">Optimal humidity level</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <HeartPulse size={16} color={avgHealth >= 85 ? "#059669" : avgHealth >= 70 ? "#D97706" : "#E11D48"} /> Overall Freshness Index
          </div>
          <div className="kpi-value" style={{ color: avgHealth >= 85 ? "#059669" : avgHealth >= 70 ? "#D97706" : "#E11D48" }}>
            {avgHealth} %
          </div>
          <div className="kpi-subtitle">
            {avgHealth >= 85 ? "🟢 Prime Quality" : "🟡 Moderate Degradation Risk"}
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <h3 style={{ marginBottom: "16px", fontSize: "1.2rem", color: "#0F172A" }}>Analytics Overview</h3>
      <div className="grid-cols-3">
        <div className="clean-card" style={{ marginBottom: 0 }}>
          <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0F172A", marginBottom: "12px" }}>24-Hr Temperature Trend (°C)</div>
          <div style={{ height: "230px" }}>
            <Line data={tempData} options={chartOptions} />
          </div>
        </div>

        <div className="clean-card" style={{ marginBottom: 0 }}>
          <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0F172A", marginBottom: "12px" }}>24-Hr Humidity Trend (%)</div>
          <div style={{ height: "230px" }}>
            <Line data={humData} options={{ ...chartOptions, scales: { ...chartOptions.scales, y: { ...chartOptions.scales.y, min: 0, max: 100 } } }} />
          </div>
        </div>

        <div className="clean-card" style={{ marginBottom: 0 }}>
          <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0F172A", marginBottom: "12px" }}>AI Predicted Spoilage Risk Distribution</div>
          <div style={{ height: "230px" }}>
            <Doughnut data={riskDonutData} options={donutOptions} />
          </div>
        </div>
      </div>

      {/* Operational Tables */}
      <h3 style={{ margin: "28px 0 16px 0", fontSize: "1.2rem", color: "#0F172A" }}>Consignments & Activity</h3>
      <div className="clean-card">
        <div className="clean-tabs-nav">
          <button 
            className={`clean-tab-btn ${activeTableTab === "recent" ? "active" : ""}`}
            onClick={() => setActiveTableTab("recent")}
          >
            🍎 Consignments
          </button>
          <button 
            className={`clean-tab-btn ${activeTableTab === "recs" ? "active" : ""}`}
            onClick={() => setActiveTableTab("recs")}
          >
            ⚡ AI Actions ({allRecs.length})
          </button>
          <button 
            className={`clean-tab-btn ${activeTableTab === "alerts" ? "active" : ""}`}
            onClick={() => setActiveTableTab("alerts")}
          >
            🚨 Alarms ({allAlerts.length})
          </button>
        </div>

        {activeTableTab === "recent" && (
          <div className="table-responsive">
            <table className="table-clean">
              <thead>
                <tr>
                  <th>Shipment ID</th>
                  <th>Food Product</th>
                  <th>Category</th>
                  <th>Origin ➔ Destination</th>
                  <th>Storage Protocol</th>
                  <th>Predicted Risk Score</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {shipments.map((s) => {
                  const badgeClass = s.status === "Critical" ? "badge-critical" : s.status === "Warning" ? "badge-warning" : s.status.includes("Recovering") ? "badge-blue" : s.status === "Delivered" ? "badge-blue" : "badge-nominal";
                  const spoilRisk = evaluateSpoilageRisk(s);
                  const scoreColor = spoilRisk.risk_score >= 6.5 ? "#E11D48" : spoilRisk.risk_score >= 3.2 ? "#D97706" : "#059669";
                  return (
                    <tr key={s.shipment_id}>
                      <td><strong style={{ color: "#2563EB" }}>{s.shipment_id}</strong></td>
                      <td><strong style={{ color: "#0F172A" }}>{s.product}</strong></td>
                      <td>{s.product_category}</td>
                      <td>{s.origin_name} ➔ {s.dest_name}</td>
                      <td><span style={{ fontSize: "0.85rem", color: "#64748B" }}>{s.storage_type}</span></td>
                      <td>
                        <strong style={{ color: scoreColor, fontSize: "0.95rem" }}>
                          {spoilRisk.risk_score} / 10 ({spoilRisk.spoilage_risk})
                        </strong>
                      </td>
                      <td><span className={`status-badge ${badgeClass}`}>{s.status}</span></td>
                      <td>
                        <button 
                          className="btn-clean btn-outline" 
                          style={{ padding: "6px 14px", fontSize: "0.8rem" }}
                          onClick={() => handleInspect(s.shipment_id)}
                        >
                          🔍 Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {activeTableTab === "recs" && (
          <div className="table-responsive">
            <table className="table-clean">
              <thead>
                <tr>
                  <th>Shipment ID</th>
                  <th>Food Product</th>
                  <th>Priority</th>
                  <th>Recommended Timely Intervention</th>
                  <th>AI Spoilage Diagnostic Rationale</th>
                  <th>Execute Action</th>
                </tr>
              </thead>
              <tbody>
                {allRecs.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: "30px", color: "#059669", fontWeight: 700 }}>
                      ✅ All perishable food shipments in nominal condition. No interventions required.
                    </td>
                  </tr>
                ) : (
                  allRecs.map((r, idx) => (
                    <tr key={`${r.id}-${idx}`}>
                      <td><strong style={{ color: "#2563EB" }}>{r.id}</strong></td>
                      <td>{r.product}</td>
                      <td>
                        <span className={`status-badge ${r.priority === "CRITICAL" ? "badge-critical" : "badge-warning"}`}>
                          {r.priority}
                        </span>
                      </td>
                      <td><strong style={{ color: "#0F172A", display: "flex", alignItems: "center", gap: "6px" }}><Zap size={16} color="#2563EB" /> {r.action}</strong></td>
                      <td style={{ fontSize: "0.85rem", color: "#64748B" }}>{r.reason}</td>
                      <td>
                        <button 
                          className="btn-clean btn-primary" 
                          style={{ padding: "6px 12px", fontSize: "0.78rem", whiteSpace: "nowrap" }}
                          onClick={() => onExecuteIntervention(r.id, r.action, "THERMAL_OVERRIDE")}
                        >
                          ⚡ Apply Now
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTableTab === "alerts" && (
          <div className="table-responsive">
            <table className="table-clean">
              <thead>
                <tr>
                  <th>Shipment ID</th>
                  <th>Food Product</th>
                  <th>Severity</th>
                  <th>Excursion / Spoilage Alarm Description</th>
                </tr>
              </thead>
              <tbody>
                {allAlerts.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", padding: "30px", color: "#059669", fontWeight: 700 }}>
                      ✅ No active thermal excursions or food safety alarms.
                    </td>
                  </tr>
                ) : (
                  allAlerts.map((a, idx) => (
                    <tr key={`${a.id}-${idx}`}>
                      <td><strong style={{ color: "#2563EB" }}>{a.id}</strong></td>
                      <td>{a.product}</td>
                      <td><span className={`status-badge ${a.sev === "CRITICAL" ? "badge-critical" : "badge-warning"}`}>{a.sev}</span></td>
                      <td style={{ color: "#E11D48", fontWeight: 600 }}>⚠️ {a.text}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
