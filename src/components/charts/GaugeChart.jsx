import React from 'react';

export const GaugeChart = ({
  value = 98.4,
  min = 0,
  max = 100,
  title = "AI Health Index",
  subtitle = "System Nominal",
  size = 180,
  strokeWidth = 16,
  color = "#10B981",
  gradientColor = "#0EA5E9"
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // We use a 240 degree arc gauge
  const arcPercentage = 0.75;
  const totalDash = circumference * arcPercentage;
  const normalizedValue = Math.min(Math.max((value - min) / (max - min), 0), 1);
  const strokeDashoffset = totalDash - normalizedValue * totalDash;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', width: `${size}px` }}>
      <svg width={size} height={size * 0.85} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id={`gauge-grad-${value}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={gradientColor} />
          </linearGradient>
        </defs>

        {/* Background Track Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#F1F5F9"
          strokeWidth={strokeWidth}
          strokeDasharray={`${totalDash} ${circumference}`}
          strokeDashoffset={0}
          strokeLinecap="round"
          transform={`rotate(135 ${size / 2} ${size / 2})`}
        />

        {/* Value Animated Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#gauge-grad-${value})`}
          strokeWidth={strokeWidth}
          strokeDasharray={`${totalDash} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(135 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
      </svg>

      {/* Center Text Typography */}
      <div
        style={{
          position: 'absolute',
          top: `${size * 0.42}px`,
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <span style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.04em', lineHeight: 1 }}>
          {value}%
        </span>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {title}
        </span>
        {subtitle && (
          <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#10B981', marginTop: '2px' }}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};
