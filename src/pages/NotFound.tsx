import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(3rem, 6vw, 6rem) 1rem'
      }}
    >
      <div
        style={{
          border: '2px solid var(--border-strong)',
          backgroundColor: 'var(--bg-secondary)',
          padding: 'clamp(2rem, 5vw, 4rem)',
          maxWidth: '720px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '10px 10px 0px 0px var(--accent-red)',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <span className="zine-tag zine-tag-red" style={{ fontSize: '0.75rem' }}>
            HTTP_STATUS_CODE: 404 // NOT_FOUND
          </span>
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(4rem, 12vw, 8rem)',
            fontWeight: 900,
            lineHeight: 0.85,
            letterSpacing: '-0.06em',
            marginBottom: '1rem',
            color: 'var(--text-primary)'
          }}
        >
          ROUTE<br />
          <span style={{ color: 'var(--accent-red)' }}>VOID.</span>
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9375rem',
            color: 'var(--text-muted)',
            marginBottom: '2.5rem',
            lineHeight: 1.6
          }}
        >
          The requested coordinate does not exist in the AWS Student Builder directory.
          Return to the main command center to continue exploring.
        </p>

        <Link to="/" className="btn-noise-primary" data-cursor="HOME">
          <ArrowLeft size={16} />
          <span>RETURN TO HOME ROUTE [00]</span>
        </Link>
      </div>
    </div>
  );
};
