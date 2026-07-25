import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { kpiMetrics, activeShipments, liveAlerts, userProfile } from '../data/mockData';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Alert } from '../components/common/Alert';
import { InteractiveAreaChart } from '../components/charts/InteractiveAreaChart';
import { ShipmentMap } from '../components/map/ShipmentMap';

export const Dashboard = ({ setActiveTab, onSelectShipment }) => {
  const [resolvedAlerts, setResolvedAlerts] = useState([]);
  const [activeTabFilter, setActiveTabFilter] = useState('all');

  const handleResolveAlert = (id) => {
    setResolvedAlerts((prev) => [...prev, id]);
  };

  const visibleAlerts = liveAlerts.filter((a) => !resolvedAlerts.includes(a.id));

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Breathtaking Hero Section */}
      <div
        style={{
          padding: '2.5rem',
          borderRadius: '28px',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
          border: '1px solid rgba(226, 232, 240, 0.9)',
          boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.06), 0 0 0 1px rgba(226, 232, 240, 0.8)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.75rem'
        }}
      >
        {/* Subtle decorative background circles */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            right: '-60px',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(14, 165, 233, 0.0) 70%)',
            pointerEvents: 'none'
          }}
        />

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', zIndex: 2 }}>
          <div style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <Badge variant="emerald" pulse>Autonomous Supply Chain nominal</Badge>
              <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                System Time: {new Date().toLocaleTimeString()} // Level 5 Quantum Link
              </span>
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1.15, margin: 0 }}>
              Welcome back, {userProfile.name.split(' ')[0]} {userProfile.name.split(' ')[2]}.
            </h1>
            <p style={{ fontSize: '1rem', color: '#475569', marginTop: '0.5rem', lineHeight: 1.5 }}>
              AETHER's neural intelligence engine is actively monitoring <strong style={{ color: '#0F172A' }}>1,428 autonomous shipments</strong> across 48 global corridors. Zero critical spoilage events detected in trailing 24h.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
            <Button variant="outline" icon="FileText" onClick={() => setActiveTab('reports')}>
              McKinsey Intelligence Brief
            </Button>
            <Button variant="primary" icon="Sparkles" onClick={() => setActiveTab('ai-analysis')}>
              Launch AI Neural Simulator
            </Button>
          </div>
        </div>

        {/* Today's AI Summary Bar */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #F0FDFA 0%, #E0F2FE 100%)',
            border: '1px solid #99F6E4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            zIndex: 2
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #0D9488 0%, #0284C7 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 6px 14px rgba(13, 148, 136, 0.3)'
              }}
            >
              <Icons.Bot size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F766E' }}>Today's AI Autonomous Intervention Summary</span>
                <Badge variant="teal" size="sm">3 Interventions Executed</Badge>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#115E59', margin: 0 }}>
                Prevented <strong>$4.2M</strong> in cold-chain thermal spoilage on Novartis mRNA consignment via automated liquid N2 injection and priority green-lane customs dispatch.
              </p>
            </div>
          </div>

          <Button variant="teal" size="sm" iconRight="ArrowRight" onClick={() => setActiveTab('ai-analysis')}>
            Inspect AI Reasoning
          </Button>
        </div>
      </div>

      {/* 2. Beautiful KPI Cards with animated numbers and micro sparklines */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {kpiMetrics.map((kpi) => {
          const IconComp = Icons[kpi.icon] || Icons.TrendingUp;
          return (
            <Card
              key={kpi.id}
              variant="interactive"
              onClick={() => setActiveTab(kpi.id === 'kpi-3' ? 'ai-analysis' : 'shipments')}
              style={{ padding: '1.5rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '14px',
                    backgroundColor: `${kpi.accentColor}15`,
                    color: kpi.accentColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.2s ease'
                  }}
                >
                  <IconComp size={22} strokeWidth={2.2} />
                </div>
                <Badge variant={kpi.isPositive ? 'emerald' : 'amber'} size="sm">
                  {kpi.change}
                </Badge>
              </div>

              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>
                  {kpi.title}
                </span>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', marginTop: '0.25rem' }}>
                  {kpi.value}
                </div>
                <span style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.25rem', display: 'block' }}>
                  {kpi.subtitle}
                </span>
              </div>

              {/* Micro Sparkline decorative vector */}
              <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(241, 245, 249, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600 }}>24h Trajectory</span>
                <svg width="60" height="20" viewBox="0 0 60 20">
                  <path
                    d={kpi.id === 'kpi-1' ? "M 0 15 Q 20 5 40 10 T 60 2" : "M 0 18 Q 15 10 30 14 T 60 4"}
                    fill="none"
                    stroke={kpi.accentColor}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 3. Global Map & Real-Time Telemetry Overlay */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Global Autonomous Corridor Simulation
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0 }}>
              Interactive satellite vector tracking of cryo-pharma and quantum hardware transits.
            </p>
          </div>
          <Button variant="outline" size="sm" icon="Radio" onClick={() => setActiveTab('live-monitoring')}>
            View All Telemetry Nodes →
          </Button>
        </div>

        <ShipmentMap onSelectShipment={(shipment) => {
          onSelectShipment && onSelectShipment(shipment);
          setActiveTab('live-monitoring');
        }} />
      </div>

      {/* 4. Interactive Chart Section & Recommendations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '1.75rem' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <InteractiveAreaChart />
        </div>
      </div>

      {/* 5. Active Shipments Ledger & Recommendations */}
      <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '1.75rem' }}>
        {/* Left: Shipment Cards Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Priority Autonomous Manifests
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0 }}>
                Live sensor telemetry and AI health scores
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setActiveTab('shipments')}>
              View All 1,428 →
            </Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {activeShipments.slice(0, 3).map((shipment) => (
              <div
                key={shipment.id}
                onClick={() => {
                  onSelectShipment && onSelectShipment(shipment);
                  setActiveTab('live-monitoring');
                }}
                className="floating-card cursor-pointer"
                style={{
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        backgroundColor: shipment.status.includes('Active') ? '#D1FAE5' : '#FEF3C7',
                        color: shipment.status.includes('Active') ? '#059669' : '#D97706',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.85rem'
                      }}
                    >
                      {shipment.id.split('-')[1]}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>{shipment.cargo}</span>
                      </div>
                      <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                        {shipment.origin.city} → {shipment.destination.city} // <strong style={{ color: '#334155' }}>{shipment.client.split('//')[0]}</strong>
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Badge variant={shipment.status.includes('Active') ? 'emerald' : 'amber'} size="sm" pulse>
                      {shipment.status}
                    </Badge>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block' }}>AI HEALTH</span>
                      <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#10B981' }}>{shipment.healthScore}%</span>
                    </div>
                  </div>
                </div>

                {/* Telemetry Dials Mini Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F8FAFC', padding: '0.75rem 1rem', borderRadius: '14px', border: '1px solid rgba(226, 232, 240, 0.8)', fontSize: '0.82rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#334155' }}>
                    <Icons.Thermometer size={16} color="#0EA5E9" /> Core Temp: <strong style={{ color: '#0F172A' }}>{shipment.telemetry.temperature}</strong>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#334155' }}>
                    <Icons.Activity size={16} color="#10B981" /> Vibration: <strong style={{ color: '#0F172A' }}>{shipment.telemetry.vibration.split(' ')[0]}</strong>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#334155' }}>
                    <Icons.Battery size={16} color="#0D9488" /> Battery: <strong style={{ color: '#0F172A' }}>{shipment.vehicle.battery}%</strong>
                  </span>
                  <span style={{ color: '#0EA5E9', fontWeight: 700, fontSize: '0.78rem' }}>
                    Inspect Live →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Alerts & AI Recommendations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                System Alerts & AI Remediation
              </h3>
              <Badge variant="indigo" size="sm" pulse>{visibleAlerts.length} Active</Badge>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0 }}>
              Automated neural actions executed without human latency
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {visibleAlerts.length === 0 ? (
              <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center', backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid rgba(226, 232, 240, 0.9)' }}>
                <Icons.CheckCircle2 size={36} color="#10B981" style={{ margin: '0 auto 0.5rem' }} />
                <span style={{ fontWeight: 700, color: '#0F172A', display: 'block' }}>All Alerts Resolved Autonomously</span>
                <span style={{ fontSize: '0.8rem', color: '#64748B' }}>AETHER neural nodes are maintaining 100% thermal stability.</span>
              </div>
            ) : (
              visibleAlerts.map((alert) => (
                <Alert
                  key={alert.id}
                  title={alert.title}
                  description={alert.description}
                  severity={alert.severity}
                  timestamp={alert.timestamp}
                  aiAction={alert.aiAction}
                  status={alert.status}
                  onActionClick={() => handleResolveAlert(alert.id)}
                  actionText="Verify & Dismiss"
                />
              ))
            )}
          </div>

          {/* AI Strategic Recommendation Card */}
          <Card
            title="AETHER AI Recommendation"
            subtitle="Immediate Optimization Opportunity"
            icon="Lightbulb"
            iconColor="#F59E0B"
            badgeText="High Impact"
            badgeColor="#F59E0B"
            style={{ background: 'linear-gradient(135deg, #FEFEF9 0%, #FFFBEB 100%)', borderColor: '#FDE68A' }}
            footer={
              <Button variant="outline" size="sm" icon="Zap" onClick={() => setActiveTab('ai-analysis')}>
                Review in AI Intelligence Core →
              </Button>
            }
          >
            <p style={{ fontSize: '0.88rem', color: '#92400E', margin: '0 0 0.75rem 0', lineHeight: 1.5 }}>
              By pre-cooling the Zurich cargo drone bay by <strong>1.4°C</strong> prior to North Atlantic entry, overall battery draw for thermal regulation will decrease by 14%, extending flight endurance by 42 minutes.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: '#B45309', fontWeight: 700 }}>
              <Icons.ShieldCheck size={16} color="#D97706" /> Projected ROI: +$14,200 in energy & maintenance savings
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
