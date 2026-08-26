import React, { useState } from 'react';
import { 
  Search, ArrowUpRight, ShieldAlert, ShieldCheck, AlertTriangle, 
  X, TrendingUp, TrendingDown, ArrowRight, Activity, Clock, User, Shield
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
        return <span className="badge-blocked" style={{ background: 'rgba(239,68,68,0.18)', color: '#FCA5A5' }}><ShieldAlert size={11} /> CRITICAL</span>;
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
      
      {/* 1. FINANCIAL / SOC SUMMARY MONITORING CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        
        {/* BLOCKED CARD (SEMANTIC RED ACCENT) */}
        <div 
          className="fintech-card fintech-card-interactive card-glow-red"
          onClick={() => setFilterDecision(filterDecision === 'BLOCKED' ? 'ALL' : 'BLOCKED')}
          style={{ 
            padding: '1.25rem', 
            borderLeft: '4px solid #EF4444',
            background: filterDecision === 'BLOCKED' ? 'rgba(239, 68, 68, 0.08)' : 'var(--bg-card)',
            boxShadow: filterDecision === 'BLOCKED' ? 'var(--shadow-glow-red)' : 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '135px'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11px', color: '#F87171', fontWeight: 800, letterSpacing: '0.04em' }}>
                  BLOCKED THREATS
                </span>
                <span style={{ fontSize: '10px', background: 'rgba(239,68,68,0.15)', color: '#FCA5A5', padding: '1px 5px', borderRadius: '3px', fontWeight: 700 }}>
                  {blockedPct}%
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#F87171', fontWeight: 700 }}>
                ₹{blockedSum.toLocaleString('en-IN')}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
              <span style={{ fontSize: '1.9rem', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em' }}>
                {blockedList.length}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                intercepted
              </span>
            </div>

            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '3px', lineHeight: 1.35 }}>
              Stopped by ML risk engine & heuristic rules
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '11px', color: 'var(--text-secondary)' }}>
            <span>Interception rate</span>
            <span style={{ color: '#F87171', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
              <TrendingUp size={12} /> High protection
            </span>
          </div>
        </div>

        {/* REVIEW (3DS) CARD (SEMANTIC AMBER ACCENT) */}
        <div 
          className="fintech-card fintech-card-interactive card-glow-amber"
          onClick={() => setFilterDecision(filterDecision === 'REVIEW' ? 'ALL' : 'REVIEW')}
          style={{ 
            padding: '1.25rem', 
            borderLeft: '4px solid #F59E0B',
            background: filterDecision === 'REVIEW' ? 'rgba(245, 158, 11, 0.08)' : 'var(--bg-card)',
            boxShadow: filterDecision === 'REVIEW' ? 'var(--shadow-glow-amber)' : 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '135px'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11px', color: '#FBBF24', fontWeight: 800, letterSpacing: '0.04em' }}>
                  REVIEW (3DS STEP-UP)
                </span>
                <span style={{ fontSize: '10px', background: 'rgba(245,158,11,0.15)', color: '#FDE68A', padding: '1px 5px', borderRadius: '3px', fontWeight: 700 }}>
                  {reviewPct}%
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#FBBF24', fontWeight: 700 }}>
                ₹{reviewSum.toLocaleString('en-IN')}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
              <span style={{ fontSize: '1.9rem', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em' }}>
                {reviewList.length}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                challenges
              </span>
            </div>

            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '3px', lineHeight: 1.35 }}>
              Multi-factor / 3DS challenge review active
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '11px', color: 'var(--text-secondary)' }}>
            <span>Friction control</span>
            <span style={{ color: '#FBBF24', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Activity size={12} /> Step-up OTP active
            </span>
          </div>
        </div>

        {/* ALLOWED CARD (SEMANTIC GREEN ACCENT) */}
        <div 
          className="fintech-card fintech-card-interactive card-glow-green"
          onClick={() => setFilterDecision(filterDecision === 'ALLOWED' ? 'ALL' : 'ALLOWED')}
          style={{ 
            padding: '1.25rem', 
            borderLeft: '4px solid #10B981',
            background: filterDecision === 'ALLOWED' ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-card)',
            boxShadow: filterDecision === 'ALLOWED' ? 'var(--shadow-glow-green)' : 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '135px'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11px', color: '#34D399', fontWeight: 800, letterSpacing: '0.04em' }}>
                  ALLOWED PAYMENTS
                </span>
                <span style={{ fontSize: '10px', background: 'rgba(16,185,129,0.15)', color: '#A7F3D0', padding: '1px 5px', borderRadius: '3px', fontWeight: 700 }}>
                  {allowedPct}%
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#34D399', fontWeight: 700 }}>
                ₹{allowedSum.toLocaleString('en-IN')}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
              <span style={{ fontSize: '1.9rem', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em' }}>
                {allowedList.length}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                authentic
              </span>
            </div>

            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '3px', lineHeight: 1.35 }}>
              Authentic checkouts passed all risk checks
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '11px', color: 'var(--text-secondary)' }}>
            <span>Approval velocity</span>
            <span style={{ color: '#34D399', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
              <TrendingDown size={12} /> Frictionless checkout
            </span>
          </div>
        </div>

      </div>

      {/* 2. TRANSACTION OPERATIONS TABLE */}
      <div className="fintech-card" style={{ padding: '0', overflow: 'hidden' }}>
        
        {/* TABLE CONTROLS BAR */}
        <div style={{
          padding: '0.85rem 1.25rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          background: 'var(--bg-secondary)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#F8FAFC' }}>Live Payment Ingestion</h3>
              <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>({filtered.length} active)</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '1px' }}>
              Select any transaction to open the comprehensive fraud intelligence dossier
            </p>
          </div>

          {/* SEARCH & FILTERS */}
          <div style={{ display: 'flex', gap: '0.55rem', alignItems: 'center', flexWrap: 'wrap' }}>
            
            {/* SEARCH INPUT */}
            <div style={{ position: 'relative', width: '230px' }}>
              <Search 
                size={13} 
                color="var(--text-muted)" 
                style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)' }} 
              />
              <input
                type="text"
                placeholder="Search Txn ID or User..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  borderRadius: '6px',
                  padding: '5px 26px 5px 28px',
                  fontSize: '12px',
                  outline: 'none',
                  transition: 'all 0.18s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent)';
                  e.target.style.boxShadow = 'var(--accent-glow)';
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
                    right: '7px',
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
                  <X size={12} />
                </button>
              )}
            </div>

            {/* FILTER BADGE / CLEAR */}
            {filterDecision !== 'ALL' && (
              <button 
                onClick={() => setFilterDecision('ALL')}
                className="btn-secondary-fintech"
                style={{ padding: '4px 9px', fontSize: '11px', gap: '4px' }}
              >
                <X size={11} />
                <span>Filter: {filterDecision}</span>
              </button>
            )}
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="custom-scrollbar" style={{ overflowX: 'auto', maxHeight: '620px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', background: 'var(--bg-secondary)' }}>
                <th style={{ padding: '9px 14px', fontWeight: 700, fontSize: '11px', letterSpacing: '0.04em' }}>TRANSACTION & USER</th>
                <th style={{ padding: '9px 14px', fontWeight: 700, fontSize: '11px', letterSpacing: '0.04em' }}>AMOUNT</th>
                <th style={{ padding: '9px 14px', fontWeight: 700, fontSize: '11px', letterSpacing: '0.04em' }}>RISK LEVEL</th>
                <th style={{ padding: '9px 14px', fontWeight: 700, fontSize: '11px', letterSpacing: '0.04em' }}>DECISION</th>
                <th style={{ padding: '9px 14px', fontWeight: 700, fontSize: '11px', letterSpacing: '0.04em' }}>PRIMARY DETECTION SIGNAL</th>
                <th style={{ padding: '9px 14px', fontWeight: 700, fontSize: '11px', letterSpacing: '0.04em' }}>TIMESTAMP</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx) => {
                const isThreat = tx.action === 'BLOCK';
                const isReview = tx.action === 'CHALLENGE_STEP_UP_OTP';
                const statusBorderColor = isThreat ? '#EF4444' : (isReview ? '#F59E0B' : '#10B981');

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
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <span className="mono" style={{ fontWeight: 700, color: '#F8FAFC' }}>{tx.id}</span>
                        <span className="badge-source">{tx.source || 'SIM'}</span>
                      </div>
                      <div className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px' }}>
                        {tx.user_id}
                      </div>
                    </td>

                    <td style={{ padding: '10px 14px', fontWeight: 700, color: isThreat ? '#F87171' : '#F8FAFC' }}>
                      ₹{tx.amount?.toLocaleString('en-IN')}
                    </td>

                    <td style={{ padding: '10px 14px' }}>
                      {getRiskBadge(tx.risk_level)}
                    </td>

                    <td style={{ padding: '10px 14px' }}>
                      {getActionBadge(tx.action)}
                    </td>

                    <td style={{ padding: '10px 14px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                      {tx.decision_rationale ? tx.decision_rationale.slice(0, 80) + '...' : 'Standard behavioral checks verified'}
                    </td>

                    <td style={{ padding: '10px 14px', color: 'var(--text-muted)', fontSize: '12px' }}>
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
        <div style={{
          position: 'fixed',
          top: Math.max(popoverPos.y - 120, 20),
          left: Math.min(popoverPos.x + 20, window.innerWidth - 350),
          width: '310px',
          background: '#0D1117',
          border: `1px solid ${hoveredTx.action === 'BLOCK' ? 'rgba(239, 68, 68, 0.45)' : 'rgba(249, 115, 22, 0.45)'}`,
          borderRadius: '7px',
          padding: '9px 13px',
          zIndex: 1000,
          boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
          pointerEvents: 'none'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
            <span className="mono" style={{ fontWeight: 800, color: '#F8FAFC', fontSize: '12.5px' }}>{hoveredTx.id}</span>
            {getActionBadge(hoveredTx.action)}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '5px' }}>
            Account: <strong style={{ color: '#F8FAFC' }}>{hoveredTx.user_id}</strong> • Amount: <strong style={{ color: '#F87171' }}>₹{hoveredTx.amount?.toLocaleString('en-IN')}</strong>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
            {hoveredTx.decision_rationale || 'Standard verified behavioral parameters.'}
          </div>
          <div style={{ marginTop: '5px', paddingTop: '5px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)' }}>
            <span>Click row to open full dossier</span>
            <span style={{ color: '#FB923C', fontWeight: 700 }}>Score: {hoveredTx.risk_score || 0}/100</span>
          </div>
        </div>
      )}

    </div>
  );
}
