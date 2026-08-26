import React from 'react';
import { ShieldAlert, Activity, Cpu, Layers, FileText, BarChart3 } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, isSimulating, setIsSimulating }) {
  const tabs = [
    { id: 'stream', label: 'Live Payment Stream', icon: Activity },
    { id: 'simulator', label: 'Risk Lab & Tensors', icon: Cpu },
    { id: 'rings', label: 'Abuse-Ring Sentinel', icon: Layers },
    { id: 'chargeback', label: 'Chargeback Auto-Responder', icon: FileText },
    { id: 'metrics', label: 'Razorpay Benchmark Bar', icon: BarChart3 },
  ];

  return (
    <header style={{
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      background: 'rgba(13, 17, 26, 0.95)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0.85rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #ef4444, #991b1b)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(239, 68, 68, 0.4)'
          }}>
            <ShieldAlert size={22} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>CerberusPay</h1>
              <span style={{ fontSize: '0.65rem', background: 'rgba(239,68,68,0.2)', color: '#f87171', border: '1px solid rgba(239,68,68,0.4)', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                RAZORPAY TRACK 02
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Triple-Headed Autonomous Payment Risk Sentinel</p>
          </div>
        </div>

        {/* THREE HEADS TELEMETRY */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
            <span>Head 1: <strong>ML Risk Scorer</strong></span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#06b6d4' }} />
            <span>Head 2: <strong>Abuse-Ring Graph</strong></span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6' }} />
            <span>Head 3: <strong>Chargeback Responder</strong></span>
          </div>
        </div>

        <div>
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            style={{
              background: isSimulating ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
              color: isSimulating ? '#34d399' : '#f87171',
              border: `1px solid ${isSimulating ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Activity size={14} />
            {isSimulating ? 'Stream: LIVE' : 'Stream: PAUSED'}
          </button>
        </div>

      </div>

      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', gap: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '2px solid #ef4444' : '2px solid transparent',
                padding: '0.75rem 0',
                color: isActive ? '#fff' : '#94a3b8',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={16} color={isActive ? '#ef4444' : '#94a3b8'} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}