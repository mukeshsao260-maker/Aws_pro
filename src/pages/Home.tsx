import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Terminal } from '../components/Terminal';
import { TickerMarquee } from '../components/TickerMarquee';
import { EVENT_INFO, STATS, LEARNING_TRACKS, FAQ_LIST, REGISTRATION_URL } from '../data/eventData';
import { animateHeroEntrance, setupScrollStagger } from '../lib/animations';
import { ArrowRight, Calendar, Clock, MapPin, Terminal as TerminalIcon } from 'lucide-react';
import heroImg from '../assets/images/aws_cloud_builders.jpg';

export const Home: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = animateHeroEntrance('.hero-section-container');
    const statsCtx = setupScrollStagger('.stats-section-container', '.stat-item-card');
    const tracksCtx = setupScrollStagger('.tracks-section-container', '.track-card-item');

    return () => {
      ctx?.revert();
      statsCtx?.revert();
      tracksCtx?.revert();
    };
  }, []);

  return (
    <div className="home-page-container">
      {/* ========================================================
          1. EXPERIMENTAL HERO SECTION
          ======================================================== */}
      <section
        ref={heroRef}
        className="hero-section-container"
        style={{
          position: 'relative',
          paddingTop: 'clamp(2.5rem, 5vw, 4.5rem)',
          paddingBottom: 'clamp(3rem, 6vw, 5rem)',
          borderBottom: '1px solid var(--border-color)',
          overflow: 'hidden'
        }}
      >
        {/* Structural Grid Crosshairs */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: '25%',
            width: '1px',
            height: '100%',
            backgroundColor: 'var(--grid-line-color)',
            pointerEvents: 'none'
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '15%',
            width: '1px',
            height: '100%',
            backgroundColor: 'var(--grid-line-color)',
            pointerEvents: 'none'
          }}
        />

        <div className="container">
          {/* Eyebrow System Bar */}
          <div
            className="hero-stagger-fade"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              marginBottom: '2rem',
              paddingBottom: '0.75rem',
              borderBottom: '1px dashed var(--border-color)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                className="live-pulse"
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-toxic)',
                  display: 'inline-block'
                }}
              />
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                {EVENT_INFO.campus.toUpperCase()} · {EVENT_INFO.state.toUpperCase()}
              </span>
            </div>

            <div style={{ color: 'var(--text-muted)', display: 'flex', gap: '16px' }}>
              <span>EDITION: 2026 // MULTI-PAGE</span>
              <span style={{ color: 'var(--accent-toxic)' }}>STATUS: CONFIRMED</span>
            </div>
          </div>

          {/* Hero Grid: Typography on Left, Terminal on Right */}
          <div
            className="hero-layout-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.25fr 1fr',
              gap: 'clamp(2rem, 5vw, 4rem)',
              alignItems: 'start'
            }}
          >
            <div>
              {/* Masked Headlines for GSAP Stagger */}
              <div style={{ overflow: 'hidden' }}>
                <h1
                  className="hero-stagger-line hero-display-title"
                  style={{
                    fontSize: 'clamp(3.2rem, 8vw, 6.2rem)',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 900,
                    lineHeight: 0.88,
                    letterSpacing: '-0.05em',
                    color: 'var(--text-primary)'
                  }}
                >
                  AWS.<br />
                  STUDENT.<br />
                  <span
                    style={{
                      color: 'var(--accent-toxic)',
                      WebkitTextStroke: '1px var(--text-primary)',
                      display: 'inline-block'
                    }}
                  >
                    COMMUNITY.
                  </span><br />
                  DAY.
                </h1>
              </div>

              {/* Lead Paragraph */}
              <p
                className="hero-stagger-fade"
                style={{
                  fontSize: 'clamp(1rem, 1.35vw, 1.25rem)',
                  lineHeight: 1.5,
                  color: 'var(--text-primary)',
                  maxWidth: '560px',
                  marginTop: '1.75rem',
                  marginBottom: '2.25rem',
                  borderLeft: '2px solid var(--accent-toxic)',
                  paddingLeft: '1.25rem'
                }}
              >
                {EVENT_INFO.lead}
              </p>

              {/* CTAs */}
              <div
                className="hero-stagger-fade hero-actions-container"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  marginBottom: '3rem'
                }}
              >
                <a
                  href={REGISTRATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-noise-primary"
                  data-cursor="RESERVE"
                  style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  RESERVE MY SEAT
                  <ArrowRight size={16} />
                </a>

                <Link to="/about" className="btn-noise-outline" data-cursor="ABOUT">
                  EXPLORE ABOUT & DETAILS
                  <ArrowRight size={16} />
                </Link>
              </div>

              {/* Event Metadata Ticket Block */}
              <div
                className="hero-stagger-fade"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '1px',
                  backgroundColor: 'var(--border-color)',
                  border: '1px solid var(--border-color)',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem' }}>
                  <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Calendar size={11} /> DATE
                  </div>
                  <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{EVENT_INFO.date}</strong>
                </div>

                <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem' }}>
                  <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Clock size={11} /> TIME
                  </div>
                  <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{EVENT_INFO.time}</strong>
                </div>

                <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem' }}>
                  <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <MapPin size={11} /> VENUE
                  </div>
                  <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{EVENT_INFO.campus}</strong>
                </div>
              </div>
            </div>

            {/* Terminal Component on Right */}
            <div className="hero-terminal-reveal" style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  top: '-18px',
                  right: '12px',
                  zIndex: 2,
                  display: 'flex',
                  gap: '6px'
                }}
              >
                <span className="zine-tag zine-tag-red">SYS: ONLINE</span>
                <span className="zine-tag">REV.2026</span>
              </div>

              <Terminal />

              <div
                style={{
                  marginTop: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  color: 'var(--text-muted)'
                }}
              >
                <span>// RUNTIME: AWS AP-SOUTH-1</span>
                <span>RUNGTA_CAMPUS_NET</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Ticker */}
      <TickerMarquee variant="toxic" />

      {/* ========================================================
          2. COMMUNITY STATISTICS
          ======================================================== */}
      <section
        className="stats-section-container"
        style={{
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-primary)'
        }}
      >
        <div className="container" style={{ padding: 0 }}>
          <div
            className="stats-grid-container"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              borderLeft: '1px solid var(--border-color)',
              borderRight: '1px solid var(--border-color)'
            }}
          >
            {STATS.map((stat, idx) => (
              <div
                key={idx}
                className="stat-item-card grid-ruled"
                style={{
                  padding: 'clamp(1.5rem, 3.5vw, 2.75rem) clamp(1rem, 2vw, 1.75rem)',
                  borderRight: idx < 3 ? '1px solid var(--border-color)' : 'none',
                  transition: 'background-color var(--transition-fast)'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    color: 'var(--text-muted)',
                    marginBottom: '1rem',
                    textTransform: 'uppercase'
                  }}
                >
                  <span>SYS.METRIC // 0{idx + 1}</span>
                  <span className="zine-tag" style={{ fontSize: '0.5625rem', padding: '1px 5px' }}>
                    {stat.note}
                  </span>
                </div>

                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(3rem, 6vw, 4.75rem)',
                    fontWeight: 900,
                    lineHeight: 0.9,
                    letterSpacing: '-0.05em',
                    color: 'var(--text-primary)',
                    marginBottom: '0.75rem'
                  }}
                >
                  {stat.value}
                </div>

                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8125rem',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase'
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          3. ABOUT THE DAY & VISUAL PREVIEW
          ======================================================== */}
      <section
        style={{
          paddingTop: 'var(--section-pad-y)',
          paddingBottom: 'var(--section-pad-y)',
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-secondary)'
        }}
      >
        <div className="container">
          <div className="section-meta-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="section-num">[ 01 ]</span>
              <span>// ABOUT THE DAY</span>
            </div>
            <Link to="/about" style={{ color: 'var(--accent-toxic)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              READ FULL MANIFESTO <ArrowRight size={13} />
            </Link>
          </div>

          <div
            className="about-layout-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.1fr 1fr',
              gap: 'clamp(2rem, 5vw, 4rem)',
              alignItems: 'center'
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: 'clamp(2.4rem, 5.5vw, 4.25rem)',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 900,
                  lineHeight: 0.95,
                  letterSpacing: '-0.04em',
                  marginBottom: '1.75rem',
                  color: 'var(--text-primary)'
                }}
              >
                TURN CURIOSITY INTO SOMETHING YOU CAN{' '}
                <span style={{ color: 'var(--accent-toxic)', textDecoration: 'underline' }}>SHIP.</span>
              </h2>

              <p style={{ fontSize: '1.125rem', lineHeight: 1.6, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
                Student Builder Community Day is a campus event built around practical learning instead of long lectures.
              </p>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                Explore cloud fundamentals, modern web development, AI-assisted workflows and deployment through short sessions, guided labs and community conversations.
              </p>

              <Link to="/about" className="btn-noise-outline" data-cursor="ABOUT">
                EXPLORE ABOUT & PHILOSOPHY
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Editorial Photo Frame */}
            <div
              style={{
                position: 'relative',
                border: '1px solid var(--border-strong)',
                backgroundColor: 'var(--bg-primary)',
                padding: '10px'
              }}
            >
              <div style={{ overflow: 'hidden', height: '360px', position: 'relative' }}>
                <img
                  src={heroImg}
                  alt="Students collaborating at AWS Student Builder Community Day"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'grayscale(20%) contrast(110%)'
                  }}
                  loading="lazy"
                />
              </div>

              <div
                style={{
                  marginTop: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  color: 'var(--text-muted)'
                }}
              >
                <span>FIG_01: STUDENT LAB SPRINT</span>
                <span>RUNGTA_CAMPUS_2026</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. LEARNING TRACKS HIGHLIGHTS
          ======================================================== */}
      <section
        className="tracks-section-container"
        style={{
          paddingTop: 'var(--section-pad-y)',
          paddingBottom: 'var(--section-pad-y)',
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-primary)'
        }}
      >
        <div className="container">
          <div className="section-meta-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="section-num">[ 02 ]</span>
              <span>// LEARNING PATHWAYS</span>
            </div>
            <div>CURRICULUM SPECIFICATIONS</div>
          </div>

          <h2
            style={{
              fontSize: 'clamp(2.4rem, 5.5vw, 4.25rem)',
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: '-0.04em',
              marginBottom: '3rem',
              color: 'var(--text-primary)'
            }}
          >
            FOUR INTENSIVE HANDS-ON{' '}
            <span style={{ color: 'var(--accent-toxic)', textDecoration: 'underline' }}>TRACKS.</span>
          </h2>

          <div
            className="grid-4-col"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1px',
              backgroundColor: 'var(--border-color)',
              border: '1px solid var(--border-color)'
            }}
          >
            {LEARNING_TRACKS.map((track) => (
              <div
                key={track.code}
                className="track-card-item"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  padding: '2rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1.5rem',
                  transition: 'background-color var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-elevated)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span className="zine-tag zine-tag-toxic">{track.code}</span>
                    <TerminalIcon size={16} style={{ color: 'var(--text-muted)' }} />
                  </div>

                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.35rem',
                      fontWeight: 800,
                      marginBottom: '0.5rem',
                      color: 'var(--text-primary)'
                    }}
                  >
                    {track.name}
                  </h3>

                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      color: 'var(--accent-toxic)',
                      marginBottom: '0.75rem'
                    }}
                  >
                    {track.focus}
                  </div>

                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    {track.summary}
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
                  HANDS-ON LAB CODE PROVIDED
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee reverse */}
      <TickerMarquee
        variant="outline"
        reverse={true}
        items={[
          'AWS COMMUNITY DAY',
          'HANDS-ON LAB SPRINTS',
          'CLOUD ARCHITECTURE',
          'GENERATIVE AI ON AWS',
          'SERVERLESS & APIS',
          'STUDENT BUILDERS'
        ]}
      />

      {/* ========================================================
          3. REGISTRATION CALL TO ACTION BANNER
          ======================================================== */}
      <section
        style={{
          paddingTop: 'var(--section-pad-y)',
          paddingBottom: 'var(--section-pad-y)',
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-secondary)',
          position: 'relative'
        }}
      >
        <div className="container">
          <div
            style={{
              border: '2px solid var(--border-strong)',
              backgroundColor: 'var(--bg-primary)',
              padding: 'clamp(2rem, 5vw, 4rem)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              boxShadow: '12px 12px 0px 0px var(--accent-toxic)',
              position: 'relative'
            }}
          >
            <span className="zine-tag zine-tag-red" style={{ marginBottom: '1.5rem' }}>
              CAPACITY LIMITED TO 100 SEATS
            </span>

            <h2
              style={{
                fontSize: 'clamp(2.5rem, 6vw, 4.75rem)',
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                lineHeight: 0.95,
                letterSpacing: '-0.04em',
                marginBottom: '1.25rem',
                color: 'var(--text-primary)',
                maxWidth: '800px'
              }}
            >
              CLAIM YOUR STUDENT BUILDER SEAT NOW.
            </h2>

            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '600px', marginBottom: '2.5rem' }}>
              Complimentary registration for all college students. Free cloud lab environment, mentored development sprints, and verified event kit.
            </p>

            <a
              href={REGISTRATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-noise-primary"
              style={{ padding: '1.2rem 2.5rem', fontSize: '1rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              data-cursor="REGISTER NOW"
            >
              OPEN REGISTRATION PORTAL
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================
          8. FAQ PREVIEW
          ======================================================== */}
      <section
        style={{
          paddingTop: 'var(--section-pad-y)',
          paddingBottom: 'var(--section-pad-y)',
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-primary)'
        }}
      >
        <div className="container">
          <div className="section-meta-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="section-num">[ 03 ]</span>
              <span>// FAQ PREVIEW</span>
            </div>
            <Link to="/faq" style={{ color: 'var(--accent-toxic)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              VIEW ALL QUESTIONS <ArrowRight size={13} />
            </Link>
          </div>

          <h2
            style={{
              fontSize: 'clamp(2.4rem, 5.5vw, 4.25rem)',
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: '-0.04em',
              marginBottom: '2.5rem',
              color: 'var(--text-primary)'
            }}
          >
            QUICK{' '}
            <span style={{ color: 'var(--accent-toxic)', textDecoration: 'underline' }}>ANSWERS.</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', backgroundColor: 'var(--border-color)', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
            {FAQ_LIST.slice(0, 2).map((faq, index) => (
              <div key={faq.id} style={{ backgroundColor: 'var(--bg-secondary)', padding: '1.75rem' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-toxic)', marginBottom: '6px' }}>
                  [ 0{index + 1} ] · {faq.category}
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                  {faq.question}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', lineHeight: 1.55 }}>
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link to="/faq" className="btn-noise-outline" data-cursor="ALL FAQS">
              SEE ALL FREQUENTLY ASKED QUESTIONS →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
