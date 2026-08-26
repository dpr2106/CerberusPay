import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, ShieldCheck, AlertTriangle, ArrowRight, 
  Layers, CheckCircle2, XCircle, Clock, MapPin, Activity, 
  Globe, Smartphone, User, Lock, CreditCard, FileText, Copy, Check
} from 'lucide-react';

export default function InvestigationView({ 
  transaction, 
  onUpdateAction, 
  onNavigateToNetworks,
  onNavigateToChargebacks
}) {
  const [relatedData, setRelatedData] = useState(null);
  const [acting, setActing] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    if (!transaction) return;
    fetch(`http://127.0.0.1:8000/api/risk/transactions/${transaction.id}/related`)
      .then(res => res.json())
      .then(data => setRelatedData(data))
      .catch(() => {
        setRelatedData({
          target: transaction,
          user_history: [],
          network_connection: {
            is_syndicate_linked: transaction.risk_score >= 70,
            ring_id: transaction.risk_score >= 70 ? 'RING_DELTA_042' : null,
            ring_name: transaction.risk_score >= 70 ? 'Card Testing Burst Syndicate' : 'Isolated Profile',
            shared_device_id: transaction.signals?.device_id || 'DEV_FINGERPRINT_A9',
            shared_ip: transaction.signals?.ip_address || '185.220.101.4',
            shared_card: transaction.signals?.card_mask || 'CARD_4111_9210'
          }
        });
      });
  }, [transaction?.id]);

  if (!transaction) {
    return (
      <div className="fintech-card" style={{ padding: '4rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <ShieldAlert size={48} style={{ margin: '0 auto 1.25rem', opacity: 0.3 }} color="#ef4444" />
        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
          No Transaction Selected for Investigation
        </h3>
        <p style={{ fontSize: '13px', maxWidth: '380px', margin: '0 auto', color: 'var(--text-secondary)' }}>
          Navigate to the <strong>Monitor</strong> view and click any transaction row to inspect its risk signals and syndicate links.
        </p>
      </div>
    );
  }

  const score = transaction.risk_score || 0;
  const isBlocked = transaction.action === 'BLOCK';
  const isReview = transaction.action === 'CHALLENGE_STEP_UP_OTP' || transaction.action === 'REVIEW_3DS';
  const isAllowed = transaction.action === 'ALLOW';

  const getRiskMeta = (s) => {
    if (s >= 90) return { label: 'CRITICAL RISK', level: 'CRITICAL', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', glow: 'var(--shadow-glow-red)' };
    if (s >= 70) return { label: 'HIGH RISK', level: 'HIGH', color: '#f87171', bg: 'rgba(248, 113, 113, 0.15)', glow: 'var(--shadow-glow-red)' };
    if (s >= 30) return { label: 'MEDIUM RISK', level: 'MEDIUM', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', glow: 'var(--shadow-glow-amber)' };
    return { label: 'LOW RISK', level: 'LOW', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', glow: 'var(--shadow-glow-green)' };
  };

  const riskMeta = getRiskMeta(score);

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleAction = async (newAction) => {
    setActing(true);
    setActionSuccess(null);
    setActionError(null);

    try {
      if (onUpdateAction) {
        await onUpdateAction(transaction.id, newAction);
      }
      setActionSuccess(`Decision updated to ${newAction} on backend!`);
      setTimeout(() => setActionSuccess(null), 3500);
    } catch (err) {
      console.error('[Action Error]:', err);
      setActionError(`Failed to update backend: ${err.message || 'Network error'}`);
      setTimeout(() => setActionError(null), 4000);
    } finally {
      setActing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '1080px', margin: '0 auto' }}>
      
      {/* TOAST SUCCESS */}
      {actionSuccess && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid #10b981',
          color: '#34d399',
          padding: '10px 16px',
          borderRadius: '7px',
          fontSize: '13px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: 'var(--shadow-glow-green)'
        }}>
          <CheckCircle2 size={16} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* TOAST ERROR */}
      {actionError && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid #ef4444',
          color: '#f87171',
          padding: '10px 16px',
          borderRadius: '7px',
          fontSize: '13px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: 'var(--shadow-glow-red)'
        }}>
          <XCircle size={16} />
          <span>{actionError}</span>
        </div>
      )}

      {/* 1. TOP HEADER DOSSIER CARD WITH GLOW */}
      <div 
        className="fintech-card" 
        style={{ 
          padding: '1.5rem', 
          borderLeft: `5px solid ${riskMeta.color}`,
          boxShadow: isBlocked ? riskMeta.glow : 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              TRANSACTION INVESTIGATION DOSSIER
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
              <span className="mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
                {transaction.id}
              </span>
              <span className="badge-source">{transaction.source || 'SIMULATION'}</span>
              <button
                onClick={() => copyToClipboard(transaction.id, 'txId')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                title="Copy Transaction ID"
              >
                {copiedField === 'txId' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              </button>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Customer User ID: <strong style={{ color: '#fff' }}>{transaction.user_id}</strong> • Ingested: {new Date(transaction.timestamp).toLocaleString()}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
              ₹{transaction.amount?.toLocaleString('en-IN')}
            </div>
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', marginTop: '4px', flexWrap: 'wrap' }}>
              <span style={{ background: riskMeta.bg, color: riskMeta.color, border: `1px solid ${riskMeta.color}40`, padding: '2px 8px', borderRadius: '5px', fontSize: '11px', fontWeight: 800 }}>
                {riskMeta.label} ({score}/100)
              </span>
              <span style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '2px 8px', borderRadius: '5px', fontSize: '11px', fontWeight: 700 }}>
                {transaction.action}
              </span>
              <span style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa', padding: '2px 8px', borderRadius: '5px', fontSize: '11px', fontWeight: 700 }}>
                {transaction.confidence || '98.4%'} CONFIDENCE
              </span>
            </div>
          </div>
        </div>

        {/* Risk Score Progress Bar */}
        <div style={{ marginTop: '1.25rem', background: 'var(--bg-secondary)', padding: '0.85rem 1rem', borderRadius: '7px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>CONTINUOUS RISK SCORE BREAKDOWN</span>
            <span className="mono" style={{ color: riskMeta.color, fontWeight: 800 }}>{score} / 100 ({riskMeta.level})</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${score}%`, height: '100%', background: `linear-gradient(90deg, #10b981 0%, #f59e0b 50%, #ef4444 100%)`, borderRadius: '3px' }} />
          </div>
        </div>
      </div>

      {/* 2. SECTION A: WHY? STRONGEST RISK SIGNALS */}
      <div className="fintech-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '14.5px', fontWeight: 800, color: '#fff', marginBottom: '0.4rem' }}>
          A. Why did CerberusPay {transaction.action === 'BLOCK' ? 'block' : (isReview ? 'challenge' : 'allow')} this transaction?
        </h3>
        
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
          {transaction.decision_rationale}
        </p>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.04em' }}>
            BEHAVIORAL EXPLAINABILITY SIGNALS (SHAP / GINI IMPURITY)
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {(transaction.feature_breakdown || []).map((factor, idx) => (
              <div 
                key={idx} 
                style={{ 
                  background: 'var(--bg-secondary)', 
                  padding: '0.85rem 1rem', 
                  borderRadius: '7px', 
                  border: '1px solid var(--border-subtle)', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  transition: 'background 0.15s ease'
                }}
              >
                <div>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: '13px' }}>
                    {factor.signal || factor.factor}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {factor.detail || factor.description}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className="mono" style={{ 
                    fontSize: '12px', 
                    fontWeight: 800, 
                    color: factor.impact?.includes('+') ? '#f87171' : '#34d399',
                    background: factor.impact?.includes('+') ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)',
                    border: `1px solid ${factor.impact?.includes('+') ? 'rgba(239,68,68,0.25)' : 'rgba(16,185,129,0.25)'}`,
                    padding: '3px 8px',
                    borderRadius: '5px'
                  }}>
                    {factor.impact || `+${factor.weight}% risk`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. SECTION B: PROCESSING TIMELINE */}
      <div className="fintech-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '14.5px', fontWeight: 800, color: '#fff', marginBottom: '0.85rem' }}>
          B. What Happened? (Audit Timeline)
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {(transaction.timeline || [
            { time: '09:45:40', event: 'Payment initiated via merchant checkout gateway', severity: 'info' },
            { time: '09:45:40', event: 'Transaction behavioral features & IP proxy vectors collected', severity: 'info' },
            { time: '09:45:40', event: `Geolocation offset calculated: ${transaction.signals?.geo_distance_km || 25} km`, severity: isBlocked ? 'danger' : 'info' },
            { time: '09:45:40', event: `Model risk score computed: ${score}/100 -> Decision: ${transaction.action}`, severity: isBlocked ? 'danger' : 'success' }
          ]).map((step, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', fontSize: '13px' }}>
              <span className="mono" style={{ color: 'var(--text-muted)', fontSize: '11px', minWidth: '70px', marginTop: '2px' }}>
                {step.time}
              </span>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: step.severity === 'danger' ? '#ef4444' : (step.severity === 'warning' ? '#f59e0b' : '#3b82f6'),
                marginTop: '6px',
                boxShadow: step.severity === 'danger' ? '0 0 8px #ef4444' : 'none'
              }} />
              <span style={{ color: step.severity === 'danger' ? '#f87171' : 'var(--text-secondary)', lineHeight: 1.4 }}>
                {step.event}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. SECTION C: WHO/WHAT IS CONNECTED? */}
      <div className="fintech-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '14.5px', fontWeight: 800, color: '#fff', marginBottom: '0.85rem' }}>
          C. Who & What is Connected? (Entity Context & Account History)
        </h3>

        {/* Identity & Device & IP Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: '7px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <User size={12} /> ACCOUNT USER ID
            </div>
            <div className="mono" style={{ fontSize: '13px', fontWeight: 800, color: '#fff', marginTop: '3px' }}>
              {transaction.user_id}
            </div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: '7px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Smartphone size={12} /> DEVICE FINGERPRINT
            </div>
            <div className="mono" style={{ fontSize: '13px', fontWeight: 800, color: '#cbd5e1', marginTop: '3px' }}>
              {transaction.signals?.device_id || 'DEV_FINGERPRINT_A9'}
            </div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: '7px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Globe size={12} /> IP / PROXY NETWORK
            </div>
            <div className="mono" style={{ fontSize: '13px', fontWeight: 800, color: transaction.signals?.is_proxy_vpn ? '#f87171' : '#34d399', marginTop: '3px' }}>
              {transaction.signals?.ip_address || '185.220.101.4 (Proxy)'}
            </div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: '7px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CreditCard size={12} /> CARD MASK
            </div>
            <div className="mono" style={{ fontSize: '13px', fontWeight: 800, color: '#cbd5e1', marginTop: '3px' }}>
              {transaction.signals?.card_mask || 'CARD_4111_9210'}
            </div>
          </div>
        </div>

        {/* Past Transactions for Account */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.04em' }}>
            PAST TRANSACTIONS FOR ACCOUNT ({transaction.user_id})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {(relatedData?.user_history || []).length > 0 ? (
              relatedData.user_history.map((pastTx, idx) => (
                <div key={idx} style={{ background: 'var(--bg-secondary)', padding: '7px 12px', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span className="mono" style={{ fontWeight: 700, color: '#fff' }}>{pastTx.id}</span>
                    <span style={{ color: 'var(--text-muted)' }}>• ₹{pastTx.amount?.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{new Date(pastTx.timestamp).toLocaleDateString()}</span>
                    {pastTx.action === 'BLOCK' && <span className="badge-blocked">BLOCKED</span>}
                    {pastTx.action === 'CHALLENGE_STEP_UP_OTP' && <span className="badge-review">REVIEW</span>}
                    {pastTx.action === 'ALLOW' && <span className="badge-allowed">ALLOWED</span>}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '4px 0' }}>
                First recorded transaction for this consumer profile.
              </div>
            )}
          </div>
        </div>

        {/* Jump to Syndicate Networks & Chargeback Dossier */}
        <div style={{ marginTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Correlate this transaction across the syndicate network or inspect dispute representment:
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {onNavigateToChargebacks && (
              <button
                onClick={() => onNavigateToChargebacks(transaction.id)}
                className="btn-secondary-fintech"
                style={{ fontSize: '12px' }}
              >
                <FileText size={14} />
                <span>CHARGEBACK DOSSIER</span>
              </button>
            )}
            <button
              onClick={() => onNavigateToNetworks(transaction)}
              className="btn-primary-fintech"
              style={{ fontSize: '12px' }}
            >
              <span>VIEW RELATED NETWORK</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 5. SECTION D: ANALYST ACTION CENTER */}
      <div className="fintech-card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            D. ANALYST ACTION CENTER
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Apply official state override to this transaction in the unified pipeline.
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <button
            onClick={() => handleAction('BLOCK')}
            disabled={acting || isBlocked}
            className="btn-secondary-fintech"
            style={{ color: '#f87171', borderColor: 'rgba(239,68,68,0.3)', opacity: isBlocked ? 0.6 : 1 }}
          >
            <XCircle size={14} /> {acting ? 'Updating...' : 'Block Payment'}
          </button>
          <button
            onClick={() => handleAction('REVIEW_3DS')}
            disabled={acting || isReview}
            className="btn-secondary-fintech"
            style={{ color: '#fbbf24', borderColor: 'rgba(245,158,11,0.3)', opacity: isReview ? 0.6 : 1 }}
          >
            <Lock size={14} /> {acting ? 'Updating...' : 'Require 3DS Review'}
          </button>
          <button
            onClick={() => handleAction('ALLOW')}
            disabled={acting || isAllowed}
            className="btn-primary-fintech"
            style={{ background: '#10b981', opacity: isAllowed ? 0.6 : 1 }}
          >
            <CheckCircle2 size={14} /> {acting ? 'Updating...' : 'Allow Payment'}
          </button>
        </div>
      </div>

    </div>
  );
}
