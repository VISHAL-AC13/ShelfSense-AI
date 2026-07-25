// src/components/Sidebar.jsx
import React from "react";
import { 
  LayoutDashboard, 
  PlusCircle, 
  Activity, 
  BrainCircuit, 
  Navigation, 
  FileText, 
  ShieldCheck,
  Apple,
  Zap,
  X
} from "lucide-react";

export default function Sidebar({ activeTab, setActiveTab, shipmentsCount, alertsCount, activeInterventions, mobileMenuOpen, onCloseMobile }) {
  const navItems = [
    { id: "dashboard", label: "Fleet Dashboard", icon: LayoutDashboard },
    { id: "register", label: "Register Shipment", icon: PlusCircle },
    { id: "live", label: "Live Monitoring", icon: Activity, badge: alertsCount > 0 ? `${alertsCount} !` : null },
    { id: "ai", label: "Timely Interventions", icon: Zap, badge: activeInterventions > 0 ? `${activeInterventions} Active` : null },
    { id: "gps", label: "GPS Route Tracking", icon: Navigation },
    { id: "reports", label: "HACCP Audit Export", icon: FileText }
  ];

  return (
    <aside className={`sidebar ${mobileMenuOpen ? "mobile-open" : ""}`}>
      <div className="sidebar-header" style={{ justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div className="logo-icon" style={{ background: "#2563EB" }}>
            <Zap size={22} color="white" />
          </div>
          <div>
            <div className="sidebar-brand-title">ShelfSense AI</div>
            <div className="sidebar-brand-sub" style={{ color: "#2563EB", fontWeight: 600 }}>Tamil Nadu Cold Chain</div>
          </div>
        </div>
        {onCloseMobile && (
          <button 
            className="mobile-close-btn" 
            onClick={onCloseMobile}
            style={{ background: "transparent", border: "none", cursor: "pointer", color: "#64748B", display: "none" }}
          >
            <X size={22} />
          </button>
        )}
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              <div className="nav-item-left">
                <Icon size={19} color={isActive ? "#2563EB" : "#64748B"} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="nav-badge" style={{ 
                  background: item.badge.includes("Active") ? "#DBEAFE" : (alertsCount > 0 ? "#FEE2E2" : "#F1F5F9"), 
                  color: item.badge.includes("Active") ? "#1D4ED8" : (alertsCount > 0 ? "#DC2626" : "#475569") 
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", background: "#F8FAFC", borderRadius: "10px", border: "1px solid #E2E8F0", marginBottom: "12px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#2563EB", color: "white", display: "flex", alignItems: "center", justify: "center", fontWeight: 700, fontSize: "0.9rem" }}>V</div>
          <div>
            <div style={{ fontWeight: 700, color: "#0F172A", fontSize: "0.85rem" }}>Vishal</div>
            <div style={{ fontSize: "0.72rem", color: "#64748B" }}>Senior Logistics Officer</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.78rem", color: "#475569", fontWeight: 500 }}>
          <ShieldCheck size={16} color="#059669" />
          <span>Tamil Nadu Hubs Verified</span>
        </div>
      </div>
    </aside>
  );
}
