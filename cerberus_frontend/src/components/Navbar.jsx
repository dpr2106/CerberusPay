import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Activity, Search, Layers, Cpu, FileText, 
  Server, User, Lock, Radio, Zap, Sparkles, AlertCircle, 
  CheckCircle2, RefreshCw, Power, Globe, Shield
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

  // 3 Core Focused Powerhouse Tabs
  const primaryTabs = [
    { id: 'monitor', label: 'Monitor', icon: Activity },
    { id: 'investigate', label: selectedTransaction ? `Investigate (${selectedTransaction.id})` : 'Investigate', icon: Search },
    { id: 'models', label: 'Models', icon: Cpu },
  ];

  const secondaryTabs = [
    { id: 'system', label: 'System', icon: Server },
  ];

  return (
    <header style={{
      borderBottom: '1px solid rgba(56, 189, 248, 0.2)',
      background: 'rgba(6, 9, 16, 0.95)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.7)'
    }}>
      
      {/* GLOWING LASER ACCENT LINE AT TOP OF SCREEN */}
      <div style={{
        height: '2px',
        width: '100%',
        background: 'linear-gradient(90deg, transparent 0%, #0284c7 25%, #38bdf8 50%, #818cf8 75%, transparent 100%)',
        boxShadow: '0 0 10px #38bdf8'
      }} />

      {/* TOP BAR: SINGLE UNIFIED ROW (NO LINE WRAPPING, PERFECT ALIGNMENT) */}
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0.65rem 1.25rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'nowrap',
        gap: '1rem'
      }}>
        
        {/* BRAND LOGO WITH LARGER FITTED EMBLEM */}
        <motion.div 
          style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', cursor: 'pointer', flexShrink: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          {/* LARGER PROMINENT LOGO BOX */}
          <motion.div 
            style={{
              position: 'relative',
              width: '42px',
              height: '42px',
              borderRadius: '11px',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 40%, #1e1b4b 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(14, 165, 233, 0.8), 0 0 50px rgba(56, 189, 248, 0.4), inset 0 0 15px rgba(56, 189, 248, 0.5)',
              border: '1.5px solid #38bdf8',
              flexShrink: 0
            }}
            whileHover={{ rotate: [0, -4, 4, 0] }}
            transition={{ duration: 0.4 }}
          >
            <img 
              src="/cerberuspay_logo.png" 
              alt="CerberusPay Logo" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: 'scale(1.18)'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <span style={{ 
                fontSize: '1.15rem', 
                fontWeight: 900, 
                letterSpacing: '-0.02em', 
                color: '#ffffff',
                textShadow: '0 0 18px rgba(255,255,255,0.45)'
              }}>
                CERBERUS<span style={{ 
                  background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 14px rgba(56, 189, 248, 0.9))',
                  fontWeight: 900
                }}>PAY</span>
              </span>
              <span style={{ 
                fontSize: '10px', 
                background: 'transparent', 
                color: '#7dd3fc', 
                padding: '2px 6px', 
                borderRadius: '4px', 
                fontWeight: 800,
                border: '1px solid rgba(56,189,248,0.7)',
                boxShadow: '0 0 10px rgba(14,165,233,0.35)'
              }}>
                SOC v3.1
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '0.02em', fontWeight: 600 }}>
              AI Payment Risk & Fraud Defense Sentinel
            </div>
          </div>
        </motion.div>

        {/* STATUS PILLS: SINGLE HORIZONTAL ROW WITH CRISP GHOST-NEON BORDERS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'nowrap', flexShrink: 0 }}>
          
          {/* 1. EMERALD SYSTEM ONLINE (GHOST) */}
          <motion.div 
            onMouseEnter={() => setHoveredPill('system')}
            onMouseLeave={() => setHoveredPill(null)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: 800,
              color: '#34d399',
              background: 'transparent',
              border: '1px solid #10b981',
              padding: '4px 9px',
              borderRadius: '6px',
              boxShadow: '0 0 12px rgba(16, 185, 129, 0.3)',
              cursor: 'default',
              whiteSpace: 'nowrap'
            }}
          >
            <div className="beacon-pulse-green" />
            <span>ONLINE</span>
            {hoveredPill === 'system' && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                style={{
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
                }}
              >
                ● ML Risk Engine & SQLite Operational • 99.99% Uptime
              </motion.div>
            )}
          </motion.div>

          {/* 2. LIVE GLOBAL PUBLIC MEMPOOL WEBSOCKET STATUS (GHOST) */}
          <motion.div 
            onMouseEnter={() => setHoveredPill('mempool')}
            onMouseLeave={() => setHoveredPill(null)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '11px',
              fontWeight: 800,
              color: '#38bdf8',
              background: 'transparent',
              border: '1px solid #38bdf8',
              padding: '4px 9px',
              borderRadius: '6px',
              boxShadow: '0 0 12px rgba(14, 165, 233, 0.35)',
              cursor: 'default',
              whiteSpace: 'nowrap'
            }}
          >
            <Globe size={11} className="animate-spin" style={{ animationDuration: '6s' }} />
            <span>LIVE WS</span>
            {hoveredPill === 'mempool' && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  background: '#0d1522',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  borderRadius: '7px',
                  padding: '7px 12px',
                  fontSize: '11px',
                  color: '#bae6fd',
                  whiteSpace: 'nowrap',
                  zIndex: 200,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.6)'
                }}
              >
                ● Connected to wss://ws.blockchain.info/inv • Streaming live global payments
              </motion.div>
            )}
          </motion.div>

          {/* 3. SUNFIRE SIMULATION MODE PILL (GHOST) */}
          <motion.div 
            onMouseEnter={() => setHoveredPill('mode')}
            onMouseLeave={() => setHoveredPill(null)}
            onClick={() => setMode(mode === 'SIMULATION' ? 'SANDBOX' : 'SIMULATION')}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '11px',
              fontWeight: 800,
              color: mode === 'SIMULATION' ? '#fbbf24' : '#60a5fa',
              background: 'transparent',
              border: `1px solid ${mode === 'SIMULATION' ? '#f59e0b' : '#3b82f6'}`,
              padding: '4px 9px',
              borderRadius: '6px',
              boxShadow: mode === 'SIMULATION' ? '0 0 12px rgba(245, 158, 11, 0.3)' : '0 0 12px rgba(59, 130, 246, 0.3)',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <Zap size={12} color={mode === 'SIMULATION' ? '#fbbf24' : '#60a5fa'} />
            <span>{mode}</span>
            {hoveredPill === 'mode' && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
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
                }}
              >
                ⚡ Click to toggle between Simulation & Sandbox traffic
              </motion.div>
            )}
          </motion.div>

          {/* 4. RADAR STREAM PILL (GHOST) */}
          <motion.button
            onMouseEnter={() => setHoveredPill('stream')}
            onMouseLeave={() => setHoveredPill(null)}
            onClick={() => setIsStreamLive(!isStreamLive)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            style={{
              position: 'relative',
              background: 'transparent',
              border: `1px solid ${isStreamLive ? '#38bdf8' : 'var(--border-subtle)'}`,
              color: isStreamLive ? '#38bdf8' : 'var(--text-muted)',
              borderRadius: '6px',
              padding: '4px 9px',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              boxShadow: isStreamLive ? '0 0 12px rgba(14, 165, 233, 0.3)' : 'none',
              whiteSpace: 'nowrap'
            }}
          >
            <Radio size={12} className={isStreamLive ? 'animate-pulse' : ''} />
            <span>{isStreamLive ? 'Stream: Live' : 'Stream: Paused'}</span>
            {hoveredPill === 'stream' && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  background: '#0d1522',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  borderRadius: '7px',
                  padding: '7px 12px',
                  fontSize: '11px',
                  color: '#bae6fd',
                  whiteSpace: 'nowrap',
                  zIndex: 200,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.6)'
                }}
              >
                {isStreamLive ? 'Ingesting live payment events • Click to pause' : 'Stream paused • Click to resume'}
              </motion.div>
            )}
          </motion.button>

          {/* 5. CHIEF RISK OFFICER OPERATOR PROFILE (GHOST) */}
          <motion.div 
            onMouseEnter={() => setHoveredPill('operator')}
            onMouseLeave={() => setHoveredPill(null)}
            whileHover={{ scale: 1.03 }}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'transparent',
              border: '1px solid #a855f7',
              padding: '4px 9px',
              borderRadius: '6px',
              fontSize: '11px',
              color: '#e9d5ff',
              boxShadow: '0 0 12px rgba(168, 85, 247, 0.25)',
              whiteSpace: 'nowrap'
            }}
          >
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 900,
              fontSize: '9px'
            }}>
              C
            </div>
            <span style={{ fontWeight: 800, color: '#fff' }}>CRO</span>
            <span className="mono" style={{ 
              fontSize: '9.5px', 
              color: '#d8b4fe', 
              fontWeight: 700 
            }}>
              OPR_LEAD
            </span>
          </motion.div>

          {/* 6. CRIMSON SIGN OUT BUTTON (GHOST) */}
          <motion.button
            onClick={onLogout}
            title="Lock Session & Sign Out"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 9px', 
              fontSize: '11px', 
              fontWeight: 800,
              color: '#f87171', 
              border: '1px solid #ef4444',
              background: 'transparent',
              borderRadius: '6px',
              cursor: 'pointer',
              boxShadow: '0 0 10px rgba(239, 68, 68, 0.25)',
              whiteSpace: 'nowrap'
            }}
          >
            <Lock size={11} />
            <span>Sign Out</span>
          </motion.button>

        </div>

      </div>

      {/* LOWER TAB NAVIGATION BAR WITH SPRING INERTIA INDICATOR */}
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0 1.25rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '1px solid var(--border-subtle)',
        overflowX: 'auto'
      }}>
        
        {/* PRIMARY FOCUSED 3 TABS WITH PHYSICAL SPRING GLIDE */}
        <div style={{ display: 'flex', gap: '0.5rem', position: 'relative' }}>
          {primaryTabs.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                whileHover={{ y: -1 }}
                whileTap={{ y: 0 }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  fontWeight: isActive ? 800 : 500,
                  fontSize: '13.5px',
                  padding: '0.75rem 1.1rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap',
                  position: 'relative'
                }}
              >
                <Icon 
                  size={16} 
                  color={isActive ? '#38bdf8' : 'var(--text-muted)'} 
                  style={{ 
                    filter: isActive ? 'drop-shadow(0 0 8px rgba(56,189,248,0.9))' : 'none'
                  }}
                />
                <span>{item.label}</span>

                {/* SHARED SPRING PHYSICS UNDERLINE */}
                {isActive && (
                  <motion.div 
                    layoutId="activeTabUnderline"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: '8%',
                      right: '8%',
                      height: '2.5px',
                      background: 'linear-gradient(90deg, #38bdf8 0%, #818cf8 100%)',
                      boxShadow: '0 0 12px #38bdf8',
                      borderRadius: '2px'
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* SECONDARY TABS */}
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          {secondaryTabs.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                whileHover={{ y: -1 }}
                whileTap={{ y: 0 }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isActive ? '#fff' : 'var(--text-muted)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '12px',
                  padding: '0.75rem 0.85rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  whiteSpace: 'nowrap',
                  position: 'relative'
                }}
              >
                <Icon size={14} color={isActive ? '#38bdf8' : 'var(--text-muted)'} />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeSecondaryTabUnderline"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: '10%',
                      right: '10%',
                      height: '2px',
                      background: '#38bdf8',
                      boxShadow: '0 0 8px #38bdf8'
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
