import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { activeShipments } from '../data/mockData';
import { Table } from '../components/common/Table';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';

export const Shipments = ({ onSelectShipment, onOpenWizard }) => {
  const [filterTab, setFilterTab] = useState('All'); // 'All' | 'Active Transit' | 'AI Intervention' | 'Delivered'
  const [inspectShipment, setInspectShipment] = useState(null);
  const [shipmentsList, setShipmentsList] = useState(activeShipments);

  const filteredData = filterTab === 'All'
    ? shipmentsList
    : shipmentsList.filter((s) => s.status.toLowerCase().includes(filterTab.toLowerCase().split(' ')[0]));

  const columns = [
    {
      key: 'id',
      header: 'Manifest ID',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: row.status.includes('Active') ? '#D1FAE5' : '#FEF3C7',
              color: row.status.includes('Active') ? '#059669' : '#D97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.8rem'
            }}
          >
            {row.id.split('-')[1]}
          </div>
          <div>
            <span style={{ fontWeight: 800, color: '#0F172A', display: 'block' }}>{row.id}</span>
            <span style={{ fontSize: '0.72rem', color: '#64748B' }}>{row.trackingNumber}</span>
          </div>
        </div>
      )
    },
    {
      key: 'cargo',
      header: 'Consignment & Client',
      render: (row) => (
        <div>
          <span style={{ fontWeight: 700, color: '#0F172A', display: 'block' }}>{row.cargo}</span>
          <span style={{ fontSize: '0.78rem', color: '#0EA5E9' }}>{row.client}</span>
        </div>
      )
    },
    {
      key: 'origin',
      header: 'Transit Route',
      render: (row) => (
        <div>
          <span style={{ fontWeight: 600, color: '#334155', display: 'block' }}>{row.origin.city} → {row.destination.city}</span>
          <span style={{ fontSize: '0.75rem', color: '#64748B' }}>ETA: {row.eta}</span>
        </div>
      )
    },
    {
      key: 'healthScore',
      header: 'AI Health Index',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '40px', height: '6px', borderRadius: '3px', backgroundColor: '#E2E8F0', overflow: 'hidden' }}>
            <div style={{ width: `${row.healthScore}%`, height: '100%', backgroundColor: row.healthScore > 95 ? '#10B981' : '#F59E0B' }} />
          </div>
          <span style={{ fontWeight: 800, color: row.healthScore > 95 ? '#059669' : '#D97706' }}>{row.healthScore}%</span>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status'
    }
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Header Bar */}
      <div
        style={{
          padding: '2rem',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
          border: '1px solid rgba(226, 232, 240, 0.9)',
          boxShadow: '0 12px 30px -5px rgba(15, 23, 42, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <Badge variant="emerald" pulse>Enterprise Ledger Active</Badge>
            <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
              Showing {filteredData.length} of 1,428 Global Consignments
            </span>
          </div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Autonomous Manifest & Telemetry Ledger
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Button variant="outline" icon="Download" onClick={() => alert("Exporting cryptographic CSV manifest audit trail...")}>
            Export Audit CSV
          </Button>
          <Button variant="primary" icon="Plus" onClick={onOpenWizard}>
            Dispatch New Manifest
          </Button>
        </div>
      </div>

      {/* Filter Tabs & Table */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#FFFFFF', padding: '6px', borderRadius: '16px', border: '1px solid rgba(226, 232, 240, 0.9)', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)' }}>
            {['All', 'Active Transit', 'AI Intervention', 'Delivered'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                style={{
                  padding: '0.5rem 1.1rem',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: filterTab === tab ? '#10B981' : 'transparent',
                  color: filterTab === tab ? '#FFFFFF' : '#64748B',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: filterTab === tab ? '0 4px 12px rgba(16, 185, 129, 0.25)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <Table
          data={filteredData}
          columns={columns}
          searchPlaceholder="Search manifests by ID, tracking code, pharmaceutical client, or port..."
          onRowClick={(row) => setInspectShipment(row)}
          actionsRender={(row) => (
            <Button
              variant="ghost"
              size="sm"
              iconRight="ArrowRight"
              onClick={() => {
                onSelectShipment && onSelectShipment(row);
                setInspectShipment(row);
              }}
            >
              Inspect
            </Button>
          )}
        />
      </div>

      {/* Detail Inspector Modal */}
      <Modal
        isOpen={!!inspectShipment}
        onClose={() => setInspectShipment(null)}
        title={inspectShipment ? `Manifest Audit // ${inspectShipment.id}` : ''}
        subtitle={inspectShipment ? `${inspectShipment.trackingNumber} // ${inspectShipment.client}` : ''}
        icon="FileCheck"
        iconColor="#10B981"
        maxWidth="680px"
        footer={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
              Cryptographic hash verified on AETHER blockchain
            </span>
            <Button variant="primary" icon="Radio" onClick={() => {
              onSelectShipment && onSelectShipment(inspectShipment);
              setInspectShipment(null);
            }}>
              Launch Live Telemetry View
            </Button>
          </div>
        }
      >
        {inspectShipment && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ padding: '1.25rem', borderRadius: '16px', backgroundColor: '#0F172A', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>Active Consignment</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', display: 'block' }}>{inspectShipment.cargo}</span>
              </div>
              <Badge variant="emerald" pulse>{inspectShipment.status}</Badge>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '14px', border: '1px solid rgba(226, 232, 240, 0.9)' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Origin Port</span>
                <strong style={{ fontSize: '0.95rem', color: '#0F172A' }}>{inspectShipment.origin.city}</strong>
              </div>
              <div style={{ padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '14px', border: '1px solid rgba(226, 232, 240, 0.9)' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Destination Port</span>
                <strong style={{ fontSize: '0.95rem', color: '#0F172A' }}>{inspectShipment.destination.city}</strong>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>
                AI Neural Reasoning & Autonomous Interventions
              </span>
              <div style={{ padding: '1.25rem', borderRadius: '16px', backgroundColor: '#E0E7FF', border: '1px solid #C7D2FE', color: '#312E81', fontSize: '0.9rem', lineHeight: 1.5 }}>
                ⚡ {inspectShipment.aiReasoning}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', textAlign: 'center' }}>
              <div style={{ padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block' }}>CORE TEMP</span>
                <strong style={{ color: '#0EA5E9', fontSize: '0.95rem' }}>{inspectShipment.telemetry.temperature}</strong>
              </div>
              <div style={{ padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block' }}>VIBRATION</span>
                <strong style={{ color: '#10B981', fontSize: '0.95rem' }}>{inspectShipment.telemetry.vibration.split(' ')[0]}</strong>
              </div>
              <div style={{ padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block' }}>DOOR SEAL</span>
                <strong style={{ color: '#6366F1', fontSize: '0.85rem' }}>Biometric Lock</strong>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
