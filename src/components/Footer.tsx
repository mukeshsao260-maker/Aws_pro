import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { NAV_LINKS, EVENT_INFO } from '../data/eventData';
import awsLogo from '../assets/images/aws_logo.jpg';

export const Footer: React.FC = () => {
  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderTop: '1px solid var(--border-color)',
        paddingTop: 'clamp(2.5rem, 5vw, 4rem)',
        paddingBottom: '2.5rem',
        position: 'relative'
      }}
    >
      <div className="container">
        {/* Top Footer Grid */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '2.5rem',
            paddingBottom: '2.5rem',
            borderBottom: '1px solid var(--border-color)'
          }}
        >
          {/* Brand & Mission Statement */}
          <div style={{ maxWidth: '420px' }}>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '1.25rem'
              }}
              data-cursor="TOP"
            >
              {/* AWS Logo */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '54px',
                  height: '38px',
                  padding: '2px 4px',
                  backgroundColor: '#ffffff',
                  border: '1.5px solid var(--border-strong)',
                  boxShadow: '2px 2px 0px 0px var(--border-strong)',
                  overflow: 'hidden',
                  flexShrink: 0
                }}
              >
                <img
                  src={awsLogo}
                  alt="AWS Logo"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                />
              </div>

              <div style={{ width: '1px', height: '28px', backgroundColor: 'var(--border-strong)' }} />

              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  lineHeight: 1.25,
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)'
                }}
              >
                <div>Student Builder</div>
                <strong style={{ color: 'var(--text-primary)' }}>COMMUNITY DAY</strong>
              </div>
            </Link>

            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                color: 'var(--text-muted)',
                lineHeight: 1.55
              }}
            >
              {EVENT_INFO.lead}
            </p>
          </div>

          {/* Quick Index Links */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--accent-toxic)',
                marginBottom: '1rem',
                fontWeight: 700
              }}
            >
              INDEX // DIRECTORY
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1.5rem' }}>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8125rem',
                    color: 'var(--text-muted)',
                    transition: 'color var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--accent-toxic)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }}
                >
                  [{link.code}] {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Technical Specs & Back To Top */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1.25rem' }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <div>STACK: REACT 19 + VITE + TYPESCRIPT</div>
              <div>DESIGN SYSTEM: NOISE DEPT. // CONTROLLED DISORDER</div>
              <div>CAMPUS: {EVENT_INFO.campus.toUpperCase()} · 2026</div>
              <div>COORDS: {EVENT_INFO.coordinates}</div>
            </div>

            <button
              onClick={scrollToTop}
              className="btn-noise-outline"
              style={{ padding: '0.625rem 1rem', fontSize: '0.75rem' }}
              data-cursor="SCROLL TOP"
              aria-label="Back to top"
            >
              <span>BACK TO TOP</span>
              <ArrowUp size={14} />
            </button>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div
          style={{
            paddingTop: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            color: 'var(--text-dim)'
          }}
        >
          <div>
            Fictional screening-task project · Preserved from original AWS Community Day source
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>NO-CORS SHEETS: ACTIVE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
