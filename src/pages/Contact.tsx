import React from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { EVENT_INFO } from '../data/eventData';
import { MapPin, Mail, Phone, UserCheck, MessageSquare, Info, Terminal, Cpu, Users, Clock } from 'lucide-react';

interface ContactProps {
  onShowToast?: (message: string, isError?: boolean) => void;
}

export const Contact: React.FC<ContactProps> = () => {
  return (
    <div className="contact-page" style={{ paddingTop: 'clamp(2.5rem, 5vw, 4rem)', paddingBottom: 'var(--section-pad-y)' }}>
      <div className="container">
        {/* Page Heading */}
        <SectionHeading
          number="03"
          category="CAMPUS & LIAISON CONTACT"
          title="CONNECT WITH THE"
          highlightWord="ORGANIZERS."
          metaRight="COMMUNITY COORDINATION DESK"
          description="Campus venue logistics, university access guidelines, transport navigation, and direct liaison channels for the AWS Student Builder Community Day."
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: 'clamp(2rem, 5vw, 4rem)',
            alignItems: 'start',
            marginBottom: '4rem'
          }}
          className="registration-grid"
        >
          {/* Left Column: Campus Coordinates & Transport Info */}
          <div>
            {/* Campus Address Card */}
            <div
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-strong)',
                boxShadow: '6px 6px 0px 0px rgba(0, 0, 0, 0.4)',
                padding: 'clamp(1.5rem, 3vw, 2.5rem)',
                marginBottom: '2rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                <MapPin size={18} style={{ color: 'var(--accent-toxic)' }} />
                <span className="zine-tag zine-tag-toxic">PRIMARY VENUE</span>
              </div>

              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.75rem' }}>
                {EVENT_INFO.campus}
              </h3>

              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {EVENT_INFO.venue}
              </p>

              {/* Technical GPS Metadata */}
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8125rem',
                  backgroundColor: 'var(--bg-primary)',
                  padding: '1rem',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div>
                  <span style={{ color: 'var(--text-dim)' }}>GPS_COORDINATES: </span>
                  <strong style={{ color: 'var(--accent-toxic)' }}>{EVENT_INFO.coordinates}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-dim)' }}>CITY / STATE: </span>
                  <span>{EVENT_INFO.city}, {EVENT_INFO.state}, India</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-dim)' }}>MAIN GATE: </span>
                  <span>Kurud Road Reception Entrance</span>
                </div>
              </div>
            </div>

            {/* Transport & Access Guidelines */}
            <div
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                padding: '1.75rem'
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-toxic)', marginBottom: '0.75rem' }}>
                TRANSIT & ENTRY PROTOCOL:
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                <div>• Nearest Railway Station: Durg Junction (DURG) / Raipur Junction (R).</div>
                <div>• Local Transit: Auto-rickshaws and campus shuttles connect Kohka and Kurud Road.</div>
                <div>• Security Clearance: Display your registration confirmation and Student ID card at Gate 01.</div>
              </div>
            </div>
          </div>

          {/* Right Column: Official Contact & Liaison Directory */}
          <div
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-strong)',
              boxShadow: '8px 8px 0px 0px rgba(0, 0, 0, 0.65)',
              padding: 'clamp(1.5rem, 3.5vw, 2.5rem)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                color: 'var(--text-muted)',
                paddingBottom: '1rem',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>COMMUNICATION_DESK // DIRECT_CHANNELS</span>
              <span className="zine-tag zine-tag-toxic">LIVE LIAISON</span>
            </div>

            {/* Email Channels Card */}
            <div
              style={{
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                padding: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                <Mail size={16} style={{ color: 'var(--accent-toxic)' }} />
                <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 800, margin: 0, textTransform: 'uppercase' }}>
                  Official Email Channels
                </h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.8125rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>General Support:</span>
                  <a href="mailto:support@awsstudentbuilders.org" style={{ color: 'var(--accent-toxic)', textDecoration: 'none', fontFamily: 'var(--font-mono)' }}>
                    support@awsstudentbuilders.org
                  </a>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Campus Desk:</span>
                  <a href="mailto:aws.community@rungta.ac.in" style={{ color: 'var(--accent-toxic)', textDecoration: 'none', fontFamily: 'var(--font-mono)' }}>
                    aws.community@rungta.ac.in
                  </a>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Volunteer Team:</span>
                  <a href="mailto:volunteers@awsstudentbuilders.org" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontFamily: 'var(--font-mono)' }}>
                    volunteers@awsstudentbuilders.org
                  </a>
                </div>
              </div>
            </div>

            {/* Helpline Numbers Card */}
            <div
              style={{
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                padding: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                <Phone size={16} style={{ color: 'var(--accent-toxic)' }} />
                <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 800, margin: 0, textTransform: 'uppercase' }}>
                  Helpline & Support Desk
                </h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.8125rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Campus Line:</span>
                  <a href="tel:+917886666666" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                    +91 (0788) 666-6666
                  </a>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Student Coordinator:</span>
                  <a href="tel:+919876543210" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontFamily: 'var(--font-mono)' }}>
                    +91 98765-43210
                  </a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-dim)', fontSize: '0.75rem', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                  <Clock size={12} />
                  <span>MON–SAT (09:00 AM – 06:00 PM IST)</span>
                </div>
              </div>
            </div>

            {/* Campus Coordination Team */}
            <div
              style={{
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                padding: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                <UserCheck size={16} style={{ color: 'var(--accent-toxic)' }} />
                <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 800, margin: 0, textTransform: 'uppercase' }}>
                  Campus Coordination Team
                </h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.8125rem' }}>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Student Community Lead</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>AWS Cloud Club Ambassador & Builder Lead</div>
                </div>
                <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '0.5rem' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Faculty Liaison Office</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Department of Computer Science & Engineering, Rungta University</div>
                </div>
              </div>
            </div>

            {/* Event Day Help Desk */}
            <div
              style={{
                border: '1px dashed var(--accent-toxic)',
                backgroundColor: 'var(--bg-tertiary)',
                padding: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                <MessageSquare size={16} style={{ color: 'var(--accent-toxic)' }} />
                <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 800, margin: 0, color: 'var(--accent-toxic)' }}>
                  EVENT DAY HELP DESK
                </h4>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', lineHeight: 1.5, margin: 0 }}>
                On 18 OCT 2026, an in-person physical helpdesk will be active from 08:30 AM at the Main Auditorium Foyer, Rungta Educational Complex.
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================
            ABOUT & EVENT OVERVIEW DOSSIER
            ======================================================== */}
        <div
          style={{
            border: '1px solid var(--border-strong)',
            backgroundColor: 'var(--bg-secondary)',
            boxShadow: '6px 6px 0px 0px rgba(0, 0, 0, 0.4)',
            padding: 'clamp(1.5rem, 3.5vw, 2.5rem)',
            marginTop: '1rem'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              paddingBottom: '1.25rem',
              borderBottom: '1px solid var(--border-color)',
              marginBottom: '2rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info size={18} style={{ color: 'var(--accent-toxic)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 800, letterSpacing: '0.08em', color: 'var(--accent-toxic)' }}>
                EVENT DOSSIER // ABOUT THE COMMUNITY DAY
              </span>
            </div>
            <span className="zine-tag">RUNGTA UNIVERSITY CAMPUS · BHILAI</span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem',
              alignItems: 'stretch'
            }}
          >
            {/* Mission & Philosophy */}
            <div style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                <Terminal size={16} style={{ color: 'var(--accent-toxic)' }} />
                <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: 800, margin: 0 }}>
                  EVENT MISSION
                </h4>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
                {EVENT_INFO.philosophy}
              </p>
            </div>

            {/* Hands-on Tracks */}
            <div style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                <Cpu size={16} style={{ color: 'var(--accent-toxic)' }} />
                <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: 800, margin: 0 }}>
                  WHAT WE BUILD
                </h4>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
                4+ intensive hands-on sprint tracks covering AWS Amplify serverless hosting, Fullstack React & DynamoDB, Generative AI with AWS Bedrock, and live deployment workflows.
              </p>
            </div>

            {/* Participation */}
            <div style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                <Users size={16} style={{ color: 'var(--accent-toxic)' }} />
                <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: 800, margin: 0 }}>
                  STUDENT BUILDER NETWORK
                </h4>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
                100+ passionate student developers, peer builders, and industry mentors coming together under one roof. Complimentary access, free cloud lab environment, and verified credentials.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
