import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, ShieldCheck, AlertTriangle, ArrowRight, 
  Layers, CheckCircle2, XCircle, Clock, MapPin, Activity, 
  Globe, Smartphone, User, Lock, ExternalLink
} from 'lucide-react';

export default function InvestigationView({ transaction, onUpdateAction, onNavigateToNetworks }) {
  const [relatedData, setRelatedData] = useState(null);
  const [acting, setActing] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Fetch related activity from backend for this transaction
  useEffect(() => {
    if (!transaction) return;
    fetch(`http://localhost:8000/api/risk/transactions/${transaction.id}/related`)
      .then(res => res.json())
      .then(data => setRelatedData(data))
      .catch(() => {
        // Fallback local synthesis from active transaction context
        setRelatedData({
          user_id: transaction.user_id,
          user_history: [
            { id: 'TXN_18291', amount: 2000.0, risk_score: 10, risk_level: 'LOW', action: 'ALLOW', timestamp: 'Yesterday, 14:20' },
            { id: 'TXN_18292', amount: 3400.0, risk_score: 18, risk_level: 'LOW', action: 'ALLOW', timestamp: 'Today, 09:12' },
            { id: transaction.id, amount: transaction.amount, risk_score: transaction.risk_score, risk_level: transaction.risk_level, action: transaction.action, timestamp: 'Just now' }
          ],
          network_connection: {
            is_syndicate_linked: transaction.risk_score >= 70,
            ring_id: transaction.risk_score >= 70 ? 'RING_DELTA_042' : null,
            ring_name: transaction.risk_score >= 70 ? 'Card Testing Burst Syndicate' : 'Isolated Profile',
            linked_accounts_count: transaction.risk_score >= 70 ? 14 : 1,
            shared_device_id: transaction.risk_score >= 70 ? 'DEV_FINGERPRINT_A9' : 'DEV_TRUSTED_01'
          }
        });
      });
  }, [transaction?.id]);

  if (!transaction) {
    return (
      <div className="fintech-card" style={{ padding: '3.5rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <ShieldAlert size={40} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
          No Transaction Selected for Investigation
        </h3>
        <p style={{ fontSize: '13px' }}>
          Select a transaction from the <strong>Monitor</strong> feed to open its investigation dossier.
        </p>
      </div>
    );
  }

  const score = transaction.risk_score || 0;
  const isBlocked = transaction.action === 'BLOCK';
  const isReview = transaction.action === 'CHALLENGE_STEP_UP_OTP';
  const isAllowed = transaction.action === 'ALLOW';

  const getRiskMeta = (s) => {
    if (s >= 90) return { label: 'CRITICAL RISK', level: 'CRITICAL', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)' };
    if (s >= 70) return { label: 'HIGH RISK', level: 'HIGH', color: '#f87171', bg: 'rgba(248, 113, 113, 0.12)' };
    if (s >= 30) return { label: 'MEDIUM RISK', level: 'MEDIUM', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' };
    return { label: 'LOW RISK', level: 'LOW', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' };
  };

  const riskMeta = getRiskMeta(score);

  // Dynamic Signal Generation (Rule 2 & 4)
  const getDerivedSignals = () => {
    if (score < 30) {
      return [
        { name: 'Geographic location', level: 'LOW', weight: 8, bar: '██', detail: `${transaction.signals?.geo_distance_km || 12} km domestic offset` },
        { name: 'Transaction velocity', level: 'LOW', weight: 5, bar: '█', detail: `${transaction.signals?.velocity_1h || 1} tx/hr within normal rate` },
        { name: 'Device & IP authenticity', level: 'LOW', weight: 6, bar: '█', detail: 'Verified residential IP & known device' }
      ];
    }
    
    const signals = [];
    if ((transaction.signals?.geo_distance_km || 0) > 500) {
      signals.push({ name: 'Geographic anomaly', level: 'HIGH', weight: 44, bar: '████████████████', detail: `${transaction.signals.geo_distance_km} km location jump from baseline` });
    }
    if ((transaction.signals?.velocity_1h || 0) > 3) {
      signals.push({ name: 'Transaction velocity', level: 'HIGH', weight: 28, bar: '████████████', detail: `${transaction.signals.velocity_1h} transactions in last 60 minutes` });
    }
    if (transaction.signals?.is_proxy_vpn) {
      signals.push({ name: 'Network anomaly (VPN / Proxy)', level: 'HIGH', weight: 18, bar: '████████', detail: 'Traffic routed via anonymized datacenter proxy' });
    }
    if ((transaction.signals?.device_trust || 1) < 0.5) {
      signals.push({ name: 'Device trust anomaly', level: 'MEDIUM', weight: 10, bar: '████', detail: `Low trust score (${((transaction.signals?.device_trust || 0.25) * 100).toFixed(0)}%)` });
    }

    if (signals.length === 0) {
      signals.push({ name: 'Account anomaly', level: 'MEDIUM', weight: 25, bar: '████████', detail: 'Elevated transaction amount deviation' });
    }
    return signals;
  };

  const signalsList = getDerivedSignals();

  // Dynamic Human-Readable Explanation (Rule 4 & 10)
  const getDynamicExplanation = () => {
    if (isAllowed) {
      return "No significant risk signals detected. Transaction behavior, geolocation, and device profile are within expected customer baseline.";
    }
    if (isReview) {
      return `Transaction flagged for 3D-Secure verification due to moderate velocity (${transaction.signals?.velocity_1h || 2} tx/hr) from a newly observed checkout profile.`;
    }
    // High / Critical
    const reasons = [];
    if (transaction.signals?.geo_distance_km > 500) reasons.push(`an unusually distant geographic location (${transaction.signals.geo_distance_km} km jump)`);
    if (transaction.signals?.velocity_1h > 3) reasons.push(`an elevated transaction rate (${transaction.signals.velocity_1h} tx/hr)`);
    if (transaction.signals?.is_proxy_vpn) reasons.push(`an active VPN proxy tunnel`);
    
    if (reasons.length > 0) {
      return `Transaction blocked because the payment originated from ${reasons.join(' combined with ')}.`;
    }
    return "Transaction blocked due to multi-signal behavioral anomaly breaching threshold.";
  };

  const handleAction = async (newAction) => {
    setActing(true);
    try {
      await fetch(`http://localhost:8000/api/risk/transactions/${transaction.id}/action?action=${newAction}`, {
        method: 'POST'
      });
      if (onUpdateAction) onUpdateAction(transaction.id, newAction);
      setActionSuccess(`Transaction decision updated to: ${newAction}`);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch {
      if (onUpdateAction) onUpdateAction(transaction.id, newAction);
      setActionSuccess(`Local decision updated to: ${newAction}`);
      setTimeout(() => setActionSuccess(null), 3000);
    }
    setActing(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '1040px', margin: '0 auto' }}>
      
      {/* TOAST SUCCESS */}
      {actionSuccess && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid #10b981',
          color: '#34d399',
          padding: '10px 16px',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={16} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* 1. HEADER: TRANSACTION INVESTIGATION (SECTION 1 & 3) */}
      <div className="fintech-card" style={{ padding: '1.5rem', borderLeft: `4px solid ${riskMeta.color}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              TRANSACTION INVESTIGATION
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
              <span className="mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
                {transaction.id}
              </span>
              <span className="badge-source">{transaction.source || 'SIMULATION'}</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              User: <strong style={{ color: '#fff' }}>{transaction.user_id}</strong> • Ingested: {new Date(transaction.timestamp).toLocaleTimeString()}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
              ₹{transaction.amount?.toLocaleString('en-IN')}
            </div>
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', marginTop: '4px' }}>
              <span style={{ background: riskMeta.bg, color: riskMeta.color, padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 800 }}>
                {riskMeta.label}
              </span>
              <span style={{ background: 'rgba(255,255,255,0.06)', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                {transaction.action}
              </span>
            </div>
          </div>
        </div>

        {/* RISK SCORE VISUALIZATION (SECTION 3) */}
        <div style={{ marginTop: '1.25rem', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Calculated Risk Score
            </span>
            <span className="mono" style={{ fontSize: '14px', fontWeight: 800, color: riskMeta.color }}>
              {score} / 100 • {riskMeta.level}
            </span>
          </div>

          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              width: `${score}%`,
              height: '100%',
              background: riskMeta.color,
              borderRadius: '3px',
              transition: 'width 0.4s ease'
            }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
            <span>0–29 LOW</span>
            <span>30–69 MEDIUM</span>
            <span>70–89 HIGH</span>
            <span>90–100 CRITICAL</span>
          </div>
        </div>
      </div>

      {/* 2. THE CENTERPIECE: WHY WAS THIS TRANSACTION BLOCKED / CHALLENGED? (SECTION 2 & 4) */}
      <div className="fintech-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>
          {isAllowed ? 'Risk Assessment Signals' : (isReview ? 'Why Was This Payment Challenged?' : 'Why Was This Payment Blocked?')}
        </h3>
        
        {/* Human Readable Explanation (Section 4) */}
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: '6px', marginBottom: '1.25rem' }}>
          {getDynamicExplanation()}
        </p>

        {/* Visual Contribution Bars (Section 2) */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            RISK SIGNALS & RELATIVE CONTRIBUTIONS
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {signalsList.map((sig, i) => (
              <div key={i} style={{ background: 'var(--bg-secondary)', padding: '0.75rem 1rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ color: '#fff', fontWeight: 600, fontSize: '13px' }}>{sig.name}</span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: sig.level === 'HIGH' ? '#f87171' : (sig.level === 'MEDIUM' ? '#fbbf24' : '#34d399')
                  }}>
                    {sig.level}
                  </span>
                </div>

                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden', margin: '4px 0' }}>
                  <div style={{
                    width: `${sig.weight}%`,
                    height: '100%',
                    background: sig.level === 'HIGH' ? '#ef4444' : (sig.level === 'MEDIUM' ? '#f59e0b' : '#10b981'),
                    borderRadius: '2px'
                  }} />
                </div>

                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px' }}>
                  {sig.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. WHAT HAPPENED? TRANSACTION TIMELINE (SECTION 5) */}
      <div className="fintech-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>
          What Happened? (Processing Timeline)
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {(transaction.timeline || [
            { time: '09:45:40', event: 'Payment initiated via checkout', severity: 'info' },
            { time: '09:45:40', event: 'Transaction behavioral features collected', severity: 'info' },
            { time: '09:45:40', event: `Geolocation anomaly evaluated (${transaction.signals?.geo_distance_km || 25} km offset)`, severity: isBlocked ? 'danger' : 'info' },
            { time: '09:45:40', event: `Risk score computed: ${score}/100 -> Decision: ${transaction.action}`, severity: isBlocked ? 'danger' : 'success' }
          ]).map((step, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '13px' }}>
              <span className="mono" style={{ color: 'var(--text-muted)', fontSize: '12px', minWidth: '65px' }}>
                {step.time}
              </span>
              <div style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: step.severity === 'danger' ? '#ef4444' : (step.severity === 'warning' ? '#f59e0b' : '#3b82f6'),
                marginTop: '6px'
              }} />
              <span style={{ color: step.severity === 'danger' ? '#f87171' : 'var(--text-secondary)' }}>
                {step.event}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. TRANSACTION CONTEXT (SECTION 6) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        
        <div className="fintech-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.65rem' }}>
            TRANSACTION CONTEXT
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Amount:</span>
              <strong style={{ color: '#fff' }}>₹{transaction.amount?.toLocaleString('en-IN')}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Category:</span>
              <span style={{ color: '#cbd5e1' }}>{transaction.category}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Source:</span>
              <span className="mono" style={{ color: '#3b82f6' }}>{transaction.source || 'SIMULATION'}</span>
            </div>
          </div>
        </div>

        <div className="fintech-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.65rem' }}>
            BEHAVIORAL SIGNALS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>1-Hour Velocity:</span>
              <strong style={{ color: (transaction.signals?.velocity_1h || 1) > 3 ? '#f87171' : '#fff' }}>
                {transaction.signals?.velocity_1h || 1} tx/hr
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Location Offset:</span>
              <span style={{ color: (transaction.signals?.geo_distance_km || 0) > 500 ? '#f87171' : '#cbd5e1' }}>
                {transaction.signals?.geo_distance_km || 25} km
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Account Maturity:</span>
              <span style={{ color: '#cbd5e1' }}>{transaction.signals?.user_account_age_days || 180} days</span>
            </div>
          </div>
        </div>

        <div className="fintech-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.65rem' }}>
            DEVICE & NETWORK
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Proxy / VPN Status:</span>
              <strong style={{ color: transaction.signals?.is_proxy_vpn ? '#f87171' : '#10b981' }}>
                {transaction.signals?.is_proxy_vpn ? 'VPN Detected' : 'Residential IP'}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Device Trust:</span>
              <span style={{ color: '#cbd5e1' }}>{((transaction.signals?.device_trust || 0.9) * 100).toFixed(0)}%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Card Declines (24h):</span>
              <span style={{ color: (transaction.signals?.card_fails_24h || 0) > 1 ? '#f87171' : '#cbd5e1' }}>
                {transaction.signals?.card_fails_24h || 0} attempts
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* 5. RELATED USER ACTIVITY (SECTION 7) */}
      <div className="fintech-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>Related User Activity</h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Answering: Is this transaction isolated or part of a sequence?</p>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Account: <strong style={{ color: '#fff' }}>{transaction.user_id}</strong></span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {(relatedData?.user_history || []).map((pastTx, idx) => (
            <div key={idx} style={{ background: 'var(--bg-secondary)', padding: '8px 12px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span className="mono" style={{ fontWeight: 600, color: '#fff' }}>{pastTx.id}</span>
                <span style={{ color: 'var(--text-muted)' }}>• ₹{pastTx.amount?.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{pastTx.timestamp?.split('T')[0] || 'Recent'}</span>
                {pastTx.action === 'BLOCK' && <span className="badge-blocked">BLOCKED</span>}
                {pastTx.action === 'CHALLENGE_STEP_UP_OTP' && <span className="badge-review">REVIEW</span>}
                {pastTx.action === 'ALLOW' && <span className="badge-allowed">ALLOWED</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. CONNECT TO ABUSE NETWORK (SECTION 8) */}
      <div className="fintech-card" style={{ padding: '1.25rem', borderLeft: '3px solid #3b82f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            ABUSE NETWORK CORRELATION
          </div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
            {relatedData?.network_connection?.is_syndicate_linked 
              ? `Connected to Syndicate (${relatedData.network_connection.ring_id})` 
              : 'Isolated Account Profile'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {relatedData?.network_connection?.is_syndicate_linked 
              ? `Shares hardware fingerprint (${relatedData.network_connection.shared_device_id}) with 14 other synthetic accounts.`
              : 'No suspicious multi-account device cluster correlated.'}
          </div>
        </div>

        <button
          onClick={onNavigateToNetworks}
          className="btn-primary-fintech"
          style={{ fontSize: '12px' }}
        >
          <span>VIEW RELATED NETWORK</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* 7. ACTION AREA (SECTION 9) */}
      <div className="fintech-card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            ANALYST INTERVENTION
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Apply official state override to this transaction record.
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <button
            onClick={() => handleAction('BLOCK')}
            disabled={acting || isBlocked}
            className="btn-secondary-fintech"
            style={{ color: '#f87171', borderColor: 'rgba(239,68,68,0.3)', opacity: isBlocked ? 0.6 : 1 }}
          >
            <XCircle size={14} /> Block Payment
          </button>
          <button
            onClick={() => handleAction('CHALLENGE_STEP_UP_OTP')}
            disabled={acting || isReview}
            className="btn-secondary-fintech"
            style={{ color: '#fbbf24', borderColor: 'rgba(245,158,11,0.3)', opacity: isReview ? 0.6 : 1 }}
          >
            <Lock size={14} /> Require 3DS Review
          </button>
          <button
            onClick={() => handleAction('ALLOW')}
            disabled={acting || isAllowed}
            className="btn-primary-fintech"
            style={{ background: '#10b981', opacity: isAllowed ? 0.6 : 1 }}
          >
            <CheckCircle2 size={14} /> Allow Payment
          </button>
        </div>
      </div>

    </div>
  );
}