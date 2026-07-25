import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { ShipmentWizardModal } from '../forms/ShipmentWizardModal';
import { Modal } from '../common/Modal';
import { activeShipments } from '../../data/mockData';
import { Badge } from '../common/Badge';

export const Layout = ({ activeTab, setActiveTab, children, onShipmentCreated }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredSearchResults = activeShipments.filter((s) =>
    s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.cargo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.origin.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', display: 'flex' }}>
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        onOpenWizard={() => setIsWizardOpen(true)}
      />

      {/* TopNav */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenWizard={() => setIsWizardOpen(true)}
        isSidebarCollapsed={isSidebarCollapsed}
      />

      {/* Main Content Area */}
      <main
        style={{
          flex: 1,
          marginLeft: isSidebarCollapsed ? '116px' : '302px',
          marginRight: '1.5rem',
          marginTop: '108px', // 76px nav height + 32px gap
          marginBottom: '2rem',
          transition: 'margin-left 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          animation: 'fade-in-up 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {children}
      </main>

      {/* Global ⌘K Search Modal */}
      <Modal
        isOpen={isSearchOpen}
        onClose={() => {
          setIsSearchOpen(false);
          setSearchQuery('');
        }}
        title="Command & Telemetry Search"
        subtitle="Search across active shipments, neural logs, or IoT sensors (Press Esc to exit)"
        icon="Search"
        iconColor="#0EA5E9"
        maxWidth="620px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ position: 'relative' }}>
            <Icons.Search size={20} color="#0EA5E9" style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Type shipment ID (e.g. SHP-9024), city, or cargo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              style={{
                width: '100%',
                padding: '0.9rem 1.25rem 0.9rem 3.25rem',
                borderRadius: '16px',
                border: '2px solid #0EA5E9',
                backgroundColor: '#F8FAFC',
                fontSize: '1rem',
                color: '#0F172A',
                outline: 'none',
                boxShadow: '0 0 0 4px rgba(14, 165, 233, 0.15)'
              }}
            />
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'block' }}>
              {searchQuery ? `Search Results (${filteredSearchResults.length})` : 'Quick Jump Suggestions'}
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '320px', overflowY: 'auto' }}>
              {filteredSearchResults.map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    setIsSearchOpen(false);
                    setActiveTab('shipments');
                  }}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '14px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(226, 232, 240, 0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#0EA5E9';
                    e.currentTarget.style.backgroundColor = '#F8FAFC';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.9)';
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#E0F2FE', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>
                      {s.id.split('-')[1]}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}>{s.id} // {s.cargo.slice(0, 32)}...</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{s.origin.city} → {s.destination.city} // {s.client.split('//')[0]}</div>
                    </div>
                  </div>
                  <Badge variant={s.status.includes('Active') ? 'emerald' : 'amber'} size="sm" pulse>
                    {s.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Dispatch Shipment Wizard Modal */}
      <ShipmentWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onShipmentCreated={onShipmentCreated}
      />
    </div>
  );
};
