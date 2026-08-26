import React from 'react';
import { 
  ShieldCheck, LayoutDashboard, ListFilter, Cpu, 
  Layers, FileText, BarChart3, Server, ToggleLeft, ToggleRight
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, mode, setMode, isStreamLive, setIsStreamLive }) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ListFilter },
    { id: 'intelligence', label: 'Risk Intelligence', icon: Cpu },
    { id: 'abuse-graph', label: 'Abuse Graph', icon: Layers },
    { id: 'chargebacks', label: 'Chargebacks', icon: FileText },
    { id: 'models', label: 'Models / Risk Lab', icon: BarChart3 },
    { id: 'system', label: 'System', icon: Server },
  ];

  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--bg-secondary)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* BRAND & STATUS HEADER */}
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        
        {/* BRAND */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <ShieldCheck size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '-0.01em', color: '#fff' }}>
                CERBERUSPAY
              </span>
              <span style={{ fontSize: '10px', color: '#60a5fa', background: 'rgba(59, 130, 246, 0.15)', padding: '1px 6px', borderRadius: '3px', fontWeight: 700 }}>
                RISK PLATFORM
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Payment Risk Intelligence Platform
            </div>
          </div>
        </div>

        {/* SYSTEM STATUS & MODE TOGGLE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          
          {/* Operational Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            fontWeight: 600,
            color: '#10b981',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            padding: '3px 8px',
            borderRadius: '4px'
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
            SYSTEM OPERATIONAL
          </div>

          {/* Mode Pill / Toggle */}
          <div 
            onClick={() => setMode(mode === 'SIMULATION' ? 'SANDBOX' : 'SIMULATION')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: 600,
              color: mode === 'SIMULATION' ? '#f59e0b' : '#3b82f6',
              background: mode === 'SIMULATION' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.1)',
              border: `1px solid ${mode === 'SIMULATION' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(59, 130, 246, 0.25)'}`,
              padding: '3px 8px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            title="Click to toggle between Simulation and Sandbox Mode"
          >
            <span>● {mode} MODE</span>
          </div>

          {/* Live Ingestion Stream Toggle */}
          <button
            onClick={() => setIsStreamLive(!isStreamLive)}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              color: isStreamLive ? '#10b981' : 'var(--text-muted)',
              borderRadius: '4px',
              padding: '3px 8px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {isStreamLive ? 'Stream: Active' : 'Stream: Paused'}
          </button>

        </div>

      </div>

      {/* NAVIGATION TABS */}
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0 1.5rem',
        display: 'flex',
        gap: '0.25rem',
        borderTop: '1px solid var(--border-subtle)',
        overflowX: 'auto'
      }}>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '2px solid #3b82f6' : '2px solid transparent',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '13px',
                padding: '0.65rem 0.85rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                whiteSpace: 'nowrap',
                transition: 'color 0.15s ease'
              }}
            >
              <Icon size={15} color={isActive ? '#3b82f6' : 'var(--text-muted)'} />
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}