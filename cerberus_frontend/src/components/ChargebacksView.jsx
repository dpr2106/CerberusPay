import React, { useState, useEffect } from 'react';
import { FileText, ShieldCheck, Clock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export default function ChargebacksView({ onInvestigateDispute }) {
  const [disputes, setDisputes] = useState([]);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchChargebacks = () => {
    fetch('http://localhost:8000/api/chargebacks')
      .then(res => {
        if (!res.ok) throw new Error(`Backend returned status ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data.disputes && data.disputes.length > 0) {
          setDisputes(data.disputes);
          if (!selectedDispute) {
            setSelectedDispute(data.disputes[0]);
          } else {
            // keep current selection updated
            const updatedSelection = data.disputes.find(d => d.id === selectedDispute.id);
            if (updatedSelection) setSelectedDispute(updatedSelection);
          }
        }
      })
      .catch(err => {
        console.error('[CerberusPay] Failed to load chargeback disputes:', err);
        setErrorMessage('Unable to connect to dispute operations service. Ensure FastAPI backend is running on port 8000.');
      });
  };

  useEffect(() => {
    fetchChargebacks();
  }, []);

  const handleGenerateEvidence = async (txId) => {
    if (isCompiling) return; // Prevent duplicate clicks
    setIsCompiling(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('http://localhost:8000/api/chargeback/generate-evidence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transaction_id: txId, reason: 'REPRESENTMENT_SUBMISSION' })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || `Server returned ${res.status}`);
      }

      const data = await res.json();
      if (data.evidence_packet) {
        // 1. Update selected dispute in place
        setSelectedDispute(prev => ({
          ...prev,
          status: 'RESPONDED',
          evidence: data.evidence_packet
        }));

        // 2. Update disputes array
        setDisputes(prev => prev.map(d => {
          if (d.transaction_id === txId) {
            return { ...d, status: 'RESPONDED', evidence: data.evidence_packet };
          }
          return d;
        }));

        setSuccessMessage('Cryptographic dispute representation packet successfully compiled and stored on backend!');
        setTimeout(() => setSuccessMessage(null), 4000);

        // 3. Re-fetch from FastAPI backend to guarantee 100% synchronization
        fetchChargebacks();
      }
    } catch (err) {
      console.error('[CerberusPay] Error generating chargeback evidence:', err);
      setErrorMessage(`Evidence compilation failed: ${err.message || 'Network error'}`);
    } finally {
      setIsCompiling(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN': return <span className="badge-blocked">OPEN DISPUTE</span>;
      case 'UNDER_REVIEW': return <span className="badge-review">UNDER REVIEW</span>;
      case 'RESPONDED': return <span className="badge-allowed">RESPONDED</span>;
      default: return <span className="badge-source">{status}</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* TOAST SUCCESS */}
      {successMessage && (
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
          <span>{successMessage}</span>
        </div>
      )}

      {/* TOAST ERROR */}
      {errorMessage && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid #ef4444',
          color: '#f87171',
          padding: '10px 16px',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* HEADER STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="fintech-card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>ACTIVE CHARGEBACK CASES</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
            {disputes.length} Disputes
          </div>
        </div>
        <div className="fintech-card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>TOTAL DISPUTED VALUE</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f87171', marginTop: '2px' }}>
            ₹{disputes.reduce((acc, d) => acc + (d.amount || 0), 0).toLocaleString('en-IN')}
          </div>
        </div>
        <div className="fintech-card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>ESTIMATED WIN PROBABILITY</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
            94.6% Average
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr', gap: '1.5rem' }}>
        
        {/* DISPUTES QUEUE */}
        <div className="fintech-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '0.85rem 1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Dispute Operations Queue</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Select a dispute to inspect evidence packet and open transaction investigation
            </p>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', background: 'var(--bg-secondary)' }}>
                <th style={{ padding: '9px 14px', fontWeight: 600 }}>CASE & TRANSACTION</th>
                <th style={{ padding: '9px 14px', fontWeight: 600 }}>AMOUNT</th>
                <th style={{ padding: '9px 14px', fontWeight: 600 }}>REASON</th>
                <th style={{ padding: '9px 14px', fontWeight: 600 }}>STATUS</th>
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
                  <td style={{ padding: '11px 14px' }}>
                    <span className="mono" style={{ fontWeight: 700, color: '#fff' }}>{d.id}</span>
                    <div className="mono" style={{ fontSize: '11px', color: '#60a5fa' }}>{d.transaction_id}</div>
                  </td>
                  <td style={{ padding: '11px 14px', fontWeight: 700, color: '#fff' }}>
                    ₹{d.amount?.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '11px 14px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {d.reason_code} • {d.reason?.replace(/_/g, ' ')}
                  </td>
                  <td style={{ padding: '11px 14px' }}>
                    {getStatusBadge(d.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* EVIDENCE PACKET & INTEGRATED INVESTIGATION */}
        <div className="fintech-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {selectedDispute ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>CHARGEBACK DOSSIER</div>
                  <span className="mono" style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>
                    {selectedDispute.id}
                  </span>
                </div>
                {getStatusBadge(selectedDispute.status)}
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Target Transaction:</span>
                  <strong className="mono" style={{ color: '#fff' }}>{selectedDispute.transaction_id}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Disputed Amount:</span>
                  <strong style={{ color: '#f87171' }}>₹{selectedDispute.amount?.toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Customer Account:</span>
                  <span style={{ color: '#cbd5e1' }}>{selectedDispute.customer}</span>
                </div>
              </div>

              {/* JUMP TO INVESTIGATION BUTTON */}
              <button
                onClick={() => onInvestigateDispute(selectedDispute.transaction_id)}
                className="btn-secondary-fintech"
                style={{ width: '100%', justifyContent: 'center', marginBottom: '1rem', fontSize: '12px' }}
              >
                <span>Investigate Transaction Dossier ({selectedDispute.transaction_id})</span>
                <ArrowRight size={14} />
              </button>

              {/* EVIDENCE STATUS */}
              {selectedDispute.evidence ? (
                <div style={{ border: '1px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.05)', padding: '1rem', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>STRUCTURED EVIDENCE PACKET COMPILED</span>
                    <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{selectedDispute.evidence.evidence_id}</span>
                  </div>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                    {selectedDispute.evidence.verdict}
                  </h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {selectedDispute.evidence.packet_summary}
                  </p>
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#10b981', fontWeight: 600 }}>
                    Estimated Win Probability: {selectedDispute.evidence.win_probability || '94.6%'}
                  </div>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                    No representment packet submitted yet. Click below to compile cryptographic audit logs into an official bank evidence packet.
                  </p>
                  <button
                    onClick={() => handleGenerateEvidence(selectedDispute.transaction_id)}
                    disabled={isCompiling}
                    className="btn-primary-fintech"
                    style={{ width: '100%', justifyContent: 'center', opacity: isCompiling ? 0.7 : 1, cursor: isCompiling ? 'not-allowed' : 'pointer' }}
                  >
                    <FileText size={14} />
                    {isCompiling ? 'Compiling Evidentiary Packet from Backend...' : 'Generate Bank Evidence Packet'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>
              Select a dispute from the queue.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}