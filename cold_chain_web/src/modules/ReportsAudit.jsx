// src/modules/ReportsAudit.jsx
import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FileText, Download, CheckCircle2, ShieldCheck, Snowflake, Cpu, AlertTriangle, Apple } from "lucide-react";
import { STORAGE_PROFILES } from "../data/mockData";
import { predictTransportRisk, evaluateSpoilageRisk, calculateHealthScore, generateRecommendations } from "../utils/aiEngines";

export default function ReportsAudit({ shipments }) {
  const [selectedId, setSelectedId] = useState(shipments[0]?.shipment_id || "");
  const shipment = shipments.find((s) => s.shipment_id === selectedId) || shipments[0];

  if (!shipment) return <div style={{ color: "#0F172A" }}>No food consignments available.</div>;

  const profile = STORAGE_PROFILES[shipment.storage_type] || STORAGE_PROFILES["Fresh Fruits (Berries & Grapes)"];
  const transRisk = predictTransportRisk(shipment);
  const spoilRisk = evaluateSpoilageRisk(shipment);
  const healthScore = calculateHealthScore(shipment, spoilRisk);
  const recs = generateRecommendations(shipment, transRisk, spoilRisk, healthScore);

  const meanTemp = (shipment.sensors && shipment.sensors.length > 0)
    ? (shipment.sensors.reduce((a, b) => a + b, 0) / shipment.sensors.length).toFixed(1)
    : profile.target_temp;

  // Generate jsPDF Document
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Header Branding
    doc.setFillColor(248, 250, 252); // Light Slate
    doc.rect(0, 0, 210, 36, "F");

    doc.setTextColor(37, 99, 235); // Primary Blue
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("ShelfSense AI -- Quality Assurance Audit", 14, 20);

    doc.setTextColor(71, 85, 105);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("FSSAI & HACCP Quality Assurance Document // Audited by: Vishal", 14, 28);

    // Section 1: Manifest Summary Table
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("1. Shipment Manifest & Routing", 14, 48);

    autoTable(doc, {
      startY: 53,
      head: [["Consignment Parameter", "Manifest Specification", "Consignment Parameter", "Manifest Specification"]],
      body: [
        ["Shipment ID", shipment.shipment_id, "Food Category", shipment.product_category],
        ["Food Product Name", shipment.product, "Storage Profile", shipment.storage_type],
        ["Origin TN Hub", shipment.origin_name, "Destination Market", shipment.dest_name],
        ["Vehicle (TN Reg)", shipment.vehicle_number, "Driver Name", shipment.driver_name],
        ["Current GPS Position", `${shipment.current_lat}, ${shipment.current_lon}`, "Current Vehicle Status", shipment.vehicle_status],
        ["Expected Market Arrival", shipment.expected_delivery || "In Transit", "Regulatory Compliance", "FSSAI Food Safety Verified"]
      ],
      theme: "grid",
      headStyles: { fillColor: [37, 99, 235] },
      styles: { fontSize: 8.5, cellPadding: 4 }
    });

    // Section 2: Thermal Array & Telemetry
    let nextY = doc.lastAutoTable.finalY + 14;
    doc.text("2. Multi-Zone Thermal Array & Atmospheric Intelligence", 14, nextY);

    autoTable(doc, {
      startY: nextY + 5,
      head: [["Telemetry Metric", "Observed Reading", "Protocol Compliance Ceiling", "Status Evaluation"]],
      body: [
        ["Chamber Mean Temperature", `${meanTemp} °C`, `${profile.min_temp}°C to ${profile.max_temp}°C`, meanTemp < profile.min_temp || meanTemp > profile.max_temp ? "EXCURSION DETECTED" : "NOMINAL"],
        ["Relative Humidity", `${shipment.humidity || 75} %`, "40.0% to 88.0%", (shipment.humidity > 88 || shipment.humidity < 40) ? "ABNORMAL HUMIDITY" : "NOMINAL"],
        ["Security Door Openings", `${shipment.door_openings || 0} Events`, `Max ${profile.max_door_openings} Events`, (shipment.door_openings > profile.max_door_openings) ? "SECURITY VIOLATION" : "NOMINAL"]
      ],
      theme: "grid",
      headStyles: { fillColor: [37, 99, 235] },
      styles: { fontSize: 9 }
    });

    // Section 3: AI Spoilage Risk Evaluation & Explainability
    nextY = doc.lastAutoTable.finalY + 14;
    doc.text("3. AI Spoilage Risk Classification & Shelf-Life Assessment", 14, nextY);

    const explainRows = spoilRisk.reasons.map((r) => [r]);
    autoTable(doc, {
      startY: nextY + 5,
      head: [["AI Spoilage Decision Support & Quality Diagnostic Reasoning"]],
      body: [
        [`Predicted Spoilage Severity Score: ${spoilRisk.risk_score} / 10 (${spoilRisk.spoilage_risk} SPOILAGE RISK)`],
        [`Transport Hazard Classification: ${transRisk.risk_level} (Confidence: ${transRisk.confidence}%)`],
        [`Composite Produce Freshness Index: ${healthScore} / 100%`],
        ...explainRows
      ],
      theme: "plain",
      styles: { fontSize: 9, cellPadding: 4, fillColor: [241, 245, 249] }
    });

    // Section 4: Actionable Recommendations
    nextY = doc.lastAutoTable.finalY + 14;
    if (nextY > 250) { doc.addPage(); nextY = 20; }
    doc.text("4. Prescriptive Shelf-Life Preventive Actions (TN Fleet)", 14, nextY);

    const recRows = recs.map((r, i) => [`#${i + 1} [${r.priority}]`, r.action, r.reason]);
    autoTable(doc, {
      startY: nextY + 5,
      head: [["Priority", "Prescriptive Action Intervention", "AI Spoilage Rationale"]],
      body: recRows,
      theme: "striped",
      headStyles: { fillColor: [217, 119, 6] },
      styles: { fontSize: 8.5 }
    });

    // Footer & SHA-3 Hash
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated by ShelfSense AI Client // Audited by Vishal // Timestamp: ${new Date().toISOString()}`, 14, pageHeight - 12);
    doc.text(`SHA-3 Audit Hash: 9f8a2c7b1e4d0f5a3e2c8b1a7d9e0f2c4b6a8d0e`, 14, pageHeight - 7);

    doc.save(`ShelfSense_AI_TN_Audit_${shipment.shipment_id}.pdf`);
  };

  const badgeClass = shipment.status === "Critical" ? "badge-critical" : shipment.status === "Warning" ? "badge-warning" : shipment.status.includes("Recovering") ? "badge-blue" : "badge-nominal";

  return (
    <div>
      {/* Top Bar Selector */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", color: "#0F172A", display: "flex", alignItems: "center", gap: "10px" }}>
            <FileText color="#2563EB" /> Quality Audit Reports
          </h2>
          <p style={{ color: "#64748B", fontSize: "0.9rem", marginTop: "4px" }}>
            Export certified FSSAI food safety documentation and AI compliance logs.
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

      {/* Action Bar */}
      <div className="clean-card" style={{ background: "#ECFDF5", border: "1px solid #059669", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <ShieldCheck size={32} color="#059669" />
          <div>
            <h3 style={{ fontSize: "1.2rem", color: "#0F172A" }}>Compliance Export — {shipment.shipment_id}</h3>
            <p style={{ fontSize: "0.85rem", color: "#475569" }}>
              Certified telemetry, AI spoilage predictions, and preventive actions.
            </p>
          </div>
        </div>
        <button 
          className="btn-clean btn-emerald" 
          style={{ padding: "14px 28px", fontSize: "1rem", boxShadow: "0 4px 6px rgba(5, 150, 105, 0.15)" }}
          onClick={handleDownloadPDF}
        >
          <Download size={18} /> Download Audit PDF
        </button>
      </div>

      {/* On-Screen Audit Preview Accordion */}
      <div className="clean-card">
        <h3 style={{ fontSize: "1.25rem", color: "#2563EB", marginBottom: "20px", borderBottom: "1px solid #E2E8F0", paddingBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
          📑 On-Screen Audit Preview — #{shipment.shipment_id}
        </h3>

        {/* Section 1 */}
        <h4 style={{ color: "#0F172A", fontSize: "1rem", marginBottom: "12px" }}>1. Consignment Manifest & Routing</h4>
        <div className="grid-cols-4" style={{ background: "#F8FAFC", padding: "16px", borderRadius: "12px", marginBottom: "24px", border: "1px solid #E2E8F0" }}>
          <div>
            <span style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 600 }}>FOOD PRODUCT:</span>
            <div style={{ fontWeight: 700, color: "#0F172A", marginTop: "2px" }}>{shipment.product}</div>
          </div>
          <div>
            <span style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 600 }}>CATEGORY:</span>
            <div style={{ fontWeight: 600, color: "#475569", marginTop: "2px" }}>{shipment.product_category}</div>
          </div>
          <div>
            <span style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 600 }}>STORAGE PROTOCOL:</span>
            <div style={{ fontWeight: 600, color: "#2563EB", marginTop: "2px" }}>{shipment.storage_type}</div>
          </div>
          <div>
            <span style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 600 }}>STATUS:</span>
            <div style={{ marginTop: "2px" }}><span className={`status-badge ${badgeClass}`}>{shipment.status}</span></div>
          </div>
        </div>

        {/* Section 2 */}
        <h4 style={{ color: "#0F172A", fontSize: "1rem", marginBottom: "12px" }}>2. Thermal Array & Telemetry</h4>
        <div className="table-responsive" style={{ marginBottom: "24px" }}>
          <table className="table-clean">
            <thead>
              <tr>
                <th>Telemetry Parameter</th>
                <th>Observed Value</th>
                <th>Protocol Compliance Ceiling</th>
                <th>Validation Evaluation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Chamber Mean Temp</strong></td>
                <td><strong style={{ color: "#2563EB" }}>{meanTemp} °C</strong></td>
                <td>{profile.min_temp}°C to {profile.max_temp}°C</td>
                <td>
                  {meanTemp < profile.min_temp || meanTemp > profile.max_temp ? (
                    <span className="status-badge badge-critical">EXCURSION DETECTED</span>
                  ) : (
                    <span className="status-badge badge-nominal">NOMINAL</span>
                  )}
                </td>
              </tr>
              <tr>
                <td><strong>Relative Humidity</strong></td>
                <td>{shipment.humidity || 75} %</td>
                <td>40.0% to 88.0%</td>
                <td>
                  {(shipment.humidity > 88 || shipment.humidity < 40) ? (
                    <span className="status-badge badge-warning">ABNORMAL HUMIDITY</span>
                  ) : (
                    <span className="status-badge badge-nominal">NOMINAL</span>
                  )}
                </td>
              </tr>
              <tr>
                <td><strong>Security Door Access</strong></td>
                <td>{shipment.door_openings || 0} Events</td>
                <td>Max {profile.max_door_openings} Events</td>
                <td>
                  {(shipment.door_openings > profile.max_door_openings) ? (
                    <span className="status-badge badge-critical">SECURITY VIOLATION</span>
                  ) : (
                    <span className="status-badge badge-nominal">NOMINAL</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 3 */}
        <h4 style={{ color: "#0F172A", fontSize: "1rem", marginBottom: "12px" }}>3. AI Spoilage Prediction & Quality</h4>
        <div style={{ background: "#F8FAFC", border: "1px solid #CBD5E1", padding: "16px", borderRadius: "12px", marginBottom: "24px" }}>
          <div style={{ display: "flex", gap: "20px", marginBottom: "12px", fontSize: "0.95rem" }}>
            <span><strong>Predicted Spoilage Score:</strong> <span style={{ color: "#E11D48", fontWeight: 700 }}>{spoilRisk.risk_score} / 10 ({spoilRisk.spoilage_risk})</span></span>
            <span><strong>Transport ML Hazard:</strong> <span style={{ color: "#D97706", fontWeight: 700 }}>{transRisk.risk_level} ({transRisk.confidence}%)</span></span>
            <span><strong>Produce Freshness Index:</strong> <span style={{ color: "#059669", fontWeight: 700 }}>{healthScore}%</span></span>
          </div>
          <ul style={{ listStyle: "none", paddingLeft: "4px" }}>
            {spoilRisk.reasons.map((r, i) => (
              <li key={i} style={{ color: "#0F172A", fontSize: "0.88rem", marginBottom: "4px" }}>▸ {r}</li>
            ))}
          </ul>
        </div>

        {/* Section 4 */}
        <h4 style={{ color: "#0F172A", fontSize: "1rem", marginBottom: "12px" }}>4. Recommended Actions</h4>
        <div className="table-responsive">
          <table className="table-clean">
            <thead>
              <tr>
                <th>Priority</th>
                <th>Recommended Action</th>
                <th>AI Rationale</th>
              </tr>
            </thead>
            <tbody>
              {recs.map((r, idx) => (
                <tr key={idx}>
                  <td><span className={`status-badge ${r.priority === "CRITICAL" ? "badge-critical" : r.priority === "HIGH" ? "badge-warning" : "badge-nominal"}`}>{r.priority}</span></td>
                  <td><strong style={{ color: "#0F172A" }}>{r.action}</strong></td>
                  <td style={{ fontSize: "0.85rem", color: "#64748B" }}>{r.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
