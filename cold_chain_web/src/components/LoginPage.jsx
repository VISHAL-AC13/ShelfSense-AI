// src/components/LoginPage.jsx
import React, { useState } from "react";
import { ShieldCheck, Lock, Mail, User, ArrowRight, Sparkles, Zap, CheckCircle2, Building2, Award } from "lucide-react";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("admin@shelfsense.ai");
  const [password, setPassword] = useState("••••••••••••");
  const [selectedRole, setSelectedRole] = useState("admin");
  const [loading, setLoading] = useState(false);

  const demoAccounts = [
    {
      id: "admin",
      name: "System Admin",
      role: "Chief Quality Officer & Fleet Admin",
      email: "admin@shelfsense.ai",
      hub: "Oddanchatram / Koyambedu Hubs, TN",
      badge: "Full Access",
      badgeColor: "#2563EB",
      bg: "#EFF6FF",
      border: "#BFDBFE"
    },
    {
      id: "logistics",
      name: "Logistics Manager",
      role: "Tamil Nadu Highway Logistics Lead",
      email: "logistics@shelfsense.ai",
      hub: "NH-44 & NH-48 Transit Corridors",
      badge: "Fleet Ops",
      badgeColor: "#059669",
      bg: "#ECFDF5",
      border: "#A7F3D0"
    },
    {
      id: "auditor",
      name: "Regulatory Auditor",
      role: "Government Cold-Chain Inspector",
      email: "auditor@shelfsense.ai",
      hub: "FSSAI Regional Office, Chennai",
      badge: "Regulatory",
      badgeColor: "#D97706",
      bg: "#FFFBEB",
      border: "#FDE68A"
    }
  ];

  const handleSelectDemo = (acc) => {
    setSelectedRole(acc.id);
    setEmail(acc.email);
    setPassword("••••••••••••");
  };

  const handleSignIn = (e, customAcc = null) => {
    if (e) e.preventDefault();
    setLoading(true);

    const targetAcc = customAcc || demoAccounts.find(a => a.id === selectedRole) || demoAccounts[0];

    setTimeout(() => {
      onLogin({
        name: targetAcc.name,
        role: targetAcc.role,
        email: targetAcc.email,
        hub: targetAcc.hub,
        badge: targetAcc.badge,
        loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }, 600);
  };

  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      background: "radial-gradient(circle at 15% 50%, #1E293B, #0F172A)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: "'Inter', sans-serif",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Decorative background blur circles */}
      <div style={{
        position: "absolute",
        top: "-10%",
        left: "-10%",
        width: "500px",
        height: "500px",
        background: "radial-gradient(circle, rgba(37,99,235,0.15) 0%, rgba(0,0,0,0) 70%)",
        borderRadius: "50%",
        filter: "blur(40px)",
        pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute",
        bottom: "-10%",
        right: "-10%",
        width: "600px",
        height: "600px",
        background: "radial-gradient(circle, rgba(5,150,105,0.12) 0%, rgba(0,0,0,0) 70%)",
        borderRadius: "50%",
        filter: "blur(40px)",
        pointerEvents: "none"
      }} />

      {/* Main Container */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1.1fr",
        maxWidth: "1100px",
        width: "100%",
        background: "rgba(255, 255, 255, 0.98)",
        borderRadius: "24px",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        overflow: "hidden",
        border: "1px solid rgba(255, 255, 255, 0.2)"
      }} className="login-grid-container">
        
        {/* Left Panel: Branding & Features */}
        <div style={{
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
          padding: "48px 40px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          color: "white",
          position: "relative"
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "32px" }}>
              <div style={{
                background: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
                padding: "10px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)"
              }}>
                <Sparkles size={24} color="white" />
              </div>
              <span style={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.5px", background: "linear-gradient(90deg, #FFFFFF, #93C5FD)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                ShelfSense AI
              </span>
            </div>

            <h1 style={{ fontSize: "2.2rem", fontWeight: 800, lineHeight: 1.2, marginBottom: "16px", color: "#FFFFFF" }}>
              Next-Gen Cold-Chain Intelligence.
            </h1>
            <p style={{ color: "#94A3B8", fontSize: "1rem", lineHeight: 1.6, marginBottom: "36px" }}>
              Real-time telemetry, IoT thermal monitoring, and automated AI prescriptive interventions for Tamil Nadu's perishable agriculture network.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ background: "rgba(37, 99, 235, 0.2)", padding: "8px", borderRadius: "8px", color: "#60A5FA" }}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "#F1F5F9" }}>FSSAI & HACCP Compliant</div>
                  <div style={{ fontSize: "0.8rem", color: "#64748B" }}>Automated audit logging & cryptographic SHA-3 verification</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ background: "rgba(5, 150, 105, 0.2)", padding: "8px", borderRadius: "8px", color: "#34D399" }}>
                  <Zap size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "#F1F5F9" }}>AI Spoilage Prevention</div>
                  <div style={{ fontSize: "0.8rem", color: "#64748B" }}>Predictive shelf-life decay models & dynamic GPS rerouting</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ background: "rgba(217, 119, 6, 0.2)", padding: "8px", borderRadius: "8px", color: "#FBBF24" }}>
                  <Building2 size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "#F1F5F9" }}>Tamil Nadu Agri-Hubs</div>
                  <div style={{ fontSize: "0.8rem", color: "#64748B" }}>Oddanchatram, Koyambedu, Nilgiris & Salem corridors</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: "40px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.8rem", color: "#64748B" }}>© 2026 ShelfSense AI Systems</span>
            <span style={{ fontSize: "0.78rem", background: "rgba(255,255,255,0.1)", padding: "4px 10px", borderRadius: "20px", color: "#E2E8F0" }}>v3.4 Enterprise</span>
          </div>
        </div>

        {/* Right Panel: Login & Demo Options */}
        <div style={{ padding: "48px 40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ marginBottom: "28px" }}>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0F172A", marginBottom: "6px" }}>
              Sign In to Portal
            </h2>
            <p style={{ color: "#64748B", fontSize: "0.92rem" }}>
              Select a <strong>Demo Account</strong> below for instant 1-click access:
            </p>
          </div>

          {/* Demo Cards Selector */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
            {demoAccounts.map((acc) => {
              const isSelected = selectedRole === acc.id;
              return (
                <div
                  key={acc.id}
                  onClick={() => handleSelectDemo(acc)}
                  style={{
                    background: isSelected ? acc.bg : "#F8FAFC",
                    border: `2px solid ${isSelected ? acc.badgeColor : "#E2E8F0"}`,
                    borderRadius: "14px",
                    padding: "14px 16px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    position: "relative",
                    boxShadow: isSelected ? "0 4px 12px rgba(0,0,0,0.05)" : "none"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "12px",
                      background: isSelected ? acc.badgeColor : "#E2E8F0",
                      color: isSelected ? "white" : "#64748B",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "1.1rem"
                    }}>
                      {acc.name[0]}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontWeight: 700, color: "#0F172A", fontSize: "0.95rem" }}>{acc.name}</span>
                        <span style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: "10px",
                          background: isSelected ? acc.badgeColor : "#CBD5E1",
                          color: "white"
                        }}>
                          {acc.badge}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.82rem", color: "#475569", marginTop: "2px" }}>{acc.role}</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSignIn(null, acc);
                    }}
                    style={{
                      background: isSelected ? acc.badgeColor : "#E2E8F0",
                      color: isSelected ? "white" : "#475569",
                      border: "none",
                      padding: "8px 14px",
                      borderRadius: "8px",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      transition: "all 0.2s"
                    }}
                  >
                    <span>Login</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "10px 0 24px 0" }}>
            <div style={{ flex: 1, height: "1px", background: "#E2E8F0" }}></div>
            <span style={{ fontSize: "0.78rem", color: "#94A3B8", fontWeight: 600, textTransform: "uppercase" }}>Or sign in with credentials</span>
            <div style={{ flex: 1, height: "1px", background: "#E2E8F0" }}></div>
          </div>

          {/* Traditional Form */}
          <form onSubmit={(e) => handleSignIn(e)}>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={18} color="#94A3B8" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 14px 12px 42px",
                    borderRadius: "10px",
                    border: "2px solid #E2E8F0",
                    fontSize: "0.95rem",
                    color: "#0F172A",
                    outline: "none",
                    fontWeight: 500,
                    transition: "border-color 0.2s"
                  }}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#475569" }}>
                  Password (Demo: Any)
                </label>
                <span style={{ fontSize: "0.78rem", color: "#2563EB", cursor: "pointer", fontWeight: 600 }}>Forgot?</span>
              </div>
              <div style={{ position: "relative" }}>
                <Lock size={18} color="#94A3B8" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 14px 12px 42px",
                    borderRadius: "10px",
                    border: "2px solid #E2E8F0",
                    fontSize: "0.95rem",
                    color: "#0F172A",
                    outline: "none",
                    fontWeight: 500
                  }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                color: "white",
                border: "none",
                fontSize: "1rem",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 10px 20px -5px rgba(37, 99, 235, 0.4)",
                transition: "all 0.2s"
              }}
            >
              {loading ? (
                <span>Authenticating Telemetry Access...</span>
              ) : (
                <>
                  <Zap size={18} />
                  <span>Sign In to Dashboard</span>
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: "24px", textAlign: "center", fontSize: "0.82rem", color: "#64748B" }}>
            🔒 Protected by 256-bit FSSAI Enterprise Encryption
          </div>
        </div>
      </div>
    </div>
  );
}
