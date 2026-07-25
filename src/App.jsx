import React, { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { LiveMonitoring } from './pages/LiveMonitoring';
import { AIAnalysis } from './pages/AIAnalysis';
import { Shipments } from './pages/Shipments';
import { Reports } from './pages/Reports';
import * as Icons from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleShipmentCreated = (newShip) => {
    showToast(`✅ Manifest ${newShip.id} dispatched! AI monitoring active.`);
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'live-monitoring':
        return <LiveMonitoring selectedShipment={selectedShipment} />;
      case 'ai-analysis':
        return <AIAnalysis />;
      case 'shipments':
        return (
          <Shipments
            onSelectShipment={(ship) => {
              setSelectedShipment(ship);
              setActiveTab('live-monitoring');
            }}
            onOpenWizard={() => {
              // Triggered inside layout
            }}
          />
        );
      case 'reports':
        return <Reports />;
      case 'dashboard':
      default:
        return (
          <Dashboard
            setActiveTab={setActiveTab}
            onSelectShipment={(ship) => {
              setSelectedShipment(ship);
            }}
          />
        );
    }
  };

  return (
    <div className="min-h-screen">
      <Layout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onShipmentCreated={handleShipmentCreated}
      >
        {renderPage()}
      </Layout>

      {/* Global Notification Toast */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            padding: '1rem 1.5rem',
            borderRadius: '16px',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.4)',
            border: '1px solid rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            zIndex: 10000,
            animation: 'fade-in-up 0.3s ease'
          }}
        >
          <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
            <Icons.Check size={16} strokeWidth={3} />
          </div>
          <span style={{ fontSize: '0.92rem', fontWeight: 700 }}>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', marginLeft: '0.5rem' }}
          >
            <Icons.X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
