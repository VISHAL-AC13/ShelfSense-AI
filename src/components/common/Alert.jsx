import React from 'react';
import * as Icons from 'lucide-react';
import { Button } from './Button';
import { Badge } from './Badge';

export const Alert = ({
  title,
  description,
  severity = 'info', // 'info' (sky) | 'warning' (amber) | 'caution' (red) | 'success' (emerald) | 'neural' (indigo)
  timestamp,
  aiAction,
  status,
  onActionClick,
  actionText = "Review AI Action",
  className = '',
  style = {}
}) => {
  const getSeverityConfig = () => {
    switch (severity.toLowerCase()) {
      case 'warning':
        return {
          icon: 'AlertTriangle',
          bg: '#FEF3C7',
          border: '#FDE68A',
          iconBg: '#F59E0B',
          text: '#D97706',
          badgeVariant: 'amber'
        };
      case 'caution':
      case 'danger':
      case 'critical':
        return {
          icon: 'AlertCircle',
          bg: '#FEE2E2',
          border: '#FECACA',
          iconBg: '#EF4444',
          text: '#DC2626',
          badgeVariant: 'red'
        };
      case 'success':
        return {
          icon: 'CheckCircle2',
          bg: '#D1FAE5',
          border: '#A7F3D0',
          iconBg: '#10B981',
          text: '#059669',
          badgeVariant: 'emerald'
        };
      case 'neural':
        return {
          icon: 'Sparkles',
          bg: '#E0E7FF',
          border: '#C7D2FE',
          iconBg: '#6366F1',
          text: '#4F46E5',
          badgeVariant: 'indigo'
        };
      case 'info':
      case 'notice':
      default:
        return {
          icon: 'Info',
          bg: '#E0F2FE',
          border: '#BAE6FD',
          iconBg: '#0EA5E9',
          text: '#0284C7',
          badgeVariant: 'sky'
        };
    }
  };

  const config = getSeverityConfig();
  const IconComponent = Icons[config.icon] || Icons.Info;

  return (
    <div
      className={`p-5 rounded-2xl transition-all duration-250 hover:shadow-md ${className}`}
      style={{
        padding: '1.25rem',
        borderRadius: '16px',
        backgroundColor: '#FFFFFF',
        border: `1px solid ${config.border}`,
        boxShadow: '0 4px 12px -2px rgba(15, 23, 42, 0.04)',
        position: 'relative',
        overflow: 'hidden',
        ...style
      }}
    >
      {/* Left accent border bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '5px',
          height: '100%',
          backgroundColor: config.iconBg
        }}
      />

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            backgroundColor: config.bg,
            color: config.iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <IconComponent size={20} strokeWidth={2.2} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
            <h5 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
              {title}
            </h5>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {timestamp && <span style={{ fontSize: '0.78rem', color: '#64748B' }}>{timestamp}</span>}
              {status && <Badge variant={config.badgeVariant} size="sm" pulse={status.includes('Active') || status.includes('AI')}>{status}</Badge>}
            </div>
          </div>

          <p style={{ fontSize: '0.9rem', color: '#334155', margin: '0 0 0.75rem 0', lineHeight: 1.5 }}>
            {description}
          </p>

          {aiAction && (
            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                backgroundColor: '#F8FAFC',
                border: '1px solid rgba(226, 232, 240, 0.9)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.6rem'
              }}
            >
              <Icons.Bot size={16} color="#6366F1" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div style={{ fontSize: '0.85rem', color: '#334155' }}>
                <span style={{ fontWeight: 700, color: '#4F46E5' }}>AI Autonomous Remediation: </span>
                {aiAction}
              </div>
            </div>
          )}
        </div>

        {onActionClick && (
          <div style={{ flexShrink: 0, alignSelf: 'center' }}>
            <Button variant={config.badgeVariant === 'emerald' ? 'primary' : config.badgeVariant === 'amber' ? 'outline' : 'sky'} size="sm" onClick={onActionClick}>
              {actionText}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
