import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { activeShipments } from '../../data/mockData';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const ShipmentMap = ({ onSelectShipment }) => {
  const [selectedShipmentId, setSelectedShipmentId] = useState('SHP-9024');
  const [isPlaying, setIsPlaying] = useState(true);

  const currentShipment = activeShipments.find((s) => s.id === selectedShipmentId) || activeShipments[0];

  // Coordinates on our 1000x500 SVG world map grid
  const routes = [
    {
      id: 'SHP-9024',
      origin: { x: 480, y: 160, label: 'Zurich, CH' },
      destination: { x: 230, y: 175, label: 'Chicago, USA' },
      path: "M 480 160 Q 360 90 230 175",
      vehicle: "HALE-800 Air Drone",
      weather: "CLEAR // FL380 -52°C",
      progress: 68
    },
    {
      id: 'SHP-4402',
      origin: { x: 490, y: 170, label: 'Basel, CH' },
      destination: { x: 760, y: 280, label: 'Singapore, SG' },
      path: "M 490 170 Q 620 220 760 280",
      vehicle: "Volvo Cryo-Rig",
      weather: "HEAVY RAIN // 32°C",
      progress: 42
    },
    {
      id: 'SHP-7719',
      origin: { x: 470, y: 155, label: 'Eindhoven, NL' },
      destination: { x: 180, y: 200, label: 'Phoenix, USA' },
      path: "M 470 155 Q 320 110 180 200",
      vehicle: "Air-Convoy Unit 1",
      weather: "ARIZONA SUN // 38°C",
      progress: 84
    }
  ];

  const activeRoute = routes.find((r) => r.id === selectedShipmentId) || routes[0];

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        border: '1px solid rgba(226, 232, 240, 0.9)',
        boxShadow: '0 12px 30px -5px rgba(15, 23, 42, 0.05)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Top Map Control Bar */}
      <div
        style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
          backgroundColor: '#F8FAFC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: '#E0F2FE', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icons.Globe2 size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Global Autonomous Transit Corridor
              </h4>
              <Badge variant="emerald" pulse>Live Satellite Link</Badge>
            </div>
            <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
              Vector vector routing over Starlink LEO quantum nodes
            </span>
          </div>
        </div>

        {/* Route Selector Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {routes.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedShipmentId(r.id)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '10px',
                border: '1px solid',
                borderColor: selectedShipmentId === r.id ? '#0EA5E9' : 'rgba(203, 213, 225, 0.8)',
                backgroundColor: selectedShipmentId === r.id ? '#E0F2FE' : '#FFFFFF',
                color: selectedShipmentId === r.id ? '#0284C7' : '#64748B',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.15s ease'
              }}
            >
              <Icons.Navigation size={14} />
              <span>{r.id}: {r.origin.label.split(',')[0]} → {r.destination.label.split(',')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* SVG Interactive Map Viewport */}
      <div style={{ position: 'relative', width: '100%', height: '460px', backgroundColor: '#F1F5F9', overflow: 'hidden' }}>
        {/* Subtle World Map Grid Background */}
        <svg viewBox="0 0 1000 500" style={{ width: '100%', height: '100%' }}>
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(203, 213, 225, 0.4)" strokeWidth="0.8" />
            </pattern>
            <linearGradient id="route-glow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#0EA5E9" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
          </defs>

          {/* Grid Fill */}
          <rect width="1000" height="500" fill="url(#grid-pattern)" />

          {/* Stylized Landmass Contours (North America, Europe, Asia, Africa outlines) */}
          <g fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" opacity="0.6">
            {/* North America */}
            <path d="M 100 100 Q 200 80 300 140 Q 280 220 180 260 Q 120 220 100 100 Z" />
            {/* South America */}
            <path d="M 220 280 Q 280 320 260 420 Q 200 440 180 360 Z" />
            {/* Europe */}
            <path d="M 440 100 Q 520 110 540 180 Q 480 200 440 150 Z" />
            {/* Asia */}
            <path d="M 540 110 Q 750 90 840 180 Q 800 280 660 260 Q 580 220 540 110 Z" />
            {/* Africa */}
            <path d="M 450 210 Q 550 220 560 360 Q 480 400 440 320 Z" />
          </g>

          {/* All Inactive Route Trajectories */}
          {routes.map((r) => (
            <path
              key={`inactive-${r.id}`}
              d={r.path}
              fill="none"
              stroke="#CBD5E1"
              strokeWidth="2"
              strokeDasharray="6 6"
              opacity={selectedShipmentId === r.id ? 0.2 : 0.6}
            />
          ))}

          {/* Active Route Trajectory (Glowing Gradient Path) */}
          <path
            d={activeRoute.path}
            fill="none"
            stroke="url(#route-glow)"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Animated Moving Vehicle Marker along active path */}
          <g>
            <circle r="16" fill="rgba(16, 185, 129, 0.25)">
              <animateMotion path={activeRoute.path} dur="12s" repeatCount="indefinite" rotate="auto" />
            </circle>
            <circle r="8" fill="#10B981" stroke="#FFFFFF" strokeWidth="2.5">
              <animateMotion path={activeRoute.path} dur="12s" repeatCount="indefinite" rotate="auto" />
            </circle>
          </g>

          {/* Origin & Destination Nodes */}
          {routes.map((r) => {
            const isSelected = selectedShipmentId === r.id;
            return (
              <g key={`nodes-${r.id}`}>
                {/* Origin Node */}
                <circle cx={r.origin.x} cy={r.origin.y} r={isSelected ? 7 : 5} fill="#0EA5E9" stroke="#FFFFFF" strokeWidth="2" />
                <text x={r.origin.x} y={r.origin.y - 12} fill="#0F172A" fontSize="11" fontWeight="700" textAnchor="middle">
                  {r.origin.label}
                </text>

                {/* Destination Node */}
                <circle cx={r.destination.x} cy={r.destination.y} r={isSelected ? 7 : 5} fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
                <text x={r.destination.x} y={r.destination.y - 12} fill="#0F172A" fontSize="11" fontWeight="700" textAnchor="middle">
                  {r.destination.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Shipment Card Overlay (Bottom Right / Top Left) */}
        <div
          style={{
            position: 'absolute',
            bottom: '1.5rem',
            right: '1.5rem',
            width: '360px',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: '20px',
            border: '1px solid rgba(226, 232, 240, 0.9)',
            boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.15)',
            padding: '1.25rem',
            zIndex: 10,
            animation: 'fade-in-up 0.25s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', borderBottom: '1px solid rgba(226, 232, 240, 0.8)', paddingBottom: '0.6rem' }}>
            <div>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Active Transit // {currentShipment.id}
              </span>
              <h5 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '220px' }}>
                {currentShipment.cargo}
              </h5>
            </div>
            <Badge variant="emerald" size="sm" pulse>
              {currentShipment.status}
            </Badge>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
            <div style={{ backgroundColor: '#F8FAFC', padding: '0.6rem', borderRadius: '12px', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
              <span style={{ fontSize: '0.68rem', color: '#64748B', display: 'block' }}>ESTIMATED ARRIVAL</span>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>{currentShipment.eta}</span>
            </div>
            <div style={{ backgroundColor: '#F8FAFC', padding: '0.6rem', borderRadius: '12px', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
              <span style={{ fontSize: '0.68rem', color: '#64748B', display: 'block' }}>WEATHER / CORRIDOR</span>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0284C7' }}>{activeRoute.weather}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
              <span style={{ color: '#64748B', fontWeight: 600 }}>Transit Completion</span>
              <span style={{ fontWeight: 800, color: '#10B981' }}>{currentShipment.progress}%</span>
            </div>
            <div style={{ width: '100%', height: '8px', borderRadius: '4px', backgroundColor: '#E2E8F0', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${currentShipment.progress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #10B981 0%, #0EA5E9 100%)',
                  borderRadius: '4px',
                  transition: 'width 0.5s ease'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: '#475569', backgroundColor: '#F1F5F9', padding: '0.5rem 0.75rem', borderRadius: '10px', marginBottom: '0.85rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Icons.BatteryCharging size={15} color="#10B981" /> Battery: <strong>{currentShipment.vehicle.battery}%</strong>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Icons.Thermometer size={15} color="#0EA5E9" /> Temp: <strong>{currentShipment.telemetry.temperature}</strong>
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            icon="Radio"
            className="w-full"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => onSelectShipment && onSelectShipment(currentShipment)}
          >
            Inspect Live Telemetry & Sensors
          </Button>
        </div>

        {/* Top Left Floating Indicator */}
        <div
          style={{
            position: 'absolute',
            top: '1.25rem',
            left: '1.25rem',
            padding: '0.5rem 0.85rem',
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(226, 232, 240, 0.9)',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#334155',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            zIndex: 10
          }}
        >
          <Icons.Radio size={14} color="#10B981" className="animate-pulse" />
          <span>Quantum Telemetry Uplink // 1,428 Nodes Connected</span>
        </div>
      </div>
    </div>
  );
};
