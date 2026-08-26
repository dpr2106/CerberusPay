import React, { useState } from 'react';
import { 
  ShieldAlert, ShieldCheck, AlertTriangle, ArrowUpRight, 
  Layers, CheckCircle2, XCircle, Clock, MapPin, Activity, Globe, Smartphone, User, Lock
} from 'lucide-react';

export default function InvestigationView({ transaction, onUpdateAction, onNavigateToNetworks }) {
  const [acting, setActing] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);

  if (!transaction) {
    return (
      <div className="fintech-card" style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <ShieldAlert size={42} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
          No Transaction Selected for Investigation
        </h3>
        <p style={{ fontSize: '13px' }}>
          Go to the <strong>Monitor</strong> tab and click any suspicious transaction to open its investigation dossier.
        </p>
      </div>
    );
  }

  const score = transaction.risk_score || 0;
  const getRiskMeta = (s) => {
    if (s >= 90) return { label: 'CRITICAL RISK', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' };
    if (s >= 70) return { label: 'HIGH RISK', color: '#f87171', bg: 'rgba(248, 113, 113, 0.15)' };
    if (s >= 30) return { label: 'MEDIUM RISK', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' };
    return { label: 'LOW RISK', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' };
  };

  const riskMeta = getRiskMeta(score);

  const handleAction = async (newAction) => {
    setActing(true);
    try {
      const res = await fetch(`http://localhost:8000/api/risk/transactions/${transaction.id}/action?action=${newAction}`, {
        method: 'POST'
      });
      const data = await res.json();
      if (onUpdateAction) onUpdateAction(transaction.id, newAction);
      setActionSuccess(`Transaction decision successfully updated to: ${newAction}`);
      setTimeout(() => setActionSuccess(null), 3500);
    } catch {
      if (onUpdateAction) onUpdateAction(transaction.id, newAction);
      setActionSuccess(`Local decision override applied: ${newAction}`);
      setTimeout(() => setActionSuccess(null), 3500);
    }
    setActing(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      
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

      {/* 1. TOP HEADER DOSSIER BANNER */}
      <div className="fintech-card" style={{ padding: '1.5rem', borderLeft: `4px solid ${riskMeta.color}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="mono" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff' }}>
                {transaction.id}
              </span>
              <span className="badge-source">{transaction.source || 'SIMULATED'}</span>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              User: <strong style={{ color: '#fff' }}>{transaction.user_id}</strong> • Ingested: {new Date(transaction.timestamp).toLocaleString()}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
              ₹{transaction.amount?.toLocaleString('en-IN')}
            </div>
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', marginTop: '4px' }}>
              <span style={{ background: riskMeta.bg, color: riskMeta.color, padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 800 }}>
                {riskMeta.label}
              </span>
              <span style={{ background: 'rgba(255,255,255,0.06)', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                ACTION: {transaction.action}
              </span>
            </div>
          </div>
        </div>

        {/* RISK SCORE VISUAL GAUGE (SECTION 5) */}
        <div style={{ marginTop: '1.25rem', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Calculated Risk Score
            </span>
            <span className="mono" style={{ fontSize: '14px', fontWeight: 800, color: riskMeta.color }}>
              {score} / 100
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
            <span>0 LOW</span>
            <span>30 MEDIUM</span>
            <span>70 HIGH</span>
            <span>90 CRITICAL</span>
          </div>
        </div>
      </div>

      {/* 2. WHY WAS THIS BLOCKED? (SECTION 4) */}
      <div className="fintech-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
          Why Was This Transaction {transaction.action === 'BLOCK' ? 'Blocked' : 'Flagged'}?
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
          {transaction.decision_rationale}
        </p>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            Primary Risk Factors & Relative Signal Weights
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {(transaction.feature_breakdown || [
              { factor: 'Geographic Distance Jump', weight: 42, description: `${transaction.signals?.geo_distance_km || 20} km deviation from baseline` },
              { factor: '1-Hour Transaction Velocity', weight: 28, description: `${transaction.signals?.velocity_1h || 1} transactions within 60 minutes` },
              { factor: 'Device / Network Anonymizer', weight: 18, description: transaction.signals?.is_proxy_vpn ? 'VPN Proxy Detected' : 'Residential IP' }
            ]).map((f, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '3px' }}>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{f.factor}</span>
                  <span className="mono" style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{f.weight}%</span>
                </div>
                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${f.weight}%`, height: '100%', background: '#3b82f6', borderRadius: '2px' }} />
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{f.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. TRANSACTION CONTEXT CARDS (SECTION 6) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        
        <div className="fintech-card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
            Transaction Context
          </div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>₹{transaction.amount?.toLocaleString('en-IN')}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>Category: {transaction.category}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Source: {transaction.source || 'SIMULATED'}</div>
        </div>

        <div className="fintech-card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
            Behavioral Metrics
          </div>
          <div style={{ fontSize: '13px', color: '#fff' }}>
            Velocity: <strong>{transaction.signals?.velocity_1h || 1} tx/hr</strong>
          </div>
          <div style={{ fontSize: '13px', color: '#fff', marginTop: '2px' }}>
            Geo Offset: <strong>{transaction.signals?.geo_distance_km || 25} km</strong>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Account Age: {transaction.signals?.user_account_age_days || 180} days
          </div>
        </div>

        <div className="fintech-card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
            Device & Network
          </div>
          <div style={{ fontSize: '13px', color: transaction.signals?.is_proxy_vpn ? '#f87171' : '#34d399', fontWeight: 600 }}>
            {transaction.signals?.is_proxy_vpn ? 'VPN / Proxy Active' : 'Clean Residential IP'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Device Trust: {((transaction.signals?.device_trust || 0.9) * 100).toFixed(0)}%
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Card Declines: {transaction.signals?.card_fails_24h || 0} in 24h
          </div>
        </div>

      </div>

      {/* 4. WHAT HAPPENED? TIMELINE (SECTION 5) */}
      <div className="fintech-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>
          What Happened? (Investigation Timeline)
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {(transaction.timeline || [
            { time: '09:41:02', event: 'User authenticated on checkout portal', severity: 'info' },
            { time: '09:42:10', event: `Location verified (${transaction.signals?.geo_distance_km || 3200} km jump offset)`, severity: 'warning' },
            { time: '09:42:11', event: `Risk score computed: ${score}/100 -> Decision: ${transaction.action}`, severity: 'danger' }
          ]).map((step, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '13px' }}>
              <span className="mono" style={{ color: 'var(--text-muted)', fontSize: '12px', minWidth: '55px' }}>
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

      {/* 5. WHAT ELSE IS CONNECTED? (SECTION 7) */}
      <div className="fintech-card" style={{ padding: '1.25rem', borderLeft: '3px solid #3b82f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Entity Graph Correlation
          </div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
            Is this payment part of a coordinated abuse ring?
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Inspect correlated accounts sharing identical device fingerprints or proxy exit nodes in the graph.
          </div>
        </div>

        <button
          onClick={onNavigateToNetworks}
          className="btn-secondary-fintech"
          style={{ fontSize: '12px' }}
        >
          <Layers size={14} /> View in Networks Graph <ArrowUpRight size={14} />
        </button>
      </div>

      {/* 6. WHAT ACTION CAN I TAKE? (SECTION 8) */}
      <div className="fintech-card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Analyst Action Center
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Apply manual intervention override to this transaction record.
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <button
            onClick={() => handleAction('BLOCK')}
            disabled={acting}
            className="btn-secondary-fintech"
            style={{ color: '#f87171', borderColor: 'rgba(239,68,68,0.3)' }}
          >
            <XCircle size={14} /> Block Payment
          </button>
          <button
            onClick={() => handleAction('CHALLENGE_STEP_UP_OTP')}
            disabled={acting}
            className="btn-secondary-fintech"
            style={{ color: '#fbbf24', borderColor: 'rgba(245,158,11,0.3)' }}
          >
            <Lock size={14} /> Require 3DS Step-Up
          </button>
          <button
            onClick={() => handleAction('ALLOW')}
            disabled={acting}
            className="btn-primary-fintech"
            style={{ background: '#10b981' }}
          >
            <CheckCircle2 size={14} /> Allow Payment
          </button>
        </div>
      </div>

    </div>
  );
}