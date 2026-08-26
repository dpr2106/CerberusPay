import React from 'react';

export default function AbuseRingsTab() {
  return (
    <div className="glass-panel" style={{ padding: '1.5rem' }}>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Head 2: Multi-Account Abuse Ring Sentinel</h2>
      <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1.5rem' }}>Graph-based correlation engine detecting coordinated card-testing rings</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        <div style={{ background: '#0d111a', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: 700, color: '#ef4444' }}>RING_DELTA_042</span>
            <span className="badge-block">COLLUSIVE RING</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem' }}>14 synthetic user accounts sharing same hardware Canvas fingerprint across 3 subnets.</p>
          <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
            <div>Target BIN: <strong>411111******9210</strong></div>
            <div>Attack Velocity: <strong>28 attempts / min</strong></div>
            <div>Status: <strong>Network Subnet Blocked</strong></div>
          </div>
        </div>

        <div style={{ background: '#0d111a', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '8px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: 700, color: '#f59e0b' }}>RING_SIGMA_019</span>
            <span className="badge-challenge">PROBE PATTERN</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem' }}>Rapid micro-transactions (₹10-₹50) probing merchant checkout endpoints.</p>
          <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
            <div>Target Merchant: <strong>Digital Gift Cards</strong></div>
            <div>Attack Velocity: <strong>12 attempts / min</strong></div>
            <div>Status: <strong>Rate Limiter Engaged</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
}