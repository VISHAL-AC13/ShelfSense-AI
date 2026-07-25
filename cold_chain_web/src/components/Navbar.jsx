// src/components/Navbar.jsx
import React from "react";
import { Sparkles, Shield, Clock, Zap, RefreshCw, Menu } from "lucide-react";

export default function Navbar({ activeTab, activeInterventions, onResetDemo, onToggleMobile }) {
  const getTitle = () => {
    switch (activeTab) {
      case "dashboard": return "Tamil Nadu Agri-Food Fleet Dashboard & Timely Intervention Center";
      case "register": return "Register New Perishable Food Consignment (TN Hubs)";
      case "live": return "Real-Time 9-Zone Thermal Array & Automated TN Intervention Deck";
      case "ai": return "Timely Intervention & AI Prescriptive Recommendation System";
      case "gps": return "Live GPS Route Trajectory & Remaining Shelf-Life Telemetry (TN Map)";
      case "reports": return "Quality Assurance & FSSAI / HACCP Regulatory Audit Export";
      default: return "Tamil Nadu Timely Intervention & Recommendation System";
    }
  };

  return (
    <header className="navbar" style={{ background: "#FFFFFF", borderBottom: "1px solid #E2E8F0", padding: "0 32px", minHeight: "70px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {onToggleMobile && (
          <button 
            className="mobile-menu-btn" 
            onClick={onToggleMobile}
            style={{ background: "#F1F5F9", border: "1px solid #CBD5E1", borderRadius: "8px", padding: "8px", cursor: "pointer", color: "#334155", display: "none" }}
          >
            <Menu size={20} />
          </button>
        )}
        <div className="navbar-title" style={{ fontWeight: 600, color: "#0F172A", fontSize: "1.05rem", display: "flex", alignItems: "center", gap: "8px" }}>
          <Zap size={18} color="#2563EB" />
          <span className="navbar-title-text">{getTitle()}</span>
        </div>
      </div>

      <div className="navbar-right-controls" style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.85rem", color: "#475569", fontWeight: 500, flexWrap: "wrap" }}>
        {onResetDemo && (
          <button 
            onClick={onResetDemo}
            className="btn-clean"
            style={{ 
              padding: "6px 14px", 
              fontSize: "0.82rem", 
              display: "flex", 
              alignItems: "center", 
              gap: "6px",
              border: "1px solid #CBD5E1",
              background: "#F8FAFC",
              color: "#334155",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 500
            }}
            title="Restore all 5 default Tamil Nadu Agri-Food consignments and reset map coordinates"
          >
            <RefreshCw size={13} color="#64748B" />
            <span>Reset TN Demo Data</span>
          </button>
        )}

        {activeInterventions > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#EFF6FF", color: "#1D4ED8", padding: "6px 12px", borderRadius: "6px", border: "1px solid #BFDBFE", fontWeight: 600 }}>
            <Zap size={14} color="#2563EB" />
            <span>{activeInterventions} Active Interventions</span>
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#F1F5F9", padding: "6px 12px", borderRadius: "6px", color: "#334155" }}>
          <Shield size={14} color="#059669" />
          <span>Automated Recovery: Enabled</span>
        </div>
      </div>
    </header>
  );
}
