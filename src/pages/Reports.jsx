import React from 'react';
import * as Icons from 'lucide-react';
import { mcKinseyReportData, userProfile } from '../data/mockData';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const Reports = () => {
  const report = mcKinseyReportData;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Top Controls Bar */}
      <div
        style={{
          padding: '1.5rem 2rem',
          borderRadius: '24px',
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(226, 232, 240, 0.9)',
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.04)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#E0E7FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icons.FileText size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Strategic Advisory // Q3 Quantitative Audit
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              McKinsey / Deloitte Executive Intelligence Briefing
            </h3>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <Button variant="outline" icon="Printer" onClick={handlePrint}>
            Print / Save PDF Brief
          </Button>
          <Button variant="sky" icon="Share2" onClick={() => alert("Cryptographic report share link generated and copied to clipboard.")}>
            Share with Stakeholders
          </Button>
        </div>
      </div>

      {/* McKinsey Editorial Document Surface */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '28px',
          border: '1px solid rgba(203, 213, 225, 0.9)',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.08)',
          padding: '4rem 4.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '3rem',
          position: 'relative'
        }}
      >
        {/* Editorial Top Border Seal */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '4.5rem',
            right: '4.5rem',
            height: '6px',
            background: 'linear-gradient(90deg, #10B981 0%, #0EA5E9 50%, #6366F1 100%)',
            borderRadius: '0 0 4px 4px'
          }}
        />

        {/* 1. Document Header */}
        <div style={{ borderBottom: '2px solid #0F172A', paddingBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
          <div style={{ maxWidth: '640px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#10B981', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: '0.75rem' }}>
              CONFIDENTIAL // BOARD OF DIRECTORS & ADVISORY PANEL
            </span>
            <h1 style={{ fontSize: '2.6rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1.15, margin: 0 }}>
              {report.title}
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#475569', marginTop: '1rem', lineHeight: 1.6 }}>
              A quantitative assessment of autonomous logistics risk mitigation, cryogenic thermal stability, and financial loss prevention across global trade corridors.
            </p>
          </div>

          <div style={{ backgroundColor: '#F8FAFC', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(226, 232, 240, 0.9)', minWidth: '260px' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>PREPARED BY</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>{report.author}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 600, marginTop: '1rem' }}>DATE OF ISSUE</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>{report.date}</div>
            <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(226, 232, 240, 0.8)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Icons.ShieldCheck size={16} color="#10B981" />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669' }}>Verified Quantum Ledger</span>
            </div>
          </div>
        </div>

        {/* 2. Executive Summary Quote Box */}
        <div
          style={{
            padding: '2.5rem',
            borderRadius: '20px',
            backgroundColor: '#F8FAFC',
            borderLeft: '6px solid #10B981',
            boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.03)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#059669', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            <Icons.Quote size={18} /> Executive Summary & Findings
          </div>
          <p style={{ fontSize: '1.15rem', color: '#1E293B', lineHeight: 1.7, fontWeight: 500, fontStyle: 'italic', margin: 0 }}>
            "{report.executiveSummary}"
          </p>
        </div>

        {/* 3. Key Financial & Operational KPI Metrics */}
        <div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.5rem' }}>
            1. Key Quantitative Impact Metrics (Trailing 90 Days)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {report.keyMetrics.map((km, idx) => (
              <div
                key={idx}
                style={{
                  padding: '1.75rem',
                  borderRadius: '20px',
                  backgroundColor: km.highlight ? '#0F172A' : '#FFFFFF',
                  color: km.highlight ? '#FFFFFF' : '#0F172A',
                  border: km.highlight ? '1px solid #0F172A' : '1px solid rgba(203, 213, 225, 0.9)',
                  boxShadow: km.highlight ? '0 15px 30px -10px rgba(15, 23, 42, 0.3)' : '0 4px 12px rgba(15, 23, 42, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}
              >
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: km.highlight ? '#94A3B8' : '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {km.label}
                </span>
                <div style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.04em', color: km.highlight ? '#34D399' : '#0F172A' }}>
                  {km.value}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Badge variant={km.highlight ? 'emerald' : 'sky'} size="sm">
                    {km.delta}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Financial Loss Prevention Breakdown (Bar Distribution) */}
        <div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.5rem' }}>
            2. Financial Loss Prevention & Risk Category Breakdown ($14.8M Total)
          </h3>
          <div style={{ padding: '2rem', borderRadius: '24px', backgroundColor: '#FFFFFF', border: '1px solid rgba(226, 232, 240, 0.9)', boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.03)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {report.lossPreventionBreakdown.map((item, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>{item.category}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>{item.percentage}% of savings</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: item.color }}>{item.amount}</span>
                  </div>
                </div>
                <div style={{ width: '100%', height: '12px', borderRadius: '6px', backgroundColor: '#F1F5F9', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${item.percentage}%`,
                      height: '100%',
                      backgroundColor: item.color,
                      borderRadius: '6px',
                      transition: 'width 1s ease'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Strategic McKinsey Recommendations */}
        <div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.5rem' }}>
            3. Strategic Recommendations for Board Consideration
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {report.strategicRecommendations.map((sr) => (
              <div
                key={sr.number}
                style={{
                  padding: '2rem',
                  borderRadius: '24px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid rgba(226, 232, 240, 0.9)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '2rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <div
                  style={{
                    fontSize: '2rem',
                    fontWeight: 800,
                    color: '#0EA5E9',
                    lineHeight: 1,
                    padding: '0.5rem 0.85rem',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid rgba(226, 232, 240, 0.9)',
                    boxShadow: '0 4px 10px rgba(15, 23, 42, 0.04)'
                  }}
                >
                  {sr.number}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      {sr.title}
                    </h4>
                    <Badge variant="indigo">{sr.priority}</Badge>
                  </div>
                  <p style={{ fontSize: '0.98rem', color: '#334155', margin: 0, lineHeight: 1.6 }}>
                    {sr.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Document Signoff Footer */}
        <div style={{ paddingTop: '2.5rem', borderTop: '2px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A' }}>{userProfile.name}</div>
            <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{userProfile.role}</div>
            <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 700, marginTop: '4px' }}>
              ✍️ Cryptographic Digital Signature Verified (SHA-256)
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8', display: 'block' }}>AETHER DYNAMICS & BIO-LOGISTICS</span>
            <span style={{ fontSize: '0.75rem', color: '#CBD5E1' }}>Report Ref: ADV-2026-Q3-MCK</span>
          </div>
        </div>
      </div>
    </div>
  );
};
