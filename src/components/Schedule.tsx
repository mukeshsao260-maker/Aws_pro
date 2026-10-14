import React, { useState } from 'react';
import { SCHEDULE_DATA } from '../lib/data';
import { Clock, MapPin, ChevronRight } from 'lucide-react';

export const Schedule: React.FC = () => {
  const [activeSession, setActiveSession] = useState<string | null>(null);

  return (
    <section
      id="schedule"
      style={{
        paddingTop: 'var(--section-pad-y)',
        paddingBottom: 'var(--section-pad-y)',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-primary)',
        position: 'relative'
      }}
    >
      <div className="container">
        {/* Section Metadata Header */}
        <div className="section-meta-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="section-num">[ 02 ]</span>
            <span>// SCHEDULE</span>
          </div>
          <div>DATE: 18 OCT 2026 // TIMEZONE: IST (UTC+5:30)</div>
        </div>

        {/* Section Headline */}
        <h2
          className="section-heading-title"
          style={{
            fontSize: 'clamp(2.4rem, 5.5vw, 4.5rem)',
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: '-0.04em',
            marginBottom: '3rem',
            color: 'var(--text-primary)',
            maxWidth: '900px'
          }}
        >
          A DAY DESIGNED AROUND{' '}
          <span style={{ color: 'var(--accent-toxic)', textDecoration: 'underline' }}>
            MOMENTUM.
          </span>
        </h2>

        {/* Schedule Table / Manifest */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1px',
            backgroundColor: 'var(--border-color)',
            border: '1px solid var(--border-color)'
          }}
        >
          {SCHEDULE_DATA.map((item) => {
            const isHovered = activeSession === item.index;

            return (
              <article
                key={item.index}
                className="schedule-row-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '160px 1fr 80px',
                  alignItems: 'center',
                  gap: '1.5rem',
                  padding: 'clamp(1.25rem, 2.5vw, 2rem) clamp(1rem, 2.5vw, 2rem)',
                  backgroundColor: isHovered ? 'var(--bg-elevated)' : 'var(--bg-secondary)',
                  borderLeft: isHovered ? '4px solid var(--accent-toxic)' : '4px solid transparent',
                  transition: 'all var(--transition-fast)',
                  cursor: 'pointer'
                }}
                onMouseEnter={() => setActiveSession(item.index)}
                onMouseLeave={() => setActiveSession(null)}
              >
                {/* Time & Session Category Tag */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <time
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: isHovered ? 'var(--accent-toxic)' : 'var(--text-primary)',
                      letterSpacing: '-0.03em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Clock size={16} style={{ color: 'var(--text-muted)' }} />
                    {item.time}
                  </time>

                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span
                      className="zine-tag"
                      style={{
                        fontSize: '0.625rem',
                        padding: '1px 6px',
                        backgroundColor: isHovered ? 'var(--accent-toxic)' : 'var(--bg-tertiary)',
                        color: isHovered ? 'var(--accent-toxic-text, #0B0B0B)' : 'var(--text-primary)'
                      }}
                    >
                      {item.tag}
                    </span>
                  </div>
                </div>

                {/* Session Title & Description */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '4px'
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(1.15rem, 2vw, 1.45rem)',
                        fontWeight: 800,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-primary)'
                      }}
                    >
                      {item.title}
                    </h3>
                  </div>

                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.875rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.5,
                      marginBottom: '6px'
                    }}
                  >
                    {item.description}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      color: 'var(--text-dim)',
                      textTransform: 'uppercase'
                    }}
                  >
                    <MapPin size={11} />
                    <span>{item.room}</span>
                  </div>
                </div>

                {/* Step Number Indicator */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: isHovered ? 'var(--accent-toxic)' : 'var(--text-dim)'
                  }}
                >
                  <span>{item.index}</span>
                  <ChevronRight size={18} style={{ opacity: isHovered ? 1 : 0.4 }} />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
