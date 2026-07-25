import React, { useState } from 'react';
import { chartTimeSeriesData } from '../../data/mockData';
import * as Icons from 'lucide-react';
import { Badge } from '../common/Badge';

export const InteractiveAreaChart = ({ title = "AI Sensor Health & Anomaly Drift Analysis", subtitle = "Real-time neural telemetry aggregated across 128 active cold-chain nodes" }) => {
  const [activeTab, setActiveTab] = useState('health'); // 'health' | 'temp' | 'anomaly'
  const [timeRange, setTimeRange] = useState('24H'); // '24H' | '7D' | '30D'
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const data = chartTimeSeriesData;
  const width = 800;
  const height = 240;
  const paddingX = 40;
  const paddingY = 30;

  const getMetricConfig = () => {
    switch (activeTab) {
      case 'temp':
        return {
          key: 'temp',
          label: 'Core Temperature (°C)',
          color: '#0EA5E9',
          gradientStart: 'rgba(14, 165, 233, 0.4)',
          gradientEnd: 'rgba(14, 165, 233, 0.0)',
          min: -72,
          max: -68,
          unit: '°C'
        };
      case 'anomaly':
        return {
          key: 'anomalyScore',
          label: 'AI Anomaly Index',
          color: '#6366F1',
          gradientStart: 'rgba(99, 102, 241, 0.4)',
          gradientEnd: 'rgba(99, 102, 241, 0.0)',
          min: 0,
          max: 3.0,
          unit: ' pts'
        };
      case 'health':
      default:
        return {
          key: 'health',
          label: 'AI Health Stability (%)',
          color: '#10B981',
          gradientStart: 'rgba(16, 185, 129, 0.4)',
          gradientEnd: 'rgba(16, 185, 129, 0.0)',
          min: 96.0,
          max: 100.0,
          unit: '%'
        };
    }
  };

  const config = getMetricConfig();

  // Calculate SVG coordinates
  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * (width - 2 * paddingX);
    const val = d[config.key];
    const normalized = Math.max(0, Math.min(1, (val - config.min) / (config.max - config.min)));
    const y = height - paddingY - normalized * (height - 2 * paddingY);
    return { x, y, val, time: d.time, raw: d };
  });

  const pathString = points.reduce((acc, pt, i) => {
    return `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x},${pt.y}`;
  }, '');

  const areaString = `${pathString} L ${points[points.length - 1].x},${height - paddingY} L ${points[0].x},${height - paddingY} Z`;

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        border: '1px solid rgba(226, 232, 240, 0.9)',
        boxShadow: '0 12px 28px -6px rgba(15, 23, 42, 0.05)',
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        position: 'relative'
      }}
    >
      {/* Header & Metric Switcher */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              {title}
            </h3>
            <Badge variant={activeTab === 'health' ? 'emerald' : activeTab === 'temp' ? 'sky' : 'indigo'} size="sm" pulse>
              Live Telemetry
            </Badge>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0 }}>
            {subtitle}
          </p>
        </div>

        {/* Metric Tabs & Time Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', backgroundColor: '#F8FAFC', padding: '4px', borderRadius: '12px', border: '1px solid rgba(226, 232, 240, 0.9)' }}>
            {[
              { id: 'health', label: 'Stability Index', icon: 'Activity' },
              { id: 'temp', label: 'Thermal Profile', icon: 'Thermometer' },
              { id: 'anomaly', label: 'Neural Anomaly', icon: 'Sparkles' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: activeTab === tab.id ? '#FFFFFF' : 'transparent',
                  color: activeTab === tab.id ? '#0F172A' : '#64748B',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  boxShadow: activeTab === tab.id ? '0 2px 6px rgba(15, 23, 42, 0.06)' : 'none',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.25rem' }}>
            {['24H', '7D', '30D'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                style={{
                  padding: '0.4rem 0.65rem',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: timeRange === range ? '#0EA5E9' : 'rgba(226, 232, 240, 0.9)',
                  backgroundColor: timeRange === range ? '#E0F2FE' : 'transparent',
                  color: timeRange === range ? '#0284C7' : '#64748B',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Chart Canvas Area */}
      <div style={{ position: 'relative', width: '100%', height: `${height}px`, marginTop: '0.5rem' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          <defs>
            <linearGradient id={`gradient-${activeTab}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={config.gradientStart} />
              <stop offset="100%" stopColor={config.gradientEnd} />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = height - paddingY - ratio * (height - 2 * paddingY);
            const labelVal = (config.min + ratio * (config.max - config.min)).toFixed(activeTab === 'health' ? 1 : 1);
            return (
              <g key={i}>
                <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} stroke="#F1F5F9" strokeWidth="1" strokeDasharray={i === 0 ? "0" : "4 4"} />
                <text x={0} y={y + 4} fill="#94A3B8" fontSize="11" fontWeight="600">
                  {labelVal}{config.unit}
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <path d={areaString} fill={`url(#gradient-${activeTab})`} transition="all 0.4s ease" />

          {/* Glowing Stroke Path */}
          <path d={pathString} fill="none" stroke={config.color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Interactive Points */}
          {points.map((pt, i) => (
            <g key={i} style={{ cursor: 'pointer' }} onMouseEnter={() => setHoveredPoint(pt)} onMouseLeave={() => setHoveredPoint(null)}>
              {/* Invisible touch area */}
              <circle cx={pt.x} cy={pt.y} r={16} fill="transparent" />
              {/* Outer Glow ring when hovered */}
              {hoveredPoint?.time === pt.time && (
                <circle cx={pt.x} cy={pt.y} r={10} fill={`${config.color}25`} />
              )}
              {/* Visible circle */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredPoint?.time === pt.time ? 6 : 4}
                fill="#FFFFFF"
                stroke={config.color}
                strokeWidth={hoveredPoint?.time === pt.time ? 3 : 2.5}
                style={{ transition: 'all 0.15s ease' }}
              />
              {/* Bottom time label */}
              <text x={pt.x} y={height - 8} fill="#64748B" fontSize="12" fontWeight="600" textAnchor="middle">
                {pt.time}
              </text>
            </g>
          ))}

          {/* Vertical Hover Guideline */}
          {hoveredPoint && (
            <line
              x1={hoveredPoint.x}
              y1={paddingY}
              x2={hoveredPoint.x}
              y2={height - paddingY}
              stroke={config.color}
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
          )}
        </svg>

        {/* Hover Tooltip Box */}
        {hoveredPoint && (
          <div
            style={{
              position: 'absolute',
              left: `${(hoveredPoint.x / width) * 100}%`,
              top: '10px',
              transform: 'translateX(-50%)',
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              padding: '0.6rem 0.85rem',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(15, 23, 42, 0.25)',
              pointerEvents: 'none',
              zIndex: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.2rem',
              minWidth: '160px',
              animation: 'fade-in-up 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94A3B8' }}>
              <span>Time: {hoveredPoint.time}</span>
              <span style={{ color: '#10B981', fontWeight: 700 }}>Nominal</span>
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF' }}>
              {hoveredPoint.val}{config.unit} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#CBD5E1' }}>({config.label.split('(')[0]})</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#E2E8F0', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '0.2rem', marginTop: '0.2rem' }}>
              Vibration: {hoveredPoint.raw.vibration}G // Anomaly: {hoveredPoint.raw.anomalyScore}
            </div>
          </div>
        )}
      </div>

      {/* Chart Legend Footer */}
      <div
        style={{
          paddingTop: '1rem',
          borderTop: '1px solid rgba(241, 245, 249, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.85rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '4px', backgroundColor: '#10B981' }} />
            <span style={{ color: '#334155', fontWeight: 600 }}>Optimal Threshold (98-100%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '4px', backgroundColor: '#0EA5E9' }} />
            <span style={{ color: '#334155', fontWeight: 600 }}>Cryo-Thermal Stability (-70°C)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '4px', backgroundColor: '#6366F1' }} />
            <span style={{ color: '#334155', fontWeight: 600 }}>Quantum Neural Anomaly Index</span>
          </div>
        </div>

        <div style={{ color: '#64748B' }}>
          ⚡ 12:00 spike mitigated automatically by <strong style={{ color: '#4F46E5' }}>AETHER Node #2</strong> (Liquid N2 Loop activated)
        </div>
      </div>
    </div>
  );
};
