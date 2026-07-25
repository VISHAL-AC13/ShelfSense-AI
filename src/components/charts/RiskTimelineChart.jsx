import React, { useState } from 'react';
import { aiAnalysisDetails } from '../../data/mockData';
import * as Icons from 'lucide-react';
import { Badge } from '../common/Badge';

export const RiskTimelineChart = () => {
  const [selectedNode, setSelectedNode] = useState(0);
  const timeline = aiAnalysisDetails.riskTimeline;

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        border: '1px solid rgba(226, 232, 240, 0.9)',
        boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.04)',
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              48-Hour Predictive Risk Trajectory // Neural Horizon
            </h4>
            <Badge variant="indigo" size="sm">Quantum Monte Carlo Simulation</Badge>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0 }}>
            Click on any transit time horizon to inspect automated AI mitigation protocols and thermal stress factors.
          </p>
        </div>
      </div>

      {/* Horizontal Timeline Bar */}
      <div style={{ position: 'relative', padding: '1rem 0 2rem 0' }}>
        {/* Connecting line */}
        <div
          style={{
            position: 'absolute',
            top: '28px',
            left: '5%',
            right: '5%',
            height: '4px',
            background: 'linear-gradient(90deg, #10B981 0%, #F59E0B 50%, #10B981 100%)',
            borderRadius: '2px',
            zIndex: 1
          }}
        />

        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${timeline.length}, 1fr)`, position: 'relative', zIndex: 2 }}>
          {timeline.map((item, idx) => {
            const isSelected = selectedNode === idx;
            const isHighRisk = item.risk > 3.0;
            const isMedRisk = item.risk > 2.0 && item.risk <= 3.0;
            const nodeColor = isHighRisk ? '#EF4444' : isMedRisk ? '#F59E0B' : '#10B981';

            return (
              <div
                key={item.hour}
                onClick={() => setSelectedNode(idx)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  transform: isSelected ? 'scale(1.05)' : 'scale(1)'
                }}
              >
                {/* Node Circle */}
                <div
                  style={{
                    width: isSelected ? '40px' : '32px',
                    height: isSelected ? '40px' : '32px',
                    borderRadius: '50%',
                    backgroundColor: isSelected ? nodeColor : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : nodeColor,
                    border: `3px solid ${nodeColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: isSelected ? '0.85rem' : '0.75rem',
                    boxShadow: isSelected ? `0 6px 16px ${nodeColor}50` : '0 2px 6px rgba(15, 23, 42, 0.08)',
                    transition: 'all 0.2s ease',
                    marginBottom: '0.75rem'
                  }}
                >
                  {item.risk}%
                </div>

                {/* Hour badge */}
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: isSelected ? '#0F172A' : '#64748B' }}>
                  {item.hour}
                </span>

                {/* Label text */}
                <span style={{ fontSize: '0.72rem', color: '#64748B', textAlign: 'center', maxWidth: '120px', marginTop: '2px', fontWeight: isSelected ? 600 : 400 }}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Node Details Box */}
      {timeline[selectedNode] && (
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderRadius: '16px',
            backgroundColor: '#F8FAFC',
            border: '1px solid rgba(226, 232, 240, 0.9)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1.25rem',
            animation: 'fade-in-up 0.2s ease'
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              backgroundColor: timeline[selectedNode].risk > 3.0 ? '#FEE2E2' : '#D1FAE5',
              color: timeline[selectedNode].risk > 3.0 ? '#DC2626' : '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {timeline[selectedNode].risk > 3.0 ? <Icons.AlertTriangle size={22} /> : <Icons.ShieldCheck size={22} />}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>
                Horizon {timeline[selectedNode].hour}: {timeline[selectedNode].label}
              </span>
              <Badge variant={timeline[selectedNode].risk > 3.0 ? 'red' : 'emerald'}>
                Risk Variance: ±{timeline[selectedNode].risk}%
              </Badge>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#334155', margin: 0, lineHeight: 1.5 }}>
              {timeline[selectedNode].risk > 3.0
                ? "High customs document inspection queue density predicted at port arrival. AETHER has pre-dispatched digital cryptographic zero-knowledge biosecurity clearances to bypass manual inspection bays."
                : "Thermal environment nominal. Ambient external temperature projected to remain within safe cryo-radiator dissipation limits. Zero intervention required."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
