import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ArrowUpRight, ShieldAlert, ShieldCheck, AlertTriangle, 
  X, TrendingUp, TrendingDown, ArrowRight, Activity, Clock, User, Shield, Radio
} from 'lucide-react';

export default function MonitorView({ transactions, mode, onSelectTransaction }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDecision, setFilterDecision] = useState('ALL');
  const [hoveredTx, setHoveredTx] = useState(null);
  const [popoverPos, setPopoverPos] = useState({ x: 0, y: 0 });

  const totalCount = Math.max(transactions.length, 1);
  const blockedList = transactions.filter(t => t.action === 'BLOCK');
  const reviewList = transactions.filter(t => t.action === 'CHALLENGE_STEP_UP_OTP');
  const allowedList = transactions.filter(t => t.action === 'ALLOW');

  const blockedSum = blockedList.reduce((acc, t) => acc + (t.amount || 0), 0);
  const reviewSum = reviewList.reduce((acc, t) => acc + (t.amount || 0), 0);
  const allowedSum = allowedList.reduce((acc, t) => acc + (t.amount || 0), 0);

  const blockedPct = ((blockedList.length / totalCount) * 100).toFixed(1);
  const reviewPct = ((reviewList.length / totalCount) * 100).toFixed(1);
  const allowedPct = ((allowedList.length / totalCount) * 100).toFixed(1);

  const filtered = transactions.filter(tx => {
    const s = searchTerm.toLowerCase();
    const matchSearch = !searchTerm || tx.id.toLowerCase().includes(s) || tx.user_id.toLowerCase().includes(s);
    const matchDecision = filterDecision === 'ALL' || 
      (filterDecision === 'BLOCKED' && tx.action === 'BLOCK') ||
      (filterDecision === 'REVIEW' && tx.action === 'CHALLENGE_STEP_UP_OTP') ||
      (filterDecision === 'ALLOWED' && tx.action === 'ALLOW');
    return matchSearch && matchDecision;
  });

  const getRiskBadge = (level) => {
    switch (level) {
      case 'CRITICAL': 
        return <span className="badge-blocked" style={{ background: 'rgba(239,68,68,0.18)', color: '#fca5a5' }}><ShieldAlert size={11} /> CRITICAL</span>;
      case 'HIGH': 
        return <span className="badge-blocked"><ShieldAlert size={11} /> HIGH</span>;
      case 'MEDIUM': 
        return <span className="badge-review"><AlertTriangle size={11} /> MEDIUM</span>;
      default: 
        return <span className="badge-allowed"><ShieldCheck size={11} /> LOW</span>;
    }
  };

  const getActionBadge = (action) => {
    switch (action) {
      case 'BLOCK': 
        return <span className="badge-blocked"><ShieldAlert size={11} /> BLOCKED</span>;
      case 'CHALLENGE_STEP_UP_OTP': 
        return <span className="badge-review"><AlertTriangle size={11} /> REVIEW 3DS</span>;
      default: 
        return <span className="badge-allowed"><ShieldCheck size={11} /> ALLOWED</span>;
    }
  };

  const handleRowMouseMove = (e, tx) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPopoverPos({ x: e.clientX, y: rect.top });
    setHoveredTx(tx);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* 1. PHYSICS SPRING-ENABLED SUMMARY CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        
        {/* BLOCKED CARD */}
        <motion.div 
          className="fintech-card fintech-card-interactive card-glow-red"
          onClick={() => setFilterDecision(filterDecision === 'BLOCKED' ? 'ALL' : 'BLOCKED')}
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          style={{ 
            padding: '1.25rem', 
            borderLeft: '4px solid #ef4444',
            background: filterDecision === 'BLOCKED' ? 'rgba(239, 68, 68, 0.12)' : 'var(--bg-card)',
            boxShadow: filterDecision === 'BLOCKED' ? 'var(--shadow-glow-red)' : 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '140px'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11px', color: '#f87171', fontWeight: 800, letterSpacing: '0.04em' }}>
                  BLOCKED THREATS
                </span>
                <span style={{ fontSize: '10px', background: 'rgba(239,68,68,0.15)', color: '#fca5a5', padding: '1px 5px', borderRadius: '3px', fontWeight: 700 }}>
                  {blockedPct}%
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#f87171', fontWeight: 700 }}>
                ₹{blockedSum.toLocaleString('en-IN')}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                {blockedList.length}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                intercepted
              </span>
            </div>

            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.35 }}>
              Stopped by ML risk engine & security rules
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '11px', color: 'var(--text-secondary)' }}>
            <span>Interception rate</span>
            <span style={{ color: '#f87171', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
              <TrendingUp size={12} /> High protection
            </span>
          </div>
        </motion.div>

        {/* REVIEW (3DS) CARD */}
        <motion.div 
          className="fintech-card fintech-card-interactive card-glow-amber"
          onClick={() => setFilterDecision(filterDecision === 'REVIEW' ? 'ALL' : 'REVIEW')}
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          style={{ 
            padding: '1.25rem', 
            borderLeft: '4px solid #f59e0b',
            background: filterDecision === 'REVIEW' ? 'rgba(245, 158, 11, 0.12)' : 'var(--bg-card)',
            boxShadow: filterDecision === 'REVIEW' ? 'var(--shadow-glow-amber)' : 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '140px'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 800, letterSpacing: '0.04em' }}>
                  REVIEW (3DS STEP-UP)
                </span>
                <span style={{ fontSize: '10px', background: 'rgba(245,158,11,0.15)', color: '#fde68a', padding: '1px 5px', borderRadius: '3px', fontWeight: 700 }}>
                  {reviewPct}%
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#fbbf24', fontWeight: 700 }}>
                ₹{reviewSum.toLocaleString('en-IN')}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                {reviewList.length}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                challenges
              </span>
            </div>

            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.35 }}>
              Multi-factor / 3DS challenge review active
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '11px', color: 'var(--text-secondary)' }}>
            <span>Friction control</span>
            <span style={{ color: '#fbbf24', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Activity size={12} /> Step-up OTP active
            </span>
          </div>
        </motion.div>

        {/* ALLOWED CARD */}
        <motion.div 
          className="fintech-card fintech-card-interactive card-glow-green"
          onClick={() => setFilterDecision(filterDecision === 'ALLOWED' ? 'ALL' : 'ALLOWED')}
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          style={{ 
            padding: '1.25rem', 
            borderLeft: '4px solid #10b981',
            background: filterDecision === 'ALLOWED' ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-card)',
            boxShadow: filterDecision === 'ALLOWED' ? 'var(--shadow-glow-green)' : 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '140px'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11px', color: '#34d399', fontWeight: 800, letterSpacing: '0.04em' }}>
                  ALLOWED PAYMENTS
                </span>
                <span style={{ fontSize: '10px', background: 'rgba(16,185,129,0.15)', color: '#a7f3d0', padding: '1px 5px', borderRadius: '3px', fontWeight: 700 }}>
                  {allowedPct}%
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#34d399', fontWeight: 700 }}>
                ₹{allowedSum.toLocaleString('en-IN')}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                {allowedList.length}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                authentic
              </span>
            </div>

            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.35 }}>
              Authentic checkouts passed all risk checks
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '11px', color: 'var(--text-secondary)' }}>
            <span>Approval velocity</span>
            <span style={{ color: '#34d399', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
              <TrendingDown size={12} /> Frictionless checkout
            </span>
          </div>
        </motion.div>

      </div>

      {/* 2. LIVE PAYMENT ACTIVITY TABLE WITH PHYSICAL SPRING INGESTION */}
      <div className="fintech-card" style={{ padding: '0', overflow: 'hidden' }}>
        
        {/* HEADER & SEARCH BAR */}
        <div style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.85rem',
          background: 'rgba(13, 18, 29, 0.5)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '14.5px', fontWeight: 800, color: '#fff' }}>Live Payment Activity</h3>
              <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>({filtered.length} shown)</span>
              
              {/* REAL-WORLD BANK BENCHMARK STREAM BADGE */}
              <span style={{
                fontSize: '10.5px',
                background: 'rgba(56, 189, 248, 0.12)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                padding: '2px 8px',
                borderRadius: '4px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <Radio size={11} className="animate-pulse" />
                <span>Live Feed: Public Global Mempool WebSocket (wss://ws.blockchain.info)</span>
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Select any suspicious transaction row to open the complete investigation dossier
            </p>
          </div>

          {/* SEARCH & FILTERS */}
          <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', flexWrap: 'wrap' }}>
            
            {/* SEARCH INPUT */}
            <div style={{ position: 'relative', width: '240px' }}>
              <Search 
                size={14} 
                color="var(--text-muted)" 
                style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} 
              />
              <input
                type="text"
                placeholder="Search Txn ID or User..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  borderRadius: '7px',
                  padding: '6px 28px 6px 30px',
                  fontSize: '12px',
                  outline: 'none',
                  transition: 'all 0.18s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent)';
                  e.target.style.boxShadow = 'var(--shadow-glow-blue)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-subtle)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* FILTER CLEAR BUTTON */}
            {filterDecision !== 'ALL' && (
              <motion.button 
                onClick={() => setFilterDecision('ALL')}
                className="btn-secondary-fintech"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{ padding: '5px 10px', fontSize: '11px', gap: '4px' }}
              >
                <X size={12} />
                <span>Filter: {filterDecision}</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* SOC ACTIVITY TABLE WITH SPRING INSERTION ROWS */}
        <div className="custom-scrollbar" style={{ overflowX: 'auto', maxHeight: '640px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', background: 'var(--bg-secondary)' }}>
                <th style={{ padding: '10px 14px', fontWeight: 700, fontSize: '11px', letterSpacing: '0.04em' }}>TRANSACTION & USER</th>
                <th style={{ padding: '10px 14px', fontWeight: 700, fontSize: '11px', letterSpacing: '0.04em' }}>AMOUNT</th>
                <th style={{ padding: '10px 14px', fontWeight: 700, fontSize: '11px', letterSpacing: '0.04em' }}>RISK LEVEL</th>
                <th style={{ padding: '10px 14px', fontWeight: 700, fontSize: '11px', letterSpacing: '0.04em' }}>DECISION</th>
                <th style={{ padding: '10px 14px', fontWeight: 700, fontSize: '11px', letterSpacing: '0.04em' }}>PRIMARY DETECTION SIGNAL</th>
                <th style={{ padding: '10px 14px', fontWeight: 700, fontSize: '11px', letterSpacing: '0.04em' }}>TIMESTAMP</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx) => {
                const isThreat = tx.action === 'BLOCK';
                const isReview = tx.action === 'CHALLENGE_STEP_UP_OTP';
                const statusBorderColor = isThreat ? '#ef4444' : (isReview ? '#f59e0b' : '#10b981');

                return (
                  <tr
                    key={tx.id}
                    onClick={() => onSelectTransaction(tx)}
                    onMouseEnter={(e) => handleRowMouseMove(e, tx)}
                    onMouseLeave={() => setHoveredTx(null)}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      borderLeft: `3px solid ${statusBorderColor}`,
                      cursor: 'pointer',
                      transition: 'background 0.15s ease',
                      background: isThreat ? 'rgba(239, 68, 68, 0.02)' : 'transparent'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = isThreat ? 'rgba(239, 68, 68, 0.08)' : 'var(--bg-hover)'}
                    onMouseOut={(e) => e.currentTarget.style.background = isThreat ? 'rgba(239, 68, 68, 0.02)' : 'transparent'}
                  >
                    <td style={{ padding: '11px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="mono" style={{ fontWeight: 700, color: '#fff' }}>{tx.id}</span>
                        <span className="badge-source">{tx.source || 'BANK_FEED'}</span>
                      </div>
                      <div className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {tx.user_id} {tx.card?.issuer ? `• ${tx.card.issuer}` : (tx.vpa ? `• ${tx.vpa.split('@')[1]}` : '')}
                      </div>
                    </td>

                    <td style={{ padding: '11px 14px', fontWeight: 800, color: isThreat ? '#f87171' : '#fff' }}>
                      ₹{tx.amount?.toLocaleString('en-IN')}
                    </td>

                    <td style={{ padding: '11px 14px' }}>
                      {getRiskBadge(tx.risk_level)}
                    </td>

                    <td style={{ padding: '11px 14px' }}>
                      {getActionBadge(tx.action)}
                    </td>

                    <td style={{ padding: '11px 14px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                      {tx.decision_rationale ? tx.decision_rationale.slice(0, 80) + '...' : 'Standard parameters verified'}
                    </td>

                    <td style={{ padding: '11px 14px', color: 'var(--text-muted)', fontSize: '12px' }}>
                      {new Date(tx.timestamp).toLocaleTimeString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* FLOATING HOVER DETAILS POPOVER */}
      {hoveredTx && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          style={{
            position: 'fixed',
            top: Math.max(popoverPos.y - 120, 20),
            left: Math.min(popoverPos.x + 20, window.innerWidth - 360),
            width: '320px',
            background: 'rgba(18, 23, 34, 0.95)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${hoveredTx.action === 'BLOCK' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(59, 130, 246, 0.4)'}`,
            borderRadius: '8px',
            padding: '10px 14px',
            zIndex: 1000,
            boxShadow: '0 10px 30px -5px rgba(0,0,0,0.7)',
            pointerEvents: 'none'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span className="mono" style={{ fontWeight: 800, color: '#fff', fontSize: '13px' }}>{hoveredTx.id}</span>
            {getActionBadge(hoveredTx.action)}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>
            Account: <strong style={{ color: '#fff' }}>{hoveredTx.user_id}</strong> • Amount: <strong style={{ color: '#f87171' }}>₹{hoveredTx.amount?.toLocaleString('en-IN')}</strong>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            {hoveredTx.decision_rationale || 'Standard verified behavioral parameters.'}
          </div>
          <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)' }}>
            <span>Click row to open full dossier</span>
            <span style={{ color: '#60a5fa' }}>Score: {hoveredTx.risk_score || 0}/100</span>
          </div>
        </motion.div>
      )}

    </div>
  );
}
