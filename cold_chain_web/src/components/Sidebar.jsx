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
  X,
  LogOut
} from "lucide-react";

export default function Sidebar({ activeTab, setActiveTab, shipmentsCount, alertsCount, activeInterventions, mobileMenuOpen, onCloseMobile, currentUser, onLogout }) {
  const navItems = [
    { id: "dashboard", label: "Fleet Dashboard", icon: LayoutDashboard },
    { id: "register", label: "Register Shipment", icon: PlusCircle },
    { id: "live", label: "Live Monitoring", icon: Activity, badge: alertsCount > 0 ? `${alertsCount} !` : null },
    { id: "ai", label: "AI Analysis", icon: BrainCircuit, badge: activeInterventions > 0 ? `${activeInterventions} Active` : null },
    { id: "gps", label: "GPS Tracking", icon: Navigation },
    { id: "reports", label: "Quality Audit", icon: FileText }
  ];

  return (
    <aside className={`sidebar ${mobileMenuOpen ? "mobile-open" : ""}`}>
      <div className="sidebar-header">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div className="logo-icon" style={{ background: "#2563EB", padding: "8px", borderRadius: "10px", display: "flex", alignItems: "center", justify: "center" }}>
            <Apple size={22} color="white" />
          </div>
          <div>
            <div className="logo-title" style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0F172A", letterSpacing: "-0.5px" }}>
              ShelfSense <span style={{ color: "#2563EB" }}>AI</span>
            </div>
            <div className="logo-subtitle" style={{ fontSize: "0.72rem", color: "#64748B", fontWeight: 600 }}>
              TN Cold-Chain Deck
            </div>
          </div>
        </div>
        <button className="mobile-close-btn" onClick={onCloseMobile}>
          <X size={24} />
        </button>
      </div>

      <nav className="sidebar-nav">
        <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", padding: "0 12px", marginBottom: "8px" }}>
          Logistics Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Icon size={19} color={isActive ? "#2563EB" : "#64748B"} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="badge" style={{ 
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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px", background: "#F8FAFC", borderRadius: "10px", border: "1px solid #E2E8F0", marginBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", overflow: "hidden" }}>
            <div style={{ minWidth: "32px", width: "32px", height: "32px", borderRadius: "50%", background: "#2563EB", color: "white", display: "flex", alignItems: "center", justify: "center", fontWeight: 700, fontSize: "0.9rem" }}>
              {currentUser?.name ? currentUser.name[0] : "V"}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontWeight: 700, color: "#0F172A", fontSize: "0.85rem", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                {currentUser?.name || "Vishal"}
              </div>
              <div style={{ fontSize: "0.7rem", color: "#64748B", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                {currentUser?.role || "Quality Admin"}
              </div>
            </div>
          </div>
          {onLogout && (
            <button 
              onClick={onLogout}
              title="Sign Out of Demo Session"
              style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer", padding: "4px", borderRadius: "6px", display: "flex", alignItems: "center" }}
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.78rem", color: "#475569", fontWeight: 500 }}>
          <ShieldCheck size={16} color="#059669" />
          <span>Tamil Nadu Hubs Verified</span>
        </div>
      </div>
    </aside>
  );
}
