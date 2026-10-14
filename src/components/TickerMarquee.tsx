import React from 'react';

interface TickerMarqueeProps {
  reverse?: boolean;
  variant?: 'toxic' | 'dark' | 'outline';
  items?: string[];
}

export const TickerMarquee: React.FC<TickerMarqueeProps> = ({
  reverse = false,
  variant = 'toxic',
  items
}) => {
  const defaultItems = [
    'AWS STUDENT BUILDER COMMUNITY DAY',
    'RUNGTA UNIVERSITY',
    '18 OCT 2026',
    'CLOUD · WEB · AI',
    'TURN CURIOSITY INTO CODE',
    'HANDS-ON WORKSHOPS',
    'PROTOTYPE & SHIP'
  ];

  const contentItems = items || defaultItems;

  const getStyle = () => {
    switch (variant) {
      case 'toxic':
        return {
          backgroundColor: 'var(--accent-toxic)',
          color: 'var(--accent-toxic-text, #0B0B0B)',
          borderColor: 'var(--accent-toxic)'
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: 'var(--text-primary)',
          borderColor: 'var(--border-color)'
        };
      case 'dark':
      default:
        return {
          backgroundColor: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
          borderColor: 'var(--border-strong)'
        };
    }
  };

  const style = getStyle();

  return (
    <div
      style={{
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        borderTop: '1px solid',
        borderBottom: '1px solid',
        borderColor: style.borderColor,
        backgroundColor: style.backgroundColor,
        color: style.color,
        padding: '0.625rem 0',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.8125rem',
        fontWeight: 700,
        letterSpacing: '0.08em',
        userSelect: 'none'
      }}
      aria-hidden="true"
    >
      <div
        className={reverse ? 'animate-marquee' : 'animate-marquee'}
        style={{
          display: 'flex',
          gap: '2.5rem',
          animationDirection: reverse ? 'reverse' : 'normal'
        }}
      >
        {/* Render twice for continuous loop */}
        {[...contentItems, ...contentItems, ...contentItems].map((item, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
            <span>{item}</span>
            <span style={{ opacity: 0.5 }}>///</span>
          </div>
        ))}
      </div>
    </div>
  );
};
