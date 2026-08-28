import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Activity, Search, Layers, Cpu, FileText, 
  Server, User, Lock, Radio, Zap, Sparkles, AlertCircle, 
  CheckCircle2, RefreshCw, Power, Globe
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
      background: 'rgba(6, 9, 16, 0.92)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.6)'
    }}>
      
      {/* TOP BAR: LOGO & SPRING STATUS PILLS */}
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
        
        {/* BRAND LOGO WITH ELECTRIC NEON CYBER BLOOM */}
        <motion.div 
          style={{ display: 'flex', alignItems: 'center', gap: '0.95rem', cursor: 'pointer' }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
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
              boxShadow: '0 0 25px rgba(14, 165, 233, 0.75), 0 0 50px rgba(56, 189, 248, 0.35), inset 0 0 15px rgba(56, 189, 248, 0.4)',
              border: '1.5px solid #38bdf8'
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
                objectFit: 'cover'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </motion.div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <span style={{ 
                fontSize: '1.15rem', 
                fontWeight: 900, 
                letterSpacing: '-0.02em', 
                color: '#ffffff',
                textShadow: '0 0 16px rgba(255,255,255,0.45)'
              }}>
                CERBERUS<span style={{ 
                  background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 12px rgba(56, 189, 248, 0.85))',
                  fontWeight: 900
                }}>PAY</span>
              </span>
              <span style={{ 
                fontSize: '10px', 
                background: 'linear-gradient(135deg, rgba(14,165,233,0.3) 0%, rgba(99,102,241,0.3) 100%)', 
                color: '#7dd3fc', 
                padding: '2px 7px', 
                borderRadius: '4px', 
                fontWeight: 800,
                border: '1px solid rgba(56,189,248,0.6)',
                boxShadow: '0 0 12px rgba(14,165,233,0.4)'
              }}>
                SOC v3.1
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '0.03em', fontWeight: 500 }}>
              AI Payment Risk & Fraud Defense Sentinel
            </div>
          </div>
        </motion.div>

        {/* STATUS PILLS WITH SPRING PHYSICS & NEON CONTRAST */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          
          {/* 1. EMERALD SYSTEM ONLINE PILL */}
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
              gap: '7px',
              fontSize: '11px',
              fontWeight: 800,
              color: '#34d399',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.3) 100%)',
              border: '1px solid rgba(52, 211, 153, 0.55)',
              padding: '5px 12px',
              borderRadius: '7px',
              boxShadow: '0 0 18px rgba(16, 185, 129, 0.35)',
              cursor: 'default'
            }}
          >
            <div className="beacon-pulse-green" />
            <span>SYSTEM ONLINE</span>
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

          {/* 2. LIVE GLOBAL PUBLIC MEMPOOL WEBSOCKET STATUS */}
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
              gap: '6px',
              fontSize: '11px',
              fontWeight: 800,
              color: '#38bdf8',
              background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.2) 0%, rgba(2, 132, 199, 0.3) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.65)',
              padding: '5px 12px',
              borderRadius: '7px',
              boxShadow: '0 0 18px rgba(14, 165, 233, 0.4)',
              cursor: 'default'
            }}
          >
            <Globe size={12} className="animate-spin" style={{ animationDuration: '6s' }} />
            <span>LIVE WS: MEMPOOL</span>
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

          {/* 3. SUNFIRE SIMULATION MODE PILL */}
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
              gap: '6px',
              fontSize: '11px',
              fontWeight: 800,
              color: mode === 'SIMULATION' ? '#fbbf24' : '#60a5fa',
              background: mode === 'SIMULATION' 
                ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.22) 0%, rgba(217, 119, 6, 0.32) 100%)'
                : 'linear-gradient(135deg, rgba(59, 130, 246, 0.22) 0%, rgba(37, 99, 235, 0.32) 100%)',
              border: `1px solid ${mode === 'SIMULATION' ? 'rgba(251, 191, 36, 0.65)' : 'rgba(96, 165, 250, 0.65)'}`,
              padding: '5px 12px',
              borderRadius: '7px',
              boxShadow: mode === 'SIMULATION' ? '0 0 18px rgba(245, 158, 11, 0.4)' : '0 0 18px rgba(59, 130, 246, 0.4)',
              cursor: 'pointer'
            }}
          >
            <Zap size={13} color={mode === 'SIMULATION' ? '#fbbf24' : '#60a5fa'} />
            <span>{mode} MODE</span>
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

          {/* 4. RADAR STREAM PILL */}
          <motion.button
            onMouseEnter={() => setHoveredPill('stream')}
            onMouseLeave={() => setHoveredPill(null)}
            onClick={() => setIsStreamLive(!isStreamLive)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            style={{
              position: 'relative',
              background: isStreamLive 
                ? 'linear-gradient(135deg, rgba(14, 165, 233, 0.22) 0%, rgba(2, 132, 199, 0.32) 100%)' 
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.08) 100%)',
              border: `1px solid ${isStreamLive ? 'rgba(56, 189, 248, 0.65)' : 'var(--border-subtle)'}`,
              color: isStreamLive ? '#38bdf8' : 'var(--text-muted)',
              borderRadius: '7px',
              padding: '5px 12px',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: isStreamLive ? '0 0 18px rgba(14, 165, 233, 0.4)' : 'none'
            }}
          >
            <Radio size={13} className={isStreamLive ? 'animate-pulse' : ''} />
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

          {/* 5. CHIEF RISK OFFICER OPERATOR PROFILE */}
          <motion.div 
            onMouseEnter={() => setHoveredPill('operator')}
            onMouseLeave={() => setHoveredPill(null)}
            whileHover={{ scale: 1.03 }}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(126, 34, 206, 0.3) 100%)',
              border: '1px solid rgba(192, 132, 252, 0.55)',
              padding: '4px 11px',
              borderRadius: '7px',
              fontSize: '11px',
              color: '#e9d5ff',
              boxShadow: '0 0 18px rgba(168, 85, 247, 0.35)'
            }}
          >
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 900,
              fontSize: '10px'
            }}>
              C
            </div>
            <span style={{ fontWeight: 800, color: '#fff' }}>Chief Risk Officer</span>
            <span className="mono" style={{ 
              fontSize: '10px', 
              background: 'rgba(255,255,255,0.12)', 
              color: '#d8b4fe', 
              padding: '1px 5px', 
              borderRadius: '3px',
              fontWeight: 700 
            }}>
              OPR_LEAD_ANALYST
            </span>
          </motion.div>

          {/* 6. CRIMSON SIGN OUT BUTTON */}
          <motion.button
            onClick={onLogout}
            title="Lock Session & Sign Out"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px', 
              fontSize: '11px', 
              fontWeight: 800,
              color: '#fca5a5', 
              border: '1px solid rgba(248, 113, 113, 0.55)',
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(185, 28, 28, 0.3) 100%)',
              borderRadius: '7px',
              cursor: 'pointer',
              boxShadow: '0 0 16px rgba(239, 68, 68, 0.35)'
            }}
          >
            <Lock size={12} />
            <span>Sign Out</span>
          </motion.button>

        </div>

      </div>

      {/* LOWER TAB NAVIGATION BAR WITH SPRING INERTIA INDICATOR */}
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
