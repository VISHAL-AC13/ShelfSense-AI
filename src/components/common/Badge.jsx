import React from 'react';

export const Badge = ({
  children,
  variant = 'emerald', // 'emerald' | 'sky' | 'teal' | 'amber' | 'red' | 'indigo' | 'slate'
  pulse = false,
  size = 'md', // 'sm' | 'md'
  className = '',
  style = {}
}) => {
  const getColors = () => {
    switch (variant) {
      case 'sky':
        return { bg: '#E0F2FE', text: '#0284C7', border: '#BAE6FD', dot: '#0EA5E9' };
      case 'teal':
        return { bg: '#CCFBF1', text: '#0F766E', border: '#99F6E4', dot: '#0D9488' };
      case 'amber':
        return { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A', dot: '#F59E0B' };
      case 'red':
        return { bg: '#FEE2E2', text: '#DC2626', border: '#FECACA', dot: '#EF4444' };
      case 'indigo':
        return { bg: '#E0E7FF', text: '#4F46E5', border: '#C7D2FE', dot: '#6366F1' };
      case 'slate':
        return { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0', dot: '#64748B' };
      case 'emerald':
      default:
        return { bg: '#D1FAE5', text: '#059669', border: '#A7F3D0', dot: '#10B981' };
    }
  };

  const colors = getColors();

  return (
    <span
      className={`inline-flex items-center font-semibold tracking-wide ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size === 'sm' ? '0.3rem' : '0.4rem',
        padding: size === 'sm' ? '0.2rem 0.55rem' : '0.3rem 0.75rem',
        fontSize: size === 'sm' ? '0.72rem' : '0.78rem',
        borderRadius: '9999px',
        backgroundColor: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
        whiteSpace: 'nowrap',
        ...style
      }}
    >
      {pulse && (
        <span style={{ position: 'relative', display: 'flex', width: '8px', height: '8px' }}>
          <span
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              backgroundColor: colors.dot,
              opacity: 0.7,
              animation: 'pulse-ring 2s infinite'
            }}
          />
          <span
            style={{
              position: 'relative',
              display: 'inline-flex',
              borderRadius: '50%',
              width: '8px',
              height: '8px',
              backgroundColor: colors.dot
            }}
          />
        </span>
      )}
      {children}
    </span>
  );
};
