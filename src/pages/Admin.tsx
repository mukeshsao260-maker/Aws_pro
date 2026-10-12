import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { SectionHeading } from '../components/SectionHeading';
import {
  getStoredRegistrations,
  getRemainingSeats,
  exportRegistrationsToExcel,
  exportSingleRegistrationToExcel,
  deleteStoredRegistration,
  clearStoredRegistrations,
  saveRegistrationRecord,
  getLiveSheetUrl,
  setLiveSheetUrl,
  getCustomWebhookUrl,
  setCustomWebhookUrl,
  GOOGLE_SCRIPT_URL,
  StoredRegistrationRecord,
  TOTAL_CAPACITY
} from '../lib/registration';
import {
  isAdmin,
  loginUser,
  logoutUser,
  ADMIN_EMAIL,
  ADMIN_PASS
} from '../lib/auth';
import {
  getStoredInquiries,
  saveInquiryRecord,
  updateInquiryStatus,
  deleteStoredInquiry,
  exportInquiriesToExcel,
  StoredInquiryRecord
} from '../lib/inquiries';
import {
  Lock,
  Unlock,
  KeyRound,
  FileSpreadsheet,
  Download,
  Trash2,
  Search,
  Eye,
  EyeOff,
  ShieldAlert,
  ShieldCheck,
  ArrowLeft,
  UserPlus,
  RefreshCw,
  Mail,
  ExternalLink,
  Tv,
  Globe,
  Radio,
  Copy,
  MessageSquare
} from 'lucide-react';

interface AdminProps {
  onShowToast: (message: string, isError?: boolean) => void;
}

