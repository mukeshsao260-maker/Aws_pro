import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  getStoredRegistrations,
  exportRegistrationsToExcel,
  exportRegistrationsToCSV,
  exportSingleRegistrationToExcel,
  saveRegistrationRecord,
  deleteStoredRegistration,
  getLiveSheetUrl,
  setLiveSheetUrl,
  StoredRegistrationRecord,
  TOTAL_CAPACITY
} from '../lib/registration';
import {
  getStoredInquiries,
  saveInquiryRecord,
  updateInquiryStatus,
  deleteStoredInquiry,
  exportInquiriesToExcel,
  exportInquiriesToCSV,
  StoredInquiryRecord
} from '../lib/inquiries';
import {
  isAdmin,
  loginUser,
  logoutUser,
  ADMIN_EMAIL,
  ADMIN_PASS
} from '../lib/auth';
import {
  FileSpreadsheet,
  Download,
  RefreshCw,
  Search,
  ArrowLeft,
  UserPlus,
  Trash2,
  Copy,
  Globe,
  Lock,
  Unlock,
  ShieldAlert,
  ShieldCheck,
  Eye,
  EyeOff,
  LogOut,
  MessageSquare
} from 'lucide-react';

interface MasterSheetProps {
  onShowToast: (message: string, isError?: boolean) => void;
  initialSheet?: 'registrations' | 'inquiries';
}

