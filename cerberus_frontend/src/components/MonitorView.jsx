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
        return <span className="badge-blocked" style={{ background: 'rgba(255, 77, 90, 0.18)' }}><ShieldAlert size={11} /> CRITICAL</span>;
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
      
      {/* 1. ENTERPRISE SOC MONITORING METRIC CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        
        {/* BLOCKED THREATS (DANGER RED ACCENT LINE) */}
        <div 
          className="fintech-card fintech-card-interactive"
          onClick={() => setFilterDecision(filterDecision === 'BLOCKED' ? 'ALL' : 'BLOCKED')}
          style={{ 
            padding: '1.25rem', 
            borderLeft: '3px solid #FF4D5A',
            background: filterDecision === 'BLOCKED' ? '#162033' : '#111A2B',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '130px'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11px', color: '#FF4D5A', fontWeight: 700, letterSpacing: '0.03em' }}>
                  BLOCKED THREATS
                </span>
                <span style={{ fontSize: '10px', background: 'rgba(255,77,90,0.12)', color: '#FF4D5A', padding: '1px 5px', borderRadius: '3px', fontWeight: 600 }}>
                  {blockedPct}%
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#FF4D5A', fontWeight: 600 }}>
                ₹{blockedSum.toLocaleString('en-IN')}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
              <span style={{ fontSize: '1.85rem', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em' }}>
                {blockedList.length}
              </span>
              <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 500 }}>
                intercepted
              </span>
            </div>

            <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '3px' }}>
              Stopped by ML risk engine & heuristic rules
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '6px', borderTop: '1px solid #26344A', fontSize: '11px', color: '#94A3B8' }}>
            <span>Interception rate</span>
            <span style={{ color: '#FF4D5A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
              <TrendingUp size={12} /> High protection
            </span>
          </div>
        </div>

        {/* REVIEW / 3DS (WARNING AMBER ACCENT LINE) */}
        <div 
          className="fintech-card fintech-card-interactive"
          onClick={() => setFilterDecision(filterDecision === 'REVIEW' ? 'ALL' : 'REVIEW')}
          style={{ 
            padding: '1.25rem', 
            borderLeft: '3px solid #F59E0B',
            background: filterDecision === 'REVIEW' ? '#162033' : '#111A2B',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '130px'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11px', color: '#F59E0B', fontWeight: 700, letterSpacing: '0.03em' }}>
                  REVIEW (3DS STEP-UP)
                </span>
                <span style={{ fontSize: '10px', background: 'rgba(245,158,11,0.12)', color: '#F59E0B', padding: '1px 5px', borderRadius: '3px', fontWeight: 600 }}>
                  {reviewPct}%
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#F59E0B', fontWeight: 600 }}>
                ₹{reviewSum.toLocaleString('en-IN')}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
              <span style={{ fontSize: '1.85rem', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em' }}>
                {reviewList.length}
              </span>
              <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 500 }}>
                challenges
              </span>
            </div>

            <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '3px' }}>
              Multi-factor / 3DS challenge review active
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '6px', borderTop: '1px solid #26344A', fontSize: '11px', color: '#94A3B8' }}>
            <span>Friction control</span>
            <span style={{ color: '#F59E0B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Activity size={12} /> Step-up OTP active
            </span>
          </div>
        </div>

        {/* ALLOWED PAYMENTS (SUCCESS GREEN ACCENT LINE) */}
        <div 
          className="fintech-card fintech-card-interactive"
          onClick={() => setFilterDecision(filterDecision === 'ALLOWED' ? 'ALL' : 'ALLOWED')}
          style={{ 
            padding: '1.25rem', 
            borderLeft: '3px solid #19C37D',
            background: filterDecision === 'ALLOWED' ? '#162033' : '#111A2B',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '130px'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11px', color: '#19C37D', fontWeight: 700, letterSpacing: '0.03em' }}>
                  ALLOWED PAYMENTS
                </span>
                <span style={{ fontSize: '10px', background: 'rgba(25,195,125,0.12)', color: '#19C37D', padding: '1px 5px', borderRadius: '3px', fontWeight: 600 }}>
                  {allowedPct}%
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#19C37D', fontWeight: 600 }}>
                ₹{allowedSum.toLocaleString('en-IN')}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
              <span style={{ fontSize: '1.85rem', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em' }}>
                {allowedList.length}
              </span>
              <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 500 }}>
                authentic
              </span>
            </div>

            <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '3px' }}>
              Authentic checkouts passed all risk checks
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '6px', borderTop: '1px solid #26344A', fontSize: '11px', color: '#94A3B8' }}>
            <span>Approval velocity</span>
            <span style={{ color: '#19C37D', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
              <TrendingDown size={12} /> Frictionless checkout
            </span>
          </div>
        </div>

      </div>

      {/* 2. TRANSACTION OPERATIONS TABLE */}
      <div className="fintech-card" style={{ padding: '0', overflow: 'hidden' }}>
        
        {/* TABLE CONTROLS HEADER */}
        <div style={{
          padding: '0.85rem 1.25rem',
          borderBottom: '1px solid #26344A',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          background: '#162033'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '13.5px', fontWeight: 700, color: '#F8FAFC' }}>Live Payment Activity</h3>
              <span className="mono" style={{ fontSize: '11px', color: '#94A3B8' }}>({filtered.length} shown)</span>
            </div>
            <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '1px' }}>
              Select any transaction to open the comprehensive fraud intelligence dossier
            </p>
          </div>

          {/* SEARCH & FILTERS */}
          <div style={{ display: 'flex', gap: '0.55rem', alignItems: 'center', flexWrap: 'wrap' }}>
            
            {/* SEARCH INPUT */}
            <div style={{ position: 'relative', width: '230px' }}>
              <Search 
                size={13} 
                color="#64748B" 
                style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)' }} 
              />
              <input
                type="text"
                placeholder="Search Txn ID or User..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  background: '#0E1626',
                  border: '1px solid #26344A',
                  color: '#F8FAFC',
                  borderRadius: '5px',
                  padding: '5px 26px 5px 28px',
                  fontSize: '12px',
                  outline: 'none',
                  transition: 'border-color 0.15s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#FF7A18'}
                onBlur={(e) => e.target.style.borderColor = '#26344A'}
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
                    color: '#64748B',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* FILTER CLEAR */}
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

        {/* SOC ACTIVITY TABLE */}
        <div className="custom-scrollbar" style={{ overflowX: 'auto', maxHeight: '620px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #26344A', color: '#94A3B8', background: '#162033' }}>
                <th style={{ padding: '9px 14px', fontWeight: 600, fontSize: '11px', letterSpacing: '0.03em' }}>TRANSACTION & USER</th>
                <th style={{ padding: '9px 14px', fontWeight: 600, fontSize: '11px', letterSpacing: '0.03em' }}>AMOUNT</th>
                <th style={{ padding: '9px 14px', fontWeight: 600, fontSize: '11px', letterSpacing: '0.03em' }}>RISK LEVEL</th>
                <th style={{ padding: '9px 14px', fontWeight: 600, fontSize: '11px', letterSpacing: '0.03em' }}>DECISION</th>
                <th style={{ padding: '9px 14px', fontWeight: 600, fontSize: '11px', letterSpacing: '0.03em' }}>PRIMARY DETECTION SIGNAL</th>
                <th style={{ padding: '9px 14px', fontWeight: 600, fontSize: '11px', letterSpacing: '0.03em' }}>TIMESTAMP</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx) => {
                const isThreat = tx.action === 'BLOCK';
                const isReview = tx.action === 'CHALLENGE_STEP_UP_OTP';
                const statusBorderColor = isThreat ? '#FF4D5A' : (isReview ? '#F59E0B' : '#19C37D');

                return (
                  <tr
                    key={tx.id}
                    onClick={() => onSelectTransaction(tx)}
                    onMouseEnter={(e) => handleRowMouseMove(e, tx)}
                    onMouseLeave={() => setHoveredTx(null)}
                    style={{
                      borderBottom: '1px solid #26344A',
                      borderLeft: `3px solid ${statusBorderColor}`,
                      cursor: 'pointer',
                      transition: 'background 0.15s ease',
                      background: 'transparent'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#19253B'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <span className="mono" style={{ fontWeight: 600, color: '#F8FAFC' }}>{tx.id}</span>
                        <span className="badge-source">{tx.source || 'SIM'}</span>
                      </div>
                      <div className="mono" style={{ fontSize: '11px', color: '#94A3B8', marginTop: '1px' }}>
                        {tx.user_id}
                      </div>
                    </td>

                    <td style={{ padding: '10px 14px', fontWeight: 600, color: isThreat ? '#FF4D5A' : '#F8FAFC' }}>
                      ₹{tx.amount?.toLocaleString('en-IN')}
                    </td>

                    <td style={{ padding: '10px 14px' }}>
                      {getRiskBadge(tx.risk_level)}
                    </td>

                    <td style={{ padding: '10px 14px' }}>
                      {getActionBadge(tx.action)}
                    </td>

                    <td style={{ padding: '10px 14px', color: '#94A3B8', fontSize: '12px' }}>
                      {tx.decision_rationale ? tx.decision_rationale.slice(0, 80) + '...' : 'Standard behavioral checks verified'}
                    </td>

                    <td style={{ padding: '10px 14px', color: '#64748B', fontSize: '12px' }}>
                      {new Date(tx.timestamp).toLocaleTimeString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* RESTRAINED HOVER DETAILS POPOVER */}
      {hoveredTx && (
        <div style={{
          position: 'fixed',
          top: Math.max(popoverPos.y - 110, 20),
          left: Math.min(popoverPos.x + 20, window.innerWidth - 340),
          width: '300px',
          background: '#162033',
          border: `1px solid #26344A`,
          borderRadius: '6px',
          padding: '8px 12px',
          zIndex: 1000,
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          pointerEvents: 'none'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span className="mono" style={{ fontWeight: 700, color: '#F8FAFC', fontSize: '12px' }}>{hoveredTx.id}</span>
            {getActionBadge(hoveredTx.action)}
          </div>
          <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '4px' }}>
            User: <strong style={{ color: '#F8FAFC' }}>{hoveredTx.user_id}</strong> • Amount: <strong style={{ color: hoveredTx.action === 'BLOCK' ? '#FF4D5A' : '#F8FAFC' }}>₹{hoveredTx.amount?.toLocaleString('en-IN')}</strong>
          </div>
          <div style={{ fontSize: '11px', color: '#94A3B8', lineHeight: 1.35 }}>
            {hoveredTx.decision_rationale || 'Standard verified behavioral parameters.'}
          </div>
        </div>
      )}

    </div>
  );
}
