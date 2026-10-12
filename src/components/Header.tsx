import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { NAV_LINKS } from '../data/eventData';
import { getAuthUser, logoutUser } from '../lib/auth';
import { Sun, Moon, Menu, X, ArrowUpRight, Lock, ShieldCheck, LogOut, User } from 'lucide-react';

interface HeaderProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState(getAuthUser());
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile drawer when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleAuthChange = () => {
      setCurrentUser(getAuthUser());
    };
    window.addEventListener('auth_state_changed', handleAuthChange);
    return () => window.removeEventListener('auth_state_changed', handleAuthChange);
  }, []);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 900,
        backgroundColor: scrolled
          ? theme === 'dark' ? 'rgba(11, 11, 11, 0.94)' : 'rgba(233, 231, 224, 0.96)'
          : 'var(--bg-primary)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-color)',
        transition: 'background-color 0.2s ease, border-color 0.2s ease'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '74px'
          }}
        >
          {/* Brand Logo & Event Tag */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              textDecoration: 'none'
            }}
            data-cursor="HOME"
          >
            {/* AWS Mark */}
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.75rem',
                fontWeight: 900,
                letterSpacing: '-0.06em',
                lineHeight: 1,
                color: 'var(--text-primary)',
                padding: '2px 7px',
                border: '1.5px solid var(--border-strong)',
                backgroundColor: 'var(--bg-secondary)'
              }}
            >
              aws
            </div>

            {/* Vertical Divider */}
            <div
              className="header-brand-tagline"
              style={{
                width: '1px',
                height: '28px',
                backgroundColor: 'var(--border-strong)'
              }}
            />

            {/* Brand text */}
            <div
              className="header-brand-tagline"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                lineHeight: 1.25,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--text-muted)'
              }}
            >
              <div>Student Builder</div>
              <strong style={{ color: 'var(--text-primary)' }}>COMMUNITY DAY</strong>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav
            className="desktop-nav-links"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.75rem'
            }}
          >
            {NAV_LINKS.filter((l) => !l.isCta).map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                data-cursor={link.label.toUpperCase()}
                style={({ isActive }) => ({
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: isActive ? 'var(--accent-toxic)' : 'var(--text-muted)',
                  borderBottom: isActive ? '2px solid var(--accent-toxic)' : '2px solid transparent',
                  paddingBottom: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'color var(--transition-fast)'
                })}
              >
                <span style={{ color: 'var(--text-dim)', fontSize: '0.625rem' }}>{link.code}.</span>
                {link.label}
              </NavLink>
            ))}

            {/* Quick Register CTA Button */}
            <Link
              to="/register"
              className="btn-noise-primary"
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.75rem'
              }}
              data-cursor="RESERVE"
            >
              REGISTER
              <ArrowUpRight size={14} />
            </Link>

            {/* Auth Session / Role Link */}
            {currentUser?.role === 'admin' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Link
                  to="/admin"
                  className="btn-noise-outline"
                  style={{
                    padding: '0.45rem 0.75rem',
                    fontSize: '0.6875rem',
                    borderColor: 'var(--accent-toxic)',
                    color: 'var(--accent-toxic)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                  title="Admin Console & Excel Database"
                >
                  <ShieldCheck size={13} />
                  <span>ADMIN [EXCEL]</span>
                </Link>
                <button
                  type="button"
                  onClick={() => logoutUser()}
                  title="Logout Admin"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-red)',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : currentUser?.role === 'user' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    color: 'var(--text-muted)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <User size={13} style={{ color: 'var(--accent-toxic)' }} />
                  <span>{currentUser.name}</span>
                </span>
                <button
                  type="button"
                  onClick={() => logoutUser()}
                  title="Logout"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-red)',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  textDecoration: 'none',
                  padding: '0.45rem 0.75rem',
                  border: '1px solid var(--border-color)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--accent-toxic)';
                  e.currentTarget.style.borderColor = 'var(--accent-toxic)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-muted)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
              >
                <Lock size={12} />
                <span>LOGIN</span>
              </Link>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light (Paper)' : 'Dark (Ink)'} Mode`}
              style={{
                padding: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all var(--transition-fast)'
              }}
              data-cursor="THEME"
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </nav>

          {/* Mobile Menu Action & Toggle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            <button
              onClick={toggleTheme}
              className="mobile-menu-btn"
              style={{
                display: 'none',
                padding: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)'
              }}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none',
                padding: '8px 12px',
                border: '1px solid var(--border-strong)',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem'
              }}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              <span>{mobileMenuOpen ? 'CLOSE' : 'MENU'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            borderTop: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-primary)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          {NAV_LINKS.filter((l) => !l.isCta).map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              style={({ isActive }) => ({
                fontFamily: 'var(--font-mono)',
                fontSize: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                padding: '0.625rem 0',
                borderBottom: '1px dashed var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: isActive ? 'var(--accent-toxic)' : 'var(--text-primary)'
              })}
            >
              <span>{link.label}</span>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>[{link.code}]</span>
            </NavLink>
          ))}
          {/* Mobile User Status / Login */}
          {currentUser ? (
            <div
              style={{
                padding: '0.875rem 1rem',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={16} style={{ color: 'var(--accent-toxic)' }} />
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {currentUser.name}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-muted)' }}>
                    {currentUser.role === 'admin' ? 'ORGANIZER ADMIN' : currentUser.email}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  logoutUser();
                  setMobileMenuOpen(false);
                }}
                className="btn-noise-outline"
                style={{
                  padding: '5px 10px',
                  fontSize: '0.6875rem',
                  color: 'var(--accent-red)',
                  borderColor: 'var(--accent-red)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <LogOut size={12} />
                <span>LOGOUT</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-noise-outline"
              style={{
                width: '100%',
                marginTop: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '0.875rem'
              }}
            >
              <Lock size={15} />
              <span>SIGN IN / LOGIN</span>
            </Link>
          )}

          {currentUser?.role === 'admin' && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-noise-outline"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                color: 'var(--accent-toxic)',
                borderColor: 'var(--accent-toxic)',
                padding: '0.875rem'
              }}
            >
              <ShieldCheck size={16} />
              <span>ORGANIZER CONSOLE [EXCEL]</span>
            </Link>
          )}

          <Link
            to="/register"
            onClick={() => setMobileMenuOpen(false)}
            className="btn-noise-primary"
            style={{ width: '100%', padding: '0.875rem', textAlign: 'center' }}
          >
            RESERVE MY SEAT →
          </Link>
        </div>
      )}
    </header>
  );
};
