import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { NAV_LINKS, REGISTRATION_URL } from '../data/eventData';
import { Sun, Moon, Menu, X, ArrowUpRight } from 'lucide-react';
import awsLogo from '../assets/images/aws_logo.jpg';

interface HeaderProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
            {/* AWS Logo */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '54px',
                height: '38px',
                padding: '2px 4px',
                backgroundColor: '#ffffff',
                border: '1.5px solid var(--border-strong)',
                boxShadow: '2px 2px 0px 0px var(--border-strong)',
                overflow: 'hidden',
                flexShrink: 0
              }}
            >
              <img
                src={awsLogo}
                alt="AWS Logo"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
            </div>

            {/* Vertical Divider */}
            <div
              style={{
                width: '1px',
                height: '28px',
                backgroundColor: 'var(--border-strong)'
              }}
            />

            {/* Brand text */}
            <div
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
            <a
              href={REGISTRATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-noise-primary"
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.75rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
              data-cursor="RESERVE"
            >
              REGISTER
              <ArrowUpRight size={14} />
            </a>



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

          <a
            href={REGISTRATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="btn-noise-primary"
            style={{ width: '100%', marginTop: '0.5rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
          >
            RESERVE MY SEAT →
          </a>
        </div>
      )}
    </header>
  );
};
