import React, { useState, useEffect, useMemo } from 'react';
import { FileText, ShieldCheck, Clock, CheckCircle2, AlertCircle, ArrowRight, X, AlertTriangle } from 'lucide-react';

export default function ChargebacksView({ 
  targetTransactionId = null, 
  onInvestigateDispute, 
  onClearTransactionFilter 
}) {
  const [disputes, setDisputes] = useState([]);
  const [selectedDisputeId, setSelectedDisputeId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // 1. SINGLE SOURCE OF TRUTH: Derive selectedDispute directly from disputes state
  const selectedDispute = useMemo(() => {
    if (!selectedDisputeId || disputes.length === 0) return null;
    return disputes.find(d => d.id === selectedDisputeId) || null;
  }, [disputes, selectedDisputeId]);

  // Fetch chargebacks from FastAPI
  const fetchChargebacks = () => {
    setIsLoading(true);
    setErrorMessage(null);

    fetch('http://127.0.0.1:8000/api/chargebacks')
      .then(res => {
        if (!res.ok) {
          throw new Error(`Chargebacks API returned HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        setIsLoading(false);
        const loadedDisputes = data.disputes || [];
        setDisputes(loadedDisputes);

        if (targetTransactionId) {
          const matched = loadedDisputes.find(d => d.transaction_id === targetTransactionId || d.id === targetTransactionId);
          if (matched) {
            setSelectedDisputeId(matched.id);
          } else {
            setSelectedDisputeId(null);
          }
        } else if (!selectedDisputeId && loadedDisputes.length > 0) {
          setSelectedDisputeId(loadedDisputes[0].id);
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.error('[CerberusPay Chargebacks API Error] Failed to fetch chargebacks:', err);
        setErrorMessage(`Unable to connect to Dispute Operations service: ${err.message}. Ensure backend is running on port 8000.`);
      });
  };

  useEffect(() => {
    fetchChargebacks();
  }, [targetTransactionId]);

  useEffect(() => {
    if (disputes.length > 0) {
      if (targetTransactionId) {
        const matched = disputes.find(d => d.transaction_id === targetTransactionId || d.id === targetTransactionId);
        setSelectedDisputeId(matched ? matched.id : null);
      } else if (!selectedDisputeId) {
        setSelectedDisputeId(disputes[0].id);
      }
    }
  }, [targetTransactionId, disputes]);

  // Generate cryptographic evidence packet and update dispute status
  const handleGenerateEvidence = async (txId, caseId) => {
    if (isCompiling) return;
    setIsCompiling(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/chargeback/generate-evidence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transaction_id: txId, reason: 'REPRESENTMENT_SUBMISSION' })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || `Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      const packet = data.evidence_packet;

      if (packet) {
        setDisputes(prevDisputes => prevDisputes.map(d => {
          if (d.transaction_id === txId || d.id === caseId) {
            return {
              ...d,
              status: 'RESPONDED',
              evidence: packet
            };
          }
          return d;
        }));

        setSuccessMessage(`Evidence packet successfully compiled for case ${caseId} (${txId})!`);
        setTimeout(() => setSuccessMessage(null), 4500);
      }
    } catch (err) {
      console.error('[CerberusPay Chargebacks API Error] Evidence compilation failed:', err);
      setErrorMessage(`Evidence packet generation failed: ${err.message}`);
    } finally {
      setIsCompiling(false);
    }
  };

  // Semantic Status Colors (Red for Open, Amber for Review, Green for Responded)
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
          border: '1px solid #10B981',
          color: '#34D399',
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
          border: '1px solid #EF4444',
          color: '#F87171',
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

      {/* TRANSACTION FILTER BANNER */}
      {targetTransactionId && (
        <div style={{
          background: 'rgba(249, 115, 22, 0.12)',
          border: '1px solid rgba(249, 115, 22, 0.35)',
          borderRadius: '6px',
          padding: '8px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FB923C' }}>
            <FileText size={15} />
            <span>Filtering disputes associated with Transaction: <strong className="mono" style={{ color: '#F8FAFC' }}>{targetTransactionId}</strong></span>
          </div>
          {onClearTransactionFilter && (
            <button
              onClick={onClearTransactionFilter}
              className="btn-secondary-fintech"
              style={{ padding: '3px 8px', fontSize: '11px', gap: '4px' }}
            >
              <X size={12} />
              <span>Show All Disputes</span>
            </button>
          )}
        </div>
      )}

      {/* HEADER STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="fintech-card" style={{ padding: '1.1rem' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>ACTIVE CHARGEBACK CASES</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F8FAFC', marginTop: '2px' }}>
            {disputes.length} Disputes
          </div>
        </div>
        <div className="fintech-card" style={{ padding: '1.1rem' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>TOTAL DISPUTED VALUE</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F87171', marginTop: '2px' }}>
            ₹{disputes.reduce((acc, d) => acc + (d.amount || 0), 0).toLocaleString('en-IN')}
          </div>
        </div>
        <div className="fintech-card" style={{ padding: '1.1rem' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>ESTIMATED WIN PROBABILITY</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10B981', marginTop: '2px' }}>
            94.6% Average
          </div>
        </div>
      </div>

      {/* TWO-COLUMN SYNCHRONIZED LAYOUT */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.6fr', gap: '1.5rem' }}>
        
        {/* LEFT COLUMN: DISPUTES QUEUE */}
        <div className="fintech-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '0.85rem 1.25rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)' }}>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#F8FAFC' }}>Dispute Operations Queue</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '1px' }}>
                Select a dispute to inspect evidence packet and open transaction investigation
              </p>
            </div>
            <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {disputes.length} Cases
            </span>
          </div>

          {disputes.length > 0 ? (
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
                {disputes.map((d) => {
                  const isSelected = selectedDisputeId === d.id;
                  return (
                    <tr
                      key={d.id}
                      onClick={() => setSelectedDisputeId(d.id)}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        background: isSelected ? 'rgba(249, 115, 22, 0.12)' : 'transparent',
                        borderLeft: isSelected ? '3px solid #F97316' : '3px solid transparent',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseOver={(e) => {
                        if (!isSelected) e.currentTarget.style.background = 'var(--bg-hover)';
                      }}
                      onMouseOut={(e) => {
                        if (!isSelected) e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <td style={{ padding: '11px 14px' }}>
                        <span className="mono" style={{ fontWeight: 700, color: '#F8FAFC' }}>{d.id}</span>
                        <div className="mono" style={{ fontSize: '11px', color: '#FB923C' }}>{d.transaction_id}</div>
                      </td>
                      <td style={{ padding: '11px 14px', fontWeight: 700, color: '#F8FAFC' }}>
                        ₹{d.amount?.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '11px 14px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {d.reason_code} • {d.reason?.replace(/_/g, ' ')}
                      </td>
                      <td style={{ padding: '11px 14px' }}>
                        {getStatusBadge(d.status)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)', fontSize: '13px' }}>
              {isLoading ? 'Loading active chargeback disputes...' : 'No dispute records currently found in queue.'}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: CHARGEBACK DOSSIER */}
        <div className="fintech-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {selectedDispute ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>CHARGEBACK DOSSIER</div>
                  <span className="mono" style={{ fontSize: '16px', fontWeight: 800, color: '#F8FAFC' }}>
                    {selectedDispute.id}
                  </span>
                </div>
                {getStatusBadge(selectedDispute.status)}
              </div>

              {/* Exact Case & Transaction Meta */}
              <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Target Transaction:</span>
                  <strong className="mono" style={{ color: '#F8FAFC' }}>{selectedDispute.transaction_id}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Disputed Amount:</span>
                  <strong style={{ color: '#F87171' }}>₹{selectedDispute.amount?.toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Customer Account:</span>
                  <span style={{ color: '#CBD5E1' }}>{selectedDispute.customer}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Dispute Reason:</span>
                  <span style={{ color: '#F59E0B', fontWeight: 600 }}>{selectedDispute.reason_code} • {selectedDispute.reason?.replace(/_/g, ' ')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Created Timestamp:</span>
                  <span style={{ color: 'var(--text-muted)' }}>{new Date(selectedDispute.created_at).toLocaleString()}</span>
                </div>
              </div>

              {/* JUMP TO INVESTIGATION BUTTON */}
              <button
                onClick={() => onInvestigateDispute && onInvestigateDispute(selectedDispute.transaction_id)}
                className="btn-secondary-fintech"
                style={{ width: '100%', justifyContent: 'center', marginBottom: '1rem', fontSize: '12px' }}
              >
                <span>Investigate Target Transaction ({selectedDispute.transaction_id})</span>
                <ArrowRight size={14} />
              </button>

              {/* EVIDENCE PACKET STATUS */}
              {selectedDispute.evidence ? (
                <div style={{ border: '1px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.06)', padding: '1rem', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 700 }}>STRUCTURED EVIDENCE PACKET COMPILED</span>
                    <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{selectedDispute.evidence.evidence_id}</span>
                  </div>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#F8FAFC', marginBottom: '4px' }}>
                    {selectedDispute.evidence.verdict}
                  </h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {selectedDispute.evidence.packet_summary}
                  </p>
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#10B981', fontWeight: 600 }}>
                    Estimated Win Probability: {selectedDispute.evidence.win_probability || '94.6%'}
                  </div>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                    No representment packet submitted yet. Click below to compile cryptographic audit logs into an official bank evidence packet.
                  </p>
                  <button
                    onClick={() => handleGenerateEvidence(selectedDispute.transaction_id, selectedDispute.id)}
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
          ) : targetTransactionId ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: 'var(--text-muted)' }}>
              <AlertTriangle size={36} color="#F59E0B" style={{ margin: '0 auto 1rem', opacity: 0.8 }} />
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#F8FAFC', marginBottom: '6px' }}>
                No Chargeback Case for {targetTransactionId}
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', maxWidth: '320px', margin: '0 auto 1.25rem', lineHeight: 1.4 }}>
                This transaction does not currently have an active dispute or bank representment filing.
              </p>
              {onClearTransactionFilter && (
                <button
                  onClick={onClearTransactionFilter}
                  className="btn-primary-fintech"
                  style={{ margin: '0 auto', fontSize: '12px' }}
                >
                  View All Active Disputes
                </button>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3.5rem 1.5rem', fontSize: '13px' }}>
              <FileText size={36} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              Select a dispute from the operations queue to inspect its chargeback dossier.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