export const MasterSheet: React.FC<MasterSheetProps> = ({ onShowToast, initialSheet = 'registrations' }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => isAdmin());
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Active Sheet tab: 'registrations' (Sheet1) or 'inquiries' (Sheet2)
  const [activeSheet, setActiveSheet] = useState<'registrations' | 'inquiries'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'inquiries') return 'inquiries';
      if (tabParam === 'registrations') return 'registrations';
      if (window.location.pathname.includes('/inquiries')) return 'inquiries';
    }
    return initialSheet;
  });

  // Registrations state
  const [registrations, setRegistrations] = useState<StoredRegistrationRecord[]>(() => getStoredRegistrations());
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('ALL');
  const [activeCell, setActiveCell] = useState<string>('A1');
  const [newlyAddedId, setNewlyAddedId] = useState<string | null>(null);
  const [lastSyncText, setLastSyncText] = useState<string>('Just now');
  const [cloudSheetUrl, setCloudSheetUrl] = useState<string>(() => getLiveSheetUrl());
  const [isEditingCloudUrl, setIsEditingCloudUrl] = useState<boolean>(false);
  const [cloudUrlInput, setCloudUrlInput] = useState<string>(() => getLiveSheetUrl());

  // Inquiries state
  const [inquiries, setInquiries] = useState<StoredInquiryRecord[]>(() => getStoredInquiries());
  const [inquirySearchFilter, setInquirySearchFilter] = useState('');
  const [inquiryTopicFilter, setInquiryTopicFilter] = useState('ALL');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('ALL');
  const [newlyAddedInquiryId, setNewlyAddedInquiryId] = useState<string | null>(null);

  const prevRegCountRef = useRef<number>(registrations.length);
  const prevInqCountRef = useRef<number>(inquiries.length);

  useEffect(() => {
    const handleAuthChange = () => {
      setIsAuthenticated(isAdmin());
    };
    window.addEventListener('auth_state_changed', handleAuthChange);
    return () => window.removeEventListener('auth_state_changed', handleAuthChange);
  }, []);

  const refreshRegData = () => {
    const latest = getStoredRegistrations();
    if (latest.length > prevRegCountRef.current && prevRegCountRef.current > 0) {
      const newest = latest[0];
      setNewlyAddedId(newest.id);
      onShowToast(`⚡ Live update: New attendee registered (${newest.name})!`, false);
      setTimeout(() => setNewlyAddedId(null), 5000);
    }
    prevRegCountRef.current = latest.length;
    setRegistrations(latest);
    setLastSyncText(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  };

  const refreshInqData = () => {
    const latest = getStoredInquiries();
    if (latest.length > prevInqCountRef.current && prevInqCountRef.current > 0) {
      const newest = latest[0];
      setNewlyAddedInquiryId(newest.id);
      onShowToast(`⚡ Live update: New contact inquiry received from ${newest.name}!`, false);
      setTimeout(() => setNewlyAddedInquiryId(null), 5000);
    }
    prevInqCountRef.current = latest.length;
    setInquiries(latest);
    setLastSyncText(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  };

  const refreshAllData = () => {
    refreshRegData();
    refreshInqData();
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    refreshAllData();

    const handleStorage = () => refreshAllData();
    const handleRegEvent = () => refreshRegData();
    const handleInqEvent = () => refreshInqData();

    window.addEventListener('storage', handleStorage);
    window.addEventListener('new_registration_stored', handleRegEvent);
    window.addEventListener('new_inquiry_stored', handleInqEvent);

    // 2-second real-time polling to ensure instant updates across both sheets
    const timer = setInterval(() => {
      refreshAllData();
    }, 2000);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('new_registration_stored', handleRegEvent);
      window.removeEventListener('new_inquiry_stored', handleInqEvent);
      clearInterval(timer);
    };
  }, [isAuthenticated]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!adminEmail.trim()) {
      setAuthError('Email address is required.');
      return;
    }
    if (!adminPassword.trim()) {
      setAuthError('Password is required.');
      return;
    }

    const res = loginUser(adminEmail, adminPassword, true);
    if (res.success && res.user?.role === 'admin') {
      setIsAuthenticated(true);
      onShowToast('✓ Administrator access authorized! Welcome to Master Live Excel Sheet.', false);
    } else {
      const errMsg = res.message || 'Access denied: Invalid administrator credentials.';
      setAuthError(errMsg);
      onShowToast(errMsg, true);
    }
  };

  const handleQuickFill = () => {
    setAdminEmail(ADMIN_EMAIL);
    setAdminPassword(ADMIN_PASS);
    setAuthError('');
  };

  const handleAddSample = () => {
    const sample = saveRegistrationRecord({
      name: `Demo Attendee ${Math.floor(Math.random() * 900) + 100}`,
      email: `attendee.${Date.now().toString().slice(-4)}@rungta.ac.in`,
      college: 'Rungta College of Engineering & Tech',
      interest: 'Cloud Architecture & Security',
      consent: true
    });
    refreshRegData();
    onShowToast(`✓ Added test attendee "${sample.name}" to Master Excel Sheet!`, false);
  };

  const handleAddSampleInquiry = () => {
    const topics = [
      'General Event Inquiry',
      'Workshop & Cloud Credentials',
      'Transport & Campus Transit',
      'Sponsorship & Partnerships',
      'Speaker & Agenda Questions'
    ];
    const chosenTopic = topics[Math.floor(Math.random() * topics.length)];
    const sample = saveInquiryRecord({
      name: `Demo Inquirer ${Math.floor(Math.random() * 900) + 100}`,
      email: `student.${Date.now().toString().slice(-4)}@rungta.ac.in`,
      topic: chosenTopic,
      message: `Need confirmation regarding laptop requirements and AWS Cloud Club participant certificates.`
    });
    refreshInqData();
    onShowToast(`✓ Added test inquiry from "${sample.name}" to Inquiries Excel Sheet!`, false);
  };

  const handleToggleInquiryStatus = (id: string, currentStatus: 'NEW' | 'IN_REVIEW' | 'RESOLVED') => {
    const nextStatus: 'NEW' | 'IN_REVIEW' | 'RESOLVED' =
      currentStatus === 'NEW' ? 'IN_REVIEW' : currentStatus === 'IN_REVIEW' ? 'RESOLVED' : 'NEW';
    updateInquiryStatus(id, nextStatus);
    refreshInqData();
    onShowToast(`Inquiry ${id} status updated to ${nextStatus}.`, false);
  };

  const handleDeleteInquiry = (id: string, name: string) => {
    if (window.confirm(`Delete contact inquiry from "${name}" (${id})?`)) {
      deleteStoredInquiry(id);
      refreshInqData();
      onShowToast(`Deleted inquiry ${id}.`, false);
    }
  };

  const handleSaveCloudUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setLiveSheetUrl(cloudUrlInput);
    setCloudSheetUrl(cloudUrlInput.trim());
    setIsEditingCloudUrl(false);
    onShowToast('✓ Google Sheet link saved!', false);
  };

  const filteredRegistrations = registrations.filter((rec) => {
    const matchQuery =
      !searchFilter.trim() ||
      rec.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      rec.email.toLowerCase().includes(searchFilter.toLowerCase()) ||
      rec.college.toLowerCase().includes(searchFilter.toLowerCase()) ||
      rec.id.toLowerCase().includes(searchFilter.toLowerCase());

    const matchTrack = selectedTrack === 'ALL' || rec.interest === selectedTrack;
    return matchQuery && matchTrack;
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

  const newInquiriesCount = inquiries.filter((i) => i.status === 'NEW').length;
  const inReviewInquiriesCount = inquiries.filter((i) => i.status === 'IN_REVIEW').length;
  const resolvedInquiriesCount = inquiries.filter((i) => i.status === 'RESOLVED').length;

  if (!isAuthenticated) {
    return (
      <div
        style={{
          backgroundColor: '#0d1117',
          color: '#e6edf3',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, Roboto, sans-serif'
        }}
      >
        {/* Top Excel Green Header */}
        <div
          style={{
            backgroundColor: '#107c41',
            color: '#ffffff',
            padding: '0.75rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #0b5a2f'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '30px',
                height: '30px',
                backgroundColor: '#ffffff',
                color: '#107c41',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1rem'
              }}
            >
              X
            </div>
            <div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 700 }}>
                {activeSheet === 'inquiries' ? 'AWS_Community_Day_Contact_Inquiries.xlsx' : 'AWS_Community_Day_Master_Registrations.xlsx'}
              </div>
              <div style={{ fontSize: '0.6875rem', opacity: 0.85 }}>
                MICROSOFT EXCEL ONLINE // SECURED WORKBOOK
              </div>
            </div>
          </div>
          <Link
            to="/"
            style={{
              color: '#ffffff',
              fontSize: '0.75rem',
              textDecoration: 'none',
              backgroundColor: 'rgba(0,0,0,0.25)',
              padding: '0.35rem 0.75rem',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ArrowLeft size={13} />
            <span>Return to Site</span>
          </Link>
        </div>

        {/* Lock Screen Body */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1rem'
          }}
        >
          <div
            style={{
              maxWidth: '520px',
              width: '100%',
              backgroundColor: '#161b22',
              border: '1px solid #30363d',
              borderRadius: '8px',
              boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                backgroundColor: '#21262d',
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid #30363d',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid #ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ef4444'
                }}
              >
                <Lock size={20} />
              </div>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f0f6fc' }}>
                  ADMIN ACCESS REQUIRED
                </div>
                <div style={{ fontSize: '0.75rem', color: '#8b949e' }}>
                  Restricted to AWS Cloud Club Administrators
                </div>
              </div>
            </div>

            <div style={{ padding: '1.5rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#8b949e', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                This Master Live Excel Sheet contains confidential registrant & contact inquiry records and is strictly locked to verified AWS Cloud Club administrators.
              </p>

              {authError && (
                <div
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid #ef4444',
                    color: '#f87171',
                    padding: '0.75rem 1rem',
                    borderRadius: '6px',
                    fontSize: '0.8125rem',
                    marginBottom: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <ShieldAlert size={16} />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleAdminLogin}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#c9d1d9', marginBottom: '6px' }}>
                    ADMINISTRATOR EMAIL
                  </label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="Enter admin email"
                    style={{
                      width: '100%',
                      padding: '0.625rem 0.875rem',
                      backgroundColor: '#0d1117',
                      border: '1px solid #30363d',
                      borderRadius: '6px',
                      color: '#f0f6fc',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#c9d1d9', marginBottom: '6px' }}>
                    ADMINISTRATOR PASSWORD
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Enter admin password"
                      style={{
                        width: '100%',
                        padding: '0.625rem 2.5rem 0.625rem 0.875rem',
                        backgroundColor: '#0d1117',
                        border: '1px solid #30363d',
                        borderRadius: '6px',
                        color: '#f0f6fc',
                        fontSize: '0.875rem',
                        outline: 'none'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#8b949e',
                        cursor: 'pointer'
                      }}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      backgroundColor: '#107c41',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.75rem 1rem',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <Unlock size={16} />
                    <span>UNLOCK LIVE EXCEL WORKBOOK</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleQuickFill}
                    style={{
                      backgroundColor: '#21262d',
                      color: '#58a6ff',
                      border: '1px solid #30363d',
                      borderRadius: '6px',
                      padding: '0.75rem 1rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                    title="Quick Fill Demo Credentials"
                  >
                    AUTO-FILL (RungtaAws@21#)
                  </button>
                </div>

                <div
                  style={{
                    borderTop: '1px dashed #30363d',
                    paddingTop: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    color: '#8b949e'
                  }}
                >
                  <span>ADMIN CREDENTIALS REQUIRED</span>
                  <Link to="/login" style={{ color: '#58a6ff', textDecoration: 'none' }}>
                    Standard Login Portal →
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: '#0d1117',
        color: '#e6edf3',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, Roboto, sans-serif'
      }}
    >
      {/* 1. EXCEL TOP TITLE & STATUS BAR */}
      <div
        style={{
          backgroundColor: '#107c41', // Microsoft Excel classic forest green
          color: '#ffffff',
          padding: '0.625rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
          borderBottom: '1px solid #0b5a2f'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#ffffff',
              color: '#107c41',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '1.1rem'
            }}
          >
            X
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
                {activeSheet === 'inquiries'
                  ? 'AWS_Community_Day_Contact_Inquiries.xlsx'
                  : 'AWS_Community_Day_Master_Registrations.xlsx'}
              </span>
              <span
                style={{
                  fontSize: '0.6875rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontFamily: 'monospace'
                }}
              >
                {activeSheet === 'inquiries' ? '● INQUIRIES SYNC ACTIVE' : '● LIVE SYNC ACTIVE'}
              </span>
            </div>
            <div style={{ fontSize: '0.6875rem', opacity: 0.85, marginTop: '2px' }}>
              {activeSheet === 'inquiries'
                ? 'CONTACT INQUIRIES SHEET // HAR BAR CONTACT PAGE SE INQUIRY AANE PAR REAL-TIME DATA ISI SHEET ME STORE HOTA HAI'
                : 'SINGLE MASTER SHEET // HAR BAR NAYA USER REGISTRATION DATA ISI ME REAL-TIME STORE HOTA HAI'}
            </div>
          </div>
        </div>

        {/* Quick Top Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Sheet Selector Shortcut */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.3)',
              borderRadius: '4px',
              padding: '2px',
              border: '1px solid rgba(255,255,255,0.15)'
            }}
          >
            <button
              type="button"
              onClick={() => {
                setActiveSheet('registrations');
                setActiveCell('A1');
              }}
              style={{
                backgroundColor: activeSheet === 'registrations' ? '#ffffff' : 'transparent',
                color: activeSheet === 'registrations' ? '#107c41' : '#ffffff',
                border: 'none',
                borderRadius: '3px',
                padding: '0.3rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <span>Sheet1 (Registrations)</span>
              <span
                style={{
                  fontSize: '0.6875rem',
                  padding: '1px 5px',
                  borderRadius: '10px',
                  backgroundColor: activeSheet === 'registrations' ? '#107c41' : 'rgba(255,255,255,0.25)',
                  color: '#ffffff'
                }}
              >
                {registrations.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveSheet('inquiries');
                setActiveCell('A1');
              }}
              style={{
                backgroundColor: activeSheet === 'inquiries' ? '#ffffff' : 'transparent',
                color: activeSheet === 'inquiries' ? '#107c41' : '#ffffff',
                border: 'none',
                borderRadius: '3px',
                padding: '0.3rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <MessageSquare size={12} />
              <span>Sheet2 (Contact Inquiries)</span>
              <span
                style={{
                  fontSize: '0.6875rem',
                  padding: '1px 5px',
                  borderRadius: '10px',
                  backgroundColor: activeSheet === 'inquiries' ? '#107c41' : 'rgba(255,255,255,0.25)',
                  color: '#ffffff'
                }}
              >
                {inquiries.length}
              </span>
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(0,0,0,0.25)',
              padding: '0.4rem 0.8rem',
              borderRadius: '4px',
              fontSize: '0.75rem'
            }}
          >
            <ShieldCheck size={13} style={{ color: '#4ade80' }} />
            <span style={{ fontFamily: 'monospace' }}>ADMIN: {ADMIN_EMAIL}</span>
          </div>

          <Link
            to="/admin"
            style={{
              color: '#ffffff',
              fontSize: '0.75rem',
              textDecoration: 'none',
              backgroundColor: 'rgba(0, 0, 0, 0.25)',
              padding: '0.4rem 0.8rem',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ArrowLeft size={13} />
            <span>Admin Portal</span>
          </Link>

          <button
            type="button"
            onClick={refreshAllData}
            style={{
              backgroundColor: '#ffffff',
              color: '#107c41',
              border: 'none',
              borderRadius: '4px',
              padding: '0.4rem 0.8rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title="Refresh latest records"
          >
            <RefreshCw size={12} />
            <span>Sync Now ({lastSyncText})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              logoutUser();
              setIsAuthenticated(false);
              onShowToast('Admin logged out from Master Excel Sheet.', false);
            }}
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.35)',
              color: '#ffffff',
              border: '1px solid rgba(239, 68, 68, 0.6)',
              borderRadius: '4px',
              padding: '0.4rem 0.8rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
            title="Logout Administrator Session"
          >
            <LogOut size={12} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* 2. EXCEL RIBBON & ACTIONS TOOLBAR */}
      <div
        style={{
          backgroundColor: '#161b22',
          borderBottom: '1px solid #30363d',
          padding: '0.625rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        {activeSheet === 'registrations' ? (
          /* Toolbar for Registrations */
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => {
                  const ok = exportRegistrationsToExcel(filteredRegistrations);
                  if (ok) onShowToast(`✓ Live Excel workbook downloaded (${filteredRegistrations.length} rows)!`, false);
                  else onShowToast('No attendee records to download.', true);
                }}
                style={{
                  backgroundColor: '#238636',
                  color: '#ffffff',
                  border: '1px solid rgba(240, 246, 252, 0.1)',
                  borderRadius: '6px',
                  padding: '0.5rem 0.9rem',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Download size={14} />
                <span>Download .XLSX</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const ok = exportRegistrationsToCSV(filteredRegistrations);
                  if (ok) onShowToast(`✓ CSV file downloaded (${filteredRegistrations.length} rows)!`, false);
                  else onShowToast('No records to download.', true);
                }}
                style={{
                  backgroundColor: '#21262d',
                  color: '#c9d1d9',
                  border: '1px solid #30363d',
                  borderRadius: '6px',
                  padding: '0.5rem 0.9rem',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Download size={14} />
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                onClick={handleAddSample}
                style={{
                  backgroundColor: '#21262d',
                  color: '#58a6ff',
                  border: '1px solid #30363d',
                  borderRadius: '6px',
                  padding: '0.5rem 0.9rem',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                title="Add a test attendee row to see real-time appending in action"
              >
                <UserPlus size={14} />
                <span>+ Test Attendee</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const url = `${window.location.origin}/admin/sheet`;
                  navigator.clipboard.writeText(url);
                  onShowToast('✓ Master Excel sheet link copied to clipboard!', false);
                }}
                style={{
                  backgroundColor: '#21262d',
                  color: '#8b949e',
                  border: '1px solid #30363d',
                  borderRadius: '6px',
                  padding: '0.5rem 0.8rem',
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                title="Copy link to this Master Excel Sheet"
              >
                <Copy size={13} />
                <span>Copy Link</span>
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#8b949e' }} />
                <input
                  type="text"
                  placeholder="Search registrants..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  style={{
                    padding: '0.45rem 0.75rem 0.45rem 2rem',
                    backgroundColor: '#0d1117',
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    color: '#c9d1d9',
                    fontSize: '0.8125rem',
                    width: '210px',
                    outline: 'none'
                  }}
                />
              </div>

              <select
                value={selectedTrack}
                onChange={(e) => setSelectedTrack(e.target.value)}
                style={{
                  padding: '0.45rem 0.75rem',
                  backgroundColor: '#0d1117',
                  border: '1px solid #30363d',
                  borderRadius: '6px',
                  color: '#c9d1d9',
                  fontSize: '0.8125rem',
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

              {cloudSheetUrl ? (
                <a
                  href={cloudSheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: '#1f6feb',
                    color: '#ffffff',
                    textDecoration: 'none',
                    borderRadius: '6px',
                    padding: '0.45rem 0.8rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <Globe size={13} />
                  <span>Google Sheet ↗</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditingCloudUrl(true)}
                  style={{
                    background: 'none',
                    border: '1px dashed #30363d',
                    color: '#58a6ff',
                    borderRadius: '6px',
                    padding: '0.45rem 0.8rem',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  + Link Google Drive Sheet
                </button>
              )}
            </div>
          </>
        ) : (
          /* Toolbar for Contact Inquiries */
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => {
                  const ok = exportInquiriesToExcel(filteredInquiries);
                  if (ok) onShowToast(`✓ Inquiries Excel workbook downloaded (${filteredInquiries.length} inquiries)!`, false);
                  else onShowToast('No contact inquiries to download.', true);
                }}
                style={{
                  backgroundColor: '#238636',
                  color: '#ffffff',
                  border: '1px solid rgba(240, 246, 252, 0.1)',
                  borderRadius: '6px',
                  padding: '0.5rem 0.9rem',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Download size={14} />
                <span>Download Inquiries .XLSX</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const ok = exportInquiriesToCSV(filteredInquiries);
                  if (ok) onShowToast(`✓ Inquiries CSV downloaded (${filteredInquiries.length} rows)!`, false);
                  else onShowToast('No inquiry rows to download.', true);
                }}
                style={{
                  backgroundColor: '#21262d',
                  color: '#c9d1d9',
                  border: '1px solid #30363d',
                  borderRadius: '6px',
                  padding: '0.5rem 0.9rem',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Download size={14} />
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                onClick={handleAddSampleInquiry}
                style={{
                  backgroundColor: '#21262d',
                  color: '#3fb950',
                  border: '1px solid #30363d',
                  borderRadius: '6px',
                  padding: '0.5rem 0.9rem',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                title="Add a demo contact inquiry to test live sync"
              >
                <MessageSquare size={14} />
                <span>+ Test Inquiry</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const url = `${window.location.origin}/admin/inquiries`;
                  navigator.clipboard.writeText(url);
                  onShowToast('✓ Inquiries Excel sheet link copied!', false);
                }}
                style={{
                  backgroundColor: '#21262d',
                  color: '#8b949e',
                  border: '1px solid #30363d',
                  borderRadius: '6px',
                  padding: '0.5rem 0.8rem',
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                title="Copy link to Inquiries Excel Sheet"
              >
                <Copy size={13} />
                <span>Copy Link</span>
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#8b949e' }} />
                <input
                  type="text"
                  placeholder="Search inquiries / messages..."
                  value={inquirySearchFilter}
                  onChange={(e) => setInquirySearchFilter(e.target.value)}
                  style={{
                    padding: '0.45rem 0.75rem 0.45rem 2rem',
                    backgroundColor: '#0d1117',
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    color: '#c9d1d9',
                    fontSize: '0.8125rem',
                    width: '220px',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Topic Filter */}
              <select
                value={inquiryTopicFilter}
                onChange={(e) => setInquiryTopicFilter(e.target.value)}
                style={{
                  padding: '0.45rem 0.75rem',
                  backgroundColor: '#0d1117',
                  border: '1px solid #30363d',
                  borderRadius: '6px',
                  color: '#c9d1d9',
                  fontSize: '0.8125rem',
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

              {/* Status Filter */}
              <select
                value={inquiryStatusFilter}
                onChange={(e) => setInquiryStatusFilter(e.target.value)}
                style={{
                  padding: '0.45rem 0.75rem',
                  backgroundColor: '#0d1117',
                  border: '1px solid #30363d',
                  borderRadius: '6px',
                  color: '#c9d1d9',
                  fontSize: '0.8125rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="ALL">All Statuses</option>
                <option value="NEW">New ({newInquiriesCount})</option>
                <option value="IN_REVIEW">In Review ({inReviewInquiriesCount})</option>
                <option value="RESOLVED">Resolved ({resolvedInquiriesCount})</option>
              </select>
            </div>
          </>
        )}
      </div>

      {/* External Google Sheet URL Drawer if editing */}
      {isEditingCloudUrl && activeSheet === 'registrations' && (
        <div
          style={{
            backgroundColor: '#161b22',
            borderBottom: '1px solid #30363d',
            padding: '0.75rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap'
          }}
        >
          <span style={{ fontSize: '0.75rem', color: '#8b949e' }}>Paste Your Google Drive Sheet URL:</span>
          <form onSubmit={handleSaveCloudUrl} style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '300px' }}>
            <input
              type="url"
              placeholder="https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit"
              value={cloudUrlInput}
              onChange={(e) => setCloudUrlInput(e.target.value)}
              style={{
                flex: 1,
                padding: '0.4rem 0.75rem',
                backgroundColor: '#0d1117',
                border: '1px solid #58a6ff',
                borderRadius: '4px',
                color: '#ffffff',
                fontSize: '0.8125rem',
                outline: 'none'
              }}
              autoFocus
            />
            <button
              type="submit"
              style={{
                backgroundColor: '#238636',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                padding: '0.4rem 0.8rem',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditingCloudUrl(false)}
              style={{
                backgroundColor: 'transparent',
                color: '#8b949e',
                border: '1px solid #30363d',
                borderRadius: '4px',
                padding: '0.4rem 0.8rem',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* 3. EXCEL FORMULA BAR */}
      <div
        style={{
          backgroundColor: '#0d1117',
          borderBottom: '1px solid #30363d',
          padding: '0.4rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontFamily: 'Consolas, monospace',
          fontSize: '0.8125rem'
        }}
      >
        {/* Name Box */}
        <div
          style={{
            backgroundColor: '#161b22',
            border: '1px solid #30363d',
            padding: '2px 10px',
            borderRadius: '3px',
            color: '#58a6ff',
            fontWeight: 700,
            minWidth: '45px',
            textAlign: 'center'
          }}
        >
          {activeCell}
        </div>

        {/* fx symbol */}
        <span style={{ color: '#8b949e', fontWeight: 700, fontStyle: 'italic' }}>fx</span>

        {/* Formula content */}
        <div style={{ color: '#c9d1d9', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {activeSheet === 'registrations'
            ? `=REGISTRATIONS(TOTAL: ${registrations.length}, REMAINING_SEATS: ${TOTAL_CAPACITY - registrations.length})`
            : `=CONTACT_INQUIRIES(TOTAL: ${inquiries.length}, NEW: ${newInquiriesCount}, IN_REVIEW: ${inReviewInquiriesCount}, RESOLVED: ${resolvedInquiriesCount})`}
        </div>

        <div style={{ fontSize: '0.75rem', color: '#8b949e' }}>
          Real-Time Continuous Master Sheet
        </div>
      </div>

      {/* Mobile Swipe Guidance Banner */}
      <div className="mobile-scroll-hint" style={{ margin: '6px 12px 0' }}>
        <span>↔ SWIPE HORIZONTALLY TO VIEW ALL COLUMNS (A - H)</span>
        <span>SHEET {activeSheet === 'registrations' ? '1: REGISTRATIONS' : '2: INQUIRIES'}</span>
      </div>

      {/* 4. MAIN EXCEL WORKBOOK GRID TABLE */}
      <div className="excel-table-scroll-container" style={{ flex: 1, overflow: 'auto', WebkitOverflowScrolling: 'touch', backgroundColor: '#0d1117' }}>
        {activeSheet === 'registrations' ? (
          /* REGISTRATIONS TABLE VIEW */
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontFamily: 'Segoe UI, -apple-system, sans-serif',
              fontSize: '0.8125rem',
              textAlign: 'left'
            }}
          >
            <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <tr
                style={{
                  backgroundColor: '#161b22',
                  borderBottom: '2px solid #30363d',
                  color: '#8b949e',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  userSelect: 'none'
                }}
              >
                <th style={{ width: '45px', padding: '8px 10px', textAlign: 'center', borderRight: '1px solid #30363d' }}>
                  #
                </th>
                <th style={{ width: '150px', padding: '8px 12px', borderRight: '1px solid #30363d' }}>
                  A · REGISTRATION ID
                </th>
                <th style={{ minWidth: '180px', padding: '8px 12px', borderRight: '1px solid #30363d' }}>
                  B · FULL NAME
                </th>
                <th style={{ minWidth: '220px', padding: '8px 12px', borderRight: '1px solid #30363d' }}>
                  C · EMAIL ADDRESS
                </th>
                <th style={{ minWidth: '240px', padding: '8px 12px', borderRight: '1px solid #30363d' }}>
                  D · COLLEGE / UNIVERSITY
                </th>
                <th style={{ minWidth: '200px', padding: '8px 12px', borderRight: '1px solid #30363d' }}>
                  E · AREA OF INTEREST
                </th>
                <th style={{ width: '100px', padding: '8px 12px', borderRight: '1px solid #30363d' }}>
                  F · CONSENT
                </th>
                <th style={{ width: '180px', padding: '8px 12px', borderRight: '1px solid #30363d' }}>
                  G · REGISTERED AT (IST)
                </th>
                <th style={{ width: '110px', padding: '8px 12px', textAlign: 'center' }}>
                  H · ACTIONS
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredRegistrations.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    style={{
                      padding: '4rem 2rem',
                      textAlign: 'center',
                      color: '#8b949e',
                      backgroundColor: '#0d1117'
                    }}
                  >
                    <FileSpreadsheet size={48} style={{ color: '#30363d', margin: '0 auto 1rem', display: 'block' }} />
                    <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#c9d1d9', marginBottom: '6px' }}>
                      {searchFilter ? 'No rows match your filter.' : 'Master Live Excel Sheet is Ready.'}
                    </div>
                    <p style={{ maxWidth: '500px', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
                      Jaise hi koi user registration page (<Link to="/register" style={{ color: '#58a6ff' }}>/register</Link>) par form submit karega, uski details turant yahan Row 1 par appear ho jayegi.
                    </p>
                    <button
                      type="button"
                      onClick={handleAddSample}
                      style={{
                        backgroundColor: '#238636',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.6rem 1.2rem',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      + Add Demo Attendee to Test Live Sheet
                    </button>
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((rec, index) => {
                  const isNew = rec.id === newlyAddedId;
                  const rowNum = index + 1;
                  return (
                    <tr
                      key={rec.id}
                      onClick={() => setActiveCell(`A${rowNum}`)}
                      style={{
                        backgroundColor: isNew ? 'rgba(46, 160, 67, 0.2)' : index % 2 === 0 ? '#0d1117' : '#161b22',
                        borderBottom: '1px solid #21262d',
                        transition: 'background-color 0.3s ease'
                      }}
                    >
                      {/* Row Index */}
                      <td
                        style={{
                          padding: '8px 10px',
                          textAlign: 'center',
                          color: '#8b949e',
                          backgroundColor: '#161b22',
                          borderRight: '1px solid #30363d',
                          fontFamily: 'Consolas, monospace',
                          fontWeight: 600,
                          fontSize: '0.75rem'
                        }}
                      >
                        {rowNum}
                      </td>

                      {/* Col A: ID */}
                      <td
                        style={{
                          padding: '8px 12px',
                          borderRight: '1px solid #21262d',
                          fontFamily: 'Consolas, monospace',
                          color: '#58a6ff',
                          fontWeight: 600
                        }}
                      >
                        {rec.id}
                      </td>

                      {/* Col B: Name */}
                      <td
                        style={{
                          padding: '8px 12px',
                          borderRight: '1px solid #21262d',
                          color: '#ffffff',
                          fontWeight: 600
                        }}
                      >
                        {rec.name}
                      </td>

                      {/* Col C: Email */}
                      <td
                        style={{
                          padding: '8px 12px',
                          borderRight: '1px solid #21262d',
                          color: '#c9d1d9'
                        }}
                      >
                        {rec.email}
                      </td>

                      {/* Col D: College */}
                      <td
                        style={{
                          padding: '8px 12px',
                          borderRight: '1px solid #21262d',
                          color: '#c9d1d9'
                        }}
                      >
                        {rec.college}
                      </td>

                      {/* Col E: Track */}
                      <td
                        style={{
                          padding: '8px 12px',
                          borderRight: '1px solid #21262d'
                        }}
                      >
                        <span
                          style={{
                            backgroundColor: '#21262d',
                            border: '1px solid #30363d',
                            borderRadius: '12px',
                            padding: '2px 8px',
                            fontSize: '0.6875rem',
                            color: '#39d353'
                          }}
                        >
                          {rec.interest}
                        </span>
                      </td>

                      {/* Col F: Consent */}
                      <td
                        style={{
                          padding: '8px 12px',
                          borderRight: '1px solid #21262d',
                          color: '#8b949e',
                          fontSize: '0.75rem'
                        }}
                      >
                        {rec.consent}
                      </td>

                      {/* Col G: Timestamp */}
                      <td
                        style={{
                          padding: '8px 12px',
                          borderRight: '1px solid #21262d',
                          color: '#8b949e',
                          fontSize: '0.75rem',
                          fontFamily: 'Consolas, monospace'
                        }}
                      >
                        {new Date(rec.registeredAt).toLocaleString('en-IN', {
                          timeZone: 'Asia/Kolkata',
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </td>

                      {/* Col H: Actions */}
                      <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => {
                              exportSingleRegistrationToExcel(rec);
                              onShowToast(`✓ Pass downloaded for ${rec.name}!`, false);
                            }}
                            style={{
                              padding: '3px 7px',
                              backgroundColor: '#21262d',
                              border: '1px solid #30363d',
                              color: '#58a6ff',
                              borderRadius: '4px',
                              fontSize: '0.6875rem',
                              cursor: 'pointer'
                            }}
                            title="Download Attendee Pass (.xlsx)"
                          >
                            Pass
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete registration for "${rec.name}"?`)) {
                                deleteStoredRegistration(rec.id);
                                refreshRegData();
                                onShowToast(`Deleted ${rec.id}.`, false);
                              }
                            }}
                            style={{
                              padding: '3px 5px',
                              backgroundColor: 'transparent',
                              border: '1px solid #30363d',
                              color: '#f85149',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                            title="Delete attendee"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        ) : (
          /* CONTACT INQUIRIES TABLE VIEW */
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontFamily: 'Segoe UI, -apple-system, sans-serif',
              fontSize: '0.8125rem',
              textAlign: 'left'
            }}
          >
            <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <tr
                style={{
                  backgroundColor: '#161b22',
                  borderBottom: '2px solid #30363d',
                  color: '#8b949e',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  userSelect: 'none'
                }}
              >
                <th style={{ width: '45px', padding: '8px 10px', textAlign: 'center', borderRight: '1px solid #30363d' }}>
                  #
                </th>
                <th style={{ width: '150px', padding: '8px 12px', borderRight: '1px solid #30363d' }}>
                  A · INQUIRY ID
                </th>
                <th style={{ minWidth: '170px', padding: '8px 12px', borderRight: '1px solid #30363d' }}>
                  B · SENDER NAME
                </th>
                <th style={{ minWidth: '220px', padding: '8px 12px', borderRight: '1px solid #30363d' }}>
                  C · EMAIL ADDRESS
                </th>
                <th style={{ minWidth: '220px', padding: '8px 12px', borderRight: '1px solid #30363d' }}>
                  D · TOPIC / SUBJECT
                </th>
                <th style={{ minWidth: '320px', padding: '8px 12px', borderRight: '1px solid #30363d' }}>
                  E · INQUIRY MESSAGE
                </th>
                <th style={{ width: '180px', padding: '8px 12px', borderRight: '1px solid #30363d' }}>
                  F · SUBMITTED AT (IST)
                </th>
                <th style={{ width: '120px', padding: '8px 12px', borderRight: '1px solid #30363d', textAlign: 'center' }}>
                  G · STATUS
                </th>
                <th style={{ width: '130px', padding: '8px 12px', textAlign: 'center' }}>
                  H · ACTIONS
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    style={{
                      padding: '4rem 2rem',
                      textAlign: 'center',
                      color: '#8b949e',
                      backgroundColor: '#0d1117'
                    }}
                  >
                    <MessageSquare size={48} style={{ color: '#30363d', margin: '0 auto 1rem', display: 'block' }} />
                    <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#c9d1d9', marginBottom: '6px' }}>
                      {inquirySearchFilter ? 'No inquiries match your filter.' : 'Contact Inquiries Master Excel Sheet is Ready.'}
                    </div>
                    <p style={{ maxWidth: '540px', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
                      Jab bhi koi user Contact page (<Link to="/contact" style={{ color: '#58a6ff' }}>/contact</Link>) par "SEND INQUIRY TO ORGANIZERS" par click karega, uska data turant yahan real-time me record ho jayega.
                    </p>
                    <button
                      type="button"
                      onClick={handleAddSampleInquiry}
                      style={{
                        backgroundColor: '#238636',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.6rem 1.2rem',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      + Add Demo Inquiry to Test Live Sheet
                    </button>
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inq, index) => {
                  const isNew = inq.id === newlyAddedInquiryId;
                  const rowNum = index + 1;
                  return (
                    <tr
                      key={inq.id}
                      onClick={() => setActiveCell(`A${rowNum}`)}
                      style={{
                        backgroundColor: isNew ? 'rgba(46, 160, 67, 0.25)' : index % 2 === 0 ? '#0d1117' : '#161b22',
                        borderBottom: '1px solid #21262d',
                        transition: 'background-color 0.3s ease'
                      }}
                    >
                      {/* Row Index */}
                      <td
                        style={{
                          padding: '8px 10px',
                          textAlign: 'center',
                          color: '#8b949e',
                          backgroundColor: '#161b22',
                          borderRight: '1px solid #30363d',
                          fontFamily: 'Consolas, monospace',
                          fontWeight: 600,
                          fontSize: '0.75rem'
                        }}
                      >
                        {rowNum}
                      </td>

                      {/* Col A: Inquiry ID */}
                      <td
                        style={{
                          padding: '8px 12px',
                          borderRight: '1px solid #21262d',
                          fontFamily: 'Consolas, monospace',
                          color: '#3fb950',
                          fontWeight: 600
                        }}
                      >
                        {inq.id}
                      </td>

                      {/* Col B: Name */}
                      <td
                        style={{
                          padding: '8px 12px',
                          borderRight: '1px solid #21262d',
                          color: '#ffffff',
                          fontWeight: 600
                        }}
                      >
                        {inq.name}
                      </td>

                      {/* Col C: Email */}
                      <td
                        style={{
                          padding: '8px 12px',
                          borderRight: '1px solid #21262d',
                          color: '#c9d1d9'
                        }}
                      >
                        <a
                          href={`mailto:${inq.email}?subject=Re: AWS Community Day Inquiry - ${inq.topic}`}
                          style={{ color: '#58a6ff', textDecoration: 'none' }}
                          title="Reply to sender via email"
                        >
                          {inq.email}
                        </a>
                      </td>

                      {/* Col D: Topic */}
                      <td
                        style={{
                          padding: '8px 12px',
                          borderRight: '1px solid #21262d'
                        }}
                      >
                        <span
                          style={{
                            backgroundColor: '#21262d',
                            border: '1px solid #30363d',
                            borderRadius: '12px',
                            padding: '2px 8px',
                            fontSize: '0.6875rem',
                            color: '#e6edf3'
                          }}
                        >
                          {inq.topic}
                        </span>
                      </td>

                      {/* Col E: Message */}
                      <td
                        style={{
                          padding: '8px 12px',
                          borderRight: '1px solid #21262d',
                          color: '#c9d1d9',
                          lineHeight: 1.4,
                          maxWidth: '360px'
                        }}
                      >
                        <div style={{ wordBreak: 'break-word' }}>{inq.message}</div>
                      </td>

                      {/* Col F: Timestamp */}
                      <td
                        style={{
                          padding: '8px 12px',
                          borderRight: '1px solid #21262d',
                          color: '#8b949e',
                          fontSize: '0.75rem',
                          fontFamily: 'Consolas, monospace'
                        }}
                      >
                        {new Date(inq.submittedAt).toLocaleString('en-IN', {
                          timeZone: 'Asia/Kolkata',
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </td>

                      {/* Col G: Status */}
                      <td style={{ padding: '8px 12px', borderRight: '1px solid #21262d', textAlign: 'center' }}>
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
                          title="Click to cycle status: NEW -> IN_REVIEW -> RESOLVED"
                        >
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: 'currentColor'
                            }}
                          />
                          <span>{inq.status}</span>
                        </button>
                      </td>

                      {/* Col H: Actions */}
                      <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => handleToggleInquiryStatus(inq.id, inq.status)}
                            style={{
                              padding: '3px 7px',
                              backgroundColor: '#21262d',
                              border: '1px solid #30363d',
                              color: '#58a6ff',
                              borderRadius: '4px',
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
                              padding: '3px 5px',
                              backgroundColor: 'transparent',
                              border: '1px solid #30363d',
                              color: '#f85149',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                            title="Delete contact inquiry"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* 5. EXCEL BOTTOM STATUS & SHEET TABS BAR */}
      <div
        style={{
          backgroundColor: '#161b22',
          borderTop: '1px solid #30363d',
          padding: '0.35rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          color: '#8b949e',
          userSelect: 'none',
          flexWrap: 'wrap',
          gap: '8px'
        }}
      >
        {/* Bottom Sheet Tabs (Excel Online style) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            type="button"
            onClick={() => {
              setActiveSheet('registrations');
              setActiveCell('A1');
            }}
            style={{
              backgroundColor: activeSheet === 'registrations' ? '#0d1117' : 'transparent',
              color: activeSheet === 'registrations' ? '#3fb950' : '#8b949e',
              fontWeight: activeSheet === 'registrations' ? 700 : 500,
              padding: '5px 14px',
              border: 'none',
              borderTop: activeSheet === 'registrations' ? '2px solid #2ea043' : '2px solid transparent',
              borderRadius: '2px 2px 0 0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.75rem'
            }}
          >
            <span>Sheet1 (Registrations)</span>
            <span
              style={{
                backgroundColor: '#21262d',
                color: '#ffffff',
                fontSize: '0.625rem',
                padding: '1px 5px',
                borderRadius: '8px'
              }}
            >
              {registrations.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveSheet('inquiries');
              setActiveCell('A1');
            }}
            style={{
              backgroundColor: activeSheet === 'inquiries' ? '#0d1117' : 'transparent',
              color: activeSheet === 'inquiries' ? '#3fb950' : '#8b949e',
              fontWeight: activeSheet === 'inquiries' ? 700 : 500,
              padding: '5px 14px',
              border: 'none',
              borderTop: activeSheet === 'inquiries' ? '2px solid #2ea043' : '2px solid transparent',
              borderRadius: '2px 2px 0 0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.75rem'
            }}
          >
            <MessageSquare size={11} />
            <span>Sheet2 (Contact Inquiries)</span>
            <span
              style={{
                backgroundColor: '#21262d',
                color: '#ffffff',
                fontSize: '0.625rem',
                padding: '1px 5px',
                borderRadius: '8px'
              }}
            >
              {inquiries.length}
            </span>
          </button>

          <div style={{ padding: '4px 8px', color: '#8b949e', cursor: 'default' }}>+</div>
        </div>

        {/* Status Metrics */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <span>READY</span>
          {activeSheet === 'registrations' ? (
            <>
              <span>COUNT: <strong style={{ color: '#ffffff' }}>{filteredRegistrations.length}</strong></span>
              <span>CAPACITY: <strong style={{ color: '#ffffff' }}>{TOTAL_CAPACITY}</strong></span>
            </>
          ) : (
            <>
              <span>INQUIRIES: <strong style={{ color: '#ffffff' }}>{filteredInquiries.length}</strong></span>
              <span>NEW: <strong style={{ color: '#d29922' }}>{newInquiriesCount}</strong></span>
              <span>RESOLVED: <strong style={{ color: '#3fb950' }}>{resolvedInquiriesCount}</strong></span>
            </>
          )}
          <span>LAST REFRESH: {lastSyncText}</span>
        </div>
      </div>
    </div>
  );
};
