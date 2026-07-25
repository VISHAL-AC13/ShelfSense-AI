import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { liveAlerts, activeShipments } from '../../data/mockData';

export const TopNav = ({ activeTab, setActiveTab, onOpenSearch, onOpenWizard, isSidebarCollapsed }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const activeShipment = activeShipments[0]; // SHP-9024

  const getPageTitle = () => {
    switch (activeTab) {
      case 'live-monitoring':
        return { category: 'TELEMETRY & IOT', title: 'Real-Time Sensor Monitoring' };
      case 'ai-analysis':
        return { category: 'NEURAL PREDICTION ENGINE', title: 'AI Risk & Spoilage Analysis' };
      case 'shipments':
        return { category: 'GLOBAL SUPPLY CHAIN', title: 'Autonomous Manifest Ledger' };
      case 'reports':
        return { category: 'QUANTITATIVE ASSESSMENTS', title: 'McKinsey Executive Intelligence Briefs' };
      case 'dashboard':
      default:
        return { category: 'MISSION CONTROL', title: 'Global Autonomous Supply Chain' };
    }
  };

  const pageInfo = getPageTitle();

  return (
    <header
      className="glass-panel"
      style={{
        position: 'fixed',
        top: '1.5rem',
        left: isSidebarCollapsed ? '116px' : '302px',
        right: '1.5rem',
        height: '76px',
        borderRadius: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.75rem',
        zIndex: 40,
        transition: 'left 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.05), 0 0 0 1px rgba(226, 232, 240, 0.8)'
      }}
    >
      {/* Left: Breadcrumb & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.72rem', fontWeight: 700, color: '#10B981', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            <span>AETHER 5.0</span>
            <span style={{ color: '#CBD5E1' }}>/</span>
            <span>{pageInfo.category}</span>
          </div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            {pageInfo.title}
          </h2>
        </div>

        {/* Current Shipment Indicator (Pulsing Pill) */}
        <div
          onClick={() => setActiveTab('live-monitoring')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.45rem 0.85rem',
            borderRadius: '9999px',
            backgroundColor: '#F8FAFC',
            border: '1px solid rgba(226, 232, 240, 0.9)',
            boxShadow: '0 2px 6px rgba(15, 23, 42, 0.02)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            maxWidth: '320px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#0EA5E9';
            e.currentTarget.style.backgroundColor = '#FFFFFF';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.9)';
            e.currentTarget.style.backgroundColor = '#F8FAFC';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          title="Click to view real-time telemetry"
        >
          <span style={{ position: 'relative', display: 'flex', width: '8px', height: '8px' }}>
            <span style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', backgroundColor: '#10B981', animation: 'pulse-ring 2s infinite' }} />
            <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', width: '8px', height: '8px', backgroundColor: '#10B981' }} />
          </span>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {activeShipment.id}: {activeShipment.origin.city.split(',')[0]} → {activeShipment.destination.city.split(',')[0]}
          </span>
          <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600, backgroundColor: '#D1FAE5', color: '#059669', padding: '0.1rem 0.45rem', borderRadius: '6px' }}>
            {activeShipment.healthScore}%
          </span>
        </div>
      </div>

      {/* Right: Search, Quick Actions, Notifications, Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Search Input Button */}
        <div
          onClick={onOpenSearch}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            padding: '0.5rem 0.85rem',
            borderRadius: '12px',
            backgroundColor: '#F8FAFC',
            border: '1px solid rgba(226, 232, 240, 0.9)',
            color: '#64748B',
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            minWidth: '220px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FFFFFF';
            e.currentTarget.style.borderColor = '#0EA5E9';
            e.currentTarget.style.color = '#0F172A';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#F8FAFC';
            e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.9)';
            e.currentTarget.style.color = '#64748B';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Icons.Search size={16} />
            <span>Search telemetry or manifest...</span>
          </div>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#E2E8F0', color: '#475569', padding: '0.15rem 0.45rem', borderRadius: '6px' }}>
            ⌘K
          </span>
        </div>

        {/* Quick Actions Button */}
        <Button variant="sky" size="sm" icon="Sparkles" onClick={() => setActiveTab('ai-analysis')}>
          AI Risk Engine
        </Button>

        {/* Notifications Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              border: '1px solid rgba(226, 232, 240, 0.9)',
              backgroundColor: showNotifications ? '#E0F2FE' : '#FFFFFF',
              color: showNotifications ? '#0284C7' : '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.15s ease'
            }}
            title="System Alerts"
          >
            <Icons.Bell size={18} />
            <span
              style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#EF4444',
                boxShadow: '0 0 6px #EF4444'
              }}
            />
          </button>

          {/* Popup Modal for Notifications */}
          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                top: '52px',
                right: 0,
                width: '380px',
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid rgba(226, 232, 240, 0.9)',
                boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.12)',
                padding: '1.25rem',
                zIndex: 100,
                animation: 'fade-in-up 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid rgba(241, 245, 249, 0.9)', paddingBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A' }}>Active Neural Alerts</span>
                  <Badge variant="red" size="sm">3 Live</Badge>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                >
                  Close
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '340px', overflowY: 'auto' }}>
                {liveAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    onClick={() => {
                      setShowNotifications(false);
                      setActiveTab('live-monitoring');
                    }}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '12px',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid rgba(226, 232, 240, 0.8)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#0EA5E9'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.8)'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>{alert.title.split('//')[0]}</span>
                      <span style={{ fontSize: '0.7rem', color: '#64748B' }}>{alert.timestamp}</span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: '#475569', margin: 0, lineHeight: 1.4 }}>
                      {alert.description}
                    </p>
                    <div style={{ marginTop: '0.4rem', fontSize: '0.72rem', color: '#10B981', fontWeight: 600 }}>
                      ⚡ {alert.aiAction.slice(0, 55)}...
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(241, 245, 249, 0.9)', textAlign: 'center' }}>
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    setActiveTab('live-monitoring');
                  }}
                  style={{ background: 'none', border: 'none', color: '#0EA5E9', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  View All Telemetry & Alerts →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile / Status Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.35rem 0.75rem 0.35rem 0.4rem',
            borderRadius: '9999px',
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(226, 232, 240, 0.9)',
            boxShadow: '0 2px 6px rgba(15, 23, 42, 0.03)',
            cursor: 'pointer'
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10B981 0%, #0EA5E9 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.78rem'
            }}
          >
            AV
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', lineHeight: 1 }}>Dr. A. Vance</span>
            <span style={{ fontSize: '0.68rem', color: '#10B981', fontWeight: 600 }}>Level 5 Core</span>
          </div>
        </div>
      </div>
    </header>
  );
};
