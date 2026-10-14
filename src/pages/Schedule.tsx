import React, { useState, useEffect } from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { SCHEDULE_ITEMS } from '../data/eventData';
import { setupScrollStagger } from '../lib/animations';
import { Clock, MapPin, User, ChevronRight, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Schedule: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string>('ALL');
  const [expandedIndex, setExpandedIndex] = useState<string | null>('01');

  useEffect(() => {
    const ctx = setupScrollStagger('.schedule-timeline-container', '.timeline-entry-row');
    return () => ctx?.revert();
  }, [selectedTag]);

  const tags = ['ALL', 'ARRIVAL', 'KEYNOTE', 'HANDS-ON', 'LAB', 'DEMO'];

  const filteredItems = selectedTag === 'ALL'
    ? SCHEDULE_ITEMS
    : SCHEDULE_ITEMS.filter((item) => item.tag === selectedTag);

  return (
    <div className="schedule-page" style={{ paddingTop: 'clamp(2.5rem, 5vw, 4rem)', paddingBottom: 'var(--section-pad-y)' }}>
      <div className="container">
        {/* Page Heading */}
        <SectionHeading
          number="02"
          category="EVENT SCHEDULE"
          title="A DAY DESIGNED AROUND"
          highlightWord="MOMENTUM."
          metaRight="DATE: 18 OCT 2026 // TIMEZONE: IST"
          description="Every hour is calibrated for active progress. Move from check-in and environment setup directly into hands-on cloud provisioning, generative AI labs, and live prototype demos."
        />

        {/* Schedule Filter Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '2.5rem',
            padding: '1rem 1.25rem',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <Filter size={14} />
            <span>FILTER BY SESSION TYPE:</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTag(t)}
                className={selectedTag === t ? 'zine-tag zine-tag-toxic' : 'zine-tag'}
                style={{
                  cursor: 'pointer',
                  fontSize: '0.6875rem',
                  padding: '4px 10px',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Timeline Manifest */}
        <div
          className="schedule-timeline-container"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1px',
            backgroundColor: 'var(--border-color)',
            border: '1px solid var(--border-color)',
            marginBottom: '4rem'
          }}
        >
          {filteredItems.map((item) => {
            const isExpanded = expandedIndex === item.index;

            return (
              <article
                key={item.index}
                className="timeline-entry-row"
                style={{
                  backgroundColor: isExpanded ? 'var(--bg-elevated)' : 'var(--bg-secondary)',
                  borderLeft: isExpanded ? '4px solid var(--accent-toxic)' : '4px solid transparent',
                  padding: 'clamp(1.5rem, 3vw, 2.25rem) clamp(1rem, 2.5vw, 2rem)',
                  transition: 'background-color var(--transition-fast), border-left var(--transition-fast)',
                  cursor: 'pointer'
                }}
                onClick={() => setExpandedIndex(isExpanded ? null : item.index)}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '180px 1fr 100px',
                    gap: '1.5rem',
                    alignItems: 'center'
                  }}
                  className="schedule-row-grid"
                >
                  {/* Time & Category Tag */}
                  <div>
                    <time
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        color: isExpanded ? 'var(--accent-toxic)' : 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        letterSpacing: '-0.03em'
                      }}
                    >
                      <Clock size={16} style={{ color: 'var(--text-muted)' }} />
                      {item.timeStart}
                    </time>
                    <div style={{ marginTop: '6px' }}>
                      <span className="zine-tag" style={{ fontSize: '0.625rem' }}>
                        {item.tag}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(1.3rem, 2vw, 1.7rem)',
                        fontWeight: 900,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-primary)',
                        marginBottom: '6px'
                      }}
                    >
                      {item.title}
                    </h3>

                    <p
                      style={{
                        fontSize: '0.9375rem',
                        color: 'var(--text-muted)',
                        lineHeight: 1.55,
                        marginBottom: '10px'
                      }}
                    >
                      {item.description}
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '1.25rem',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        color: 'var(--text-dim)',
                        textTransform: 'uppercase'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} />
                        <span>{item.room}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <User size={12} />
                        <span>FACILITATOR: {item.leadMentor}</span>
                      </div>
                    </div>
                  </div>

                  {/* Step Index & Expand Icon */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: '8px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '1.5rem',
                      fontWeight: 900,
                      color: isExpanded ? 'var(--accent-toxic)' : 'var(--text-dim)'
                    }}
                  >
                    <span>{item.index}</span>
                    <ChevronRight
                      size={20}
                      style={{
                        transform: isExpanded ? 'rotate(90deg)' : 'none',
                        transition: 'transform var(--transition-fast)'
                      }}
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Schedule Bottom Info & Registration Link */}
        <div
          style={{
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-secondary)',
            padding: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem'
          }}
        >
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-toxic)', marginBottom: '4px' }}>
              CAMPUS SCHEDULE POLICIES
            </div>
            <div style={{ fontSize: '0.9375rem', color: 'var(--text-muted)' }}>
              All participants are required to report at 10:00 AM with their laptop and active student ID.
            </div>
          </div>

          <Link to="/register" className="btn-noise-primary" data-cursor="RESERVE">
            SAVE YOUR SEAT FOR 18 OCT →
          </Link>
        </div>
      </div>
    </div>
  );
};
