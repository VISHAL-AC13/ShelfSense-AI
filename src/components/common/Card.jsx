import React from 'react';
import * as Icons from 'lucide-react';

export const Card = ({
  title,
  subtitle,
  icon: IconName,
  iconColor = '#10B981',
  badgeText,
  badgeColor = '#10B981',
  variant = 'floating', // 'floating' | 'static' | 'interactive' | 'glass'
  className = '',
  children,
  footer,
  onClick,
  style = {}
}) => {
  const IconComponent = IconName && Icons[IconName] ? Icons[IconName] : null;

  const getVariantClass = () => {
    switch (variant) {
      case 'static':
        return 'card-static';
      case 'interactive':
        return 'floating-card cursor-pointer';
      case 'glass':
        return 'glass-panel rounded-[20px] transition-all duration-250 hover:shadow-lg';
      case 'floating':
      default:
        return 'floating-card';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`p-6 flex flex-col justify-between ${getVariantClass()} ${className}`}
      style={{
        borderRadius: '20px',
        padding: '1.5rem',
        ...style
      }}
    >
      <div>
        {/* Card Header */}
        {(title || IconComponent || badgeText) && (
          <div className="flex items-start justify-between gap-4 mb-4" style={{ marginBottom: '1rem' }}>
            <div className="flex items-center gap-3" style={{ gap: '0.75rem', display: 'flex', alignItems: 'center' }}>
              {IconComponent && (
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-250 hover:scale-105"
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '14px',
                    backgroundColor: `${iconColor}15`,
                    color: iconColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <IconComponent size={22} strokeWidth={2} />
                </div>
              )}
              <div>
                {title && (
                  <h4
                    className="font-bold text-slate-900 tracking-tight"
                    style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', margin: 0 }}
                  >
                    {title}
                  </h4>
                )}
                {subtitle && (
                  <p
                    className="text-xs text-slate-500 mt-0.5"
                    style={{ fontSize: '0.85rem', color: '#64748B', margin: '2px 0 0 0' }}
                  >
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {badgeText && (
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide flex items-center gap-1.5 shrink-0"
                style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: `${badgeColor}15`,
                  color: badgeColor,
                  border: `1px solid ${badgeColor}30`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: badgeColor }}
                />
                {badgeText}
              </span>
            )}
          </div>
        )}

        {/* Card Body */}
        <div className="w-full">{children}</div>
      </div>

      {/* Card Footer */}
      {footer && (
        <div
          className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between"
          style={{
            marginTop: '1.25rem',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(226, 232, 240, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
};
