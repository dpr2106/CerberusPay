import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
      background: 'rgba(8, 11, 17, 0.94)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.5)'
    }}>
      
      {/* TOP BAR: LOGO & SPRING STATUS PILLS */}
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
        
        {/* BRAND LOGO WITH PHYSICS SPRING HOVER */}
        <motion.div 
          style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', cursor: 'pointer' }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <motion.div 
            style={{
              position: 'relative',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #0284c7 0%, #1e1b4b 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(14, 165, 233, 0.5)',
              border: '1.5px solid rgba(56, 189, 248, 0.6)'
            }}
            whileHover={{ rotate: [0, -5, 5, 0] }}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ 
                fontSize: '1.05rem', 
                fontWeight: 900, 
                letterSpacing: '-0.02em', 
                color: '#ffffff',
                textShadow: '0 0 12px rgba(255,255,255,0.2)'
              }}>
                CERBERUS<span style={{ 
                  color: '#38bdf8', 
                  textShadow: '0 0 14px rgba(56, 189, 248, 0.7)' 
                }}>PAY</span>
              </span>
              <span style={{ 
                fontSize: '10px', 
                background: 'linear-gradient(135deg, rgba(14,165,233,0.25) 0%, rgba(99,102,241,0.25) 100%)', 
                color: '#7dd3fc', 
                padding: '2px 6px', 
                borderRadius: '4px', 
                fontWeight: 800,
                border: '1px solid rgba(56,189,248,0.4)',
                boxShadow: '0 0 10px rgba(14,165,233,0.25)'
              }}>
                SOC v3.1
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.03em' }}>
              Payment Risk & Fraud Defense Console
            </div>
          </div>
        </motion.div>

        {/* STATUS PILLS WITH SPRING PHYSICS */}
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
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.16) 0%, rgba(5, 150, 105, 0.25) 100%)',
              border: '1px solid rgba(52, 211, 153, 0.45)',
              padding: '5px 11px',
              borderRadius: '7px',
              boxShadow: '0 0 14px rgba(16, 185, 129, 0.25)',
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

          {/* 2. SUNFIRE SIMULATION MODE PILL */}
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
                ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.18) 0%, rgba(217, 119, 6, 0.28) 100%)'
                : 'linear-gradient(135deg, rgba(59, 130, 246, 0.18) 0%, rgba(37, 99, 235, 0.28) 100%)',
              border: `1px solid ${mode === 'SIMULATION' ? 'rgba(251, 191, 36, 0.55)' : 'rgba(96, 165, 250, 0.55)'}`,
              padding: '5px 11px',
              borderRadius: '7px',
              boxShadow: mode === 'SIMULATION' ? '0 0 14px rgba(245, 158, 11, 0.3)' : '0 0 14px rgba(59, 130, 246, 0.3)',
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

          {/* 3. RADAR STREAM PILL */}
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
                ? 'linear-gradient(135deg, rgba(14, 165, 233, 0.18) 0%, rgba(2, 132, 199, 0.28) 100%)' 
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.08) 100%)',
              border: `1px solid ${isStreamLive ? 'rgba(56, 189, 248, 0.55)' : 'var(--border-subtle)'}`,
              color: isStreamLive ? '#38bdf8' : 'var(--text-muted)',
              borderRadius: '7px',
              padding: '5px 11px',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: isStreamLive ? '0 0 14px rgba(14, 165, 233, 0.3)' : 'none'
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

          {/* 4. CHIEF RISK OFFICER OPERATOR PROFILE */}
          <motion.div 
            onMouseEnter={() => setHoveredPill('operator')}
            onMouseLeave={() => setHoveredPill(null)}
            whileHover={{ scale: 1.03 }}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(126, 34, 206, 0.25) 100%)',
              border: '1px solid rgba(192, 132, 252, 0.45)',
              padding: '4px 10px',
              borderRadius: '7px',
              fontSize: '11px',
              color: '#e9d5ff',
              boxShadow: '0 0 14px rgba(168, 85, 247, 0.25)'
            }}
          >
            <div style={{
              width: '18px',
              height: '18px',
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
              background: 'rgba(255,255,255,0.1)', 
              color: '#d8b4fe', 
              padding: '1px 5px', 
              borderRadius: '3px',
              fontWeight: 700 
            }}>
              OPR_LEAD_ANALYST
            </span>
          </motion.div>

          {/* 5. CRIMSON SIGN OUT BUTTON */}
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
              border: '1px solid rgba(248, 113, 113, 0.5)',
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.18) 0%, rgba(185, 28, 28, 0.28) 100%)',
              borderRadius: '7px',
              cursor: 'pointer',
              boxShadow: '0 0 12px rgba(239, 68, 68, 0.3)'
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
        
        {/* PRIMARY TABS WITH PHYSICAL SPRING GLIDE */}
        <div style={{ display: 'flex', gap: '0.35rem', position: 'relative' }}>
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
                  fontSize: '13px',
                  padding: '0.65rem 0.95rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  whiteSpace: 'nowrap',
                  position: 'relative'
                }}
              >
                <Icon 
                  size={15} 
                  color={isActive ? '#38bdf8' : 'var(--text-muted)'} 
                  style={{ 
                    filter: isActive ? 'drop-shadow(0 0 6px rgba(56,189,248,0.8))' : 'none'
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
                      background: 'linear-gradient(90deg, #38bdf8 0%, #3b82f6 100%)',
                      boxShadow: '0 0 10px #38bdf8',
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
                  padding: '0.65rem 0.75rem',
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
