import React, { useState } from 'react';
import { 
  ShieldCheck, Activity, Search, Layers, Cpu, FileText, 
  Server, User, Lock, Radio, Zap, Sparkles, AlertCircle, 
  CheckCircle2, RefreshCw, Power
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
  const [hoveredPill, setHoveredPill] = useState(null);

  const primaryTabs = [
    { id: 'monitor', label: 'Monitor', icon: Activity },
    { id: 'investigate', label: selectedTransaction ? `Investigate (${selectedTransaction.id})` : 'Investigate', icon: Search },
    { id: 'networks', label: 'Networks', icon: Layers },
    { id: 'models', label: 'Models', icon: Cpu },
  ];

  const secondaryTabs = [
    { id: 'chargebacks', label: 'Chargebacks', icon: FileText },
    { id: 'system', label: 'System', icon: Server },
  ];

  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(7, 9, 12, 0.95)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.75)'
    }}>
      
      {/* TOP BAR: BRAND LOGO & COMPACT STATUS CONTROLS */}
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0.6rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.85rem'
      }}>
        
        {/* CERBERUSPAY ORANGE BRAND */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            position: 'relative',
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            overflow: 'hidden',
            background: '#0D1117',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(249, 115, 22, 0.4)',
            border: '1.5px solid rgba(249, 115, 22, 0.55)',
            cursor: 'pointer',
            transition: 'transform 0.18s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <img 
              src="/cerberuspay_logo.png" 
              alt="CerberusPay Logo" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ 
                fontSize: '1.05rem', 
                fontWeight: 900, 
                letterSpacing: '-0.02em', 
                color: '#F8FAFC',
                textShadow: '0 0 12px rgba(255,255,255,0.15)'
              }}>
                CERBERUS<span style={{ 
                  color: '#F97316', 
                  textShadow: '0 0 14px rgba(249, 115, 22, 0.6)' 
                }}>PAY</span>
              </span>
              <span style={{ 
                fontSize: '10px', 
                background: 'rgba(249, 115, 22, 0.15)', 
                color: '#FB923C', 
                padding: '2px 6px', 
                borderRadius: '4px', 
                fontWeight: 800,
                border: '1px solid rgba(249, 115, 22, 0.35)'
              }}>
                SOC v3.1
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.03em' }}>
              Payment Risk & Fraud Defense Console
            </div>
          </div>
        </div>

        {/* STATUS CONTROLS (COMPACT PROFESSIONAL SOC TOOLBAR) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap' }}>
          
          {/* 1. EMERALD SYSTEM ONLINE (GREEN FOR HEALTHY) */}
          <div 
            onMouseEnter={() => setHoveredPill('system')}
            onMouseLeave={() => setHoveredPill(null)}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: 700,
              color: '#34D399',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              padding: '4px 10px',
              borderRadius: '6px',
              cursor: 'default',
              transition: 'all 0.18s ease'
            }}
          >
            <div className="beacon-pulse-green" />
            <span>SYSTEM ONLINE</span>
            {hoveredPill === 'system' && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '6px',
                background: '#0D1117',
                border: '1px solid #252D38',
                borderRadius: '6px',
                padding: '6px 10px',
                fontSize: '11px',
                color: '#A7F3D0',
                whiteSpace: 'nowrap',
                zIndex: 200,
                boxShadow: '0 8px 24px rgba(0,0,0,0.7)'
              }}>
                ● ML Risk Engine & SQLite Operational • 99.99% Uptime
              </div>
            )}
          </div>

          {/* 2. AMBER/ORANGE SIMULATION MODE TOGGLE */}
          <div 
            onMouseEnter={() => setHoveredPill('mode')}
            onMouseLeave={() => setHoveredPill(null)}
            onClick={() => setMode(mode === 'SIMULATION' ? 'SANDBOX' : 'SIMULATION')}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '11px',
              fontWeight: 700,
              color: mode === 'SIMULATION' ? '#FBBF24' : '#FB923C',
              background: mode === 'SIMULATION' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(249, 115, 22, 0.12)',
              border: `1px solid ${mode === 'SIMULATION' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(249, 115, 22, 0.4)'}`,
              padding: '4px 10px',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
              transform: hoveredPill === 'mode' ? 'translateY(-1px)' : 'translateY(0)'
            }}
          >
            <Zap size={12} color={mode === 'SIMULATION' ? '#FBBF24' : '#F97316'} />
            <span>{mode} MODE</span>
            {hoveredPill === 'mode' && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '6px',
                background: '#0D1117',
                border: '1px solid #252D38',
                borderRadius: '6px',
                padding: '6px 10px',
                fontSize: '11px',
                color: '#FDE68A',
                whiteSpace: 'nowrap',
                zIndex: 200,
                boxShadow: '0 8px 24px rgba(0,0,0,0.7)'
              }}>
                ⚡ Click to toggle between Simulation & Sandbox traffic
              </div>
            )}
          </div>

          {/* 3. STREAM LIVE TOGGLE (BRAND ORANGE) */}
          <button
            onMouseEnter={() => setHoveredPill('stream')}
            onMouseLeave={() => setHoveredPill(null)}
            onClick={() => setIsStreamLive(!isStreamLive)}
            style={{
              position: 'relative',
              background: isStreamLive ? 'rgba(249, 115, 22, 0.14)' : 'rgba(255, 255, 255, 0.04)',
              border: `1px solid ${isStreamLive ? 'rgba(249, 115, 22, 0.45)' : 'var(--border-subtle)'}`,
              color: isStreamLive ? '#FB923C' : 'var(--text-muted)',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.18s ease',
              transform: hoveredPill === 'stream' ? 'translateY(-1px)' : 'translateY(0)'
            }}
          >
            <Radio size={12} className={isStreamLive ? 'animate-pulse' : ''} />
            <span>{isStreamLive ? 'Stream: Live' : 'Stream: Paused'}</span>
            {hoveredPill === 'stream' && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '6px',
                background: '#0D1117',
                border: '1px solid #252D38',
                borderRadius: '6px',
                padding: '6px 10px',
                fontSize: '11px',
                color: '#FED7AA',
                whiteSpace: 'nowrap',
                zIndex: 200,
                boxShadow: '0 8px 24px rgba(0,0,0,0.7)'
              }}>
                {isStreamLive ? 'Ingesting live payment events • Click to pause' : 'Stream paused • Click to resume'}
              </div>
            )}
          </button>

          {/* 4. CHIEF RISK OFFICER BADGE */}
          <div 
            onMouseEnter={() => setHoveredPill('operator')}
            onMouseLeave={() => setHoveredPill(null)}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#0D1117',
              border: '1px solid #252D38',
              padding: '3px 9px',
              borderRadius: '6px',
              fontSize: '11px',
              color: '#F8FAFC',
              transition: 'all 0.18s ease'
            }}
          >
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #F97316 0%, #C2410C 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
              fontWeight: 900,
              fontSize: '9.5px'
            }}>
              C
            </div>
            <span style={{ fontWeight: 700, color: '#F8FAFC' }}>Chief Risk Officer</span>
            <span className="mono" style={{ 
              fontSize: '10px', 
              background: 'rgba(255,255,255,0.06)', 
              color: 'var(--text-secondary)', 
              padding: '1px 5px', 
              borderRadius: '3px',
              fontWeight: 700 
            }}>
              OPR_LEAD_ANALYST
            </span>

            {hoveredPill === 'operator' && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '6px',
                background: '#0D1117',
                border: '1px solid #252D38',
                borderRadius: '6px',
                padding: '6px 10px',
                fontSize: '11px',
                color: '#CBD5E1',
                whiteSpace: 'nowrap',
                zIndex: 200,
                boxShadow: '0 8px 24px rgba(0,0,0,0.7)'
              }}>
                Role: <strong>Lead Fraud Operations Analyst</strong>
              </div>
            )}
          </div>

          {/* 5. DESTRUCTIVE / RED SIGN OUT BUTTON */}
          <button
            onClick={onLogout}
            title="Lock Session & Sign Out"
            onMouseEnter={() => setHoveredPill('signout')}
            onMouseLeave={() => setHoveredPill(null)}
            style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 10px', 
              fontSize: '11px', 
              fontWeight: 700,
              color: '#F87171', 
              border: '1px solid rgba(239, 68, 68, 0.4)',
              background: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
              transform: hoveredPill === 'signout' ? 'translateY(-1px)' : 'translateY(0)'
            }}
          >
            <Lock size={11} />
            <span>Sign Out</span>
          </button>

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
        <div style={{ display: 'flex', gap: '0.25rem' }}>
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
                  borderBottom: isActive ? '2px solid #F97316' : '2px solid transparent',
                  color: isActive ? '#F8FAFC' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '13px',
                  padding: '0.65rem 0.9rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                  position: 'relative'
                }}
              >
                <Icon 
                  size={14} 
                  color={isActive ? '#F97316' : 'var(--text-muted)'} 
                  style={{ 
                    transition: 'transform 0.18s ease', 
                    transform: isActive ? 'scale(1.08)' : 'scale(1)',
                    filter: isActive ? 'drop-shadow(0 0 5px rgba(249,115,22,0.6))' : 'none'
                  }}
                />
                <span>{item.label}</span>
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '10%',
                    right: '10%',
                    height: '2px',
                    background: 'linear-gradient(90deg, #F97316 0%, #FB923C 100%)',
                    boxShadow: '0 0 8px #F97316'
                  }} />
                )}
              </button>
            );
          })}
        </div>

        {/* SECONDARY TABS */}
        <div style={{ display: 'flex', gap: '0.25rem' }}>
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
                  borderBottom: isActive ? '2px solid #F97316' : '2px solid transparent',
                  color: isActive ? '#F8FAFC' : 'var(--text-muted)',
                  fontWeight: isActive ? 700 : 500,
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
                <Icon size={13} color={isActive ? '#F97316' : 'var(--text-muted)'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
