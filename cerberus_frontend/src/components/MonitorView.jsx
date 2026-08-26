import React, { useState } from 'react';
import { Search, ArrowUpRight, ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function MonitorView({ transactions, mode, onSelectTransaction }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDecision, setFilterDecision] = useState('ALL');

  const blockedList = transactions.filter(t => t.action === 'BLOCK');
  const reviewList = transactions.filter(t => t.action === 'CHALLENGE_STEP_UP_OTP');
  const allowedList = transactions.filter(t => t.action === 'ALLOW');

  const blockedSum = blockedList.reduce((acc, t) => acc + (t.amount || 0), 0);
  const reviewSum = reviewList.reduce((acc, t) => acc + (t.amount || 0), 0);
  const allowedSum = allowedList.reduce((acc, t) => acc + (t.amount || 0), 0);

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
      case 'CRITICAL': return <span className="badge-blocked">CRITICAL</span>;
      case 'HIGH': return <span className="badge-blocked" style={{ color: '#f87171' }}>HIGH</span>;
      case 'MEDIUM': return <span className="badge-review">MEDIUM</span>;
      default: return <span className="badge-allowed">LOW</span>;
    }
  };

  const getActionBadge = (action) => {
    switch (action) {
      case 'BLOCK': return <span className="badge-blocked">BLOCKED</span>;
      case 'CHALLENGE_STEP_UP_OTP': return <span className="badge-review">REVIEW</span>;
      default: return <span className="badge-allowed">ALLOWED</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* COMPACT SUMMARY COUNTER BAR (SECTION 3) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        
        <div 
          className="fintech-card" 
          onClick={() => setFilterDecision(filterDecision === 'BLOCKED' ? 'ALL' : 'BLOCKED')}
          style={{ padding: '1rem', cursor: 'pointer', borderLeft: '3px solid #ef4444' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>BLOCKED</span>
            <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: 600 }}>₹{blockedSum.toLocaleString('en-IN')}</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f87171', marginTop: '2px' }}>
            {blockedList.length} <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>threats</span>
          </div>
        </div>

        <div 
          className="fintech-card" 
          onClick={() => setFilterDecision(filterDecision === 'REVIEW' ? 'ALL' : 'REVIEW')}
          style={{ padding: '1rem', cursor: 'pointer', borderLeft: '3px solid #f59e0b' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>REVIEW (3DS)</span>
            <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 600 }}>₹{reviewSum.toLocaleString('en-IN')}</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fbbf24', marginTop: '2px' }}>
            {reviewList.length} <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>challenges</span>
          </div>
        </div>

        <div 
          className="fintech-card" 
          onClick={() => setFilterDecision(filterDecision === 'ALLOWED' ? 'ALL' : 'ALLOWED')}
          style={{ padding: '1rem', cursor: 'pointer', borderLeft: '3px solid #10b981' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>ALLOWED</span>
            <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 600 }}>₹{allowedSum.toLocaleString('en-IN')}</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399', marginTop: '2px' }}>
            {allowedList.length} <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>authentic</span>
          </div>
        </div>

      </div>

      {/* LIVE ACTIVITY STREAM (SECTION 3) */}
      <div className="fintech-card" style={{ padding: '0', overflow: 'hidden' }}>
        
        {/* HEADER & FILTER */}
        <div style={{
          padding: '0.85rem 1.25rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Live Payment Activity</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Click any suspicious payment to open the full investigation dossier
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '220px' }}>
              <Search size={13} color="var(--text-muted)" style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search transaction or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  borderRadius: '6px',
                  padding: '4px 8px 4px 26px',
                  fontSize: '12px'
                }}
              />
            </div>

            {filterDecision !== 'ALL' && (
              <button 
                onClick={() => setFilterDecision('ALL')}
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontSize: '11px', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
              >
                Clear Filter ({filterDecision})
              </button>
            )}
          </div>
        </div>

        {/* ACTIVITY TABLE */}
        <div className="custom-scrollbar" style={{ overflowX: 'auto', maxHeight: '640px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', background: 'var(--bg-secondary)' }}>
                <th style={{ padding: '9px 14px', fontWeight: 600 }}>TRANSACTION</th>
                <th style={{ padding: '9px 14px', fontWeight: 600 }}>AMOUNT</th>
                <th style={{ padding: '9px 14px', fontWeight: 600 }}>RISK LEVEL</th>
                <th style={{ padding: '9px 14px', fontWeight: 600 }}>DECISION</th>
                <th style={{ padding: '9px 14px', fontWeight: 600 }}>DETECTION SIGNAL</th>
                <th style={{ padding: '9px 14px', fontWeight: 600 }}>TIME</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx, idx) => (
                <tr
                  key={idx}
                  onClick={() => onSelectTransaction(tx)}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '11px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="mono" style={{ fontWeight: 600, color: '#fff' }}>{tx.id}</span>
                      <span className="badge-source">{tx.source || 'SIM'}</span>
                    </div>
                  </td>
                  <td style={{ padding: '11px 14px', fontWeight: 700, color: '#fff' }}>
                    ₹{tx.amount?.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '11px 14px' }}>
                    {getRiskBadge(tx.risk_level)}
                  </td>
                  <td style={{ padding: '11px 14px' }}>
                    {getActionBadge(tx.action)}
                  </td>
                  <td style={{ padding: '11px 14px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                    {tx.decision_rationale ? tx.decision_rationale.slice(0, 75) + '...' : 'Standard parameters'}
                  </td>
                  <td style={{ padding: '11px 14px', color: 'var(--text-muted)', fontSize: '12px' }}>
                    {new Date(tx.timestamp).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}