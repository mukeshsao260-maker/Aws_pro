import React, { useState, useEffect } from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { RegistrationForm } from '../components/RegistrationForm';
import { EVENT_INFO } from '../data/eventData';
import { getRemainingSeats, getUserConfirmedRegistration } from '../lib/registration';
import { getAuthUser } from '../lib/auth';
import { Laptop, Mail, IdCard } from 'lucide-react';

interface RegisterProps {
  onShowToast: (message: string, isError?: boolean) => void;
}

export const Register: React.FC<RegisterProps> = ({ onShowToast }) => {
  const [remainingSeats, setRemainingSeats] = useState<number>(100);
  const [hasConfirmedPass, setHasConfirmedPass] = useState<boolean>(() => {
    const auth = getAuthUser();
    return Boolean(getUserConfirmedRegistration(auth?.role === 'user' ? auth.email : undefined));
  });

  useEffect(() => {
    setRemainingSeats(getRemainingSeats());

    const updateStatus = () => {
      const auth = getAuthUser();
      const confirmed = getUserConfirmedRegistration(auth?.role === 'user' ? auth.email : undefined);
      setHasConfirmedPass(Boolean(confirmed));
      setRemainingSeats(getRemainingSeats());
    };

    window.addEventListener('user_registration_confirmed', updateStatus);
    window.addEventListener('auth_state_changed', updateStatus);
    return () => {
      window.removeEventListener('user_registration_confirmed', updateStatus);
      window.removeEventListener('auth_state_changed', updateStatus);
    };
  }, []);

  const handleRegistrationSuccess = () => {
    setRemainingSeats(getRemainingSeats());
    const auth = getAuthUser();
    setHasConfirmedPass(Boolean(getUserConfirmedRegistration(auth?.role === 'user' ? auth.email : undefined)));
  };

  return (
    <div className="register-page" style={{ paddingTop: 'clamp(2.5rem, 5vw, 4rem)', paddingBottom: 'var(--section-pad-y)' }}>
      <div className="container">
        {/* Page Heading */}
        <SectionHeading
          number="04"
          category={hasConfirmedPass ? "SEAT RESERVED // PASS CONFIRMED" : "REGISTRATION PORTAL"}
          title={hasConfirmedPass ? "YOUR PASS IS" : "SAVE YOUR"}
          highlightWord={hasConfirmedPass ? "ACTIVE." : "SEAT."}
          metaRight="1 REGISTRATION PER ATTENDEE"
          description={
            hasConfirmedPass
              ? "Your seat for the AWS Student Builder Community Day is successfully confirmed. Please review your pass details and venue instructions below."
              : "Registration is completely free for enrolled students. Complete the verified form below to confirm your attendance. Only one registration is allowed per email address."
          }
        />

        {/* 2-Column Layout: Guidelines & Info on Left, Form on Right */}
        <div
          className="registration-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.25fr',
            gap: 'clamp(2rem, 5vw, 4.5rem)',
            alignItems: 'start'
          }}
        >
          {/* Left Column: Guidelines, Logistics, Live Seat Counter, Admin Portal Link */}
          <div>
            {/* Live Seat Status Box */}
            <div
              style={{
                border: '1px solid var(--border-strong)',
                backgroundColor: 'var(--bg-secondary)',
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontFamily: 'var(--font-mono)',
                marginBottom: '2rem',
                boxShadow: '4px 4px 0px 0px var(--accent-toxic)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  className="live-pulse"
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-toxic)',
                    display: 'inline-block'
                  }}
                />
                <span style={{ fontSize: '0.8125rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Demo seats available:
                </span>
              </div>

              <div
                id="seatCount"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2rem',
                  fontWeight: 900,
                  color: 'var(--accent-toxic)'
                }}
              >
                {remainingSeats}
              </div>
            </div>

            {/* Checklist Guidelines */}
            <div
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                padding: '1.75rem',
                marginBottom: '2rem'
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: 'var(--accent-toxic)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '1rem'
                }}
              >
                ATTENDEE REQUIREMENTS
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <Laptop size={18} style={{ color: 'var(--accent-toxic)', marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.9375rem', color: 'var(--text-primary)' }}>Bring your laptop + charger</strong>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>You will write code and deploy directly from your personal workstation.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <Mail size={18} style={{ color: 'var(--accent-toxic)', marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.9375rem', color: 'var(--text-primary)' }}>Use an active email address</strong>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Important lab access keys and event schedules are dispatched here.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <IdCard size={18} style={{ color: 'var(--accent-toxic)', marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.9375rem', color: 'var(--text-primary)' }}>Carry your college ID</strong>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Required at the main campus reception gate for badge issuance.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Logistics Badge */}
            <div
              style={{
                border: '1px dashed var(--border-strong)',
                backgroundColor: 'var(--bg-tertiary)',
                padding: '1.25rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                marginBottom: '1.5rem'
              }}
            >
              <div style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>// VENUE DISPATCH:</div>
              <div>{EVENT_INFO.venue}</div>
              <div>COORDINATES: {EVENT_INFO.coordinates}</div>
              <div>EVENT TIMING: 10:00 AM — 5:00 PM (CHECK-IN AT 10:00 AM)</div>
            </div>


          </div>

          {/* Right Column: Reusable Registration Form */}
          <div>
            <RegistrationForm
              onSuccess={handleRegistrationSuccess}
              onShowToast={onShowToast}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
