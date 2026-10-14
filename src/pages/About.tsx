import React, { useEffect } from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { EVENT_INFO, REGISTRATION_URL } from '../data/eventData';
import { FEATURE_DATA } from '../lib/data';
import { setupImageReveal, setupScrollStagger } from '../lib/animations';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import heroImg from '../assets/images/aws_cloud_builders.jpg';

export const About: React.FC = () => {
  useEffect(() => {
    const imgCtx = setupImageReveal('.about-editorial-image');
    const cardsCtx = setupScrollStagger('.feature-cards-grid', '.feature-card-item');

    return () => {
      imgCtx?.revert();
      cardsCtx?.revert();
    };
  }, []);

  return (
    <div className="about-page" style={{ paddingTop: 'clamp(2.5rem, 5vw, 4rem)', paddingBottom: 'var(--section-pad-y)' }}>
      <div className="container">
        {/* Page Heading */}
        <SectionHeading
          number="01"
          category="ABOUT THE DAY"
          title="TURN CURIOSITY INTO SOMETHING YOU CAN"
          highlightWord="SHIP."
          metaRight="EVENT PHILOSOPHY & MANIFESTO"
          description={EVENT_INFO.lead}
        />

        {/* Big Editorial Quote / Philosophy Statement */}
        <div
          style={{
            borderLeft: '4px solid var(--accent-toxic)',
            backgroundColor: 'var(--bg-secondary)',
            padding: 'clamp(2rem, 4vw, 3rem)',
            marginBottom: '4rem',
            borderRight: '1px solid var(--border-color)',
            borderTop: '1px solid var(--border-color)',
            borderBottom: '1px solid var(--border-color)'
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--accent-toxic)',
              marginBottom: '1rem',
              letterSpacing: '0.1em'
            }}
          >
            // PHILOSOPHY_DIRECTIVE
          </div>

          <p
            style={{
              fontSize: 'clamp(1.25rem, 2.5vw, 1.85rem)',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              lineHeight: 1.3,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              marginBottom: '1.25rem'
            }}
          >
            "{EVENT_INFO.philosophy}"
          </p>

          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6, maxWidth: '850px' }}>
            Student Builder Community Day at Rungta University is a fictional campus event designed to bridge the gap between academic theory and real-world software delivery. We believe the highest leverage skill an engineering student can cultivate is the confidence to take an abstract idea, write functional code, and deploy it to global cloud infrastructure before sunset.
          </p>
        </div>

        {/* Editorial Image & Deep Storytelling */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.25fr 1fr',
            gap: 'clamp(2rem, 5vw, 4rem)',
            alignItems: 'center',
            marginBottom: '5rem'
          }}
          className="about-layout-grid"
        >
          <div
            className="about-editorial-image"
            style={{
              border: '1px solid var(--border-strong)',
              backgroundColor: 'var(--bg-secondary)',
              padding: '12px',
              position: 'relative'
            }}
          >
            <div style={{ overflow: 'hidden', height: '420px', position: 'relative' }}>
              <img
                src={heroImg}
                alt="Student builder collaborative session at Rungta University"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'contrast(108%)'
                }}
              />
            </div>
            <div
              style={{
                marginTop: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                color: 'var(--text-muted)'
              }}
            >
              <span>FIG_02: EXPERIENTIAL LEARNING LAB</span>
              <span>CHHATTISGARH · 18 OCT 2026</span>
            </div>
          </div>

          <div>
            <span className="zine-tag zine-tag-toxic" style={{ marginBottom: '1rem' }}>
              WHAT TO EXPECT
            </span>

            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                marginBottom: '1.25rem'
              }}
            >
              PRACTICAL LABS INSTEAD OF PASSIVE PRESENTATIONS.
            </h3>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', lineHeight: 1.65, marginBottom: '1rem' }}>
              Bring your laptop, your questions, and one raw idea you want to build. From morning check-in to evening demo hour, students work directly in cloud accounts provisioned for the day, receiving real-time code reviews from mentors.
            </p>

            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                marginTop: '1.5rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem'
              }}
            >
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--accent-toxic)' }} />
                <span>Zero registration fees for enrolled university students</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--accent-toxic)' }} />
                <span>Live cloud sandboxes and guided code templates</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--accent-toxic)' }} />
                <span>Mentors from engineering backgrounds and student clubs</span>
              </li>
            </ul>
          </div>
        </div>

        {/* The 3 Core Pillars */}
        <div style={{ marginBottom: '5rem' }}>
          <div className="section-meta-header">
            <span>[ PILLARS ] // CORE EVENT TENETS</span>
            <span>THREE STEPS OF THE EXPERIENCE</span>
          </div>

          <div
            className="feature-cards-grid grid-3-col"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1.5rem'
            }}
          >
            {FEATURE_DATA.map((item) => (
              <div
                key={item.index}
                className="feature-card-item"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  padding: '2.5rem 1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1.5rem',
                  transition: 'background-color var(--transition-fast)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 900, color: 'var(--accent-toxic)' }}>
                      {item.index}
                    </span>
                    <span className="zine-tag" style={{ fontSize: '0.5625rem' }}>{item.tag}</span>
                  </div>

                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.65rem',
                      fontWeight: 900,
                      letterSpacing: '-0.02em',
                      marginBottom: '0.75rem'
                    }}
                  >
                    {item.title}
                  </h3>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                    {item.description}
                  </p>
                </div>

                <div
                  style={{
                    borderTop: '1px dashed var(--border-color)',
                    paddingTop: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    color: 'var(--text-dim)'
                  }}
                >
                  TENET_SPEC // VERIFIED
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA to Register */}
        <div
          style={{
            border: '1px solid var(--border-strong)',
            backgroundColor: 'var(--bg-secondary)',
            padding: '3rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '2rem'
          }}
        >
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>
              READY TO BUILD AT RUNGTA UNIVERSITY?
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
              Join 100 student builders on 18 OCT 2026 for a day of hands-on cloud development.
            </p>
          </div>

          <a
            href={REGISTRATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-noise-primary"
            data-cursor="REGISTER"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            REGISTER FOR THE DAY
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};
