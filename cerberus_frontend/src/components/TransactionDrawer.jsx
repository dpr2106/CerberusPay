import React from 'react';
import { X, ShieldAlert, ShieldCheck, AlertTriangle, Clock, MapPin, Activity, Globe, Smartphone, User, DollarSign } from 'lucide-react';

export default function TransactionDrawer({ transaction, onClose }) {
  if (!transaction) return null;

  const score = transaction.risk_score || 0;
  const getRiskLevel = (s) => {
    if (s >= 90) return { label: 'CRITICAL', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' };
    if (s >= 70) return { label: 'HIGH', color: '#f87171', bg: 'rgba(248, 113, 113, 0.15)' };
    if (s >= 30) return { label: 'MEDIUM', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' };
    return { label: 'LOW', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' };
  };

  const riskMeta = getRiskLevel(score);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(4px)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      <div 
        className="custom-scrollbar"
        style={{
          width: '100%',
          maxWidth: '520px',
          height: '100%',
          background: 'var(--bg-card)',
          borderLeft: '1px solid var(--border-subtle)',
          padding: '1.75rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.5)'
        }}
      >
        
        {/* DRAWER HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="mono" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
                {transaction.id}
              </span>
              <span className="badge-source">{transaction.source || 'SIMULATED'}</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Transaction Investigation Dossier
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              borderRadius: '6px',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* RISK SCORE VISUALIZATION (RULE 5) */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: `1px solid ${riskMeta.color}33`,
          borderRadius: '8px',
          padding: '1.25rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Risk Score Assessment
            </span>
            <span style={{
              background: riskMeta.bg,
              color: riskMeta.color,
              padding: '2px 8px',
              borderRadius: '4px',
              fontWeight: 800,
              fontSize: '11px'
            }}>
              {riskMeta.label}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: riskMeta.color, letterSpacing: '-0.03em', lineHeight: 1 }}>
              {score}
            </span>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 600 }}>/ 100</span>
          </div>

          {/* Clean Progress Bar */}
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

        {/* TRANSACTION METADATA GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', padding: '0.75rem', borderRadius: '6px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Amount</div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
              ₹{transaction.amount?.toLocaleString('en-IN')}
            </div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', padding: '0.75rem', borderRadius: '6px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Decision</div>
            <div style={{ marginTop: '2px' }}>
              {transaction.action === 'BLOCK' && <span className="badge-blocked">BLOCK</span>}
              {transaction.action === 'CHALLENGE_STEP_UP_OTP' && <span className="badge-review">CHALLENGE 3DS</span>}
              {transaction.action === 'ALLOW' && <span className="badge-allowed">ALLOW</span>}
            </div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', padding: '0.75rem', borderRadius: '6px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>User / Cardholder</div>
            <div className="mono" style={{ fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginTop: '2px' }}>
              {transaction.user_id}
            </div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', padding: '0.75rem', borderRadius: '6px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Timestamp</div>
            <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '2px' }}>
              {new Date(transaction.timestamp).toLocaleTimeString()}
            </div>
          </div>

        </div>

        {/* WHY WAS THIS TRANSACTION BLOCKED / REVIEWED? (RULE 4 & 9) */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '1.25rem'
        }}>
          <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Decision Rationale
          </h4>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {transaction.decision_rationale}
          </p>

          {/* FACTOR BREAKDOWN */}
          <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.65rem' }}>
              Risk Factor Contributions
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {(transaction.feature_breakdown || [
                { factor: 'Geographic Distance Jump', weight: 42, description: `${transaction.signals?.geo_distance_km || 20} km deviation` },
                { factor: 'Transaction Velocity (1h)', weight: 28, description: `${transaction.signals?.velocity_1h || 1} transactions/hr` },
                { factor: 'Device / IP Trust Status', weight: 18, description: transaction.signals?.is_proxy_vpn ? 'VPN / Proxy detected' : 'Clean residential IP' }
              ]).map((f, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '2px' }}>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{f.factor}</span>
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

        {/* TRANSACTION INVESTIGATION TIMELINE (RULE 6) */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '1.25rem'
        }}>
          <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            Event Investigation Timeline
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', position: 'relative' }}>
            {(transaction.timeline || [
              { time: '09:41', event: 'User session initiated on merchant portal', severity: 'info' },
              { time: '09:43', event: 'Cart value and payment method attached', severity: 'info' },
              { time: '09:44', event: 'Device fingerprint and IP location resolved', severity: 'warning' },
              { time: '09:47', event: `Risk score computed: ${score}/100 -> Decision: ${transaction.action}`, severity: 'danger' }
            ]).map((step, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '12px' }}>
                <span className="mono" style={{ color: 'var(--text-muted)', fontSize: '11px', minWidth: '40px' }}>
                  {step.time}
                </span>
                <div style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: step.severity === 'danger' ? '#ef4444' : (step.severity === 'warning' ? '#f59e0b' : '#3b82f6'),
                  marginTop: '5px'
                }} />
                <span style={{ color: step.severity === 'danger' ? '#f87171' : 'var(--text-secondary)' }}>
                  {step.event}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}