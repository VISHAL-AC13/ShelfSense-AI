import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export const ShipmentWizardModal = ({ isOpen, onClose, onShipmentCreated }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    cargoName: 'Quantum Superconducting Processor Core',
    client: 'CERN // Large Hadron Collider Div',
    origin: 'Geneva, Switzerland (GVA-Cryo 1)',
    destination: 'Tokyo, Japan (HND-TechLab)',
    vehicleType: 'HALE-900 Autonomous Air Drone',
    targetTemp: '-270.0',
    maxVibration: '0.02',
    biometricLock: true,
    aiModel: 'AETHER-7 Quantum Transformer (v4.8)',
    priority: 'Critical'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateStep1 = () => {
    const errs = {};
    if (!formData.cargoName.trim()) errs.cargoName = 'Cargo description is required';
    if (!formData.client.trim()) errs.client = 'Client / Stakeholder is required';
    if (!formData.origin.trim()) errs.origin = 'Origin port is required';
    if (!formData.destination.trim()) errs.destination = 'Destination port is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!formData.targetTemp || isNaN(formData.targetTemp)) errs.targetTemp = 'Valid target temperature required';
    if (!formData.maxVibration || isNaN(formData.maxVibration)) errs.maxVibration = 'Valid vibration threshold required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((s) => Math.min(3, s + 1));
  };

  const handlePrev = () => {
    setStep((s) => Math.max(1, s - 1));
  };

  const handleLaunch = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onShipmentCreated && onShipmentCreated({
        id: `SHP-${Math.floor(1000 + Math.random() * 9000)}`,
        trackingNumber: `AETH-2026-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        cargo: formData.cargoName,
        client: formData.client,
        origin: { city: formData.origin.split('(')[0].trim(), coords: [46.2044, 6.1432] },
        destination: { city: formData.destination.split('(')[0].trim(), coords: [35.6762, 139.6503] },
        status: "Active Transit",
        healthScore: 99.8,
        progress: 12,
        eta: "18h 45m remaining",
        currentLocation: "Geneva Ascent Corridor // FL180",
        vehicle: { type: formData.vehicleType, id: "ACD-X99", battery: 100, signal: "Starlink Quantum" },
        telemetry: {
          temperature: `${formData.targetTemp}°C`,
          targetTemp: `${formData.targetTemp}°C`,
          humidity: "0.01%",
          vibration: "0.005G (Ultra-Stable)",
          doorSeal: "Tamper Lock Active // Biometric Sealed",
          pressure: "101.3 kPa"
        },
        aiReasoning: `Manifest initialized under ${formData.aiModel}. Real-time predictive spoilage models activated with thermal tolerance buffer of ±0.2°C.`,
        riskLevel: "Low",
        priority: formData.priority
      });
      onClose();
      setStep(1);
    }, 1200);
  };

  const inputStyle = {
    width: '100%',
    padding: '0.85rem 1rem',
    borderRadius: '14px',
    border: '1px solid rgba(203, 213, 225, 0.9)',
    backgroundColor: '#FFFFFF',
    fontSize: '0.95rem',
    color: '#0F172A',
    outline: 'none',
    transition: 'all 0.2s ease',
    marginTop: '0.35rem'
  };

  const labelStyle = {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#334155',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem'
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Dispatch Autonomous Shipment"
      subtitle="Configure IoT telemetry parameters and assign AI neural monitoring models"
      icon="Send"
      iconColor="#10B981"
      maxWidth="720px"
      footer={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Step {step} of 3 //</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>
              {step === 1 ? 'Route & Cargo Manifest' : step === 2 ? 'Sensor Thresholds' : 'AI Verification & Launch'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {step > 1 && (
              <Button variant="outline" onClick={handlePrev} disabled={isSubmitting}>
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button variant="primary" iconRight="ArrowRight" onClick={handleNext}>
                Continue to {step === 1 ? 'Telemetry' : 'Review'}
              </Button>
            ) : (
              <Button variant="primary" icon="Rocket" onClick={handleLaunch} isLoading={isSubmitting}>
                Launch Autonomous Monitor
              </Button>
            )}
          </div>
        </div>
      }
    >
      {/* Wizard Step Indicator Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', padding: '0 1rem' }}>
        {[
          { num: 1, title: "Cargo & Route", icon: "Package" },
          { num: 2, title: "IoT Telemetry", icon: "Activity" },
          { num: 3, title: "AI Neural Launch", icon: "Cpu" }
        ].map((s, idx) => (
          <React.Fragment key={s.num}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  backgroundColor: step === s.num ? '#10B981' : step > s.num ? '#D1FAE5' : '#F1F5F9',
                  color: step === s.num ? '#FFFFFF' : step > s.num ? '#059669' : '#94A3B8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  boxShadow: step === s.num ? '0 6px 14px rgba(16, 185, 129, 0.3)' : 'none',
                  transition: 'all 0.25s ease'
                }}
              >
                {step > s.num ? <Icons.Check size={18} strokeWidth={3} /> : s.num}
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: step >= s.num ? '#0F172A' : '#94A3B8' }}>
                  {s.title}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                  {step === s.num ? 'In Progress' : step > s.num ? 'Completed' : 'Pending'}
                </div>
              </div>
            </div>
            {idx < 2 && (
              <div
                style={{
                  height: '2px',
                  flex: '1 1 60px',
                  backgroundColor: step > idx + 1 ? '#10B981' : '#E2E8F0',
                  margin: '0 0.75rem',
                  transition: 'background-color 0.25s ease'
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* STEP 1: Route & Cargo Manifest */}
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={labelStyle}><Icons.Box size={16} color="#0EA5E9" /> Cargo Description & Specification</label>
            <input
              type="text"
              value={formData.cargoName}
              onChange={(e) => setFormData({ ...formData, cargoName: e.target.value })}
              style={{ ...inputStyle, borderColor: errors.cargoName ? '#EF4444' : 'rgba(203, 213, 225, 0.9)' }}
              placeholder="e.g. mRNA Genomic Vaccines (-70°C Cold Chain)"
            />
            {errors.cargoName && <span style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '4px', display: 'block' }}>{errors.cargoName}</span>}
          </div>

          <div>
            <label style={labelStyle}><Icons.Users size={16} color="#0EA5E9" /> Client / Enterprise Stakeholder</label>
            <input
              type="text"
              value={formData.client}
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              style={{ ...inputStyle, borderColor: errors.client ? '#EF4444' : 'rgba(203, 213, 225, 0.9)' }}
              placeholder="e.g. Novartis Bio-Pharma Global Hub"
            />
            {errors.client && <span style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '4px', display: 'block' }}>{errors.client}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}><Icons.MapPin size={16} color="#10B981" /> Origin Port / Gateway</label>
              <input
                type="text"
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                style={{ ...inputStyle, borderColor: errors.origin ? '#EF4444' : 'rgba(203, 213, 225, 0.9)' }}
              />
              {errors.origin && <span style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '4px', display: 'block' }}>{errors.origin}</span>}
            </div>

            <div>
              <label style={labelStyle}><Icons.Navigation size={16} color="#6366F1" /> Destination Facility</label>
              <input
                type="text"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                style={{ ...inputStyle, borderColor: errors.destination ? '#EF4444' : 'rgba(203, 213, 225, 0.9)' }}
              />
              {errors.destination && <span style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '4px', display: 'block' }}>{errors.destination}</span>}
            </div>
          </div>

          <div>
            <label style={labelStyle}><Icons.Truck size={16} color="#0D9488" /> Autonomous Transport Vehicle</label>
            <select
              value={formData.vehicleType}
              onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="HALE-900 Autonomous Air Drone">HALE-900 Autonomous Air Drone (Long Range)</option>
              <option value="Volvo FH16-E Electric Autonomous Rig">Volvo FH16-E Electric Autonomous Rig (Highway)</option>
              <option value="EuroCargo Cryo-Express High-Speed Rail">EuroCargo Cryo-Express High-Speed Rail</option>
              <option value="Air-Suspension Semiconductor Convoy">Air-Suspension Semiconductor Convoy (Ultra-Stable)</option>
            </select>
          </div>
        </div>
      )}

      {/* STEP 2: IoT Telemetry & Sensor Thresholds */}
      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ padding: '1rem', borderRadius: '16px', backgroundColor: '#F0FDFA', border: '1px solid #99F6E4', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Icons.ThermometerSnowflake size={24} color="#0D9488" />
            <div>
              <span style={{ fontWeight: 700, color: '#0F766E', fontSize: '0.9rem', display: 'block' }}>Thermal & Vibration Precision Protection</span>
              <span style={{ fontSize: '0.8rem', color: '#115E59' }}>AETHER AI will automatically initiate active liquid nitrogen coolant or reroute around road turbulence if thresholds are approached within ±5%.</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}><Icons.Thermometer size={16} color="#0EA5E9" /> Target Core Temp (°C)</label>
              <input
                type="number"
                step="0.1"
                value={formData.targetTemp}
                onChange={(e) => setFormData({ ...formData, targetTemp: e.target.value })}
                style={{ ...inputStyle, borderColor: errors.targetTemp ? '#EF4444' : 'rgba(203, 213, 225, 0.9)' }}
              />
            </div>

            <div>
              <label style={labelStyle}><Icons.Activity size={16} color="#10B981" /> Max Vibration Threshold (G)</label>
              <input
                type="number"
                step="0.01"
                value={formData.maxVibration}
                onChange={(e) => setFormData({ ...formData, maxVibration: e.target.value })}
                style={{ ...inputStyle, borderColor: errors.maxVibration ? '#EF4444' : 'rgba(203, 213, 225, 0.9)' }}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}><Icons.ShieldCheck size={16} color="#6366F1" /> Biometric Security & Tamper Protocol</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, biometricLock: true })}
                style={{
                  flex: 1,
                  padding: '0.85rem',
                  borderRadius: '14px',
                  border: `2px solid ${formData.biometricLock ? '#10B981' : 'rgba(226, 232, 240, 0.9)'}`,
                  backgroundColor: formData.biometricLock ? '#D1FAE5' : '#F8FAFC',
                  color: formData.biometricLock ? '#059669' : '#64748B',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <Icons.Lock size={18} /> Biometric Tamper Lock Active
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, biometricLock: false })}
                style={{
                  flex: 1,
                  padding: '0.85rem',
                  borderRadius: '14px',
                  border: `2px solid ${!formData.biometricLock ? '#0EA5E9' : 'rgba(226, 232, 240, 0.9)'}`,
                  backgroundColor: !formData.biometricLock ? '#E0F2FE' : '#F8FAFC',
                  color: !formData.biometricLock ? '#0284C7' : '#64748B',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <Icons.Unlock size={18} /> Standard Electronic Seal
              </button>
            </div>
          </div>

          <div>
            <label style={labelStyle}><Icons.Flag size={16} color="#F59E0B" /> SLA Priority Classification</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="Critical">Critical Level 5 // Zero Tolerance for Drift</option>
              <option value="High">High Priority // Accelerated Customs Green-Lane</option>
              <option value="Standard">Standard Autonomous Logistics</option>
            </select>
          </div>
        </div>
      )}

      {/* STEP 3: AI Neural Launch Review */}
      {step === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ padding: '1.25rem', borderRadius: '18px', background: 'linear-gradient(135deg, #E0E7FF 0%, #F3E8FF 100%)', border: '1px solid #C7D2FE' }}>
            <div style={{ display: 'flex', items: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Icons.Sparkles size={20} color="#4F46E5" />
                <span style={{ fontWeight: 800, color: '#312E81', fontSize: '1rem' }}>AI Neural Verification Ready</span>
              </div>
              <Badge variant="indigo" pulse>99.9% Prediction Confidence</Badge>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#4338CA', margin: 0, lineHeight: 1.5 }}>
              AETHER has pre-simulated 10,000 meteorological and traffic permutations for this corridor. Optimal flight altitude and customs cryptographic tokens are loaded into autonomous node <strong style={{ color: '#1E1B4B' }}>#ACD-X99</strong>.
            </p>
          </div>

          {/* Summary Box */}
          <div style={{ padding: '1.25rem', borderRadius: '18px', backgroundColor: '#F8FAFC', border: '1px solid rgba(226, 232, 240, 0.9)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Cargo Specification</span>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>{formData.cargoName}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Stakeholder / Client</span>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>{formData.client}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Transit Corridor</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>{formData.origin} → {formData.destination}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Assigned Vehicle</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>{formData.vehicleType}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Target Core Temp</span>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0D9488' }}>{formData.targetTemp}°C (±0.1°C buffer)</span>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Security Protocol</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#10B981' }}>{formData.biometricLock ? '🔒 Biometric Tamper Sealed' : '🔓 Electronic Seal'}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.82rem', color: '#64748B', padding: '0 0.5rem' }}>
            <Icons.ShieldCheck size={16} color="#10B981" />
            <span>Insured up to $5,000,000 under AETHER Autonomous Zero-Loss Guarantee.</span>
          </div>
        </div>
      )}
    </Modal>
  );
};