export const Admin: React.FC<AdminProps> = ({ onShowToast }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return isAdmin();
  });

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const [registrations, setRegistrations] = useState<StoredRegistrationRecord[]>([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('ALL');

  // Contact Inquiries state
  const [inquiries, setInquiries] = useState<StoredInquiryRecord[]>(() => getStoredInquiries());
  const [inquirySearchFilter, setInquirySearchFilter] = useState('');
  const [inquiryTopicFilter, setInquiryTopicFilter] = useState('ALL');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('ALL');
  const [newlyAddedInquiryId, setNewlyAddedInquiryId] = useState<string | null>(null);

  // Live Sync & Cloud Sheet State
  const [isLiveSyncActive, setIsLiveSyncActive] = useState<boolean>(true);
  const [lastSyncText, setLastSyncText] = useState<string>('Just now');
  const [cloudSheetUrl, setCloudSheetUrl] = useState<string>(() => getLiveSheetUrl());
  const [customSheetInput, setCustomSheetInput] = useState<string>(() => getLiveSheetUrl());
  const [customWebhookInput, setCustomWebhookInput] = useState<string>(() => getCustomWebhookUrl());
  const [showSheetEmbed, setShowSheetEmbed] = useState<boolean>(false);
  const [isEditingSheetUrl, setIsEditingSheetUrl] = useState<boolean>(false);
  const [newlyAddedId, setNewlyAddedId] = useState<string | null>(null);

  const prevCountRef = useRef<number>(0);
  const prevInqCountRef = useRef<number>(inquiries.length);

  const refreshData = () => {
    // 1. Registrations
    const latestReg = getStoredRegistrations();
    if (latestReg.length > prevCountRef.current && prevCountRef.current > 0) {
      const newest = latestReg[0];
      setNewlyAddedId(newest.id);
      onShowToast(`⚡ Live update: New attendee registered (${newest.name})!`, false);
      setTimeout(() => setNewlyAddedId(null), 6000);
    }
    prevCountRef.current = latestReg.length;
    setRegistrations(latestReg);

    // 2. Inquiries
    const latestInq = getStoredInquiries();
    if (latestInq.length > prevInqCountRef.current && prevInqCountRef.current > 0) {
      const newestInq = latestInq[0];
      setNewlyAddedInquiryId(newestInq.id);
      onShowToast(`⚡ Live update: New contact inquiry from (${newestInq.name})!`, false);
      setTimeout(() => setNewlyAddedInquiryId(null), 6000);
    }
    prevInqCountRef.current = latestInq.length;
    setInquiries(latestInq);

    setLastSyncText(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  };

  useEffect(() => {
    const handleAuthChange = () => {
      setIsAuthenticated(isAdmin());
    };
    window.addEventListener('auth_state_changed', handleAuthChange);
    return () => window.removeEventListener('auth_state_changed', handleAuthChange);
  }, []);

  // Initial load and live sync listeners
  useEffect(() => {
    if (!isAuthenticated) return;

    refreshData();

    // Event listener for cross-tab or in-page new registrations & inquiries
    const handleStorageChange = () => {
      refreshData();
    };
    const handleLiveEvent = () => {
      refreshData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('new_registration_stored', handleLiveEvent);
    window.addEventListener('new_inquiry_stored', handleLiveEvent);

    // Live Polling Interval (every 3 seconds when live sync is on)
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isLiveSyncActive) {
      interval = setInterval(() => {
        refreshData();
      }, 3000);
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('new_registration_stored', handleLiveEvent);
      window.removeEventListener('new_inquiry_stored', handleLiveEvent);
      if (interval) clearInterval(interval);
    };
  }, [isAuthenticated, isLiveSyncActive]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginUser(emailInput, passwordInput, true);

    if (result.success && result.user?.role === 'admin') {
      setIsAuthenticated(true);
      setAuthError('');
      onShowToast('✓ Admin verified! Welcome to Organizer Console.', false);
      refreshData();
    } else {
      setAuthError(result.message || 'Invalid credentials. Only aws.rungta@gmail.com has Excel access.');
      onShowToast('Access denied: Invalid admin email or password.', true);
    }
  };

  const handleLogout = () => {
    logoutUser();
    setIsAuthenticated(false);
    setPasswordInput('');
    onShowToast('Admin logged out. Excel database locked.', false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete registration for "${name}" (${id})?`)) {
      deleteStoredRegistration(id);
      refreshData();
      onShowToast(`Record ${id} removed.`, false);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('WARNING: Are you sure you want to permanently clear all stored registrations from the local database?')) {
      clearStoredRegistrations();
      refreshData();
      onShowToast('All stored records cleared.', false);
    }
  };

  const handleAddSample = () => {
    const sampleRecord = saveRegistrationRecord({
      name: `Demo Builder ${Math.floor(Math.random() * 900) + 100}`,
      email: `builder.${Date.now().toString().slice(-4)}@rungta.ac.in`,
      college: 'Rungta College of Engineering & Tech',
      interest: 'Cloud Architecture & Security',
      consent: true
    });
    refreshData();
    onShowToast(`Sample attendee "${sampleRecord.name}" added to Live Excel database.`, false);
  };

  const handleSaveSheetUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setLiveSheetUrl(customSheetInput);
    setCloudSheetUrl(customSheetInput.trim());
    if (customWebhookInput.trim()) {
      setCustomWebhookUrl(customWebhookInput.trim());
    }
    setIsEditingSheetUrl(false);
    onShowToast('✓ Master Sheet settings updated!', false);
  };

  const handleAddSampleInquiry = () => {
    const topics = [
      'General Event Inquiry',
      'Workshop & Cloud Credentials',
      'Transport & Campus Transit',
      'Sponsorship & Partnerships',
      'Speaker & Agenda Questions'
    ];
    const chosen = topics[Math.floor(Math.random() * topics.length)];
    const sample = saveInquiryRecord({
      name: `Demo Inquirer ${Math.floor(Math.random() * 900) + 100}`,
      email: `student.${Date.now().toString().slice(-4)}@rungta.ac.in`,
      topic: chosen,
      message: `Checking if attendance certificate and AWS swag kit will be provided to all registered students.`
    });
    refreshData();
    onShowToast(`Sample inquiry from "${sample.name}" added to Inquiries database.`, false);
  };

  const handleToggleInquiryStatus = (id: string, currentStatus: 'NEW' | 'IN_REVIEW' | 'RESOLVED') => {
    const nextStatus: 'NEW' | 'IN_REVIEW' | 'RESOLVED' =
      currentStatus === 'NEW' ? 'IN_REVIEW' : currentStatus === 'IN_REVIEW' ? 'RESOLVED' : 'NEW';
    updateInquiryStatus(id, nextStatus);
    refreshData();
    onShowToast(`Inquiry ${id} marked as ${nextStatus}.`, false);
  };

  const handleDeleteInquiry = (id: string, name: string) => {
    if (window.confirm(`Delete contact inquiry from "${name}" (${id})?`)) {
      deleteStoredInquiry(id);
      refreshData();
      onShowToast(`Inquiry ${id} removed.`, false);
    }
  };

  const filteredRegistrations = registrations.filter((rec) => {
    const matchesSearch =
      !searchFilter.trim() ||
      rec.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      rec.email.toLowerCase().includes(searchFilter.toLowerCase()) ||
      rec.college.toLowerCase().includes(searchFilter.toLowerCase()) ||
      rec.id.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesTrack = selectedTrack === 'ALL' || rec.interest === selectedTrack;

    return matchesSearch && matchesTrack;
  });

  const filteredInquiries = inquiries.filter((inq) => {
    const matchQuery =
      !inquirySearchFilter.trim() ||
      inq.name.toLowerCase().includes(inquirySearchFilter.toLowerCase()) ||
      inq.email.toLowerCase().includes(inquirySearchFilter.toLowerCase()) ||
      inq.topic.toLowerCase().includes(inquirySearchFilter.toLowerCase()) ||
      inq.id.toLowerCase().includes(inquirySearchFilter.toLowerCase()) ||
      inq.message.toLowerCase().includes(inquirySearchFilter.toLowerCase());

    const matchTopic = inquiryTopicFilter === 'ALL' || inq.topic === inquiryTopicFilter;
    const matchStatus = inquiryStatusFilter === 'ALL' || inq.status === inquiryStatusFilter;
    return matchQuery && matchTopic && matchStatus;
  });

  return (
    <div className="admin-page" style={{ paddingTop: 'clamp(2.5rem, 5vw, 4rem)', paddingBottom: 'var(--section-pad-y)' }}>
      <div className="container">
        {/* Section Heading */}
        <SectionHeading
          number="ADM"
          category="ORGANIZER CONSOLE"
          title="ADMIN"
          highlightWord="PORTAL."
          metaRight="SECURE ACCESS // LIVE EXCEL DATABASE"
          description="Restricted organizer console for AWS Community Day. Access, inspect, and export all live registered attendee data to Microsoft Excel (.xlsx) and Google Sheets."
        />

        {!isAuthenticated ? (
          /* Authentication Screen */
          <div
            style={{
              maxWidth: '540px',
              margin: '2rem auto 4rem',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-strong)',
              boxShadow: '10px 10px 0px 0px rgba(0, 0, 0, 0.75)',
              padding: 'clamp(2rem, 5vw, 3rem)'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '1.25rem',
                marginBottom: '1.5rem'
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-strong)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-toxic)'
                }}
              >
                <Lock size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>
                  ADMIN ACCESS REQUIRED
                </h2>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  LIVE EXCEL SPREADSHEET ACCESS IS RESTRICTED
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              The event participant database contains contact and institutional info. Please sign in with the official administrator credentials to unlock the Excel export engine.
            </p>

            <form onSubmit={handleLogin}>
              {/* Admin Email Input */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label
                  htmlFor="adminEmail"
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
                  Admin Email Address
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
                    id="adminEmail"
                    type="email"
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      if (authError) setAuthError('');
                    }}
                    placeholder="Enter admin email"
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem 0.875rem 2.5rem',
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border-strong)',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.9375rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Admin Password Input */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label
                  htmlFor="adminPasscode"
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
                  Admin Password
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
                    id="adminPasscode"
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (authError) setAuthError('');
                    }}
                    placeholder="Enter admin password"
                    style={{
                      width: '100%',
                      padding: '0.875rem 2.75rem 0.875rem 2.5rem',
                      backgroundColor: 'var(--bg-elevated)',
                      border: authError ? '1px solid var(--accent-red)' : '1px solid var(--border-strong)',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.9375rem',
                      outline: 'none'
                    }}
                    autoFocus
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
                {authError && (
                  <p
                    style={{
                      color: 'var(--accent-red)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      marginTop: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <ShieldAlert size={12} /> {authError}
                  </p>
                )}
              </div>

              {/* Fixed Credentials Info */}
              <div
                style={{
                  padding: '0.875rem 1rem',
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px dashed var(--border-color)',
                  marginBottom: '1.5rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.6
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-toxic)', fontWeight: 700 }}>
                    <KeyRound size={13} />
                    <span>ORGANIZER ROOT CREDENTIALS:</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEmailInput(ADMIN_EMAIL);
                      setPasswordInput(ADMIN_PASS);
                      setAuthError('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: 'var(--accent-toxic)',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      fontSize: '0.6875rem',
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    Auto-Fill
                  </button>
                </div>
                <div>EMAIL: <strong style={{ color: 'var(--text-primary)' }}>aws.rungta@gmail.com</strong></div>
                <div>PASSWORD: <strong style={{ color: 'var(--text-primary)' }}>RungtaAws@21#</strong></div>
              </div>

              <button
                type="submit"
                className="btn-noise-primary"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginBottom: '1rem'
                }}
                data-cursor="UNLOCK"
              >
                <Unlock size={16} />
                <span>SIGN IN & UNLOCK EXCEL ENGINE</span>
              </button>

              <Link
                to="/register"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  textDecoration: 'none'
                }}
              >
                <ArrowLeft size={12} />
                <span>Return to Public Registration Page</span>
              </Link>
            </form>
          </div>
        ) : (
          /* Authenticated Admin Dashboard */
          <div>
            {/* Top Admin Live Sync Bar */}
            <div
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-strong)',
                padding: '1.25rem 1.75rem',
                marginBottom: '2rem',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                boxShadow: '6px 6px 0px 0px rgba(0,0,0,0.6)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-strong)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-toxic)'
                  }}
                >
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      ORGANIZER ROOT: <span style={{ color: 'var(--accent-toxic)' }}>aws.rungta@gmail.com</span>
                    </span>
                    <span
                      className="zine-tag zine-tag-toxic"
                      style={{
                        fontSize: '0.625rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '2px 7px'
                      }}
                    >
                      <span
                        className="live-pulse"
                        style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          backgroundColor: 'currentColor',
                          display: 'inline-block'
                        }}
                      />
                      LIVE STREAM ACTIVE
                    </span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    LAST SYNC: {lastSyncText} // AUTO-REFRESH EVERY 3s
                  </div>
                </div>
              </div>

              {/* Action Buttons on Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                {/* Toggle Live Sync */}
                <button
                  type="button"
                  onClick={() => {
                    setIsLiveSyncActive((prev) => !prev);
                    onShowToast(isLiveSyncActive ? 'Live sync paused.' : 'Live sync activated!', false);
                  }}
                  style={{
                    padding: '0.5rem 0.875rem',
                    backgroundColor: isLiveSyncActive ? 'var(--bg-elevated)' : 'transparent',
                    border: isLiveSyncActive ? '1px solid var(--accent-toxic)' : '1px solid var(--border-color)',
                    color: isLiveSyncActive ? 'var(--accent-toxic)' : 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  title="Toggle automatic live syncing"
                >
                  <Radio size={13} className={isLiveSyncActive ? 'cursor-blink' : ''} />
                  <span>{isLiveSyncActive ? 'LIVE SYNC: ON' : 'LIVE SYNC: PAUSED'}</span>
                </button>

                <button
                  type="button"
                  onClick={refreshData}
                  className="btn-noise-outline"
                  style={{ padding: '0.5rem 0.875rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                  title="Refresh registration data manually"
                >
                  <RefreshCw size={13} />
                  <span>SYNC NOW</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'transparent',
                    border: '1px solid var(--accent-red)',
                    color: 'var(--accent-red)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all var(--transition-fast)'
                  }}
                  data-cursor="LOCK"
                >
                  <Lock size={13} />
                  <span>LOCK / LOGOUT</span>
                </button>
              </div>
            </div>

            {/* Metrics Overview Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.25rem',
                marginBottom: '2rem'
              }}
            >
              {/* Stat 1: Total Registered */}
              <div
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-strong)',
                  padding: '1.5rem',
                  boxShadow: '4px 4px 0px 0px var(--accent-toxic)'
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Live Registrations
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent-toxic)', margin: '4px 0' }}>
                  {registrations.length}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-dim)' }}>
                  Auto-updating in real-time
                </div>
              </div>

              {/* Stat 2: Seats Available */}
              <div
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-strong)',
                  padding: '1.5rem',
                  boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.5)'
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Live Capacity Remaining
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)', margin: '4px 0' }}>
                  {getRemainingSeats()} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ {TOTAL_CAPACITY}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-dim)' }}>
                  Seats remaining for students
                </div>
              </div>

              {/* Stat 3: Excel Engine */}
              <div
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-strong)',
                  padding: '1.5rem',
                  boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.5)'
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Excel Export Engine
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-toxic)', margin: '8px 0' }}>
                  LIVE .XLSX
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-dim)' }}>
                  Formatted multi-column workbook
                </div>
              </div>

              {/* Stat 4: Google Sheets Cloud */}
              <div
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-strong)',
                  padding: '1.5rem',
                  boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.5)'
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Google Sheets Cloud Sync
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-toxic)', margin: '10px 0' }}>
                  LIVE CONNECTED
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-dim)' }}>
                  Google Apps Script webhook online
                </div>
              </div>

              {/* Stat 5: Contact Inquiries */}
              <div
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-strong)',
                  padding: '1.5rem',
                  boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.5)'
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Contact Inquiries Sheet
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 900, color: '#3fb950', margin: '4px 0' }}>
                  {inquiries.length}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-dim)' }}>
                  {inquiries.filter((i) => i.status === 'NEW').length} New / Unresolved inquiries
                </div>
              </div>
            </div>

            {/* MASTER LIVE EXCEL SHEET CONSOLE (SINGLE PERMANENT SHEET) */}
            <div
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                border: '2px solid var(--accent-toxic)',
                boxShadow: '8px 8px 0px 0px rgba(0, 0, 0, 0.75)',
                padding: 'clamp(1.5rem, 3.5vw, 2.5rem)',
                marginBottom: '2.5rem',
                position: 'relative'
              }}
            >
              {/* Card Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '12px',
                  borderBottom: '1px solid var(--border-color)',
                  paddingBottom: '1.25rem',
                  marginBottom: '1.25rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileSpreadsheet size={24} style={{ color: 'var(--accent-toxic)' }} />
                    <h3 style={{ fontSize: '1.375rem', fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>
                      MASTER LIVE EXCEL SHEET
                    </h3>
                    <span
                      className="zine-tag zine-tag-toxic"
                      style={{
                        fontSize: '0.625rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <span
                        className="live-pulse"
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: 'currentColor',
                          display: 'inline-block'
                        }}
                      />
                      SINGLE MASTER SHEET
                    </span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-toxic)', marginTop: '4px', fontWeight: 700 }}>
                    // HAR BAR NAYA REGISTRATION DATA ISI EK SHEET ME AUTOMATICALLY STORE HOTA HAI
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={handleAddSample}
                    className="btn-noise-outline"
                    style={{ padding: '0.5rem 0.875rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                    title="Add test attendee to verify continuous storage in this same sheet"
                  >
                    <UserPlus size={14} />
                    <span>+ TEST LIVE ATTENDEE</span>
                  </button>
                </div>
              </div>

              {/* Explanatory Lead */}
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem', maxWidth: '780px' }}>
                Aapko alag-alag file download karne ki zaroorat nahi hai. Niche diye gaye <strong>Master Live Excel Sheet link</strong> ko open kijiye — website se aane wala har ek naya registration data real-time me isi ek continuous Excel sheet me save hota rehta hai.
              </p>

              {/* Sheet Link Display & Control Bar */}
              <div
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border-strong)',
                  padding: '1.25rem',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    DIRECT EXCEL / GOOGLE SHEET LINK:
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsEditingSheetUrl(!isEditingSheetUrl)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent-toxic)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    {isEditingSheetUrl ? 'CANCEL' : (cloudSheetUrl ? '✏️ Edit Sheet Link' : '+ Connect Custom Google Sheet Link')}
                  </button>
                </div>

                {isEditingSheetUrl ? (
                  <form onSubmit={handleSaveSheetUrl} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        GOOGLE SHEET VIEW / EDIT LINK:
                      </label>
                      <input
                        type="url"
                        placeholder="https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit"
                        value={customSheetInput}
                        onChange={(e) => setCustomSheetInput(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          backgroundColor: 'var(--bg-secondary)',
                          border: '1px solid var(--accent-toxic)',
                          color: 'var(--text-primary)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.8125rem',
                          outline: 'none'
                        }}
                        autoFocus
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        GOOGLE APPS SCRIPT WEBHOOK URL (FOR REAL-TIME FORM POSTING):
                      </label>
                      <input
                        type="url"
                        placeholder={GOOGLE_SCRIPT_URL}
                        value={customWebhookInput}
                        onChange={(e) => setCustomWebhookInput(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          backgroundColor: 'var(--bg-secondary)',
                          border: '1px solid var(--border-strong)',
                          color: 'var(--text-primary)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.75rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        type="submit"
                        className="btn-noise-primary"
                        style={{ padding: '0.75rem 1.25rem', fontSize: '0.75rem' }}
                      >
                        SAVE SETTINGS
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingSheetUrl(false)}
                        className="btn-noise-outline"
                        style={{ padding: '0.75rem 1rem', fontSize: '0.75rem' }}
                      >
                        CANCEL
                      </button>
                    </div>
                  </form>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px',
                      padding: '0.875rem 1rem',
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px dashed var(--border-color)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                      <Globe size={18} style={{ color: 'var(--accent-toxic)', flexShrink: 0 }} />
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.8125rem',
                          color: 'var(--text-primary)',
                          wordBreak: 'break-all'
                        }}
                      >
                        {typeof window !== 'undefined' ? `${window.location.origin}/admin/sheet` : '/admin/sheet'}
                      </span>
                      <span className="zine-tag zine-tag-toxic" style={{ fontSize: '0.5625rem' }}>
                        LIVE EXCEL URL
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const urlToCopy = typeof window !== 'undefined' ? `${window.location.origin}/admin/sheet` : '/admin/sheet';
                        navigator.clipboard.writeText(urlToCopy);
                        onShowToast('✓ Master Excel sheet link copied!', false);
                      }}
                      style={{
                        padding: '0.45rem 0.875rem',
                        backgroundColor: 'var(--bg-elevated)',
                        border: '1px solid var(--border-strong)',
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                      title="Copy link to clipboard"
                    >
                      <Copy size={12} />
                      <span>COPY LINK</span>
                    </button>
                  </div>
                )}

                {/* Main Prominent Action Buttons */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                  {/* The Main Prominent Link Button -> Opens Master Live Excel Sheet */}
                  <Link
                    to="/admin/sheet"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-noise-primary"
                    style={{
                      padding: '0.875rem 1.75rem',
                      fontSize: '0.875rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      textDecoration: 'none'
                    }}
                    data-cursor="SHEET"
                  >
                    <ExternalLink size={16} />
                    <span>OPEN MASTER LIVE EXCEL SHEET ↗</span>
                  </Link>

                  <Link
                    to="/admin/inquiries"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-noise-outline"
                    style={{
                      padding: '0.875rem 1.5rem',
                      fontSize: '0.875rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      textDecoration: 'none',
                      color: '#3fb950',
                      borderColor: '#2ea043'
                    }}
                  >
                    <MessageSquare size={16} />
                    <span>OPEN INQUIRIES EXCEL SHEET ↗</span>
                  </Link>

                  {cloudSheetUrl && (
                    <a
                      href={cloudSheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-noise-outline"
                      style={{
                        padding: '0.875rem 1.25rem',
                        fontSize: '0.8125rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        textDecoration: 'none'
                      }}
                    >
                      <Globe size={15} />
                      <span>OPEN GOOGLE DRIVE SHEET ↗</span>
                    </a>
                  )}

                  {cloudSheetUrl && (
                    <button
                      type="button"
                      onClick={() => setShowSheetEmbed(!showSheetEmbed)}
                      className="btn-noise-outline"
                      style={{
                        padding: '0.875rem 1.25rem',
                        fontSize: '0.8125rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <Tv size={15} />
                      <span>{showSheetEmbed ? 'HIDE EMBEDDED SHEET' : 'VIEW EMBEDDED SPREADSHEET'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      const ok = exportRegistrationsToExcel(registrations);
                      if (ok) onShowToast('Offline backup (.xlsx) file downloaded!', false);
                      else onShowToast('No records to backup.', true);
                    }}
                    style={{
                      padding: '0.875rem 1.25rem',
                      backgroundColor: 'transparent',
                      border: '1px dashed var(--border-strong)',
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    title="Download offline copy as backup"
                  >
                    <Download size={14} />
                    <span>OFFLINE BACKUP (.XLSX)</span>
                  </button>
                </div>
              </div>

              {/* Webhook Endpoint Status */}
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '8px',
                  borderTop: '1px dashed var(--border-color)',
                  paddingTop: '0.875rem'
                }}
              >
                <div>
                  <span style={{ color: 'var(--text-dim)' }}>CLOUD WEBHOOK TARGET: </span>
                  <span style={{ color: 'var(--text-primary)' }}>{GOOGLE_SCRIPT_URL}</span>
                </div>
                <span style={{ color: 'var(--accent-toxic)' }}>✓ STATUS: CONTINUOUS LIVE APPEND ACTIVE</span>
              </div>

              {/* Embedded Google Sheet Iframe Viewer If Toggled */}
              {showSheetEmbed && cloudSheetUrl && (
                <div style={{ marginTop: '1.5rem', border: '1px solid var(--border-strong)' }}>
                  <div
                    style={{
                      padding: '0.625rem 1rem',
                      backgroundColor: 'var(--bg-secondary)',
                      borderBottom: '1px solid var(--border-color)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span>EMBEDDED VIEW: MASTER LIVE EXCEL SHEET</span>
                    <a href={cloudSheetUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-toxic)' }}>
                      Open full tab ↗
                    </a>
                  </div>
                  <iframe
                    src={cloudSheetUrl}
                    title="Master Live Google Sheet"
                    style={{ width: '100%', height: '520px', border: 'none', backgroundColor: '#fff' }}
                  />
                </div>
              )}
            </div>

            {/* Attendee Registry Table Section (Rendered as Live Excel Workbook) */}
            <div
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-strong)',
                boxShadow: '8px 8px 0px 0px rgba(0, 0, 0, 0.75)',
                padding: 'clamp(1.5rem, 3.5vw, 2.5rem)'
              }}
            >
              {/* Excel Spreadsheet Header Bar */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  borderBottom: '1px solid var(--border-color)',
                  paddingBottom: '1.25rem',
                  marginBottom: '1.5rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileSpreadsheet size={22} style={{ color: 'var(--accent-toxic)' }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>
                      LIVE EXCEL SPREADSHEET (WORKBOOK VIEW)
                    </h3>
                    <span className="zine-tag zine-tag-toxic">
                      {filteredRegistrations.length} ROWS IN SHEET
                    </span>
                  </div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                    Jab bhi koi user register karta hai, uski complete details (Name, Email, College, Track, Timestamp) yahan Excel sheet me live show hoti hai.
                  </p>
                </div>

                {/* Filter, Search & Download Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <div style={{ position: 'relative' }}>
                    <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      placeholder="Search in sheet (name, email, ID...)"
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      style={{
                        padding: '0.5rem 0.75rem 0.5rem 2rem',
                        backgroundColor: 'var(--bg-elevated)',
                        border: '1px solid var(--border-strong)',
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        width: '240px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <select
                    value={selectedTrack}
                    onChange={(e) => setSelectedTrack(e.target.value)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border-strong)',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="ALL">All Tracks</option>
                    <option value="Cloud Architecture & Security">Cloud Architecture</option>
                    <option value="Generative AI & Bedrock on AWS">GenAI on AWS</option>
                    <option value="Serverless & Modern App Dev">Serverless</option>
                    <option value="DevOps & Infrastructure as Code">DevOps</option>
                    <option value="Career & Certification Pathways">Career & Certs</option>
                  </select>

                  {/* Direct Excel File Download Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const ok = exportRegistrationsToExcel(filteredRegistrations);
                      if (ok) onShowToast(`✓ Live Excel file with ${filteredRegistrations.length} attendee details downloaded!`, false);
                      else onShowToast('No attendee records to download.', true);
                    }}
                    className="btn-noise-primary"
                    style={{
                      padding: '0.5rem 1rem',
                      fontSize: '0.75rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    title="Download complete Excel (.xlsx) file with all user details"
                  >
                    <Download size={13} />
                    <span>DOWNLOAD EXCEL (.XLSX)</span>
                  </button>

                  {registrations.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAll}
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
                      title="Clear all stored registrations"
                    >
                      <Trash2 size={13} />
                      <span>CLEAR</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Table or Empty State */}
              {filteredRegistrations.length === 0 ? (
                <div
                  style={{
                    padding: '3.5rem 1.5rem',
                    textAlign: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.875rem',
                    color: 'var(--text-muted)',
                    border: '1px dashed var(--border-color)'
                  }}
                >
                  {searchFilter ? (
                    <div>No attendee details match your search in the Excel sheet.</div>
                  ) : (
                    <div>
                      <p style={{ marginBottom: '1rem' }}>Excel sheet is currently empty. As soon as a student registers, their details will appear here automatically.</p>
                      <button
                        type="button"
                        onClick={handleAddSample}
                        className="btn-noise-outline"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}
                      >
                        + Add Demo Student to Live Sheet
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="mobile-scroll-hint">
                    <span>↔ SWIPE HORIZONTALLY TO VIEW ALL ATTENDEE COLUMNS</span>
                    <span>EXCEL TABLE</span>
                  </div>
                  <div className="table-responsive-wrapper" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                    <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      textAlign: 'left',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8125rem'
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          borderBottom: '2px solid var(--border-strong)',
                          backgroundColor: 'var(--bg-tertiary)',
                          color: 'var(--text-muted)',
                          fontSize: '0.6875rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}
                      >
                        <th style={{ padding: '0.75rem 1rem' }}>Row</th>
                        <th style={{ padding: '0.75rem 1rem' }}>[A] Registration ID</th>
                        <th style={{ padding: '0.75rem 1rem' }}>[B] Full Name</th>
                        <th style={{ padding: '0.75rem 1rem' }}>[C] Email Address</th>
                        <th style={{ padding: '0.75rem 1rem' }}>[D] College / University</th>
                        <th style={{ padding: '0.75rem 1rem' }}>[E] Area of Interest</th>
                        <th style={{ padding: '0.75rem 1rem' }}>[F] Registered At</th>
                        <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>[G] Pass (.xlsx)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRegistrations.map((rec, index) => {
                        const isNew = rec.id === newlyAddedId;
                        return (
                          <tr
                            key={rec.id}
                            style={{
                              borderBottom: '1px solid var(--border-color)',
                              backgroundColor: isNew
                                ? 'rgba(57, 255, 20, 0.12)'
                                : index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                              transition: 'background-color 0.5s ease'
                            }}
                          >
                            <td style={{ padding: '0.875rem 1rem', color: 'var(--text-muted)' }}>
                              {isNew ? (
                                <span className="zine-tag zine-tag-toxic" style={{ fontSize: '0.5625rem', padding: '1px 5px' }}>
                                  NEW
                                </span>
                              ) : (
                                index + 1
                              )}
                            </td>
                            <td style={{ padding: '0.875rem 1rem', color: 'var(--accent-toxic)', fontWeight: 'bold' }}>{rec.id}</td>
                            <td style={{ padding: '0.875rem 1rem', color: 'var(--text-primary)', fontWeight: 600 }}>{rec.name}</td>
                            <td style={{ padding: '0.875rem 1rem', color: 'var(--text-muted)' }}>{rec.email}</td>
                            <td style={{ padding: '0.875rem 1rem', color: 'var(--text-muted)' }}>{rec.college}</td>
                            <td style={{ padding: '0.875rem 1rem' }}>
                              <span className="zine-tag zine-tag-ghost" style={{ fontSize: '0.625rem' }}>
                                {rec.interest}
                              </span>
                            </td>
                            <td style={{ padding: '0.875rem 1rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                              {new Date(rec.registeredAt).toLocaleString('en-IN', {
                                dateStyle: 'short',
                                timeStyle: 'short'
                              })}
                            </td>
                            <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    exportSingleRegistrationToExcel(rec);
                                    onShowToast(`Individual pass for ${rec.name} downloaded!`, false);
                                  }}
                                  style={{
                                    padding: '4px 8px',
                                    backgroundColor: 'var(--bg-elevated)',
                                    border: '1px solid var(--border-strong)',
                                    color: 'var(--text-primary)',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.6875rem',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}
                                  title="Download Attendee Pass Excel (.xlsx)"
                                >
                                  <FileSpreadsheet size={12} style={{ color: 'var(--accent-toxic)' }} />
                                  <span>.XLSX</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDelete(rec.id, rec.name)}
                                  style={{
                                    padding: '4px 6px',
                                    backgroundColor: 'transparent',
                                    border: '1px solid var(--border-color)',
                                    color: 'var(--accent-red)',
                                    cursor: 'pointer'
                                  }}
                                  title="Delete record"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
            </div>

            {/* LIVE CONTACT INQUIRIES EXCEL WORKBOOK (SHEET 2 VIEW) */}
            <div
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-strong)',
                boxShadow: '8px 8px 0px 0px rgba(0, 0, 0, 0.75)',
                padding: 'clamp(1.5rem, 3.5vw, 2.5rem)',
                marginTop: '2.5rem'
              }}
            >
              {/* Header Bar */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  borderBottom: '1px solid var(--border-color)',
                  paddingBottom: '1.25rem',
                  marginBottom: '1.5rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <MessageSquare size={22} style={{ color: '#3fb950' }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>
                      LIVE CONTACT INQUIRIES (EXCEL SHEET VIEW)
                    </h3>
                    <span
                      className="zine-tag zine-tag-toxic"
                      style={{
                        backgroundColor: 'rgba(63, 185, 80, 0.15)',
                        borderColor: '#3fb950',
                        color: '#3fb950'
                      }}
                    >
                      {filteredInquiries.length} INQUIRIES IN SHEET
                    </span>
                  </div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                    Jab bhi koi user Contact page (/contact) par "SEND INQUIRY TO ORGANIZERS" click karta hai, uska data turant yahan real-time Excel sheet me store hota hai.
                  </p>
                </div>

                {/* Direct Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <Link
                    to="/admin/inquiries"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-noise-primary"
                    style={{
                      padding: '0.5rem 1rem',
                      fontSize: '0.75rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      textDecoration: 'none'
                    }}
                  >
                    <ExternalLink size={13} />
                    <span>OPEN FULL INQUIRIES EXCEL SHEET ↗</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      const ok = exportInquiriesToExcel(filteredInquiries);
                      if (ok) onShowToast(`✓ Downloaded ${filteredInquiries.length} contact inquiries to .xlsx!`, false);
                      else onShowToast('No inquiry records to download.', true);
                    }}
                    className="btn-noise-outline"
                    style={{ padding: '0.5rem 0.875rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    title="Download Excel file with all contact inquiries"
                  >
                    <Download size={13} />
                    <span>EXPORT INQUIRIES (.XLSX)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAddSampleInquiry}
                    className="btn-noise-outline"
                    style={{
                      padding: '0.5rem 0.875rem',
                      fontSize: '0.75rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#3fb950',
                      borderColor: '#2ea043'
                    }}
                    title="Add a sample inquiry to verify real-time append"
                  >
                    <UserPlus size={13} />
                    <span>+ TEST LIVE INQUIRY</span>
                  </button>
                </div>
              </div>

              {/* Inquiries Search & Filter Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  marginBottom: '1.25rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <div style={{ position: 'relative' }}>
                    <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      placeholder="Search inquiries (name, email, text...)"
                      value={inquirySearchFilter}
                      onChange={(e) => setInquirySearchFilter(e.target.value)}
                      style={{
                        padding: '0.5rem 0.75rem 0.5rem 2rem',
                        backgroundColor: 'var(--bg-elevated)',
                        border: '1px solid var(--border-strong)',
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        width: '260px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <select
                    value={inquiryTopicFilter}
                    onChange={(e) => setInquiryTopicFilter(e.target.value)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border-strong)',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="ALL">All Inquiry Topics</option>
                    <option value="General Event Inquiry">General Event</option>
                    <option value="Workshop & Cloud Credentials">Workshops & Cloud</option>
                    <option value="Transport & Campus Transit">Transport & Transit</option>
                    <option value="Sponsorship & Partnerships">Sponsorship</option>
                    <option value="Speaker & Agenda Questions">Speaker & Agenda</option>
                  </select>

                  <select
                    value={inquiryStatusFilter}
                    onChange={(e) => setInquiryStatusFilter(e.target.value)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border-strong)',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="NEW">New</option>
                    <option value="IN_REVIEW">In Review</option>
                    <option value="RESOLVED">Resolved</option>
                  </select>
                </div>

                {/* Direct Link Share Pill */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)'
                  }}
                >
                  <span>DIRECT INQUIRIES LINK:</span>
                  <button
                    type="button"
                    onClick={() => {
                      const url = typeof window !== 'undefined' ? `${window.location.origin}/admin/inquiries` : '/admin/inquiries';
                      navigator.clipboard.writeText(url);
                      onShowToast('✓ Link copied: /admin/inquiries', false);
                    }}
                    style={{
                      padding: '0.3rem 0.6rem',
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border-strong)',
                      color: '#3fb950',
                      cursor: 'pointer',
                      fontSize: '0.6875rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Copy size={11} />
                    <span>COPY LINK</span>
                  </button>
                </div>
              </div>

              {/* Inquiries Table or Empty State */}
              {filteredInquiries.length === 0 ? (
                <div
                  style={{
                    padding: '3rem 1.5rem',
                    textAlign: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.875rem',
                    color: 'var(--text-muted)',
                    border: '1px dashed var(--border-color)'
                  }}
                >
                  <MessageSquare size={36} style={{ color: 'var(--text-muted)', margin: '0 auto 0.75rem', display: 'block' }} />
                  <p style={{ marginBottom: '1rem' }}>
                    {inquirySearchFilter ? 'No inquiries match your search filter.' : 'Inquiries sheet is currently empty. As soon as a user submits an inquiry on /contact, it will appear here.'}
                  </p>
                  <button
                    type="button"
                    onClick={handleAddSampleInquiry}
                    className="btn-noise-outline"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', color: '#3fb950', borderColor: '#2ea043' }}
                  >
                    + Add Demo Inquiry to Live Sheet
                  </button>
                </div>
              ) : (
                <>
                  <div className="mobile-scroll-hint">
                    <span>↔ SWIPE HORIZONTALLY TO VIEW ALL INQUIRY COLUMNS</span>
                    <span>INQUIRIES SHEET</span>
                  </div>
                  <div className="table-responsive-wrapper" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                    <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      textAlign: 'left',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8125rem'
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          borderBottom: '2px solid var(--border-strong)',
                          backgroundColor: 'var(--bg-tertiary)',
                          color: 'var(--text-muted)',
                          fontSize: '0.6875rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}
                      >
                        <th style={{ padding: '0.75rem 1rem' }}>Row</th>
                        <th style={{ padding: '0.75rem 1rem' }}>[A] Inquiry ID</th>
                        <th style={{ padding: '0.75rem 1rem' }}>[B] Sender Name</th>
                        <th style={{ padding: '0.75rem 1rem' }}>[C] Email Address</th>
                        <th style={{ padding: '0.75rem 1rem' }}>[D] Topic</th>
                        <th style={{ padding: '0.75rem 1rem' }}>[E] Message</th>
                        <th style={{ padding: '0.75rem 1rem' }}>[F] Submitted At</th>
                        <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>[G] Status</th>
                        <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>[H] Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInquiries.map((inq, index) => {
                        const isNew = inq.id === newlyAddedInquiryId;
                        return (
                          <tr
                            key={inq.id}
                            style={{
                              borderBottom: '1px solid var(--border-color)',
                              backgroundColor: isNew
                                ? 'rgba(63, 185, 80, 0.15)'
                                : index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                              transition: 'background-color 0.5s ease'
                            }}
                          >
                            <td style={{ padding: '0.875rem 1rem', color: 'var(--text-muted)' }}>
                              {isNew ? (
                                <span className="zine-tag zine-tag-toxic" style={{ fontSize: '0.5625rem', padding: '1px 5px' }}>
                                  NEW
                                </span>
                              ) : (
                                index + 1
                              )}
                            </td>
                            <td style={{ padding: '0.875rem 1rem', color: '#3fb950', fontWeight: 'bold' }}>{inq.id}</td>
                            <td style={{ padding: '0.875rem 1rem', color: 'var(--text-primary)', fontWeight: 600 }}>{inq.name}</td>
                            <td style={{ padding: '0.875rem 1rem', color: 'var(--text-muted)' }}>
                              <a
                                href={`mailto:${inq.email}?subject=Re: AWS Community Day Inquiry - ${inq.topic}`}
                                style={{ color: 'var(--accent-toxic)', textDecoration: 'none' }}
                                title="Reply via email"
                              >
                                {inq.email}
                              </a>
                            </td>
                            <td style={{ padding: '0.875rem 1rem' }}>
                              <span className="zine-tag zine-tag-ghost" style={{ fontSize: '0.625rem' }}>
                                {inq.topic}
                              </span>
                            </td>
                            <td style={{ padding: '0.875rem 1rem', color: 'var(--text-secondary)', maxWidth: '300px' }}>
                              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={inq.message}>
                                {inq.message}
                              </div>
                            </td>
                            <td style={{ padding: '0.875rem 1rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                              {new Date(inq.submittedAt).toLocaleString('en-IN', {
                                dateStyle: 'short',
                                timeStyle: 'short'
                              })}
                            </td>
                            <td style={{ padding: '0.875rem 1rem', textAlign: 'center' }}>
                              <button
                                type="button"
                                onClick={() => handleToggleInquiryStatus(inq.id, inq.status)}
                                style={{
                                  border: 'none',
                                  borderRadius: '12px',
                                  padding: '3px 8px',
                                  fontSize: '0.6875rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  backgroundColor:
                                    inq.status === 'NEW'
                                      ? 'rgba(210, 153, 34, 0.2)'
                                      : inq.status === 'IN_REVIEW'
                                      ? 'rgba(88, 166, 255, 0.2)'
                                      : 'rgba(46, 160, 67, 0.2)',
                                  color:
                                    inq.status === 'NEW'
                                      ? '#d29922'
                                      : inq.status === 'IN_REVIEW'
                                      ? '#58a6ff'
                                      : '#3fb950',
                                  borderStyle: 'solid',
                                  borderWidth: '1px',
                                  borderColor:
                                    inq.status === 'NEW'
                                      ? 'rgba(210, 153, 34, 0.4)'
                                      : inq.status === 'IN_REVIEW'
                                      ? 'rgba(88, 166, 255, 0.4)'
                                      : 'rgba(46, 160, 67, 0.4)'
                                }}
                                title="Click to cycle status"
                              >
                                {inq.status}
                              </button>
                            </td>
                            <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <button
                                  type="button"
                                  onClick={() => handleToggleInquiryStatus(inq.id, inq.status)}
                                  style={{
                                    padding: '4px 8px',
                                    backgroundColor: 'var(--bg-elevated)',
                                    border: '1px solid var(--border-strong)',
                                    color: 'var(--text-primary)',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.6875rem',
                                    cursor: 'pointer'
                                  }}
                                  title="Cycle resolution status"
                                >
                                  {inq.status === 'NEW' ? 'Review' : inq.status === 'IN_REVIEW' ? 'Resolve' : 'Reopen'}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteInquiry(inq.id, inq.name)}
                                  style={{
                                    padding: '4px 6px',
                                    backgroundColor: 'transparent',
                                    border: '1px solid var(--border-color)',
                                    color: 'var(--accent-red)',
                                    cursor: 'pointer'
                                  }}
                                  title="Delete inquiry"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
