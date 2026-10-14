import React, { useState } from 'react';
import { Terminal as TerminalIcon, RotateCcw, Check } from 'lucide-react';

export const Terminal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sh' | 'log' | 'json'>('sh');
  const [runIndex, setRunIndex] = useState<number>(3); // 3 = full output shown

  const handleRerun = () => {
    setRunIndex(0);
    setTimeout(() => setRunIndex(1), 300);
    setTimeout(() => setRunIndex(2), 700);
    setTimeout(() => setRunIndex(3), 1100);
  };

  return (
    <div
      className="terminal-box"
      style={{
        border: '1px solid var(--border-strong)',
        backgroundColor: '#111111',
        color: '#E8E6DF',
        boxShadow: '8px 8px 0px 0px rgba(0, 0, 0, 0.45)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Terminal Header Bar */}
      <div
        className="terminal-header-bar"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          borderBottom: '1px solid #262626',
          backgroundColor: '#0B0B0B'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '9px', height: '9px', backgroundColor: 'var(--accent-red)', display: 'inline-block' }} />
          <span style={{ width: '9px', height: '9px', backgroundColor: 'var(--accent-orange)', display: 'inline-block' }} />
          <span style={{ width: '9px', height: '9px', backgroundColor: 'var(--color-primary, #84109D)', display: 'inline-block' }} />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              color: '#888888',
              marginLeft: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            SYS://BUILDER-CONSOLE
          </span>
        </div>

        {/* Live Preview Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.625rem',
              padding: '2px 7px',
              backgroundColor: 'var(--color-primary, #84109D)',
              color: '#FFFFFF',
              fontWeight: 700,
              textTransform: 'uppercase',
              border: '1px solid var(--color-primary, #84109D)'
            }}
          >
            ● LIVE PREVIEW
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="terminal-tabs-container"
        style={{
          display: 'flex',
          borderBottom: '1px solid #262626',
          backgroundColor: '#161616',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6875rem'
        }}
      >
        <button
          onClick={() => setActiveTab('sh')}
          style={{
            padding: '7px 14px',
            borderRight: '1px solid #262626',
            backgroundColor: activeTab === 'sh' ? '#111111' : 'transparent',
            color: activeTab === 'sh' ? 'var(--color-primary-light, #B42DD2)' : '#888888',
            fontWeight: activeTab === 'sh' ? 'bold' : 'normal',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <TerminalIcon size={12} />
          builder-day.sh
        </button>

        <button
          onClick={() => setActiveTab('log')}
          style={{
            padding: '7px 14px',
            borderRight: '1px solid #262626',
            backgroundColor: activeTab === 'log' ? '#111111' : 'transparent',
            color: activeTab === 'log' ? 'var(--color-primary-light, #B42DD2)' : '#888888',
            fontWeight: activeTab === 'log' ? 'bold' : 'normal'
          }}
        >
          aws-cloud.log
        </button>

        <button
          onClick={() => setActiveTab('json')}
          style={{
            padding: '7px 14px',
            backgroundColor: activeTab === 'json' ? '#111111' : 'transparent',
            color: activeTab === 'json' ? 'var(--color-primary-light, #B42DD2)' : '#888888',
            fontWeight: activeTab === 'json' ? 'bold' : 'normal'
          }}
        >
          tracks.json
        </button>
      </div>

      {/* Terminal Content Body */}
      <div
        className="terminal-content-body"
        style={{
          padding: '1.25rem 1.25rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8125rem',
          lineHeight: '1.65',
          minHeight: '220px',
          backgroundColor: '#111111',
          color: '#E8E6DF'
        }}
      >
        {activeTab === 'sh' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div>
              <span style={{ color: 'var(--color-primary-light, #B42DD2)', marginRight: '8px' }}>$</span>
              <span>init </span>
              <strong style={{ color: '#FFFFFF' }}>student-builder</strong>
            </div>

            {runIndex >= 1 && (
              <div>
                <span style={{ color: 'var(--color-primary-light, #B42DD2)', marginRight: '8px' }}>$</span>
                <span>choose --track </span>
                <span style={{ color: 'var(--color-primary-light, #B42DD2)', fontWeight: 'bold' }}>cloud</span>
              </div>
            )}

            {runIndex >= 2 && (
              <div>
                <span style={{ color: 'var(--color-primary-light, #B42DD2)', marginRight: '8px' }}>$</span>
                <span>deploy --idea </span>
                <span style={{ color: 'var(--color-primary-soft, #F1D4FA)' }}>"my-first-app"</span>
              </div>
            )}

            {runIndex >= 3 && (
              <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ color: 'var(--color-primary-light, #B42DD2)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} />
                  <span>environment ready</span>
                </div>
                <div style={{ color: 'var(--color-primary-light, #B42DD2)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} />
                  <span>mentor connected</span>
                </div>
                <div style={{ color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: 'var(--color-primary-light, #B42DD2)' }}><Check size={14} /></span>
                  <span>builder mindset: <strong style={{ color: 'var(--color-primary-light, #B42DD2)', textDecoration: 'underline' }}>ON</strong></span>
                </div>
              </div>
            )}

            <div style={{ marginTop: '0.5rem' }}>
              <span style={{ color: 'var(--color-primary, #84109D)' }}>▋</span>
            </div>
          </div>
        )}

        {activeTab === 'log' && (
          <div style={{ color: '#888888', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div>[10:00:00] AWS_SESSION_INITIALIZED: region=ap-south-1</div>
            <div>[10:00:02] WORKSHOP_CREDENTIALS_DISPENSED: count=100</div>
            <div>[10:00:05] CLUSTER_PROVISION: ok (latency: 12ms)</div>
            <div>[10:00:12] MENTOR_CHANNELS: synced (audio/screen)</div>
            <div style={{ color: 'var(--color-primary-light, #B42DD2)' }}>[10:00:15] READY: ALL SYSTEMS GO FOR HACKATHON PROTO</div>
          </div>
        )}

        {activeTab === 'json' && (
          <pre style={{ margin: 0, color: 'var(--color-primary-soft, #F1D4FA)', fontSize: '0.75rem' }}>
            {`{
  "event": "AWS Student Builder Day",
  "campus": "Rungta University",
  "tracks": ["Cloud", "Web", "GenAI", "OpenSource"],
  "seats": 100,
  "status": "OPEN_FOR_STUDENTS"
}`}
          </pre>
        )}
      </div>

      {/* Terminal Footer Bar */}
      <div
        className="terminal-footer-bar"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 14px',
          borderTop: '1px solid #262626',
          backgroundColor: '#0B0B0B',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6875rem',
          color: '#888888'
        }}
      >
        <div style={{ display: 'flex', gap: '14px' }}>
          <span style={{ color: 'var(--color-primary-light, #B42DD2)' }}>01</span>
          <span>BUILD SESSION</span>
          <span>10:00 → 17:00</span>
        </div>

        <button
          onClick={handleRerun}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            color: '#E8E6DF',
            fontSize: '0.625rem',
            padding: '2px 7px',
            border: '1px solid #333333',
            backgroundColor: '#1A1A1A'
          }}
          title="Re-run terminal commands"
        >
          <RotateCcw size={10} />
          RE-RUN
        </button>
      </div>
    </div>
  );
};
