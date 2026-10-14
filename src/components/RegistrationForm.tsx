import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  RegistrationPayload,
  ValidationErrors,
  validateField,
  validateAll,
  submitRegistrationToGoogleSheets,
  StoredRegistrationRecord,
  getUserConfirmedRegistration
} from '../lib/registration';
import { getAuthUser, logoutUser } from '../lib/auth';
import { INTEREST_OPTIONS } from '../lib/data';
import { Check, AlertCircle, Loader2, Send, CheckCircle2, ArrowRight, UserPlus } from 'lucide-react';

interface RegistrationFormProps {
  onSuccess?: () => void;
  onShowToast?: (message: string, isError?: boolean) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSuccess,
  onShowToast
}) => {
  const authUser = getAuthUser();
  const initialEmail = authUser?.role === 'user' ? authUser.email : '';
  const initialName = authUser?.role === 'user' && authUser.name !== 'Student Builder' ? authUser.name : '';

  const [formData, setFormData] = useState<RegistrationPayload>({
    name: initialName,
    email: initialEmail,
    college: '',
    interest: '',
    consent: false
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<StoredRegistrationRecord | null>(() => {
    return getUserConfirmedRegistration(initialEmail || undefined);
  });
  const [submissionStatus, setSubmissionStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  useEffect(() => {
    const handleAuthChange = () => {
      const currentAuth = getAuthUser();
      const currentEmail = currentAuth?.role === 'user' ? currentAuth.email : '';
      const confirmed = getUserConfirmedRegistration(currentEmail || undefined);
      setSubmittedRecord(confirmed);
      if (currentEmail && !confirmed) {
        setFormData((prev) => ({
          ...prev,
          email: currentEmail,
          name: prev.name || (currentAuth?.name && currentAuth.name !== 'Student Builder' ? currentAuth.name : '')
        }));
      }
    };

    window.addEventListener('auth_state_changed', handleAuthChange);
    window.addEventListener('user_registration_confirmed', handleAuthChange);
    return () => {
      window.removeEventListener('auth_state_changed', handleAuthChange);
      window.removeEventListener('user_registration_confirmed', handleAuthChange);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    const val = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: val
    }));

    if (touched[name]) {
      const error = validateField(name as keyof RegistrationPayload, val);
      setErrors((prev) => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBlur = (field: keyof RegistrationPayload) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors((prev) => ({
      ...prev,
      [field]: error
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      name: true,
      email: true,
      college: true,
      interest: true,
      consent: true
    });

    const validationErrors = validateAll(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      if (validationErrors.consent) {
        onShowToast?.("Please accept the demo event update consent.", true);
      } else {
        onShowToast?.("Please fix the highlighted fields.", true);
      }
      setSubmissionStatus({
        type: 'error',
        message: 'Please review and fix the highlighted fields below.'
      });
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmissionStatus({ type: null, message: '' });

    try {
      const result = await submitRegistrationToGoogleSheets(formData);

      if (result.success && result.record) {
        setSubmittedRecord(result.record);
        setSubmissionStatus({
          type: 'success',
          message: `✓ Thanks ${formData.name.trim()}! Your registration is confirmed.`
        });

        onShowToast?.("Registration confirmed successfully!", false);
        onSuccess?.();

        setFormData({
          name: '',
          email: '',
          college: '',
          interest: '',
          consent: false
        });
        setTouched({});
        setErrors({});
      } else {
        setSubmissionStatus({
          type: 'error',
          message: result.message
        });
        onShowToast?.(result.message, true);
      }
    } catch (err) {
      console.error("Submission failed:", err);
      setSubmissionStatus({
        type: 'error',
        message: 'An unexpected transmission error occurred. Please try again.'
      });
      onShowToast?.("An unexpected transmission error occurred.", true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-strong)',
        boxShadow: '8px 8px 0px 0px rgba(0, 0, 0, 0.65)',
        padding: 'clamp(1.5rem, 3.5vw, 2.75rem)'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '1.25rem',
          marginBottom: '1.75rem',
          borderBottom: '1px solid var(--border-color)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6875rem',
          color: 'var(--text-muted)'
        }}
      >
        <span>FORM_ID: AWS_REG_2026</span>
        <span className="zine-tag zine-tag-toxic">LIVE VERIFICATION</span>
      </div>

      {submittedRecord ? (
        <div className="registration-success-ticket" style={{ animation: 'fadeIn 0.3s ease-out' }}>
          <div
            style={{
              padding: '1.25rem',
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--accent-toxic)',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}
          >
            <CheckCircle2 size={22} style={{ color: 'var(--accent-toxic)', marginTop: '2px', flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 800, color: 'var(--accent-toxic)', letterSpacing: '0.04em' }}>
                REGISTRATION CONFIRMED & SAVED
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.5 }}>
                Your data has been sent directly to the Master Live Excel Sheet and your seat is confirmed.
              </div>
            </div>
          </div>

          {/* Attendee Pass Details Card */}
          <div
            style={{
              border: '1px solid var(--border-strong)',
              backgroundColor: 'var(--bg-elevated)',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              position: 'relative'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '0.75rem',
                marginBottom: '1.25rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem'
              }}
            >
              <span style={{ color: 'var(--text-muted)' }}>// ATTENDEE PASS</span>
              <span style={{ color: 'var(--accent-toxic)', fontWeight: 800, letterSpacing: '0.05em' }}>{submittedRecord.id}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Attendee Name
                </div>
                <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {submittedRecord.name}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Email Address
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', wordBreak: 'break-all' }}>
                  {submittedRecord.email}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Institution / College
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                  {submittedRecord.college}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Area of Interest
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--accent-toxic)', fontWeight: 600 }}>
                  {submittedRecord.interest}
                </div>
              </div>
            </div>

            <div
              style={{
                borderTop: '1px dashed var(--border-color)',
                paddingTop: '0.75rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                color: 'var(--text-muted)',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px'
              }}
            >
              <span>REGISTERED: {new Date(submittedRecord.registeredAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
              <span style={{ color: 'var(--accent-toxic)' }}>STATUS: CONFIRMED</span>
            </div>
          </div>

          {/* Confirmed Status Actions - Single Registration Rule */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div
              style={{
                padding: '0.875rem 1rem',
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                textAlign: 'center',
                marginBottom: '0.25rem'
              }}
            >
              🔒 1 SEAT PERMITTED PER EMAIL // YOUR REGISTRATION IS FINAL & CONFIRMED
            </div>

            <button
              type="button"
              onClick={() => {
                logoutUser();
                setSubmittedRecord(null);
                setFormData({
                  name: '',
                  email: '',
                  college: '',
                  interest: '',
                  consent: false
                });
                setTouched({});
                setErrors({});
                onShowToast?.('Logged out. You can now register with a new email!', false);
              }}
              className="btn-noise-outline"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                color: 'var(--accent-toxic)',
                borderColor: 'var(--accent-toxic)',
                padding: '0.75rem 1rem',
                fontSize: '0.8125rem',
                cursor: 'pointer'
              }}
            >
              <UserPlus size={15} />
              <span>REGISTER WITH ANOTHER NEW EMAIL</span>
            </button>

            <Link
              to="/"
              className="btn-noise-primary"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                textDecoration: 'none'
              }}
              data-cursor="HOME"
            >
              <span>RETURN TO HOME PAGE</span>
              <ArrowRight size={15} />
            </Link>

            <Link
              to="/about"
              className="btn-noise-outline"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                textDecoration: 'none'
              }}
              data-cursor="ABOUT"
            >
              <span>EXPLORE EVENT DETAILS</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      ) : (
        <form id="registrationForm" onSubmit={handleSubmit} noValidate>
        {/* Field: Full Name */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label
            htmlFor="name"
            style={{
              display: 'block',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: errors.name ? 'var(--accent-red)' : 'var(--text-primary)',
              marginBottom: '0.5rem'
            }}
          >
            Full name <span style={{ color: 'var(--accent-toxic)' }}>*</span>
          </label>

          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Mukesh Kumar"
            value={formData.name}
            onChange={handleChange}
            onBlur={() => handleBlur('name')}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
            style={{
              width: '100%',
              padding: '0.875rem 1rem',
              backgroundColor: 'var(--bg-elevated)',
              border: errors.name ? '1px solid var(--accent-red)' : '1px solid var(--border-strong)',
              color: 'var(--text-primary)',
              fontSize: '0.9375rem',
              outline: 'none',
              transition: 'border-color var(--transition-fast)'
            }}
          />
          {errors.name && (
            <p
              id="name-error"
              style={{
                color: 'var(--accent-red)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <AlertCircle size={11} /> {errors.name}
            </p>
          )}
        </div>

        {/* Field: Email */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label
            htmlFor="email"
            style={{
              display: 'block',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: errors.email ? 'var(--accent-red)' : 'var(--text-primary)',
              marginBottom: '0.5rem'
            }}
          >
            Email address <span style={{ color: 'var(--accent-toxic)' }}>*</span>
          </label>

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            onBlur={() => handleBlur('email')}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            style={{
              width: '100%',
              padding: '0.875rem 1rem',
              backgroundColor: 'var(--bg-elevated)',
              border: errors.email ? '1px solid var(--accent-red)' : '1px solid var(--border-strong)',
              color: 'var(--text-primary)',
              fontSize: '0.9375rem',
              outline: 'none',
              transition: 'border-color var(--transition-fast)'
            }}
          />
          {errors.email && (
            <p
              id="email-error"
              style={{
                color: 'var(--accent-red)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <AlertCircle size={11} /> {errors.email}
            </p>
          )}
        </div>

        {/* Field: College */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label
            htmlFor="college"
            style={{
              display: 'block',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: errors.college ? 'var(--accent-red)' : 'var(--text-primary)',
              marginBottom: '0.5rem'
            }}
          >
            College / University <span style={{ color: 'var(--accent-toxic)' }}>*</span>
          </label>

          <input
            id="college"
            name="college"
            type="text"
            autoComplete="organization"
            placeholder="Rungta University"
            value={formData.college}
            onChange={handleChange}
            onBlur={() => handleBlur('college')}
            aria-invalid={Boolean(errors.college)}
            aria-describedby={errors.college ? 'college-error' : undefined}
            style={{
              width: '100%',
              padding: '0.875rem 1rem',
              backgroundColor: 'var(--bg-elevated)',
              border: errors.college ? '1px solid var(--accent-red)' : '1px solid var(--border-strong)',
              color: 'var(--text-primary)',
              fontSize: '0.9375rem',
              outline: 'none',
              transition: 'border-color var(--transition-fast)'
            }}
          />
          {errors.college && (
            <p
              id="college-error"
              style={{
                color: 'var(--accent-red)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <AlertCircle size={11} /> {errors.college}
            </p>
          )}
        </div>

        {/* Field: Area of Interest */}
        <div style={{ marginBottom: '1.75rem' }}>
          <label
            htmlFor="interest"
            style={{
              display: 'block',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: errors.interest ? 'var(--accent-red)' : 'var(--text-primary)',
              marginBottom: '0.5rem'
            }}
          >
            Area of interest <span style={{ color: 'var(--accent-toxic)' }}>*</span>
          </label>

          <select
            id="interest"
            name="interest"
            value={formData.interest}
            onChange={handleChange}
            onBlur={() => handleBlur('interest')}
            aria-invalid={Boolean(errors.interest)}
            aria-describedby={errors.interest ? 'interest-error' : undefined}
            style={{
              width: '100%',
              padding: '0.875rem 1rem',
              backgroundColor: 'var(--bg-elevated)',
              border: errors.interest ? '1px solid var(--accent-red)' : '1px solid var(--border-strong)',
              color: formData.interest ? 'var(--text-primary)' : 'var(--text-muted)',
              fontSize: '0.9375rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="">Select one</option>
            {INTEREST_OPTIONS.map((opt) => (
              <option key={opt} value={opt} style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>
                {opt}
              </option>
            ))}
          </select>
          {errors.interest && (
            <p
              id="interest-error"
              style={{
                color: 'var(--accent-red)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <AlertCircle size={11} /> {errors.interest}
            </p>
          )}
        </div>

        {/* Consent Checkbox */}
        <div style={{ marginBottom: '2rem' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <input
              id="consent"
              name="consent"
              type="checkbox"
              checked={formData.consent}
              onChange={handleChange}
              onBlur={() => handleBlur('consent')}
              style={{
                width: '18px',
                height: '18px',
                marginTop: '3px',
                accentColor: 'var(--accent-toxic)',
                cursor: 'pointer'
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                color: errors.consent ? 'var(--accent-red)' : 'var(--text-primary)',
                lineHeight: 1.45
              }}
            >
              I agree to receive event updates for this fictional demo.
            </span>
          </label>
          {errors.consent && (
            <p
              style={{
                color: 'var(--accent-red)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                marginTop: '4px',
                marginLeft: '30px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <AlertCircle size={11} /> {errors.consent}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-noise-primary"
          style={{
            width: '100%',
            opacity: isSubmitting ? 0.7 : 1,
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
          data-cursor="SUBMIT"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="cursor-blink" />
              <span>TRANSMITTING REGISTRATION...</span>
            </>
          ) : (
            <>
              <span>COMPLETE REGISTRATION</span>
              <Send size={15} />
            </>
          )}
        </button>

        {/* Submission Result Feedback */}
        {submissionStatus.message && (
          <div
            id="formMessage"
            role="status"
            aria-live="polite"
            style={{
              marginTop: '1.25rem',
              padding: '0.875rem 1rem',
              border: '1px solid',
              borderColor: submissionStatus.type === 'success' ? 'var(--accent-toxic)' : 'var(--accent-red)',
              backgroundColor: 'var(--bg-tertiary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8125rem',
              color: submissionStatus.type === 'success' ? 'var(--accent-toxic)' : 'var(--accent-red)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {submissionStatus.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
            <span>{submissionStatus.message}</span>
          </div>
        )}

        {/* Privacy Note */}
        <div
          style={{
            marginTop: '1.5rem',
            paddingTop: '1rem',
            borderTop: '1px dashed var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            color: 'var(--text-muted)'
          }}
        >
          <span>PRIVACY: DATA PROTECTED</span>
          <span>LIMITED SEATS AVAILABLE</span>
        </div>
      </form>
      )}
    </div>
  );
};
