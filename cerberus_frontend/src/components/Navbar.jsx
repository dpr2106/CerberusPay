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
      borderBottom: '1px solid #26344A',
      background: '#0B1220',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
    }}>
      
      {/* TOP HEADER ROW */}
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0.65rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        
        {/* ENTERPRISE BRAND MARK */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '6px',
            overflow: 'hidden',
            background: '#111A2B',
            border: '1px solid #26344A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{ 
                fontSize: '1rem', 
                fontWeight: 800, 
                letterSpacing: '-0.01em', 
                color: '#F8FAFC'
              }}>
                CERBERUS<span style={{ color: '#FF7A18' }}>PAY</span>
              </span>
              <span style={{ 
                fontSize: '10px', 
                background: '#162033', 
                color: '#94A3B8', 
                padding: '1px 5px', 
                borderRadius: '3px', 
                fontWeight: 600,
                border: '1px solid #26344A'
              }}>
                v3.1 SOC
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#94A3B8' }}>
              Payment Risk & Fraud Defense Console
            </div>
          </div>
        </div>

        {/* COMPACT ENTERPRISE CONTROLS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          
          {/* SYSTEM ONLINE */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: 600,
              color: '#19C37D',
              background: '#111A2B',
              border: '1px solid #26344A',
              padding: '4px 9px',
              borderRadius: '5px'
            }}
          >
            <div className="beacon-pulse-green" />
            <span>SYSTEM ONLINE</span>
          </div>

          {/* SIMULATION / SANDBOX MODE */}
          <button
            onClick={() => setMode(mode === 'SIMULATION' ? 'SANDBOX' : 'SIMULATION')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '11px',
              fontWeight: 600,
              color: mode === 'SIMULATION' ? '#F59E0B' : '#94A3B8',
              background: '#111A2B',
              border: '1px solid #26344A',
              padding: '4px 9px',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background 0.15s ease'
            }}
            title="Toggle between Simulation and Sandbox mode"
          >
            <Zap size={12} color={mode === 'SIMULATION' ? '#F59E0B' : '#64748B'} />
            <span>{mode} MODE</span>
          </button>

          {/* LIVE STREAM TOGGLE */}
          <button
            onClick={() => setIsStreamLive(!isStreamLive)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '11px',
              fontWeight: 600,
              color: isStreamLive ? '#F8FAFC' : '#64748B',
              background: isStreamLive ? '#162033' : '#111A2B',
              border: '1px solid #26344A',
              padding: '4px 9px',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background 0.15s ease'
            }}
          >
            <Radio size={12} color={isStreamLive ? '#19C37D' : '#64748B'} />
            <span>{isStreamLive ? 'Stream: Live' : 'Stream: Paused'}</span>
          </button>

          {/* OPERATOR ROLE BADGE */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#111A2B',
              border: '1px solid #26344A',
              padding: '3px 8px',
              borderRadius: '5px',
              fontSize: '11px',
              color: '#F8FAFC'
            }}
          >
            <span style={{ fontWeight: 600 }}>Chief Risk Officer</span>
            <span className="mono" style={{ 
              fontSize: '10px', 
              background: '#162033', 
              color: '#94A3B8', 
              padding: '1px 4px', 
              borderRadius: '3px'
            }}>
              OPR_LEAD
            </span>
          </div>

          {/* SIGN OUT BUTTON */}
          <button
            onClick={onLogout}
            title="Lock Session & Sign Out"
            style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 9px', 
              fontSize: '11px', 
              fontWeight: 600,
              color: '#FF4D5A', 
              border: '1px solid rgba(255, 77, 90, 0.35)',
              background: '#111A2B',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background 0.15s ease'
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
        borderTop: '1px solid #26344A',
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
                  borderBottom: isActive ? '2px solid #FF7A18' : '2px solid transparent',
                  color: isActive ? '#F8FAFC' : '#94A3B8',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '13px',
                  padding: '0.65rem 0.85rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.15s ease'
                }}
              >
                <Icon 
                  size={14} 
                  color={isActive ? '#FF7A18' : '#64748B'} 
                />
                <span>{item.label}</span>
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
                  borderBottom: isActive ? '2px solid #FF7A18' : '2px solid transparent',
                  color: isActive ? '#F8FAFC' : '#64748B',
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
                <Icon size={13} color={isActive ? '#FF7A18' : '#64748B'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
