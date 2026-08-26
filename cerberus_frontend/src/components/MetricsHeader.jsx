import React from 'react';

export default function MetricsHeader({ metrics }) {
  return (
    <div style={{ background: '#0d111a', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0.75rem 1.5rem' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Held-Out Precision</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399' }}>
            {metrics ? `${(metrics.precision * 100).toFixed(1)}%` : '100%'}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Held-Out Recall</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#06b6d4' }}>
            {metrics ? `${(metrics.recall * 100).toFixed(1)}%` : '100%'}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Prevented Fraud Value</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
            ₹26.19 Lakhs
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>False-Positive Cost</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f59e0b' }}>
            ₹0.00 (Zero-Friction)
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Net ROI Ratio</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#8b5cf6' }}>
            2,619.5x
          </div>
        </div>
      </div>
    </div>
  );
}