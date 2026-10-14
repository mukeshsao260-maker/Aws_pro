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
        backgroundColor: '#0B0B0B',
        color: '#F3ECFF',
        boxShadow: '8px 8px 0px 0px rgba(0, 0, 0, 0.65)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Terminal Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          borderBottom: '1px solid rgba(173, 92, 255, 0.2)',
          backgroundColor: '#050308'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '9px', height: '9px', backgroundColor: '#3E1278', display: 'inline-block' }} />
          <span style={{ width: '9px', height: '9px', backgroundColor: '#7A28D8', display: 'inline-block' }} />
          <span style={{ width: '9px', height: '9px', backgroundColor: '#AD5CFF', display: 'inline-block' }} />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              color: '#A396B8',
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
              backgroundColor: '#AD5CFF',
              color: '#000000',
              fontWeight: 700,
              textTransform: 'uppercase',
              border: '1px solid #AD5CFF'
            }}
          >
            ● LIVE PREVIEW
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid rgba(173, 92, 255, 0.2)',
          backgroundColor: '#120A1E',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6875rem'
        }}
      >
        <button
          onClick={() => setActiveTab('sh')}
          style={{
            padding: '7px 14px',
            borderRight: '1px solid rgba(173, 92, 255, 0.2)',
            backgroundColor: activeTab === 'sh' ? '#0B0B0B' : 'transparent',
            color: activeTab === 'sh' ? '#AD5CFF' : '#A396B8',
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
            borderRight: '1px solid rgba(173, 92, 255, 0.2)',
            backgroundColor: activeTab === 'log' ? '#0B0B0B' : 'transparent',
            color: activeTab === 'log' ? '#AD5CFF' : '#A396B8',
            fontWeight: activeTab === 'log' ? 'bold' : 'normal'
          }}
        >
          aws-cloud.log
        </button>

        <button
          onClick={() => setActiveTab('json')}
          style={{
            padding: '7px 14px',
            backgroundColor: activeTab === 'json' ? '#0B0B0B' : 'transparent',
            color: activeTab === 'json' ? '#AD5CFF' : '#A396B8',
            fontWeight: activeTab === 'json' ? 'bold' : 'normal'
          }}
        >
          tracks.json
        </button>
      </div>

      {/* Terminal Content Body */}
      <div
        style={{
          padding: '1.25rem 1.25rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8125rem',
          lineHeight: '1.65',
          minHeight: '220px',
          backgroundColor: '#0B0B0B',
          color: '#F3ECFF'
        }}
      >
        {activeTab === 'sh' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div>
              <span style={{ color: '#AD5CFF', marginRight: '8px' }}>$</span>
              <span>init </span>
              <strong style={{ color: '#FFFFFF' }}>student-builder</strong>
            </div>

            {runIndex >= 1 && (
              <div>
                <span style={{ color: '#AD5CFF', marginRight: '8px' }}>$</span>
                <span>choose --track </span>
                <span style={{ color: '#D9B8FF', fontWeight: 'bold' }}>cloud</span>
              </div>
            )}

            {runIndex >= 2 && (
              <div>
                <span style={{ color: '#AD5CFF', marginRight: '8px' }}>$</span>
                <span>deploy --idea </span>
                <span style={{ color: '#D9B8FF' }}>"my-first-app"</span>
              </div>
            )}

            {runIndex >= 3 && (
              <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ color: '#AD5CFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} />
                  <span>environment ready</span>
                </div>
                <div style={{ color: '#AD5CFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} />
                  <span>mentor connected</span>
                </div>
                <div style={{ color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: '#AD5CFF' }}><Check size={14} /></span>
                  <span>builder mindset: <strong style={{ color: '#AD5CFF', textDecoration: 'underline' }}>ON</strong></span>
                </div>
              </div>
            )}

            <div style={{ marginTop: '0.5rem' }}>
              <span style={{ color: '#AD5CFF' }}>▋</span>
            </div>
          </div>
        )}

        {activeTab === 'log' && (
          <div style={{ color: '#A396B8', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div>[10:00:00] AWS_SESSION_INITIALIZED: region=ap-south-1</div>
            <div>[10:00:02] WORKSHOP_CREDENTIALS_DISPENSED: count=100</div>
            <div>[10:00:05] CLUSTER_PROVISION: ok (latency: 12ms)</div>
            <div>[10:00:12] MENTOR_CHANNELS: synced (audio/screen)</div>
            <div style={{ color: '#AD5CFF' }}>[10:00:15] READY: ALL SYSTEMS GO FOR HACKATHON PROTO</div>
          </div>
        )}

        {activeTab === 'json' && (
          <pre style={{ margin: 0, color: '#D9B8FF', fontSize: '0.75rem' }}>
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
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 14px',
          borderTop: '1px solid rgba(173, 92, 255, 0.2)',
          backgroundColor: '#050308',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6875rem',
          color: '#A396B8'
        }}
      >
        <div style={{ display: 'flex', gap: '14px' }}>
          <span style={{ color: '#AD5CFF' }}>01</span>
          <span>BUILD SESSION</span>
          <span>10:00 → 17:00</span>
        </div>

        <button
          onClick={handleRerun}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            color: '#F3ECFF',
            fontSize: '0.625rem',
            padding: '2px 7px',
            border: '1px solid rgba(173, 92, 255, 0.3)',
            backgroundColor: '#120A1E'
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
