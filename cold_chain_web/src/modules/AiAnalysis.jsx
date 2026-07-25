// src/modules/AiAnalysis.jsx
import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { BrainCircuit, ShieldAlert, HeartPulse, Rocket, CheckCircle2, AlertTriangle, Cpu, FileText, Apple, Zap } from "lucide-react";
import { predictTransportRisk, evaluateSpoilageRisk, calculateHealthScore, generateRecommendations } from "../utils/aiEngines";

export default function AiAnalysis({ shipments, onExecuteIntervention }) {
  const [selectedId, setSelectedId] = useState(shipments[0]?.shipment_id || "");
  const shipment = shipments.find((s) => s.shipment_id === selectedId) || shipments[0];

  if (!shipment) return <div style={{ color: "#0F172A" }}>No perishable consignments available.</div>;

  const transRisk = predictTransportRisk(shipment);
  const spoilRisk = evaluateSpoilageRisk(shipment);
  const healthScore = calculateHealthScore(shipment, spoilRisk);
  const recs = generateRecommendations(shipment, transRisk, spoilRisk, healthScore);

  const healthDonutData = {
    labels: ["Freshness Index (%)", "Degraded (%)"],
    datasets: [
      {
        data: [healthScore, 100 - healthScore],
        backgroundColor: [
          healthScore >= 85 ? "#059669" : healthScore >= 70 ? "#D97706" : "#E11D48",
          "#F1F5F9"
        ],
        borderColor: "#FFFFFF",
        borderWidth: 2
      }
    ]
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "75%",
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    }
  };

  const transBadge = transRisk.risk_level === "HIGH" ? "badge-critical" : transRisk.risk_level === "MEDIUM" ? "badge-warning" : "badge-nominal";
  const spoilBadge = spoilRisk.spoilage_risk === "HIGH" ? "badge-critical" : spoilRisk.spoilage_risk === "MEDIUM" ? "badge-warning" : "badge-nominal";
  const scoreColor = spoilRisk.risk_score >= 6.5 ? "#E11D48" : spoilRisk.risk_score >= 3.2 ? "#D97706" : "#059669";

  return (
    <div>
      {/* Top Bar Selector */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", color: "#0F172A", display: "flex", alignItems: "center", gap: "10px" }}>
            <Zap color="#2563EB" /> Timely Intervention & AI Prescriptive Recommendation Engine
          </h2>
          <p style={{ color: "#64748B", fontSize: "0.9rem", marginTop: "4px" }}>
            Automated decision support heuristics, Spoilage severity scoring, and 1-click timely interventions to salvage produce shelf-life.
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
                {s.shipment_id} // {s.product}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Prominent Predicted Spoilage Banner */}
      <div className="clean-card" style={{ background: "#F8FAFC", border: `2px solid ${scoreColor}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <ShieldAlert size={36} color={scoreColor} />
          <div>
            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>
              Primary AI Prediction // Manifest #{shipment.shipment_id}
            </div>
            <h3 style={{ fontSize: "1.4rem", color: "#0F172A", margin: "4px 0" }}>
              Predicted Spoilage Risk Score: <span style={{ color: scoreColor }}>{spoilRisk.risk_score} / 10</span> ({spoilRisk.spoilage_risk} SEVERITY)
            </h3>
            <p style={{ fontSize: "0.92rem", color: "#475569" }}>
              <strong>AI Assessment:</strong> {spoilRisk.reasons[0] || "All food preservation parameters are strictly within nominal tolerances."}
            </p>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <span className={`status-badge ${spoilBadge}`} style={{ fontSize: "1rem", padding: "8px 16px" }}>
            {spoilRisk.spoilage_risk} SPOILAGE RISK
          </span>
        </div>
      </div>

      {/* 3 AI Intelligence Cards Row */}
      <div className="grid-cols-3">
        {/* Card 1: Transport ML Risk */}
        <div className="clean-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", marginBottom: 0 }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>
                1. Logistics Delay & Hazard ML
              </span>
              <Cpu size={18} color="#2563EB" />
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "16px" }}>
              <span className={`status-badge ${transBadge}`} style={{ fontSize: "0.95rem", padding: "6px 14px" }}>
                {transRisk.risk_level} RISK
              </span>
              <span style={{ fontSize: "0.85rem", color: "#64748B" }}>
                Conf: {transRisk.confidence}%
              </span>
            </div>
            <p style={{ fontSize: "0.82rem", color: "#475569", marginBottom: "16px" }}>
              Evaluates highway transit delays, door openings, and ambient thermal drift to output ML probabilities:
            </p>
          </div>
          <div>
            <div style={{ marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", marginBottom: "4px" }}>
                <span style={{ color: "#059669", fontWeight: 600 }}>LOW Probability</span>
                <strong>{transRisk.probabilities.LOW}%</strong>
              </div>
              <div style={{ width: "100%", height: "6px", background: "#F1F5F9", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ width: `${transRisk.probabilities.LOW}%`, height: "100%", background: "#059669" }}></div>
              </div>
            </div>
            <div style={{ marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", marginBottom: "4px" }}>
                <span style={{ color: "#D97706", fontWeight: 600 }}>MEDIUM Probability</span>
                <strong>{transRisk.probabilities.MEDIUM}%</strong>
              </div>
              <div style={{ width: "100%", height: "6px", background: "#F1F5F9", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ width: `${transRisk.probabilities.MEDIUM}%`, height: "100%", background: "#D97706" }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", marginBottom: "4px" }}>
                <span style={{ color: "#E11D48", fontWeight: 600 }}>HIGH Probability</span>
                <strong>{transRisk.probabilities.HIGH}%</strong>
              </div>
              <div style={{ width: "100%", height: "6px", background: "#F1F5F9", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ width: `${transRisk.probabilities.HIGH}%`, height: "100%", background: "#E11D48" }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Spoilage Rule Engine */}
        <div className="clean-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", marginBottom: 0 }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>
                2. Biological Decay & Shelf-Life
              </span>
              <ShieldAlert size={18} color="#D97706" />
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "16px" }}>
              <span className={`status-badge ${spoilBadge}`} style={{ fontSize: "0.95rem", padding: "6px 14px" }}>
                {spoilRisk.spoilage_risk} SEVERITY
              </span>
              <span style={{ fontSize: "1.2rem", fontWeight: 800, color: scoreColor }}>
                Score: {spoilRisk.risk_score} / 10
              </span>
            </div>
            <p style={{ fontSize: "0.82rem", color: "#475569", marginBottom: "16px" }}>
              Evaluates multi-zone temperature compliance, condensation risk, and microbial growth heuristics.
            </p>
          </div>
          <div style={{ background: "#F8FAFC", padding: "12px 14px", borderRadius: "10px", border: "1px solid #E2E8F0" }}>
            <div style={{ fontSize: "0.75rem", color: "#64748B", textTransform: "uppercase", marginBottom: "4px" }}>Primary Safety Trigger:</div>
            <div style={{ fontSize: "0.85rem", color: "#0F172A", fontWeight: 600 }}>
              {spoilRisk.reasons[0] || "Strictly nominal."}
            </div>
          </div>
        </div>

        {/* Card 3: Health Gauge */}
        <div className="clean-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", textAlign: "center", marginBottom: 0 }}>
          <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>
              3. Produce Freshness Index
            </span>
            <HeartPulse size={18} color="#059669" />
          </div>
          <div style={{ position: "relative", width: "170px", height: "170px", margin: "10px 0" }}>
            <Doughnut data={healthDonutData} options={donutOptions} />
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "2.1rem", fontWeight: 900, color: "#0F172A" }}>
                {healthScore}%
              </div>
              <div style={{ fontSize: "0.72rem", color: "#64748B", textTransform: "uppercase" }}>Freshness</div>
            </div>
          </div>
          <div style={{ fontSize: "0.85rem", color: healthScore >= 85 ? "#059669" : healthScore >= 70 ? "#D97706" : "#E11D48", fontWeight: 700 }}>
            {healthScore >= 85 ? "🟢 Prime Produce Quality & Shelf-Life" : healthScore >= 70 ? "🟡 Moderate Operational Stress" : "🔴 Critical Quality Degradation"}
          </div>
        </div>
      </div>

      {/* Explainability Box */}
      <div className="clean-card" style={{ background: "#FFFFFF", border: "1px solid #CBD5E1", marginTop: "24px" }}>
        <h4 style={{ fontSize: "1.1rem", color: "#2563EB", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
          <FileText size={18} /> AI Explainability Engine — Why Was This Spoilage Score Predicted?
        </h4>
        <p style={{ fontSize: "0.9rem", color: "#475569", marginBottom: "16px" }}>
          The decision support rules engine evaluated telemetry for <strong style={{ color: "#2563EB" }}>{shipment.shipment_id}</strong> against the <strong style={{ color: "#0F172A" }}>{shipment.storage_type}</strong> food preservation protocol and logged the following diagnostic reasons:
        </p>
        <ul style={{ listStyle: "none", paddingLeft: "10px" }}>
          {spoilRisk.reasons.map((reason, idx) => (
            <li key={idx} style={{ marginBottom: "10px", display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "0.92rem", color: "#0F172A" }}>
              <span style={{ color: spoilRisk.risk_score >= 3.2 ? "#E11D48" : "#059669", fontSize: "1.1rem", fontWeight: 800 }}>
                {spoilRisk.risk_score >= 3.2 ? "▸" : "✓"}
              </span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ⚡ PRESCRIPTIVE TIMELY INTERVENTIONS WITH 1-CLICK EXECUTION */}
      <h3 style={{ margin: "28px 0 16px 0", fontSize: "1.25rem", color: "#0F172A", display: "flex", alignItems: "center", gap: "8px" }}>
        <Zap color="#2563EB" /> Prescriptive Timely Interventions & Automated Execution
      </h3>
      <div className="grid-cols-2">
        {recs.map((r, idx) => {
          const borderClass = r.priority === "CRITICAL" ? "#FCA5A5" : r.priority === "HIGH" ? "#FDE68A" : "#A7F3D0";
          const bgClass = r.priority === "CRITICAL" ? "#FFF1F2" : r.priority === "HIGH" ? "#FFFBEB" : "#ECFDF5";

          return (
            <div key={idx} className="clean-card" style={{ background: bgClass, border: `1px solid ${borderClass}`, marginBottom: 0, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <span className={`status-badge ${r.priority === "CRITICAL" ? "badge-critical" : r.priority === "HIGH" ? "badge-warning" : "badge-nominal"}`}>
                    PRIORITY: {r.priority}
                  </span>
                  <span style={{ fontSize: "0.78rem", color: "#64748B", fontWeight: 600 }}>Intervention #{idx + 1}</span>
                </div>
                <h4 style={{ fontSize: "1.15rem", color: "#0F172A", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Rocket size={18} color="#2563EB" /> {r.action}
                </h4>
                <p style={{ fontSize: "0.88rem", color: "#475569", marginBottom: "16px" }}>
                  <strong>AI Diagnostic Rationale:</strong> {r.reason}
                </p>
              </div>
              <div style={{ borderTop: `1px solid ${borderClass}`, paddingTop: "12px", textAlign: "right" }}>
                <button 
                  className="btn-clean btn-primary" 
                  style={{ padding: "8px 16px", fontSize: "0.85rem", background: r.priority === "CRITICAL" ? "#E11D48" : r.priority === "HIGH" ? "#D97706" : "#059669" }}
                  onClick={() => onExecuteIntervention(shipment.shipment_id, r.action, "THERMAL_OVERRIDE")}
                >
                  ⚡ Execute Automated Intervention
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
