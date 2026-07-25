import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { activeShipments, liveAlerts } from '../data/mockData';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Alert } from '../components/common/Alert';

export const LiveMonitoring = ({ selectedShipment: propShipment }) => {
  const [selectedId, setSelectedId] = useState(propShipment ? propShipment.id : activeShipments[0].id);
  const [liveTemp, setLiveTemp] = useState(-268.1);
  const [liveHumidity, setLiveHumidity] = useState(0.02);
  const [liveBattery, setLiveBattery] = useState(92);
  const [doorStatus, setDoorStatus] = useState('Biometric Tamper Lock Active // Verified');
  const [isSimulating, setIsSimulating] = useState(true);

  const shipment = activeShipments.find((s) => s.id === selectedId) || activeShipments[0];

  // Initialize live values when shipment changes
  useEffect(() => {
    const baseTemp = parseFloat(shipment.telemetry.temperature);
    const baseHum = parseFloat(shipment.telemetry.humidity);
    const baseBat = shipment.vehicle.battery;
    setLiveTemp(isNaN(baseTemp) ? 20.0 : baseTemp);
    setLiveHumidity(isNaN(baseHum) ? 35.0 : baseHum);
    setLiveBattery(baseBat);
    setDoorStatus(shipment.telemetry.doorSeal);
  }, [selectedId, shipment]);

  // Simulate subtle real-time IoT fluctuations
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setLiveTemp((prev) => parseFloat((prev + (Math.random() * 0.04 - 0.02)).toFixed(2)));
      setLiveHumidity((prev) => parseFloat(Math.max(0, (prev + (Math.random() * 0.1 - 0.05))).toFixed(2)));
    }, 2500);
    return () => clearInterval(interval);
  }, [isSimulating]);

  const handleTestLock = () => {
    setDoorStatus('Initiating Biometric Zero-Knowledge Proof Verification...');
    setTimeout(() => {
      setDoorStatus('Biometric Tamper Lock Active // 256-Bit Cryptographic Seal Verified');
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Top Header & Shipment Switcher */}
      <div
        style={{
          padding: '1.75rem 2rem',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
          border: '1px solid rgba(226, 232, 240, 0.9)',
          boxShadow: '0 12px 30px -5px rgba(15, 23, 42, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <Badge variant="emerald" pulse>Live IoT Sensor Array Connected</Badge>
            <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
              Uplink Rate: 1,200 points/sec // Encryption: Quantum AES-512
            </span>
          </div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Real-Time Telemetry & Condition Monitoring
          </h2>
        </div>

        {/* Shipment Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Select Manifest:</span>
          {activeShipments.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedId(s.id)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '12px',
                border: '1px solid',
                borderColor: selectedId === s.id ? '#10B981' : 'rgba(203, 213, 225, 0.8)',
                backgroundColor: selectedId === s.id ? '#D1FAE5' : '#FFFFFF',
                color: selectedId === s.id ? '#059669' : '#475569',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: selectedId === s.id ? '0 4px 12px rgba(16, 185, 129, 0.2)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: selectedId === s.id ? '#10B981' : '#CBD5E1' }} />
              <span>{s.id}: {s.cargo.split(' ')[0]} {s.cargo.split(' ')[1]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Manifest Overview Banner */}
      <div
        style={{
          padding: '1.5rem',
          borderRadius: '20px',
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          alignItems: 'center',
          boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.25)'
        }}
      >
        <div>
          <span style={{ fontSize: '0.72rem', color: '#94A3B8', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Active Consignment</span>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', display: 'block' }}>{shipment.cargo}</span>
          <span style={{ fontSize: '0.78rem', color: '#38BDF8', marginTop: '2px', display: 'block' }}>{shipment.client}</span>
        </div>

        <div>
          <span style={{ fontSize: '0.72rem', color: '#94A3B8', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Transit Route</span>
          <span style={{ fontSize: '1rem', fontWeight: 700, color: '#F8FAFC' }}>{shipment.origin.city} → {shipment.destination.city}</span>
          <span style={{ fontSize: '0.78rem', color: '#10B981', display: 'block' }}>ETA: {shipment.eta} ({shipment.progress}% Complete)</span>
        </div>

        <div>
          <span style={{ fontSize: '0.72rem', color: '#94A3B8', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Assigned Vehicle</span>
          <span style={{ fontSize: '1rem', fontWeight: 700, color: '#F8FAFC' }}>{shipment.vehicle.type}</span>
          <span style={{ fontSize: '0.78rem', color: '#CBD5E1', display: 'block' }}>ID: {shipment.vehicle.id} // {shipment.vehicle.signal}</span>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.72rem', color: '#94A3B8', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>AI Neural Health</span>
          <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10B981' }}>{shipment.healthScore}%</span>
          <span style={{ fontSize: '0.75rem', color: '#A7F3D0', display: 'block' }}>Status: {shipment.status}</span>
        </div>
      </div>

      {/* Live Animated Telemetry Dials & Sensors Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {/* 1. Temperature Sensor Dial */}
        <Card
          title="Core Thermal Array"
          subtitle="Real-time internal cryogenic temperature"
          icon="ThermometerSnowflake"
          iconColor="#0EA5E9"
          badgeText="Nominal"
          badgeColor="#0EA5E9"
          style={{ padding: '1.75rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '1rem 0' }}>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.04em', lineHeight: 1 }}>
                {liveTemp}°C
              </div>
              <span style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '4px', display: 'block' }}>
                Target Setpoint: <strong>{shipment.telemetry.targetTemp}</strong>
              </span>
            </div>

            {/* Animated Thermometer SVG Dial */}
            <div style={{ width: '48px', height: '120px', backgroundColor: '#F1F5F9', borderRadius: '24px', padding: '6px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', position: 'relative', border: '1px solid rgba(203, 213, 225, 0.9)' }}>
              <div
                style={{
                  width: '100%',
                  height: '75%',
                  background: 'linear-gradient(180deg, #0EA5E9 0%, #0284C7 100%)',
                  borderRadius: '18px',
                  transition: 'height 0.8s ease',
                  position: 'relative'
                }}
              >
                <div style={{ position: 'absolute', top: '6px', left: '50%', transform: 'translateX(-50%)', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.7)' }} />
              </div>
            </div>
          </div>

          <div style={{ paddingTop: '0.75rem', borderTop: '1px solid rgba(241, 245, 249, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B' }}>
            <span>Drift Variance: <strong>±0.02°C</strong></span>
            <span style={{ color: '#0EA5E9', fontWeight: 700 }}>Coolant Flow: 98%</span>
          </div>
        </Card>

        {/* 2. Humidity & Gas Indicator */}
        <Card
          title="Atmospheric & Humidity Sensor"
          subtitle="Hermetically sealed cargo environment"
          icon="Droplets"
          iconColor="#0D9488"
          badgeText="Optimal"
          badgeColor="#0D9488"
          style={{ padding: '1.75rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '1rem 0' }}>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.04em', lineHeight: 1 }}>
                {liveHumidity}%
              </div>
              <span style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '4px', display: 'block' }}>
                O2/CO2 Partial Pressure: <strong>0.00 PPM</strong>
              </span>
            </div>

            {/* Circular Humidity Ring */}
            <div style={{ width: '90px', height: '90px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="90" height="90" viewBox="0 0 90 90">
                <circle cx="45" cy="45" r="36" fill="none" stroke="#F1F5F9" strokeWidth="10" />
                <circle cx="45" cy="45" r="36" fill="none" stroke="#0D9488" strokeWidth="10" strokeDasharray="226" strokeDashoffset={226 - (226 * (liveHumidity * 2)) / 100} strokeLinecap="round" transform="rotate(-90 45 45)" style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
              </svg>
              <span style={{ position: 'absolute', fontSize: '0.8rem', fontWeight: 800, color: '#0F766E' }}>DRY</span>
            </div>
          </div>

          <div style={{ paddingTop: '0.75rem', borderTop: '1px solid rgba(241, 245, 249, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B' }}>
            <span>Dew Point: <strong>-84.2°C</strong></span>
            <span style={{ color: '#0D9488', fontWeight: 700 }}>Desiccant Active</span>
          </div>
        </Card>

        {/* 3. Door Seal & Biometric Status */}
        <Card
          title="Biometric Security Seal"
          subtitle="Zero-knowledge quantum cryptographic lock"
          icon="Lock"
          iconColor="#10B981"
          badgeText="Tamper Proof"
          badgeColor="#10B981"
          style={{ padding: '1.75rem' }}
        >
          <div style={{ margin: '1rem 0' }}>
            <div style={{ padding: '0.85rem', borderRadius: '14px', backgroundColor: '#F0FDFA', border: '1px solid #99F6E4', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <Icons.ShieldCheck size={24} color="#0D9488" className="animate-pulse" />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F766E', lineHeight: 1.4 }}>
                {doorStatus}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              icon="KeyRound"
              onClick={handleTestLock}
              className="w-full"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Execute Biometric Proof Challenge
            </Button>
          </div>

          <div style={{ paddingTop: '0.75rem', borderTop: '1px solid rgba(241, 245, 249, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B' }}>
            <span>Last Handover: <strong>Zurich CryoHub</strong></span>
            <span style={{ color: '#10B981', fontWeight: 700 }}>256-Bit Encrypted</span>
          </div>
        </Card>

        {/* 4. Vehicle & Propulsion Condition */}
        <Card
          title="Autonomous Vehicle Health"
          subtitle="Propulsion, battery & suspension diagnostics"
          icon="Cpu"
          iconColor="#6366F1"
          badgeText={`${liveBattery}% Battery`}
          badgeColor="#6366F1"
          style={{ padding: '1.75rem' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: '0.75rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: '#475569' }}>Cryo-Engine Coolant Pressure</span>
              <strong style={{ color: '#10B981' }}>Nominal (14.2 PSI)</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: '#475569' }}>Active Suspension Damping</span>
              <strong style={{ color: '#6366F1' }}>{shipment.telemetry.vibration}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: '#475569' }}>Satellite Uplink Latency</span>
              <strong style={{ color: '#0EA5E9' }}>14ms (Starlink Quantum)</strong>
            </div>
          </div>

          <div style={{ paddingTop: '0.75rem', borderTop: '1px solid rgba(241, 245, 249, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B' }}>
            <span>Vibration Limit: <strong>0.02G</strong></span>
            <span style={{ color: '#6366F1', fontWeight: 700 }}>AI Auto-Damping On</span>
          </div>
        </Card>
      </div>

      {/* Real-Time Event Timeline & Live Alert Stream */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.75rem' }}>
        {/* Left: Interactive Timeline */}
        <Card
          title="Autonomous Transit Event Log"
          subtitle="Chronological audit trail verified by cryptographic consensus"
          icon="History"
          iconColor="#10B981"
          style={{ padding: '1.75rem' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.5rem' }}>
            {[
              { time: "08:14 UTC", event: "Biometric Tamper Lock sealed at Zurich CryoHub 4. Qubit core temperature stabilized at -268.0°C.", type: "success" },
              { time: "10:42 UTC", event: "AETHER neural net detected clear-air turbulence over FL380 North Atlantic corridor. Altitude adjusted by +2,000ft.", type: "neural" },
              { time: "12:15 UTC", event: "Mid-flight satellite handshake completed via Starlink Quantum LEO array. Zero packet loss.", type: "info" },
              { time: "13:20 UTC (Current)", event: "Approaching Chicago O'Hare Air Corridor. Descent trajectory simulated; 99.8% stability forecast.", type: "active" }
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
                {/* Vertical timeline connector */}
                {i < 3 && (
                  <div style={{ position: 'absolute', top: '24px', left: '15px', width: '2px', height: 'calc(100% + 10px)', backgroundColor: '#E2E8F0' }} />
                )}
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: item.type === 'active' ? '#10B981' : item.type === 'neural' ? '#E0E7FF' : '#F1F5F9',
                    color: item.type === 'active' ? '#FFFFFF' : item.type === 'neural' ? '#4F46E5' : '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    zIndex: 2,
                    boxShadow: item.type === 'active' ? '0 0 0 4px #D1FAE5' : 'none'
                  }}
                >
                  {item.type === 'active' ? <Icons.Radio size={16} className="animate-pulse" /> : <Icons.Check size={16} />}
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: item.type === 'active' ? '#10B981' : '#64748B' }}>{item.time}</span>
                  <p style={{ fontSize: '0.88rem', color: '#0F172A', margin: '2px 0 0 0', fontWeight: item.type === 'active' ? 700 : 400 }}>
                    {item.event}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Right: Streaming Alerts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Live Telemetry Alert Stream
            </h3>
            <Badge variant="indigo" pulse>AI Automated Resolution</Badge>
          </div>

          {liveAlerts.map((alert) => (
            <Alert
              key={alert.id}
              title={alert.title}
              description={alert.description}
              severity={alert.severity}
              timestamp={alert.timestamp}
              aiAction={alert.aiAction}
              status={alert.status}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
