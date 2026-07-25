import React from 'react';
import * as Icons from 'lucide-react';
import { userProfile } from '../../data/mockData';

export const Sidebar = ({ activeTab, setActiveTab, isCollapsed, setIsCollapsed, onOpenWizard }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', badge: null },
    { id: 'live-monitoring', label: 'Live Monitoring', icon: 'Radio', badge: 'LIVE', badgeColor: '#10B981' },
    { id: 'ai-analysis', label: 'AI Intelligence', icon: 'Sparkles', badge: '98.4%', badgeColor: '#6366F1' },
    { id: 'shipments', label: 'Shipments', icon: 'Box', badge: '1,428', badgeColor: '#0EA5E9' },
    { id: 'reports', label: 'Executive Briefs', icon: 'FileText', badge: null }
  ];

  return (
    <aside
      className="floating-card"
      style={{
        position: 'fixed',
        top: '1.5rem',
        left: '1.5rem',
        bottom: '1.5rem',
        width: isCollapsed ? '84px' : '270px',
        borderRadius: '24px',
        backgroundColor: '#FFFFFF',
        border: '1px solid rgba(226, 232, 240, 0.9)',
        boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.07), 0 0 0 1px rgba(226, 232, 240, 0.6)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: isCollapsed ? '1.5rem 0.75rem' : '1.5rem 1.25rem',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        zIndex: 50,
        overflow: 'hidden'
      }}
    >
      {/* Top Section: Logo & Toggle */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            marginBottom: '2rem',
            padding: isCollapsed ? '0' : '0 0.5rem'
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('dashboard')}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #10B981 0%, #0EA5E9 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 6px 16px rgba(16, 185, 129, 0.3)',
                flexShrink: 0
              }}
            >
              <Icons.Cpu size={22} strokeWidth={2.5} />
            </div>
            {!isCollapsed && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#0F172A', lineHeight: 1 }}>
                  AETHER
                </span>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#10B981', letterSpacing: '0.12em', marginTop: '3px' }}>
                  AUTONOMOUS AI
                </span>
              </div>
            )}
          </div>

          {/* Collapse Toggle */}
          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                backgroundColor: '#F8FAFC',
                color: '#64748B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              title="Collapse Sidebar"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#E2E8F0';
                e.currentTarget.style.color = '#0F172A';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#F8FAFC';
                e.currentTarget.style.color = '#64748B';
              }}
            >
              <Icons.ChevronLeft size={18} />
            </button>
          )}
        </div>

        {/* Quick Action Button in Sidebar */}
        <div style={{ marginBottom: '1.75rem', padding: isCollapsed ? '0' : '0 0.25rem' }}>
          <button
            onClick={onOpenWizard}
            style={{
              width: '100%',
              padding: isCollapsed ? '0.75rem 0' : '0.75rem 1rem',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 700,
              fontSize: isCollapsed ? '0' : '0.88rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              cursor: 'pointer',
              boxShadow: '0 6px 16px rgba(16, 185, 129, 0.3)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 22px rgba(16, 185, 129, 0.45)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.3)';
            }}
            title="Dispatch Autonomous Shipment"
          >
            <Icons.PlusCircle size={20} />
            {!isCollapsed && <span>Dispatch Shipment</span>}
          </button>
        </div>

        {/* Navigation Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {navItems.map((item) => {
            const IconComp = Icons[item.icon] || Icons.Circle;
            const isActive = activeTab === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isCollapsed ? 'center' : 'space-between',
                  padding: isCollapsed ? '0.85rem 0' : '0.85rem 1rem',
                  borderRadius: '14px',
                  backgroundColor: isActive ? '#D1FAE5' : 'transparent',
                  color: isActive ? '#059669' : '#475569',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  fontWeight: isActive ? 700 : 500
                }}
                title={isCollapsed ? item.label : undefined}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = '#F1F5F9';
                    e.currentTarget.style.color = '#0F172A';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#475569';
                  }
                }}
              >
                {/* Active left indicator indicator bar */}
                {isActive && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '0',
                      top: '20%',
                      height: '60%',
                      width: '4px',
                      borderRadius: '0 6px 6px 0',
                      backgroundColor: '#10B981'
                    }}
                  />
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <IconComp
                    size={20}
                    style={{
                      color: isActive ? '#059669' : '#64748B',
                      transition: 'color 0.2s ease'
                    }}
                  />
                  {!isCollapsed && <span style={{ fontSize: '0.92rem' }}>{item.label}</span>}
                </div>

                {!isCollapsed && item.badge && (
                  <span
                    style={{
                      padding: '0.15rem 0.5rem',
                      borderRadius: '9999px',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      backgroundColor: `${item.badgeColor || '#10B981'}15`,
                      color: item.badgeColor || '#10B981',
                      border: `1px solid ${item.badgeColor || '#10B981'}30`
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Expand Toggle (if collapsed) & Profile / Status */}
      <div>
        {isCollapsed ? (
          <button
            onClick={() => setIsCollapsed(false)}
            style={{
              width: '100%',
              padding: '0.75rem 0',
              borderRadius: '12px',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              backgroundColor: '#F8FAFC',
              color: '#64748B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              marginBottom: '1rem'
            }}
            title="Expand Sidebar"
          >
            <Icons.ChevronRight size={18} />
          </button>
        ) : null}

        {/* Neural Node Status */}
        <div
          style={{
            padding: isCollapsed ? '0.75rem 0' : '0.85rem 1rem',
            borderRadius: '16px',
            backgroundColor: '#F8FAFC',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            gap: '0.75rem',
            marginBottom: '1rem'
          }}
        >
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              flexShrink: 0,
              boxShadow: '0 0 8px rgba(16, 185, 129, 0.8)'
            }}
          />
          {!isCollapsed && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A' }}>Quantum Core 5.0</span>
              <span style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 600 }}>128 Nodes Nominal</span>
            </div>
          )}
        </div>

        {/* User Profile Mini Card */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            gap: '0.75rem',
            padding: isCollapsed ? '0.5rem 0' : '0.5rem 0.5rem',
            borderTop: '1px solid rgba(241, 245, 249, 0.9)',
            paddingTop: '1rem'
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.9rem',
              flexShrink: 0,
              boxShadow: '0 4px 10px rgba(14, 165, 233, 0.25)'
            }}
          >
            {userProfile.avatar}
          </div>
          {!isCollapsed && (
            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {userProfile.name}
              </span>
              <span style={{ fontSize: '0.72rem', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {userProfile.role.split('//')[0]}
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
