import React from 'react';
import { Cpu } from 'lucide-react';

export default function RiskLabTab({
  simAmount, setSimAmount,
  simVelocity, setSimVelocity,
  simGeoDistance, setSimGeoDistance,
  simProxy, setSimProxy,
  handleManualEvaluate, evalResult
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Feature Tensor Simulator</h2>
        <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1.5rem' }}>Test Cerberus ML model against custom behavioral vectors</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
              <span>Transaction Amount (INR)</span>
              <strong style={{ color: '#06b6d4' }}>₹{simAmount.toLocaleString()}</strong>
            </div>
            <input
              type="range"
              min="100"
              max="100000"
              step="500"
              value={simAmount}
              onChange={(e) => setSimAmount(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
              <span>1-Hour Transaction Velocity</span>
              <strong style={{ color: '#f59e0b' }}>{simVelocity} tx/hr</strong>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              value={simVelocity}
              onChange={(e) => setSimVelocity(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
              <span>Geolocation Jump Distance</span>
              <strong style={{ color: '#ef4444' }}>{simGeoDistance} km</strong>
            </div>
            <input
              type="range"
              min="1"
              max="10000"
              step="100"
              value={simGeoDistance}
              onChange={(e) => setSimGeoDistance(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={simProxy === 1}
                onChange={(e) => setSimProxy(e.target.checked ? 1 : 0)}
              />
              <span>Proxy / Tor / VPN Detected</span>
            </label>
          </div>

          <button
            onClick={handleManualEvaluate}
            className="btn-crimson"
            style={{ marginTop: '1rem', justifyContent: 'center' }}
          >
            <Cpu size={16} /> Evaluate Risk Vector
          </button>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {evalResult ? (
          <div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Evaluation Result</span>
            <div style={{ fontSize: '3rem', fontWeight: 800, margin: '0.5rem 0', color: evalResult.risk_score >= 70 ? '#ef4444' : (evalResult.risk_score >= 40 ? '#f59e0b' : '#10b981') }}>
              {evalResult.risk_score}/100
            </div>
            <div style={{ marginBottom: '1rem' }}>
              {evalResult.action === 'BLOCK' && <span className="badge-block" style={{ fontSize: '1rem', padding: '6px 14px' }}>ACTION: BLOCK TRANSACTION</span>}
              {evalResult.action === 'CHALLENGE_STEP_UP_OTP' && <span className="badge-challenge" style={{ fontSize: '1rem', padding: '6px 14px' }}>ACTION: STEP-UP 3DS CHALLENGE</span>}
              {evalResult.action === 'ALLOW' && <span className="badge-allow" style={{ fontSize: '1rem', padding: '6px 14px' }}>ACTION: ALLOW TRANSACTION</span>}
            </div>
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.5 }}>
              <strong>Sentinel Rationale:</strong> {evalResult.decision_rationale}
            </p>
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#64748b' }}>
            <Cpu size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p>Adjust the feature tensor sliders on the left and click <strong>Evaluate Risk Vector</strong> to inspect the ML model.</p>
          </div>
        )}
      </div>
    </div>
  );
}