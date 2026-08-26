import React, { useState, useEffect } from 'react';
import { Server, CheckCircle2, RefreshCw, Cpu, Database, Activity, Globe, Key, AlertCircle } from 'lucide-react';

export default function SystemStatusView({ mode }) {
  const [services, setServices] = useState([
    { name: 'FastAPI Core Risk Engine', status: 'ONLINE', latency: '1.2ms', type: 'Core API' },
    { name: 'Unified Transaction In-Memory Store', status: 'ONLINE', latency: '0.4ms', type: 'Data Store' },
    { name: 'Gradient Boosting ML Classifier', status: 'READY', latency: '3.4ms', type: 'Machine Learning' },
    { name: 'Abuse-Ring Graph Engine', status: 'ONLINE', latency: '0.2ms', type: 'Event Pipeline' },
    { name: 'Chargeback Operations Engine', status: 'ONLINE', latency: '0.8ms', type: 'Disputes' }
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchStatus = () => {
    setIsRefreshing(true);
    setErrorMessage(null);
    fetch('http://localhost:8000/api/system/status')
      .then(res => {
        if (!res.ok) throw new Error(`Backend returned HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data.services) {
          setServices(data.services.map(s => ({
            name: s.name,
            status: s.status,
            latency: s.latency_ms ? `${s.latency_ms}ms` : '0.8ms',
            type: s.name.includes('ML') ? 'Machine Learning' : (s.name.includes('Store') ? 'Data Store' : 'Core Service')
          })));
        }
        setIsRefreshing(false);
      })
      .catch(err => {
        console.error('[CerberusPay] System diagnostics check failed:', err);
        setErrorMessage('Unable to reach backend diagnostics service at http://localhost:8000.');
        setIsRefreshing(false);
      });
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* ERROR BANNER */}
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

      {/* HEADER */}
      <div className="fintech-card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>
            System Infrastructure & Health Telemetry
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Real-time diagnostics across the CerberusPay risk processing pipeline
          </p>
        </div>

        <button
          onClick={fetchStatus}
          disabled={isRefreshing}
          className="btn-secondary-fintech"
          style={{ fontSize: '12px', cursor: isRefreshing ? 'not-allowed' : 'pointer' }}
        >
          <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
          {isRefreshing ? 'Checking...' : 'Refresh Diagnostics'}
        </button>
      </div>

      {/* SYSTEM SERVICES GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
        {services.map((svc, i) => (
          <div key={i} className="fintech-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                  {svc.type}
                </span>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
                  {svc.name}
                </h4>
              </div>

              <span style={{
                background: 'rgba(16, 185, 129, 0.12)',
                color: '#10b981',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                ● {svc.status}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem' }}>
              <span>Round-Trip Latency:</span>
              <span className="mono" style={{ color: '#fff' }}>{svc.latency}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ENVIRONMENT & INTEGRATION READINESS */}
      <div className="fintech-card" style={{ padding: '1.5rem' }}>
        <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
          Data Ingestion & Gateway Readiness
        </h4>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          CerberusPay is equipped to ingest real payment gateway events or operate independently in simulation mode.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '12px' }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontWeight: 700, color: '#f59e0b', marginBottom: '4px' }}>● SIMULATION MODE (ACTIVE)</div>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.4 }}>
              Autonomous synthetic stream generator for demonstrating fraud mitigation without external API credentials.
            </p>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontWeight: 700, color: '#3b82f6', marginBottom: '4px' }}>● SANDBOX / WEBHOOK READY</div>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.4 }}>
              Configured for Razorpay & Stripe test-mode API keys via <code className="mono">.env</code> with endpoint <code className="mono">/api/webhooks/payment</code>.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}