import React from 'react';
import * as Icons from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary', // 'primary' | 'sky' | 'teal' | 'outline' | 'ghost' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: IconName,
  iconRight: IconRightName,
  isLoading = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  style = {}
}) => {
  const IconComponent = IconName && Icons[IconName] ? Icons[IconName] : null;
  const IconRightComponent = IconRightName && Icons[IconRightName] ? Icons[IconRightName] : null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'sky':
        return {
          background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
          color: '#FFFFFF',
          border: 'none',
          boxShadow: '0 4px 12px rgba(14, 165, 233, 0.25)'
        };
      case 'teal':
        return {
          background: 'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)',
          color: '#FFFFFF',
          border: 'none',
          boxShadow: '0 4px 12px rgba(13, 148, 136, 0.25)'
        };
      case 'outline':
        return {
          backgroundColor: '#FFFFFF',
          color: '#0F172A',
          border: '1px solid rgba(203, 213, 225, 0.9)',
          boxShadow: '0 2px 6px rgba(15, 23, 42, 0.03)'
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: '#475569',
          border: '1px solid transparent',
          boxShadow: 'none'
        };
      case 'danger':
        return {
          background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
          color: '#FFFFFF',
          border: 'none',
          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)'
        };
      case 'primary':
      default:
        return {
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          color: '#FFFFFF',
          border: 'none',
          boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { padding: '0.4rem 0.85rem', fontSize: '0.8rem', borderRadius: '10px', gap: '0.35rem' };
      case 'lg':
        return { padding: '0.85rem 1.75rem', fontSize: '1.05rem', borderRadius: '16px', gap: '0.6rem' };
      case 'md':
      default:
        return { padding: '0.6rem 1.25rem', fontSize: '0.9rem', borderRadius: '12px', gap: '0.5rem' };
    }
  };

  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    position: 'relative',
    whiteSpace: 'nowrap',
    ...getSizeStyles(),
    ...getVariantStyles(),
    ...style
  };

  const handleMouseEnter = (e) => {
    if (!disabled && !isLoading && variant !== 'ghost') {
      e.currentTarget.style.transform = 'translateY(-2px)';
      if (variant === 'primary') e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.4)';
      if (variant === 'sky') e.currentTarget.style.boxShadow = '0 8px 20px rgba(14, 165, 233, 0.4)';
      if (variant === 'outline') e.currentTarget.style.borderColor = '#0EA5E9';
    } else if (!disabled && variant === 'ghost') {
      e.currentTarget.style.backgroundColor = 'rgba(241, 245, 249, 0.8)';
    }
  };

  const handleMouseLeave = (e) => {
    if (!disabled && !isLoading) {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = getVariantStyles().boxShadow;
      if (variant === 'outline') e.currentTarget.style.borderColor = 'rgba(203, 213, 225, 0.9)';
      if (variant === 'ghost') e.currentTarget.style.backgroundColor = 'transparent';
    }
  };

  const handleMouseDown = (e) => {
    if (!disabled && !isLoading) {
      e.currentTarget.style.transform = 'scale(0.98)';
    }
  };

  const handleMouseUp = (e) => {
    if (!disabled && !isLoading) {
      e.currentTarget.style.transform = 'translateY(-2px)';
    }
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`btn-interactive ${className}`}
      style={baseStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {isLoading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Icons.Loader size={18} className="animate-spin" style={{ animation: 'spin-slow 1s linear infinite' }} />
          <span>Processing...</span>
        </div>
      ) : (
        <>
          {IconComponent && <IconComponent size={size === 'sm' ? 15 : size === 'lg' ? 20 : 17} strokeWidth={2.2} />}
          <span>{children}</span>
          {IconRightComponent && <IconRightComponent size={size === 'sm' ? 15 : size === 'lg' ? 20 : 17} strokeWidth={2.2} />}
        </>
      )}
    </button>
  );
};
