import React, { useState } from 'react';
import { FileText, ShieldCheck, Clock, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';

export default function ChargebacksView() {
  const [disputes, setDisputes] = useState([
    {
      id: 'CB_90124A',
      transaction_id: 'TXN_8F91A20C',
      amount: 28450.0,
      reason: 'FRAUDULENT_UNRECOGNIZED_CHARGE',
      reason_code: '10.4',
      customer: 'Rahul M. (rahul.m@gmail.com)',
      risk_score: 92,
      status: 'OPEN',
      date: '2 hours ago',
      evidence: null
    },
    {
      id: 'CB_88291B',
      transaction_id: 'TXN_7E31B91D',
      amount: 14200.0,
      reason: 'PRODUCT_NOT_RECEIVED',
      reason_code: '13.1',
      customer: 'Kavita S. (kavita.s@yahoo.com)',
      risk_score: 45,
      status: 'RESPONDED',
      date: '1 day ago',
      evidence: {
        evidence_id: 'EVD_88291B',
        verdict: 'SIGNED_DELIVERY_CONFIRMED',
        win_probability: '94.6%',
        packet_summary: 'Compiled IP session match, device fingerprint continuity, and carrier delivery signature.'
      }
    },
    {
      id: 'CB_77102C',
      transaction_id: 'TXN_4A10C29F',
      amount: 45000.0,
      reason: 'FRAUDULENT_UNRECOGNIZED_CHARGE',
      reason_code: '10.4',
      customer: 'Vikram J. (vikram.j@outlook.com)',
      risk_score: 88,
      status: 'UNDER_REVIEW',
      date: '18 hours ago',
      evidence: null
    }
  ]);

  const [selectedDispute, setSelectedDispute] = useState(disputes[0]);
  const [isCompiling, setIsCompiling] = useState(false);

  const handleGenerateEvidence = (disputeId) => {
    setIsCompiling(true);
    setTimeout(() => {
      setDisputes(prev => prev.map(d => {
        if (d.id === disputeId) {
          return {
            ...d,
            status: 'RESPONDED',
            evidence: {
              evidence_id: `EVD_${d.id.slice(3)}`,
              verdict: 'AUTHENTIC_CARDHOLDER_PROOF',
              win_probability: '94.6%',
              packet_summary: 'Comprehensive evidentiary bundle demonstrating 3DS authentication, carrier delivery proof, and matching historical device fingerprint.'
            }
          };
        }
        return d;
      }));
      setIsCompiling(false);
      setSelectedDispute(prev => ({
        ...prev,
        status: 'RESPONDED',
        evidence: {
          evidence_id: `EVD_${prev.id.slice(3)}`,
          verdict: 'AUTHENTIC_CARDHOLDER_PROOF',
          win_probability: '94.6%',
          packet_summary: 'Comprehensive evidentiary bundle demonstrating 3DS authentication, carrier delivery proof, and matching historical device fingerprint.'
        }
      }));
    }, 800);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN': return <span className="badge-blocked">OPEN DISPUTE</span>;
      case 'UNDER_REVIEW': return <span className="badge-review">UNDER REVIEW</span>;
      case 'RESPONDED': return <span className="badge-allowed">RESPONDED</span>;
      case 'RESOLVED': return <span style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>RESOLVED</span>;
      default: return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* HEADER SUMMARY */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="fintech-card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>ACTIVE CHARGEBACKS</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
            {disputes.length} Cases
          </div>
        </div>
        <div className="fintech-card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>DISPUTED VOLUME</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f87171', marginTop: '2px' }}>
            ₹{disputes.reduce((acc, d) => acc + d.amount, 0).toLocaleString('en-IN')}
          </div>
        </div>
        <div className="fintech-card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>DEFENSE WIN PROBABILITY</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
            94.6% Avg
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.4fr', gap: '1.5rem' }}>
        
        {/* DISPUTES TABLE */}
        <div className="fintech-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Chargeback Operations Queue</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Merchant dispute representations and evidence submission</p>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', background: 'var(--bg-secondary)' }}>
                <th style={{ padding: '10px 14px', fontWeight: 600 }}>DISPUTE ID</th>
                <th style={{ padding: '10px 14px', fontWeight: 600 }}>AMOUNT</th>
                <th style={{ padding: '10px 14px', fontWeight: 600 }}>REASON</th>
                <th style={{ padding: '10px 14px', fontWeight: 600 }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {disputes.map((d, i) => (
                <tr
                  key={i}
                  onClick={() => setSelectedDispute(d)}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    background: selectedDispute?.id === d.id ? 'var(--bg-hover)' : 'transparent'
                  }}
                >
                  <td style={{ padding: '12px 14px' }}>
                    <span className="mono" style={{ fontWeight: 600, color: '#fff' }}>{d.id}</span>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{d.transaction_id}</div>
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#fff' }}>
                    ₹{d.amount.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {d.reason_code} • {d.reason.replace(/_/g, ' ')}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    {getStatusBadge(d.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* DISPUTE EVIDENCE & AUTO-RESPONDER DOSSIER */}
        <div className="fintech-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {selectedDispute ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span className="mono" style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>
                  {selectedDispute.id}
                </span>
                {getStatusBadge(selectedDispute.status)}
              </div>

              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Customer: <strong>{selectedDispute.customer}</strong>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Disputed Transaction:</span>
                  <span className="mono" style={{ color: '#fff' }}>{selectedDispute.transaction_id}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Disputed Value:</span>
                  <strong style={{ color: '#f87171' }}>₹{selectedDispute.amount.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              {/* EVIDENCE STATUS */}
              {selectedDispute.evidence ? (
                <div style={{ border: '1px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.05)', padding: '1rem', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>EVIDENCE PACKET COMPILED</span>
                    <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{selectedDispute.evidence.evidence_id}</span>
                  </div>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                    {selectedDispute.evidence.verdict}
                  </h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {selectedDispute.evidence.packet_summary}
                  </p>
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#10b981', fontWeight: 600 }}>
                    Estimated Win Probability: {selectedDispute.evidence.win_probability}
                  </div>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    No representation evidence packet submitted yet. Click below to compile cryptographic audit proofs.
                  </p>
                  <button
                    onClick={() => handleGenerateEvidence(selectedDispute.id)}
                    disabled={isCompiling}
                    className="btn-primary-fintech"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <FileText size={15} />
                    {isCompiling ? 'Compiling Evidentiary Proofs...' : 'Generate Bank Evidence Packet'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>
              Select a dispute from the queue to inspect evidence.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}