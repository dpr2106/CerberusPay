import React from 'react';
import { FileText } from 'lucide-react';

export default function ChargebackTab({
  disputeTxnId, setDisputeTxnId,
  disputeReason, setDisputeReason,
  evidencePacket, loadingEvidence,
  handleGenerateEvidence
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Head 3: Chargeback Auto-Responder</h2>
        <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1.5rem' }}>Compiles cryptographic evidentiary packets to win merchant dispute chargebacks</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Transaction ID in Dispute</label>
            <input
              type="text"
              value={disputeTxnId}
              onChange={(e) => setDisputeTxnId(e.target.value)}
              style={{ width: '100%', background: '#0d111a', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px 12px', borderRadius: '6px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Chargeback Reason Code</label>
            <select
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              style={{ width: '100%', background: '#0d111a', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px 12px', borderRadius: '6px' }}
            >
              <option value="FRAUDULENT_UNRECOGNIZED_CHARGE">Fraudulent / Unrecognized Charge (10.4)</option>
              <option value="PRODUCT_NOT_RECEIVED">Product Not Received (13.1)</option>
              <option value="DEFECTIVE_MERCHANDISE">Defective / Not as Described (13.3)</option>
            </select>
          </div>

          <button
            onClick={handleGenerateEvidence}
            disabled={loadingEvidence}
            className="btn-crimson"
            style={{ marginTop: '1rem', justifyContent: 'center' }}
          >
            <FileText size={16} /> {loadingEvidence ? 'Compiling Evidentiary Proofs...' : 'Generate Bank Evidence Packet'}
          </button>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        {evidencePacket ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>PACKET ID: <strong>{evidencePacket.evidence_id}</strong></span>
              <span className="badge-allow">WIN PROBABILITY: {evidencePacket.win_probability}</span>
            </div>

            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#34d399', marginBottom: '0.5rem' }}>{evidencePacket.verdict}</h3>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '1rem' }}>{evidencePacket.packet_summary}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {evidencePacket.proofs_compiled.map((proof, i) => (
                <div key={i} style={{ background: '#0d111a', padding: '8px 12px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span>{proof.type}</span>
                  <strong style={{ color: '#06b6d4' }}>{proof.confidence} Confidence</strong>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#64748b', padding: '2rem 0' }}>
            <FileText size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p>Click <strong>Generate Bank Evidence Packet</strong> to compile cryptographic dispute defense.</p>
          </div>
        )}
      </div>
    </div>
  );
}