import React, { useEffect } from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { setupImageReveal, setupHorizontalScroll } from '../lib/animations';
import { Terminal, Cloud, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import builderImg from '../assets/images/aws_cloud_builders.jpg';

export const Gallery: React.FC = () => {
  useEffect(() => {
    const revealCtx = setupImageReveal('.gallery-masked-image');
    const horizCtx = setupHorizontalScroll('.gallery-horizontal-section', '.gallery-horizontal-track');

    return () => {
      revealCtx?.revert();
      horizCtx?.revert();
    };
  }, []);

  return (
    <div className="gallery-page" style={{ paddingTop: 'clamp(2.5rem, 5vw, 4rem)', paddingBottom: 'var(--section-pad-y)' }}>
      <div className="container">
        {/* Page Heading */}
        <SectionHeading
          number="06"
          category="EVENT GALLERY & HIGHLIGHTS"
          title="IMMERSIVE BUILDER"
          highlightWord="MOMENTS."
          metaRight="VISUAL ARCHIVE // RUNGTA COMPLEX"
          description="Visual artifacts, laboratory environments, and architectural schematics from the AWS Student Builder Community Day experience."
        />

        {/* Feature Hero Image: Authentic Workshop Photo */}
        <div
          style={{
            marginBottom: '4rem',
            border: '1px solid var(--border-strong)',
            backgroundColor: 'var(--bg-secondary)',
            padding: '16px'
          }}
        >
          <div className="gallery-masked-image" style={{ overflow: 'hidden', height: 'clamp(320px, 50vw, 560px)', position: 'relative' }}>
            <img
              src={builderImg}
              alt="Student builders collaborating on cloud deployments"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'contrast(106%)'
              }}
            />
          </div>

          <div
            style={{
              marginTop: '16px',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--text-muted)'
            }}
          >
            <div>
              <strong style={{ color: 'var(--text-primary)', marginRight: '8px' }}>ARCHIVE_01:</strong>
              <span>STUDENT TEAMS PROTOTYPING ON AP-SOUTH-1 INFRASTRUCTURE</span>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span className="zine-tag zine-tag-toxic">LIVE LAB SPRINT</span>
              <span className="zine-tag">RUNGTA_2026</span>
            </div>
          </div>
        </div>

        {/* Asymmetric Graphic Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            marginBottom: '5rem'
          }}
        >
          {/* Card 1: Cloud Architecture Schematic */}
          <div
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '360px',
              position: 'relative'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <span className="zine-tag">SCHEMATIC_V1</span>
                <Cloud size={20} style={{ color: 'var(--accent-toxic)' }} />
              </div>

              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 900, marginBottom: '1rem' }}>
                SERVERLESS TOPOLOGY
              </h3>

              {/* Graphic Code Box */}
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  lineHeight: '1.6',
                  color: 'var(--accent-lavender)',
                  backgroundColor: 'var(--bg-primary)',
                  padding: '1rem',
                  border: '1px solid var(--border-strong)',
                  marginBottom: '1rem'
                }}
              >
                <div>[CLIENT: REACT + VITE]</div>
                <div>  ↓ HTTPS (TLS 1.3)</div>
                <div>[AMPLIFY / S3 + CLOUDFRONT]</div>
                <div>  ↓ REST API REQUEST</div>
                <div>[API GATEWAY → AWS LAMBDA]</div>
                <div>  ↓ PERSISTENCE & GENAI</div>
                <div>[DYNAMODB + BEDROCK]</div>
              </div>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Target deployment architecture practiced during the 12:00 PM and 2:00 PM lab sessions.
              </p>
            </div>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-dim)', borderTop: '1px dashed var(--border-color)', paddingTop: '0.75rem' }}>
              BLUEPRINT SPECIFICATION // 2026
            </div>
          </div>

          {/* Card 2: Terminal Script Stream */}
          <div
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '360px'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <span className="zine-tag zine-tag-toxic">LIVE RUNTIME</span>
                <Terminal size={20} style={{ color: 'var(--accent-toxic)' }} />
              </div>

              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 900, marginBottom: '1rem' }}>
                DEPLOYMENT LOG
              </h3>

              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--bg-primary)',
                  padding: '1rem',
                  border: '1px solid var(--border-strong)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  marginBottom: '1rem'
                }}
              >
                <div>&gt; git push aws-lab main</div>
                <div style={{ color: 'var(--text-muted)' }}>&gt; build trigger: commit e8a91c</div>
                <div style={{ color: 'var(--accent-toxic)' }}>&gt; ✓ bundling vite production assets...</div>
                <div style={{ color: 'var(--accent-toxic)' }}>&gt; ✓ deployed: https://builder-demo.rungta.edu</div>
                <div style={{ color: 'var(--accent-orange)' }}>&gt; latency: 18ms (ap-south-1)</div>
              </div>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Automated continuous integration pipeline configured for student repositories.
              </p>
            </div>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-dim)', borderTop: '1px dashed var(--border-color)', paddingTop: '0.75rem' }}>
              PIPELINE // VERIFIED_CLEAN
            </div>
          </div>

          {/* Card 3: Community Hackathon Poster Artwork */}
          <div
            style={{
              backgroundColor: 'var(--accent-toxic)',
              color: 'var(--accent-toxic-text, #0B0B0B)',
              border: '1px solid var(--accent-toxic)',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '360px'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 900, border: '1px solid currentColor', padding: '2px 6px' }}>
                  POSTER_MANIFEST
                </span>
                <Layers size={20} color="currentColor" />
              </div>

              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 900, lineHeight: 0.95, marginBottom: '1rem' }}>
                CODE.<br />
                PROTOTYPE.<br />
                DEPLOY.
              </h3>

              <p style={{ fontSize: '0.9375rem', fontWeight: 600, lineHeight: 1.5 }}>
                100 Builders. 1 Day. Cloud computing, generative AI, and real production delivery at Rungta University.
              </p>
            </div>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, borderTop: '1px solid currentColor', paddingTop: '0.75rem' }}>
              18 OCTOBER 2026 // BHILAI, CG
            </div>
          </div>
        </div>

        {/* Gallery CTA */}
        <div
          style={{
            border: '1px solid var(--border-strong)',
            backgroundColor: 'var(--bg-secondary)',
            padding: '2.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1.5rem'
          }}
        >
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem' }}>
              BE PART OF THE NEXT HIGHLIGHT REEL
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
              Seats are free and capped at 100 student builders.
            </p>
          </div>

          <Link to="/register" className="btn-noise-primary" data-cursor="CLAIM SEAT">
            RESERVE MY SEAT NOW →
          </Link>
        </div>
      </div>
    </div>
  );
};
