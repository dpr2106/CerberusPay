import React, { useState } from 'react';
import { Cpu, ShieldAlert, AlertTriangle, ArrowUpRight, Zap } from 'lucide-react';

export default function RiskIntelligenceView({ onEvaluateCustom }) {
  const [amount, setAmount] = useState(12500);
  const [velocity, setVelocity] = useState(6);
  const [geoDistance, setGeoDistance] = useState(3200);
  const [proxy, setProxy] = useState(1);
  const [cardFails, setCardFails] = useState(3);
  const [accountAge, setAccountAge] = useState(8);

  const [evalResult, setEvalResult] = useState(null);
  const [evaluating, setEvaluating] = useState(false);

  const handleRunEvaluation = async () => {
    setEvaluating(true);
    const payload = {
      user_id: 'USR_INTELLIGENCE_LAB',
      amount: amount,
      category: 'electronics',
      velocity_1h: velocity,
      geo_distance_km: geoDistance,
      device_trust_score: proxy ? 0.25 : 0.92,
      is_proxy_vpn: proxy,
      card_fails_24h: cardFails,
      user_account_age_days: accountAge,
      is_new_shipping_address: 1
    };

    try {
      const res = await fetch('http://localhost:8000/api/risk/evaluate-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setEvalResult(data.evaluation);
      if (onEvaluateCustom) onEvaluateCustom(data.evaluation);
    } catch {
      const score = (geoDistance > 1000 || proxy || velocity > 4) ? 88 : 15;
      setEvalResult({
        id: `TXN_${Date.now().toString().slice(-6)}`,
        amount: amount,
        risk_score: score,
        risk_level: score >= 90 ? 'CRITICAL' : (score >= 70 ? 'HIGH' : (score >= 30 ? 'MEDIUM' : 'LOW')),
        action: score >= 70 ? 'BLOCK' : (score >= 30 ? 'CHALLENGE_STEP_UP_OTP' : 'ALLOW'),
        decision_rationale: score >= 70 ? 'High-confidence anomaly: Geographic jump with proxy routing.' : 'Clean profile.',
        feature_breakdown: [
          { factor: 'Geographic Distance', weight: 42, description: `${geoDistance} km deviation` },
          { factor: '1-Hour Velocity', weight: 28, description: `${velocity} transactions/hr` },
          { factor: 'Proxy Anonymizer', weight: 18, description: proxy ? 'Active VPN' : 'Direct IP' }
        ]
      });
    }
    setEvaluating(false);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
      
      {/* FEATURE VECTOR SLIDERS */}
      <div className="fintech-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>
          Interactive Risk Vector Lab
        </h3>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Synthesize custom multi-dimensional behavioral parameters and inspect model scoring
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Transaction Amount (INR)</span>
              <strong style={{ color: '#fff' }}>₹{amount.toLocaleString('en-IN')}</strong>
            </div>
            <input
              type="range"
              min="100"
              max="100000"
              step="500"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>1-Hour Transaction Velocity</span>
              <strong style={{ color: '#fff' }}>{velocity} tx/hr</strong>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              value={velocity}
              onChange={(e) => setVelocity(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Geolocation Deviation Distance</span>
              <strong style={{ color: '#fff' }}>{geoDistance} km</strong>
            </div>
            <input
              type="range"
              min="1"
              max="10000"
              step="100"
              value={geoDistance}
              onChange={(e) => setGeoDistance(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Cardholder Account Age</span>
              <strong style={{ color: '#fff' }}>{accountAge} Days</strong>
            </div>
            <input
              type="range"
              min="1"
              max="600"
              value={accountAge}
              onChange={(e) => setAccountAge(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={proxy === 1}
                onChange={(e) => setProxy(e.target.checked ? 1 : 0)}
              />
              <span style={{ color: 'var(--text-primary)' }}>Proxy / VPN Detected</span>
            </label>
          </div>

          <button
            onClick={handleRunEvaluation}
            disabled={evaluating}
            className="btn-primary-fintech"
            style={{ marginTop: '0.75rem', justifyContent: 'center' }}
          >
            <Cpu size={15} />
            {evaluating ? 'Computing Inference...' : 'Evaluate Behavioral Tensor'}
          </button>

        </div>
      </div>

      {/* INFERENCE OUTPUT & EXPLAINABILITY */}
      <div className="fintech-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {evalResult ? (
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
              Inference Evaluation
            </div>
            
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '0.5rem 0' }}>
              <span style={{ fontSize: '2.75rem', fontWeight: 800, color: evalResult.risk_score >= 70 ? '#ef4444' : (evalResult.risk_score >= 30 ? '#f59e0b' : '#10b981'), lineHeight: 1 }}>
                {evalResult.risk_score}
              </span>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 600 }}>/ 100</span>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              {evalResult.action === 'BLOCK' && <span className="badge-blocked" style={{ fontSize: '12px', padding: '4px 10px' }}>DECISION: BLOCK TRANSACTION</span>}
              {evalResult.action === 'CHALLENGE_STEP_UP_OTP' && <span className="badge-review" style={{ fontSize: '12px', padding: '4px 10px' }}>DECISION: 3DS STEP-UP CHALLENGE</span>}
              {evalResult.action === 'ALLOW' && <span className="badge-allowed" style={{ fontSize: '12px', padding: '4px 10px' }}>DECISION: ALLOW TRANSACTION</span>}
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
              {evalResult.decision_rationale}
            </p>

            {/* Contribution Breakdown */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Primary Contributing Signals
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {(evalResult.feature_breakdown || []).map((f, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: '#fff' }}>{f.factor}</span>
                    <span className="mono" style={{ color: 'var(--text-muted)' }}>{f.description}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>
            <Cpu size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
            <p style={{ fontSize: '13px' }}>
              Adjust parameters on the left and click <strong>Evaluate Behavioral Tensor</strong> to run inference.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}