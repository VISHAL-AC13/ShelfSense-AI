// src/App.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./modules/Dashboard";
import RegisterShipment from "./modules/RegisterShipment";
import LiveMonitoring from "./modules/LiveMonitoring";
import AiAnalysis from "./modules/AiAnalysis";
import GpsTracking from "./modules/GpsTracking";
import ReportsAudit from "./modules/ReportsAudit";
import LoginPage from "./components/LoginPage";
import { INITIAL_SHIPMENTS, STORAGE_PROFILES } from "./data/mockData";
import { 
  fetchShipments, 
  registerShipmentApi, 
  updateTelemetryApi, 
  executeInterventionApi, 
  resetDemoApi 
} from "./services/api";
import "./App.css";

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("aether_tn_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (err) {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shipments, setShipments] = useState(() => {
    try {
      const saved = localStorage.getItem("aether_tn_shipments_v3");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0 && parsed[0].origin_name && parsed[0].origin_name.includes("TN")) {
          return parsed;
        }
      }
    } catch (err) {
      console.error("Failed to load shipments from localStorage:", err);
    }
    return INITIAL_SHIPMENTS;
  });

  const [selectedId, setSelectedId] = useState(shipments[0]?.shipment_id || INITIAL_SHIPMENTS[0].shipment_id);
  const [toastMsg, setToastMsg] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("aether_tn_shipments_v3", JSON.stringify(shipments));
    } catch (err) {
      console.error("Failed to save shipments to localStorage:", err);
    }
  }, [shipments]);

  // Fetch initial state from Python Backend SQLite DB when mounted
  useEffect(() => {
    fetchShipments()
      .then((backendData) => {
        if (backendData && backendData.length > 0) {
          setShipments(backendData);
          if (!selectedId) setSelectedId(backendData[0].shipment_id);
          console.log("[OK] Connected to Python Flask Backend & SQLite DB");
        }
      })
      .catch((err) => {
        console.warn("Python backend offline or unreachable. Using local standalone state:", err.message);
      });
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 4500);
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem("aether_tn_user", JSON.stringify(user));
    } catch (err) {}
    showToast(`Welcome, ${user.name} (${user.role})!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem("aether_tn_user");
    } catch (err) {}
  };

  // Reset to default Tamil Nadu Demo Manifests
  const handleResetDemo = () => {
    localStorage.removeItem("aether_tn_shipments_v3");
    localStorage.removeItem("aether_food_shipments");
    setShipments(INITIAL_SHIPMENTS);
    setSelectedId(INITIAL_SHIPMENTS[0].shipment_id);
    showToast("All 5 Tamil Nadu Agri-Food Consignments & GPS Maps restored to default.");

    // Call Python backend reset
    resetDemoApi()
      .then((res) => {
        if (res.shipments) setShipments(res.shipments);
      })
      .catch(() => {});
  };

  // Handle registering new consignment
  const handleRegisterShipment = (newShipment) => {
    setShipments((prev) => [newShipment, ...prev]);
    setSelectedId(newShipment.shipment_id);
    showToast(`Consignment ${newShipment.shipment_id} registered. 9-Zone thermal array active.`);

    // Persist to Python backend
    registerShipmentApi(newShipment)
      .then((saved) => {
        if (saved) {
          setShipments((prev) => prev.map((s) => s.shipment_id === saved.shipment_id ? saved : s));
        }
      })
      .catch(() => {});
  };

  // Handle Timely Intervention Execution (The core solution with dynamic GPS rerouting!)
  const handleExecuteIntervention = (id, interventionTitle, interventionType = "THERMAL_OVERRIDE") => {
    // Optimistic local update with GPS depot rerouting
    setShipments((prev) =>
      prev.map((s) => {
        if (s.shipment_id !== id) return s;
        const profile = STORAGE_PROFILES[s.storage_type] || STORAGE_PROFILES["Fresh Fruits (Berries & Grapes)"];
        let updatedSensors = [...(s.sensors || Array(9).fill(profile.target_temp))];

        if (interventionType === "THERMAL_OVERRIDE" || interventionType === "EMERGENCY_REROUTE" || interventionTitle.includes("Override") || interventionTitle.includes("Super-Chill")) {
          updatedSensors = updatedSensors.map((val) => {
            const diff = val - profile.target_temp;
            if (Math.abs(diff) > 0.5) return parseFloat((val - (diff * 0.7)).toFixed(1));
            return val;
          });
        }

        const newAlerts = [
          `TIMELY INTERVENTION EXECUTED: ${interventionTitle}. Automated IoT command dispatched to TN truck.`,
          ...(s.alerts || []).filter((a) => !a.includes("CRITICAL FOOD EXCURSION"))
        ];

        let updates = {
          ...s,
          sensors: updatedSensors,
          status: "Recovering -- Override Active",
          vehicle_status: `Intervention Active: ${interventionTitle}`,
          alerts: newAlerts
        };

        // If Emergency Reroute or Route Diversion, instantly change GPS destination coordinates to nearest TN cold depot!
        if (interventionType === "EMERGENCY_REROUTE" || interventionTitle.includes("Reroute") || interventionTitle.includes("Divert") || interventionTitle.includes("Depot")) {
          const depots = [
            { name: "Erode Aavin & Cold Hub, TN", lat: 11.3410, lon: 77.7172 },
            { name: "Salem Steel Plant Road Cold Depot, TN", lat: 11.6643, lon: 78.1460 },
            { name: "Oddanchatram Agri Cold Storage, TN", lat: 10.5015, lon: 77.7479 },
            { name: "Madurai Ring Road Cold Facility, TN", lat: 9.9252, lon: 78.1198 },
            { name: "Coimbatore Ukkadam Cold Terminal, TN", lat: 10.9925, lon: 76.9614 },
            { name: "Koyambedu Logistics Cold Hub, Chennai, TN", lat: 13.0694, lon: 80.1948 }
          ];
          let best = depots[0];
          let minDist = 9999;
          const clat = parseFloat(s.current_lat || 11.0);
          const clon = parseFloat(s.current_lon || 78.0);
          depots.forEach((d) => {
            if (s.origin_name && s.origin_name.includes(d.name.split(" ")[0])) return;
            const dist = Math.hypot(clat - d.lat, clon - d.lon);
            if (dist < minDist) { minDist = dist; best = d; }
          });

          updates.dest_name = best.name;
          updates.dest_lat = best.lat;
          updates.dest_lon = best.lon;
          updates.status = "Recovering -- Rerouted";
          updates.vehicle_status = `Rerouted to ${best.name}`;
        }

        return updates;
      })
    );

    showToast(`Timely Intervention executed on ${id}: ${interventionTitle}. GPS trajectory updated.`);

    // Execute in Python SQLite database
    executeInterventionApi(id, interventionTitle, interventionType)
      .then((updated) => {
        if (updated) {
          setShipments((prev) => prev.map((s) => s.shipment_id === id ? updated : s));
        }
      })
      .catch(() => {});
  };

  // Handle live telemetry simulator update
  const handleUpdateTelemetry = (id, newSensors, newHum, newDoors) => {
    // Optimistic local update
    setShipments((prev) =>
      prev.map((s) => {
        if (s.shipment_id !== id) return s;
        const profile = STORAGE_PROFILES[s.storage_type] || STORAGE_PROFILES["Fresh Fruits (Berries & Grapes)"];
        let newStatus = "Active";
        let newAlerts = [];

        let critCount = 0, warnCount = 0;
        newSensors.forEach((t) => {
          if (t < profile.min_temp - 1.5 || t > profile.max_temp + 1.5) critCount++;
          else if (t < profile.min_temp || t > profile.max_temp) warnCount++;
        });

        if (critCount > 0) {
          newStatus = "Critical";
          newAlerts.push(`CRITICAL FOOD EXCURSION: ${critCount} thermal sensors exceeding protocol safety envelope.`);
        } else if (warnCount > 0) {
          newStatus = "Warning";
          newAlerts.push(`ABNORMAL DRIFT WARNING: ${warnCount} thermal sensors operating outside nominal food target.`);
        }

        if (newDoors > profile.max_door_openings) {
          newStatus = "Critical";
          newAlerts.push(`SECURITY VIOLATION: ${newDoors} unauthorized door access events logged on TN highway.`);
        }

        if (newHum > 88 || newHum < 40) {
          if (newStatus !== "Critical") newStatus = "Warning";
          newAlerts.push(`HUMIDITY ALARM: Relative humidity at ${newHum}% poses produce desiccation or mold rot risk.`);
        }

        if (s.status === "Delivered") newStatus = "Delivered";
        else if (s.status.includes("Recovering") && critCount === 0) newStatus = "Recovering -- Override Active";

        return {
          ...s,
          sensors: newSensors,
          humidity: newHum,
          door_openings: newDoors,
          status: newStatus,
          alerts: newAlerts
        };
      })
    );

    // Update in Python ML engine & SQLite
    updateTelemetryApi(id, newSensors, newHum, newDoors)
      .then((updated) => {
        if (updated) {
          setShipments((prev) => prev.map((s) => s.shipment_id === id ? updated : s));
        }
      })
      .catch(() => {});
  };

  // Count alerts & interventions
  let totalAlerts = 0;
  let activeInterventions = 0;
  shipments.forEach((s) => {
    if (s.status.includes("Recovering") || (s.vehicle_status && s.vehicle_status.includes("Intervention")) || (s.vehicle_status && s.vehicle_status.includes("Rerouted"))) {
      activeInterventions++;
    }
    if (s.status === "Critical" || s.status === "Warning") {
      totalAlerts++;
    }
  });

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="app-layout">
      {/* Clean, professional toast notification without flashy neon colors */}
      {toastMsg && (
        <div style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 9999,
          background: "#0F172A",
          color: "#FFFFFF",
          padding: "14px 20px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(15, 23, 42, 0.15)",
          borderLeft: "4px solid #2563EB",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontWeight: 500,
          fontSize: "0.9rem",
          animation: "slideIn 0.25s ease"
        }}>
          <span style={{ color: "#3B82F6", fontWeight: 700 }}>ℹ️</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {mobileMenuOpen && (
        <div 
          className="mobile-backdrop" 
          onClick={() => setMobileMenuOpen(false)} 
        />
      )}

      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(id) => { setActiveTab(id); setMobileMenuOpen(false); }} 
        shipmentsCount={shipments.length} 
        alertsCount={totalAlerts}
        activeInterventions={activeInterventions}
        mobileMenuOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <main className="main-container">
        <Navbar 
          activeTab={activeTab} 
          activeInterventions={activeInterventions} 
          onResetDemo={handleResetDemo}
          onToggleMobile={() => setMobileMenuOpen(!mobileMenuOpen)}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        <div className="content-area">
          {activeTab === "dashboard" && (
            <Dashboard 
              shipments={shipments} 
              onSelectShipment={(id) => setSelectedId(id)} 
              setActiveTab={setActiveTab} 
              onExecuteIntervention={handleExecuteIntervention}
            />
          )}

          {activeTab === "register" && (
            <RegisterShipment 
              onRegisterShipment={handleRegisterShipment} 
              setActiveTab={setActiveTab} 
            />
          )}

          {activeTab === "live" && (
            <LiveMonitoring 
              shipments={shipments} 
              onUpdateTelemetry={handleUpdateTelemetry} 
              onExecuteIntervention={handleExecuteIntervention}
            />
          )}

          {activeTab === "ai" && (
            <AiAnalysis 
              shipments={shipments} 
              onExecuteIntervention={handleExecuteIntervention}
            />
          )}

          {activeTab === "gps" && (
            <GpsTracking 
              shipments={shipments} 
              onExecuteIntervention={handleExecuteIntervention}
            />
          )}

          {activeTab === "reports" && (
            <ReportsAudit 
              shipments={shipments} 
            />
          )}
        </div>
      </main>
    </div>
  );
}
