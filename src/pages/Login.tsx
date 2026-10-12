import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SectionHeading } from '../components/SectionHeading';
import {
  loginUser,
  getAuthUser,
  logoutUser,
  ADMIN_EMAIL,
  ADMIN_PASS,
  DEMO_USER_EMAIL,
  DEMO_USER_PASS
} from '../lib/auth';
import { getUserConfirmedRegistration } from '../lib/registration';
import {
  ShieldCheck,
  User,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  LogOut,
  UserPlus
} from 'lucide-react';

interface LoginProps {
  onShowToast: (message: string, isError?: boolean) => void;
}

export const Login: React.FC<LoginProps> = ({ onShowToast }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(getAuthUser());

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'admin' | 'user'>('user');

  useEffect(() => {
    const handleAuthChange = () => {
      setCurrentUser(getAuthUser());
    };
    window.addEventListener('auth_state_changed', handleAuthChange);
    return () => window.removeEventListener('auth_state_changed', handleAuthChange);
  }, []);

  const handleSelectAdmin = () => {
    setActiveTab('admin');
    setErrorMessage('');
  };

  const handleSelectUser = () => {
    setActiveTab('user');
    setErrorMessage('');
  };

  const handleAutoFill = () => {
    if (activeTab === 'admin') {
      setEmail(ADMIN_EMAIL);
      setPassword(ADMIN_PASS);
    } else {
      setEmail(DEMO_USER_EMAIL);
      setPassword(DEMO_USER_PASS);
    }
    setErrorMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your password.');
      return;
    }

    const result = loginUser(email, password, rememberMe);

    if (result.success && result.user) {
      if (result.user.role === 'admin') {
        onShowToast('✓ Admin authorized! Unlocking Excel Database...', false);
        navigate('/admin');
      } else {
        const confirmed = getUserConfirmedRegistration(result.user.email);
        if (confirmed) {
          onShowToast(`✓ Welcome back, ${result.user.name}! Opening your confirmed pass...`, false);
        } else {
          onShowToast(`✓ Logged in as ${result.user.email}! Please complete your registration.`, false);
        }
        navigate('/register');
      }
    } else {
      setErrorMessage(result.message);
      onShowToast(result.message, true);
    }
  };

  const handleLogout = () => {
    logoutUser();
    setEmail('');
    setPassword('');
    onShowToast('Logged out successfully.', false);
  };

  return (
    <div className="login-page" style={{ paddingTop: 'clamp(2.5rem, 5vw, 4rem)', paddingBottom: 'var(--section-pad-y)' }}>
      <div className="container">
        {/* Section Heading */}
        <SectionHeading
          number="00"
          category="PORTAL AUTHENTICATION"
          title="IDENTITY &"
          highlightWord="ACCESS."
          metaRight="DUAL ROLE // RBAC SECURITY"
          description="Sign in to your account. Administrator credentials provide exclusive access to participant Excel exports, while student accounts allow session participation and badge reservations."
        />

        <div style={{ maxWidth: '620px', margin: '1.5rem auto 4rem' }}>
          {/* If already logged in, show current session status */}
          {currentUser && (
            <div
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-strong)',
                padding: '1.5rem',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                boxShadow: '4px 4px 0px 0px var(--accent-toxic)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {currentUser.role === 'admin' ? (
                  <ShieldCheck size={26} style={{ color: 'var(--accent-toxic)' }} />
                ) : (
                  <User size={26} style={{ color: 'var(--accent-toxic)' }} />
                )}
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                    CURRENT ACTIVE SESSION
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {currentUser.email}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-toxic)', fontWeight: 600 }}>
                    ROLE: {currentUser.role.toUpperCase()}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {currentUser.role === 'admin' ? (
                  <button
                    type="button"
                    onClick={() => navigate('/admin')}
                    className="btn-noise-primary"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}
                  >
                    <span>OPEN ADMIN CONSOLE</span>
                    <ArrowRight size={13} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => navigate('/register')}
                    className="btn-noise-primary"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}
                  >
                    <span>GO TO REGISTRATION</span>
                    <ArrowRight size={13} />
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    padding: '0.5rem 0.75rem',
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--accent-toxic)',
                    color: 'var(--accent-toxic)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title="Switch to another email"
                >
                  <UserPlus size={13} />
                  <span>SIGN IN WITH NEW EMAIL</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    padding: '0.5rem 0.75rem',
                    backgroundColor: 'transparent',
                    border: '1px solid var(--accent-red)',
                    color: 'var(--accent-red)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title="Logout current session"
                >
                  <LogOut size={13} />
                  <span>LOGOUT</span>
                </button>
              </div>
            </div>
          )}

          {/* Login Card */}
          <div
            className="login-card-container"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-strong)',
              boxShadow: '8px 8px 0px 0px rgba(0, 0, 0, 0.75)',
              padding: 'clamp(2rem, 5vw, 3rem)'
            }}
          >
            {/* Role Tabs */}
            <div
              className="login-tab-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                marginBottom: '1rem',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '1.25rem'
              }}
            >
              <button
                type="button"
                onClick={handleSelectUser}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: activeTab === 'user' ? 'var(--bg-elevated)' : 'transparent',
                  border: activeTab === 'user' ? '1px solid var(--accent-toxic)' : '1px solid var(--border-color)',
                  color: activeTab === 'user' ? 'var(--accent-toxic)' : 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <User size={16} />
                <span>STUDENT / ATTENDEE</span>
              </button>

              <button
                type="button"
                onClick={handleSelectAdmin}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: activeTab === 'admin' ? 'var(--bg-elevated)' : 'transparent',
                  border: activeTab === 'admin' ? '1px solid var(--accent-toxic)' : '1px solid var(--border-color)',
                  color: activeTab === 'admin' ? 'var(--accent-toxic)' : 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <ShieldCheck size={16} />
                <span>ADMIN (EXCEL ACCESS)</span>
              </button>
            </div>

            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                color: 'var(--text-muted)',
                marginBottom: '1.5rem',
                backgroundColor: 'var(--bg-tertiary)',
                padding: '0.625rem 0.875rem',
                border: '1px dashed var(--border-color)'
              }}
            >
              {activeTab === 'user'
                ? '⚡ Har naye email se aap 1 baar login karke apni event seat register kar sakte hain.'
                : '🛡️ Restricted to AWS Cloud Club administrators with Master Excel Sheet access.'}
            </div>

            {/* Main Form */}
            <form onSubmit={handleSubmit} noValidate>
              {/* Email Field */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label
                  htmlFor="loginEmail"
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--text-primary)',
                    marginBottom: '0.5rem'
                  }}
                >
                  Email Address <span style={{ color: 'var(--accent-toxic)' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)'
                    }}
                  />
                  <input
                    id="loginEmail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem 0.875rem 2.5rem',
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border-strong)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9375rem',
                      outline: 'none'
                    }}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label
                  htmlFor="loginPassword"
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--text-primary)',
                    marginBottom: '0.5rem'
                  }}
                >
                  Password <span style={{ color: 'var(--accent-toxic)' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)'
                    }}
                  />
                  <input
                    id="loginPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    style={{
                      width: '100%',
                      padding: '0.875rem 2.75rem 0.875rem 2.5rem',
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border-strong)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9375rem',
                      outline: 'none'
                    }}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer'
                    }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: 'rgba(255, 68, 68, 0.1)',
                    border: '1px solid var(--accent-red)',
                    color: 'var(--accent-red)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    marginBottom: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <AlertCircle size={15} style={{ flexShrink: 0 }} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Remember Me */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ accentColor: 'var(--accent-toxic)' }}
                  />
                  <span>Keep session active</span>
                </label>

                <button
                  type="button"
                  onClick={handleAutoFill}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: 'var(--accent-toxic)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Auto-fill demo credentials
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn-noise-primary"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                data-cursor="SIGNIN"
              >
                <span>
                  {activeTab === 'admin' ? 'SIGN IN AS ADMINISTRATOR' : 'SIGN IN AS STUDENT BUILDER'}
                </span>
                <ArrowRight size={15} />
              </button>
            </form>

            {/* Quick Guest Link */}
            <div
              style={{
                marginTop: '1.75rem',
                paddingTop: '1.25rem',
                borderTop: '1px dashed var(--border-color)',
                textAlign: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--text-muted)'
              }}
            >
              <span>Just want to attend the event? </span>
              <Link
                to="/register"
                style={{
                  color: 'var(--accent-toxic)',
                  fontWeight: 700,
                  textDecoration: 'underline'
                }}
              >
                Go directly to Student Registration →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
