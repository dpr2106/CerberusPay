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
      background: 'rgba(8, 10, 14, 0.96)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 4px 24px -2px rgba(0, 0, 0, 0.8)'
    }}>
      
      {/* TOP BAR: GOLD LOGO & INTERACTIVE STATUS PILLS */}
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
        
        {/* GOLD CERBERUSPAY LOGO & BRAND */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            position: 'relative',
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #eab308 0%, #78350f 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 18px rgba(234, 179, 8, 0.55)',
            border: '1.5px solid rgba(250, 204, 21, 0.65)',
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
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
                color: '#ffffff',
                textShadow: '0 0 12px rgba(255,255,255,0.2)'
              }}>
                CERBERUS<span style={{ 
                  color: '#facc15', 
                  textShadow: '0 0 14px rgba(250, 204, 21, 0.7)' 
                }}>PAY</span>
              </span>
              <span style={{ 
                fontSize: '10px', 
                background: 'linear-gradient(135deg, rgba(234,179,8,0.25) 0%, rgba(202,138,4,0.25) 100%)', 
                color: '#fef08a', 
                padding: '2px 6px', 
                borderRadius: '4px', 
                fontWeight: 800,
                border: '1px solid rgba(250,204,21,0.4)',
                boxShadow: '0 0 10px rgba(234,179,8,0.25)'
              }}>
                SOC v3.1
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.03em' }}>
              Payment Risk & Fraud Defense Console
            </div>
          </div>
        </div>

        {/* STATUS PILLS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          
          {/* 1. EMERALD SYSTEM ONLINE PILL */}
          <div 
            onMouseEnter={() => setHoveredPill('system')}
            onMouseLeave={() => setHoveredPill(null)}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              fontSize: '11px',
              fontWeight: 800,
              color: '#34d399',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.16) 0%, rgba(5, 150, 105, 0.25) 100%)',
              border: '1px solid rgba(52, 211, 153, 0.45)',
              padding: '5px 11px',
              borderRadius: '7px',
              boxShadow: '0 0 14px rgba(16, 185, 129, 0.25)',
              cursor: 'default',
              transition: 'all 0.2s ease'
            }}
          >
            <div className="beacon-pulse-green" />
            <span>SYSTEM ONLINE</span>
            {hoveredPill === 'system' && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                background: '#0d1522',
                border: '1px solid rgba(52, 211, 153, 0.4)',
                borderRadius: '7px',
                padding: '7px 12px',
                fontSize: '11px',
                color: '#a7f3d0',
                whiteSpace: 'nowrap',
                zIndex: 200,
                boxShadow: '0 10px 25px rgba(0,0,0,0.6)'
              }}>
                ● ML Risk Engine & SQLite Operational • 99.99% Uptime
              </div>
            )}
          </div>

          {/* 2. GOLDEN SUNFIRE SIMULATION MODE PILL */}
          <div 
            onMouseEnter={() => setHoveredPill('mode')}
            onMouseLeave={() => setHoveredPill(null)}
            onClick={() => setMode(mode === 'SIMULATION' ? 'SANDBOX' : 'SIMULATION')}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: 800,
              color: mode === 'SIMULATION' ? '#fbbf24' : '#eab308',
              background: mode === 'SIMULATION' 
                ? 'linear-gradient(135deg, rgba(234, 179, 8, 0.18) 0%, rgba(202, 138, 4, 0.28) 100%)'
                : 'linear-gradient(135deg, rgba(250, 204, 21, 0.18) 0%, rgba(234, 179, 8, 0.28) 100%)',
              border: `1px solid ${mode === 'SIMULATION' ? 'rgba(250, 204, 21, 0.55)' : 'rgba(234, 179, 8, 0.55)'}`,
              padding: '5px 11px',
              borderRadius: '7px',
              boxShadow: '0 0 14px rgba(234, 179, 8, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: hoveredPill === 'mode' ? 'translateY(-1.5px)' : 'translateY(0)'
            }}
          >
            <Zap size={13} color={mode === 'SIMULATION' ? '#fbbf24' : '#facc15'} />
            <span>{mode} MODE</span>
            {hoveredPill === 'mode' && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                background: '#0d1522',
                border: '1px solid rgba(251, 191, 36, 0.4)',
                borderRadius: '7px',
                padding: '7px 12px',
                fontSize: '11px',
                color: '#fde68a',
                whiteSpace: 'nowrap',
                zIndex: 200,
                boxShadow: '0 10px 25px rgba(0,0,0,0.6)'
              }}>
                ⚡ Click to toggle between Simulation & Sandbox traffic
              </div>
            )}
          </div>

          {/* 3. GOLDEN RADAR STREAM PILL */}
          <button
            onMouseEnter={() => setHoveredPill('stream')}
            onMouseLeave={() => setHoveredPill(null)}
            onClick={() => setIsStreamLive(!isStreamLive)}
            style={{
              position: 'relative',
              background: isStreamLive 
                ? 'linear-gradient(135deg, rgba(234, 179, 8, 0.18) 0%, rgba(202, 138, 4, 0.28) 100%)' 
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.08) 100%)',
              border: `1px solid ${isStreamLive ? 'rgba(250, 204, 21, 0.55)' : 'var(--border-subtle)'}`,
              color: isStreamLive ? '#facc15' : 'var(--text-muted)',
              borderRadius: '7px',
              padding: '5px 11px',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: isStreamLive ? '0 0 14px rgba(234, 179, 8, 0.3)' : 'none',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: hoveredPill === 'stream' ? 'translateY(-1.5px)' : 'translateY(0)'
            }}
          >
            <Radio size={13} className={isStreamLive ? 'animate-pulse' : ''} />
            <span>{isStreamLive ? 'Stream: Live' : 'Stream: Paused'}</span>
            {hoveredPill === 'stream' && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                background: '#0d1522',
                border: '1px solid rgba(250, 204, 21, 0.4)',
                borderRadius: '7px',
                padding: '7px 12px',
                fontSize: '11px',
                color: '#fef08a',
                whiteSpace: 'nowrap',
                zIndex: 200,
                boxShadow: '0 10px 25px rgba(0,0,0,0.6)'
              }}>
                {isStreamLive ? 'Ingesting live payment events • Click to pause' : 'Stream paused • Click to resume'}
              </div>
            )}
          </button>

          {/* 4. CHIEF RISK OFFICER OPERATOR PROFILE BADGE */}
          <div 
            onMouseEnter={() => setHoveredPill('operator')}
            onMouseLeave={() => setHoveredPill(null)}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.15) 0%, rgba(120, 53, 15, 0.25) 100%)',
              border: '1px solid rgba(250, 204, 21, 0.45)',
              padding: '4px 10px',
              borderRadius: '7px',
              fontSize: '11px',
              color: '#fef08a',
              boxShadow: '0 0 14px rgba(234, 179, 8, 0.25)',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #facc15 0%, #ca8a04 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000',
              fontWeight: 900,
              fontSize: '10px'
            }}>
              C
            </div>
            <span style={{ fontWeight: 800, color: '#fff' }}>Chief Risk Officer</span>
            <span className="mono" style={{ 
              fontSize: '10px', 
              background: 'rgba(255,255,255,0.1)', 
              color: '#fef08a', 
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
                marginTop: '8px',
                background: '#0d1522',
                border: '1px solid rgba(250, 204, 21, 0.4)',
                borderRadius: '7px',
                padding: '7px 12px',
                fontSize: '11px',
                color: '#fef08a',
                whiteSpace: 'nowrap',
                zIndex: 200,
                boxShadow: '0 10px 25px rgba(0,0,0,0.6)'
              }}>
                Role: <strong>Lead Fraud Operations Analyst</strong>
              </div>
            )}
          </div>

          {/* 5. CRIMSON SIGN OUT BUTTON */}
          <button
            onClick={onLogout}
            title="Lock Session & Sign Out"
            onMouseEnter={() => setHoveredPill('signout')}
            onMouseLeave={() => setHoveredPill(null)}
            style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px', 
              fontSize: '11px', 
              fontWeight: 800,
              color: '#fca5a5', 
              border: '1px solid rgba(248, 113, 113, 0.5)',
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.18) 0%, rgba(185, 28, 28, 0.28) 100%)',
              borderRadius: '7px',
              cursor: 'pointer',
              boxShadow: '0 0 12px rgba(239, 68, 68, 0.3)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: hoveredPill === 'signout' ? 'translateY(-1.5px)' : 'translateY(0)'
            }}
          >
            <Lock size={12} />
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
                  borderBottom: isActive ? '2px solid #facc15' : '2px solid transparent',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  fontWeight: isActive ? 800 : 500,
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
                  color={isActive ? '#facc15' : 'var(--text-muted)'} 
                  style={{ 
                    transition: 'transform 0.2s ease', 
                    transform: isActive ? 'scale(1.1)' : 'scale(1)',
                    filter: isActive ? 'drop-shadow(0 0 6px rgba(250,204,21,0.8))' : 'none'
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
                    background: 'linear-gradient(90deg, #facc15 0%, #eab308 100%)',
                    boxShadow: '0 0 10px #facc15'
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
                <Icon size={14} color={isActive ? '#facc15' : 'var(--text-muted)'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
