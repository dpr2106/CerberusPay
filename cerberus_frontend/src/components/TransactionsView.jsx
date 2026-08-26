import React, { useState } from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

export default function TransactionsView({ transactions, onSelectTransaction }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [decisionFilter, setDecisionFilter] = useState('ALL');
  const [sourceFilter, setSourceFilter] = useState('ALL');

  // Filter logic
  const filteredTransactions = transactions.filter(tx => {
    // Search
    const s = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
      tx.id.toLowerCase().includes(s) || 
      tx.user_id.toLowerCase().includes(s);

    // Risk Filter
    const matchesRisk = riskFilter === 'ALL' || tx.risk_level === riskFilter;

    // Decision Filter
    const matchesDecision = decisionFilter === 'ALL' || 
      (decisionFilter === 'BLOCKED' && tx.action === 'BLOCK') ||
      (decisionFilter === 'REVIEW' && tx.action === 'CHALLENGE_STEP_UP_OTP') ||
      (decisionFilter === 'ALLOWED' && tx.action === 'ALLOW');

    // Source Filter
    const matchesSource = sourceFilter === 'ALL' || tx.source === sourceFilter;

    return matchesSearch && matchesRisk && matchesDecision && matchesSource;
  });

  const getRiskScoreBadge = (score) => {
    if (score >= 90) return <span style={{ color: '#ef4444', fontWeight: 700 }}>{score} / 100</span>;
    if (score >= 70) return <span style={{ color: '#f87171', fontWeight: 700 }}>{score} / 100</span>;
    if (score >= 30) return <span style={{ color: '#f59e0b', fontWeight: 700 }}>{score} / 100</span>;
    return <span style={{ color: '#10b981', fontWeight: 700 }}>{score} / 100</span>;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* FILTER & SEARCH BAR (RULE 20) */}
      <div className="fintech-card" style={{ padding: '0.85rem 1.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Search */}
        <div style={{ position: 'relative', minWidth: '260px', flex: 1 }}>
          <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by Transaction ID or User ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              borderRadius: '6px',
              padding: '6px 10px 6px 30px',
              fontSize: '13px'
            }}
          />
        </div>

        {/* Dropdown Filters */}
        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          
          {/* Risk Level Filter */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              borderRadius: '6px',
              padding: '6px 10px',
              fontSize: '12px'
            }}
          >
            <option value="ALL">Risk: All</option>
            <option value="LOW">Risk: Low (0-29)</option>
            <option value="MEDIUM">Risk: Medium (30-69)</option>
            <option value="HIGH">Risk: High (70-89)</option>
            <option value="CRITICAL">Risk: Critical (90-100)</option>
          </select>

          {/* Decision Filter */}
          <select
            value={decisionFilter}
            onChange={(e) => setDecisionFilter(e.target.value)}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              borderRadius: '6px',
              padding: '6px 10px',
              fontSize: '12px'
            }}
          >
            <option value="ALL">Decision: All</option>
            <option value="ALLOWED">Allowed</option>
            <option value="REVIEW">Review / 3DS</option>
            <option value="BLOCKED">Blocked</option>
          </select>

          {/* Source Filter */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              borderRadius: '6px',
              padding: '6px 10px',
              fontSize: '12px'
            }}
          >
            <option value="ALL">Source: All</option>
            <option value="SIMULATED">Simulated</option>
            <option value="SANDBOX">Sandbox</option>
            <option value="WEBHOOK">Webhook</option>
          </select>

        </div>

      </div>

      {/* CLEAN DEFAULT TRANSACTION TABLE (RULE 4) */}
      <div className="fintech-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="custom-scrollbar" style={{ overflowX: 'auto', maxHeight: '680px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', background: 'var(--bg-secondary)' }}>
                <th style={{ padding: '10px 16px', fontWeight: 600 }}>TRANSACTION</th>
                <th style={{ padding: '10px 16px', fontWeight: 600 }}>USER</th>
                <th style={{ padding: '10px 16px', fontWeight: 600 }}>AMOUNT</th>
                <th style={{ padding: '10px 16px', fontWeight: 600 }}>RISK SCORE</th>
                <th style={{ padding: '10px 16px', fontWeight: 600 }}>STATUS</th>
                <th style={{ padding: '10px 16px', fontWeight: 600 }}>SOURCE</th>
                <th style={{ padding: '10px 16px', fontWeight: 600 }}>TIME</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx, idx) => (
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
                  <td style={{ padding: '12px 16px' }} className="mono">
                    <span style={{ fontWeight: 600, color: '#fff' }}>{tx.id}</span>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                    {tx.user_id}
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#fff' }}>
                    ₹{tx.amount?.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {getRiskScoreBadge(tx.risk_score)}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {tx.action === 'BLOCK' && <span className="badge-blocked">BLOCKED</span>}
                    {tx.action === 'CHALLENGE_STEP_UP_OTP' && <span className="badge-review">REVIEW</span>}
                    {tx.action === 'ALLOW' && <span className="badge-allowed">ALLOWED</span>}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className="badge-source">{tx.source || 'SIMULATED'}</span>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '12px' }}>
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