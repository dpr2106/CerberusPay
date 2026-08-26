import React, { useState } from 'react';
import { 
  ShieldCheck, Activity, Search, Layers, Cpu, FileText, 
  Server, User, Lock, Radio, Info, ChevronRight, HelpCircle
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  mode, 
  setMode, 
  isStreamLive, 
  setIsStreamLive, 
  selectedTransaction,
  currentOperator,
  onLogout
}) {
  const [hoveredTooltip, setHoveredTooltip] = useState(null);

  const primaryTabs = [
    { id: 'monitor', label: 'Monitor', icon: Activity, desc: 'Real-time transaction stream & threat detection' },
    { id: 'investigate', label: selectedTransaction ? `Investigate (${selectedTransaction.id})` : 'Investigate', icon: Search, desc: 'Deep transaction dossier & signal explainability' },
    { id: 'networks', label: 'Networks', icon: Layers, desc: 'Fraud syndicate & linked entity graph' },
    { id: 'models', label: 'Models', icon: Cpu, desc: 'ML benchmark & real-time decision thresholds' },
  ];

  const secondaryTabs = [
    { id: 'chargebacks', label: 'Chargebacks', icon: FileText, desc: 'Bank dispute representment operations' },
    { id: 'system', label: 'System', icon: Server, desc: 'Platform microservices & SMTP health' },
  ];

  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(13, 18, 29, 0.92)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.4)'
    }}>
      
      {/* TOP BAR: BRANDING & OPERATIONAL STATUS BADGES */}
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0.65rem 1.5rem',
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
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 0 15px -2px rgba(59, 130, 246, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <ShieldCheck size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '-0.01em', color: '#fff' }}>
                CERBERUS<span style={{ color: '#60a5fa' }}>PAY</span>
              </span>
              <span style={{ 
                fontSize: '10px', 
                background: 'rgba(59,130,246,0.15)', 
                color: '#60a5fa', 
                padding: '1px 5px', 
                borderRadius: '3px', 
                fontWeight: 700,
                border: '1px solid rgba(59,130,246,0.25)' 
              }}>
                SOC v3.1
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.02em' }}>
              Payment Risk & Fraud Defense Console
            </div>
          </div>
        </div>

        {/* OPERATIONAL STATUS & CONTROLS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          
          {/* SYSTEM ONLINE BADGE */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: 700,
              color: '#34d399',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.22)',
              padding: '4px 10px',
              borderRadius: '6px',
              boxShadow: '0 0 10px -2px rgba(16, 185, 129, 0.15)'
            }}
          >
            <div className="beacon-pulse-green" />
            <span>SYSTEM ONLINE</span>
          </div>

          {/* SIMULATION MODE BADGE WITH TOOLTIP */}
          <div 
            onMouseEnter={() => setHoveredTooltip('mode')}
            onMouseLeave={() => setHoveredTooltip(null)}
            onClick={() => setMode(mode === 'SIMULATION' ? 'SANDBOX' : 'SIMULATION')}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: 700,
              color: mode === 'SIMULATION' ? '#fbbf24' : '#60a5fa',
              background: mode === 'SIMULATION' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.1)',
              border: `1px solid ${mode === 'SIMULATION' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(59, 130, 246, 0.25)'}`,
              padding: '4px 10px',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <span style={{ fontSize: '9px' }}>●</span>
            <span>{mode} MODE</span>
            {hoveredTooltip === 'mode' && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '6px',
                background: '#161d2d',
                border: '1px solid var(--border-muted)',
                borderRadius: '6px',
                padding: '6px 10px',
                fontSize: '11px',
                color: 'var(--text-secondary)',
                whiteSpace: 'nowrap',
                zIndex: 200,
                boxShadow: 'var(--shadow-lg)'
              }}>
                Simulated live gateway traffic stream • Click to toggle
              </div>
            )}
          </div>

          {/* LIVE STREAM TOGGLE BUTTON */}
          <button
            onClick={() => setIsStreamLive(!isStreamLive)}
            style={{
              background: isStreamLive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.03)',
              border: `1px solid ${isStreamLive ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-subtle)'}`,
              color: isStreamLive ? '#34d399' : 'var(--text-muted)',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <Radio size={12} className={isStreamLive ? 'animate-pulse' : ''} />
            <span>{isStreamLive ? 'Stream: Live' : 'Stream: Paused'}</span>
          </button>

          {/* AUTHENTICATED OPERATOR PROFILE & LOGOUT */}
          {currentOperator && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(59, 130, 246, 0.12)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                color: '#93c5fd'
              }}>
                <User size={12} />
                <span style={{ fontWeight: 700, color: '#fff' }}>{currentOperator.name}</span>
                <span className="mono" style={{ opacity: 0.7, fontSize: '10px' }}>({currentOperator.operator_id})</span>
              </div>

              <button
                onClick={onLogout}
                title="Lock Session & Sign Out"
                className="btn-secondary-fintech"
                style={{ 
                  padding: '4px 9px', 
                  fontSize: '11px', 
                  color: '#f87171', 
                  borderColor: 'rgba(239,68,68,0.25)',
                  background: 'rgba(239, 68, 68, 0.06)'
                }}
              >
                <Lock size={11} />
                <span>Sign Out</span>
              </button>
            </div>
          )}

        </div>

      </div>

      {/* LOWER TAB NAVIGATION BAR */}
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '1px solid var(--border-subtle)',
        overflowX: 'auto'
      }}>
        
        {/* PRIMARY TABS */}
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          {primaryTabs.map(item => {
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
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '13px',
                  padding: '0.65rem 0.95rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative'
                }}
              >
                <Icon 
                  size={15} 
                  color={isActive ? '#3b82f6' : 'var(--text-muted)'} 
                  style={{ transition: 'transform 0.2s ease', transform: isActive ? 'scale(1.1)' : 'scale(1)' }}
                />
                <span>{item.label}</span>
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '15%',
                    right: '15%',
                    height: '2px',
                    background: '#3b82f6',
                    boxShadow: '0 0 10px #3b82f6'
                  }} />
                )}
              </button>
            );
          })}
        </div>

        {/* SECONDARY TABS */}
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          {secondaryTabs.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? '2px solid var(--text-muted)' : '2px solid transparent',
                  color: isActive ? '#fff' : 'var(--text-muted)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '12px',
                  padding: '0.65rem 0.75rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.15s ease'
                }}
              >
                <Icon size={14} color={isActive ? '#cbd5e1' : 'var(--text-muted)'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
