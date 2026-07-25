import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { aiAnalysisDetails, activeShipments } from '../data/mockData';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { GaugeChart } from '../components/charts/GaugeChart';
import { RiskTimelineChart } from '../components/charts/RiskTimelineChart';

export const AIAnalysis = () => {
  const [recommendations, setRecommendations] = useState(aiAnalysisDetails.recommendations);
  const [activeModelTab, setActiveModelTab] = useState('quantum');

  const handleApplyRecommendation = (id) => {
    setRecommendations((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, applied: true, impact: '✅ Applied // Neural Route Synchronized' } : rec))
    );
  };

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Futuristic Neural Core Header */}
      <div
        style={{
          padding: '2.5rem',
          borderRadius: '28px',
          background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)',
          color: '#FFFFFF',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem'
        }}
      >
        {/* Decorative background grid & glowing orb */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(16, 185, 129, 0.0) 70%)',
            pointerEvents: 'none'
          }}
        />

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', zIndex: 2 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
              <Badge variant="indigo" pulse>AETHER-7 Quantum Transformer (v4.8)</Badge>
              <span style={{ fontSize: '0.78rem', color: '#A5B4FC', fontWeight: 600 }}>
                128 GPU Edge Clusters // Zero Hallucination Guarantee
              </span>
            </div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.03em', margin: 0 }}>
              Autonomous AI Risk & Prediction Core
            </h1>
            <p style={{ fontSize: '1.05rem', color: '#CBD5E1', marginTop: '0.5rem', maxWidth: '680px', lineHeight: 1.5 }}>
              Deep neural analysis of thermal drift, atmospheric turbulence, and customs processing latency across 1,428 active supply chain corridors.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.1)', padding: '6px', borderRadius: '16px', backdropFilter: 'blur(12px)' }}>
            {[
              { id: 'quantum', label: 'Quantum Monte Carlo', icon: 'Sparkles' },
              { id: 'thermal', label: 'Cryo-Thermal Net', icon: 'ThermometerSnowflake' },
              { id: 'route', label: 'Vector Path AI', icon: 'Navigation' }
            ].map((tab) => {
              const IconComp = Icons[tab.icon] || Icons.Sparkles;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveModelTab(tab.id)}
                  style={{
                    padding: '0.6rem 1rem',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: activeModelTab === tab.id ? '#6366F1' : 'transparent',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <IconComp size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Neural Metrics Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.15)',
            zIndex: 2
          }}
        >
          <div>
            <span style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>Telemetry Ingestion</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38BDF8', marginTop: '2px' }}>1.28 Billion / sec</div>
            <span style={{ fontSize: '0.75rem', color: '#6E8098' }}>Real-time IoT acoustic & thermal arrays</span>
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>Prediction Accuracy</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34D399', marginTop: '2px' }}>99.94%</div>
            <span style={{ fontSize: '0.75rem', color: '#6E8098' }}>Verified against historical port arrivals</span>
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>Spoilage Probability</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FBBF24', marginTop: '2px' }}>0.02%</div>
            <span style={{ fontSize: '0.75rem', color: '#6E8098' }}>With autonomous intervention enabled</span>
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>Active GPU Nodes</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#A7F3D0', marginTop: '2px' }}>128 Nominal</div>
            <span style={{ fontSize: '0.75rem', color: '#6E8098' }}>Global Edge Data Centers</span>
          </div>
        </div>
      </div>

      {/* 2. Large AI Health Score & Confidence Gauge Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.75rem' }}>
        <Card
          title="Global AI Health Score"
          subtitle="Aggregated sensor stability index across all 1,428 consignments"
          icon="Activity"
          iconColor="#10B981"
          badgeText="Optimal"
          badgeColor="#10B981"
          style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <div style={{ margin: '1.5rem 0' }}>
            <GaugeChart value={98.4} title="HEALTH INDEX" subtitle="0 Anomalies" size={220} color="#10B981" gradientColor="#0EA5E9" />
          </div>
          <p style={{ fontSize: '0.88rem', color: '#475569', textAlign: 'center', margin: '0 1rem', lineHeight: 1.5 }}>
            All cryogenic compressors and active air-suspension damping arrays are operating within <strong style={{ color: '#0F172A' }}>±0.05%</strong> of engineering tolerances.
          </p>
        </Card>

        <Card
          title="Neural Prediction Confidence"
          subtitle="Monte Carlo probability of zero-loss on-time arrival"
          icon="Sparkles"
          iconColor="#6366F1"
          badgeText="99.7% Confident"
          badgeColor="#6366F1"
          style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <div style={{ margin: '1.5rem 0' }}>
            <GaugeChart value={99.7} title="CONFIDENCE" subtitle="High Precision" size={220} color="#6366F1" gradientColor="#0EA5E9" />
          </div>
          <p style={{ fontSize: '0.88rem', color: '#475569', textAlign: 'center', margin: '0 1rem', lineHeight: 1.5 }}>
            AETHER has calculated 100,000 meteorological and traffic permutations for active routes. Route deviations will be executed automatically 4 hours prior to turbulence events.
          </p>
        </Card>
      </div>

      {/* 3. Predictive Risk Timeline */}
      <RiskTimelineChart />

      {/* 4. Deep Neural Reasoning Cards & Executive Summary */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Deep AI Reasoning & Autonomous Actions
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0 }}>
              Why did AETHER intervene? Transparent explanation of neural decision trees.
            </p>
          </div>
          <Badge variant="emerald" pulse>Zero Human Latency</Badge>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {aiAnalysisDetails.reasoningCards.map((rc) => {
            const IconComp = Icons[rc.icon] || Icons.Bot;
            return (
              <Card
                key={rc.id}
                title={rc.title}
                subtitle={`Prediction Confidence: ${rc.confidence}`}
                icon={rc.icon}
                iconColor="#6366F1"
                badgeText={rc.statusBadge}
                badgeColor={rc.statusBadge.includes('Executed') ? '#10B981' : '#0EA5E9'}
                style={{ padding: '1.75rem' }}
                footer={
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', fontSize: '0.82rem' }}>
                    <span style={{ color: '#64748B' }}>Financial Loss Prevented:</span>
                    <strong style={{ color: '#10B981', fontSize: '0.95rem' }}>{rc.impact}</strong>
                  </div>
                }
              >
                <div style={{ padding: '1rem 1.25rem', borderRadius: '14px', backgroundColor: '#F8FAFC', border: '1px solid rgba(226, 232, 240, 0.9)', margin: '0.5rem 0 0.75rem 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', color: '#4F46E5', fontWeight: 700, fontSize: '0.8rem' }}>
                    <Icons.Cpu size={15} /> AETHER NEURAL REASONING
                  </div>
                  <p style={{ fontSize: '0.9rem', color: '#334155', margin: 0, lineHeight: 1.5 }}>
                    {rc.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 5. One-Click AI Recommendations Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              AI Strategic Recommendations
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0 }}>
              One-click autonomous execution to optimize battery profiles and port servicing.
            </p>
          </div>
          <Badge variant="amber" size="sm">2 Actionable</Badge>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="floating-card"
              style={{
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                backgroundColor: rec.applied ? '#F0FDFA' : '#FFFFFF',
                borderColor: rec.applied ? '#99F6E4' : 'rgba(226, 232, 240, 0.9)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: '1 1 380px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: rec.applied ? '#D1FAE5' : '#FEF3C7',
                    color: rec.applied ? '#059669' : '#D97706',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {rec.applied ? <Icons.CheckCircle2 size={22} /> : <Icons.Zap size={22} />}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                    <h5 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      {rec.title}
                    </h5>
                    {rec.applied && <Badge variant="emerald" size="sm">Executed Autonomously</Badge>}
                  </div>
                  <p style={{ fontSize: '0.88rem', color: '#475569', margin: 0, lineHeight: 1.4 }}>
                    {rec.subtitle}
                  </p>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: rec.applied ? '#059669' : '#0EA5E9', marginTop: '0.4rem' }}>
                    ⚡ Impact: {rec.impact}
                  </div>
                </div>
              </div>

              <div>
                {rec.applied ? (
                  <Button variant="outline" size="sm" icon="Check" disabled>
                    Action Synchronized
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="md"
                    icon="Rocket"
                    onClick={() => handleApplyRecommendation(rec.id)}
                  >
                    {rec.actionText}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Executive Overview Footer Card */}
      <Card
        title="AETHER Executive Intelligence Overview"
        subtitle="Signed by Quantum Neural Advisory Engine"
        icon="Award"
        iconColor="#10B981"
        style={{ background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)', padding: '2rem' }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '0.5rem' }}>
          <div>
            <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.4rem' }}>Zero-Loss Biosecurity Protocol</h5>
            <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
              All mRNA and EUV optical shipments are operating under Level 5 biometric cryptographic seals. No unauthorized access attempts detected across global transit hubs.
            </p>
          </div>
          <div>
            <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.4rem' }}>Predictive Spoilage Buffer</h5>
            <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
              By anticipating atmospheric equatorial heatwaves 12 hours ahead of physical touchdown, AETHER has preserved 100% of biological potency for Novartis and CERN consignments.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
