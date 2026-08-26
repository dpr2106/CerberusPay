import React from 'react';

export default function LiveStreamTab({ transactions }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Real-Time Payment Interception Stream</h2>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Ingesting live payment events with sub-5ms anomaly classification</p>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Showing last {transactions.length} transactions
          </div>
        </div>

        <div className="custom-scrollbar" style={{ overflowX: 'auto', maxHeight: '600px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}>
                <th style={{ padding: '10px' }}>TXN ID</th>
                <th style={{ padding: '10px' }}>USER</th>
                <th style={{ padding: '10px' }}>AMOUNT</th>
                <th style={{ padding: '10px' }}>GEO DISTANCE</th>
                <th style={{ padding: '10px' }}>VELOCITY (1H)</th>
                <th style={{ padding: '10px' }}>PROXY/VPN</th>
                <th style={{ padding: '10px' }}>RISK SCORE</th>
                <th style={{ padding: '10px' }}>ACTION</th>
                <th style={{ padding: '10px' }}>RATIONALE</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: idx === 0 ? 'rgba(239,68,68,0.05)' : 'transparent' }}>
                  <td style={{ padding: '10px' }} className="mono">{tx.id}</td>
                  <td style={{ padding: '10px', color: '#94a3b8' }}>{tx.user_id}</td>
                  <td style={{ padding: '10px', fontWeight: 700 }}>₹{tx.amount.toLocaleString()}</td>
                  <td style={{ padding: '10px' }}>{tx.signals?.geo_distance_km} km</td>
                  <td style={{ padding: '10px' }}>{tx.signals?.velocity_1h} tx/hr</td>
                  <td style={{ padding: '10px' }}>
                    {tx.signals?.is_proxy_vpn ? (
                      <span style={{ color: '#f87171', fontWeight: 700 }}>VPN YES</span>
                    ) : (
                      <span style={{ color: '#94a3b8' }}>CLEAN</span>
                    )}
                  </td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ fontWeight: 800, color: tx.risk_score >= 70 ? '#ef4444' : (tx.risk_score >= 40 ? '#f59e0b' : '#10b981') }}>
                      {tx.risk_score}/100
                    </span>
                  </td>
                  <td style={{ padding: '10px' }}>
                    {tx.action === 'BLOCK' && <span className="badge-block">BLOCK</span>}
                    {tx.action === 'CHALLENGE_STEP_UP_OTP' && <span className="badge-challenge">CHALLENGE 3DS</span>}
                    {tx.action === 'ALLOW' && <span className="badge-allow">ALLOW</span>}
                  </td>
                  <td style={{ padding: '10px', fontSize: '0.75rem', color: '#94a3b8' }}>{tx.decision_rationale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}