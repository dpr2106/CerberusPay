import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Zap, CreditCard, ShieldCheck, ShieldAlert, AlertTriangle, 
  Send, RefreshCw, CheckCircle2, ArrowRight, Code, Terminal, Globe, Lock
} from 'lucide-react';

export default function PaymentIngestModal({ isOpen, onClose, onPaymentIngested }) {
  const [method, setMethod] = useState('UPI'); // 'UPI' | 'CARD' | 'NETBANKING'
  const [amount, setAmount] = useState(2499);
  const [userId, setUserId] = useState('USR_8921');
  const [vpa, setVpa] = useState('customer@okhdfcbank');
  const [cardLast4, setCardLast4] = useState('4111');
  const [cardIssuer, setCardIssuer] = useState('HDFC Bank');
  const [velocity, setVelocity] = useState(1);
  const [geoDistance, setGeoDistance] = useState(0);
  const [isProxy, setIsProxy] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  if (!isOpen) return null;

  // Preset Handlers for 1-Click Attack Simulation
  const applyPreset = (type) => {
    if (type === 'AUTHENTIC') {
      setMethod('UPI');
      setAmount(1499);
      setUserId('USR_7820');
      setVpa('shopper@okhdfcbank');
      setVelocity(1);
      setGeoDistance(0);
      setIsProxy(false);
    } else if (type === 'CARD_TESTING') {
      setMethod('CARD');
      setAmount(42800);
      setUserId('USR_8921');
      setCardLast4('9210');
      setCardIssuer('HDFC Bank');
      setVelocity(9);
      setGeoDistance(4800);
      setIsProxy(true);
    } else if (type === 'HIGH_VALUE_STEPUP') {
      setMethod('CARD');
      setAmount(18500);
      setUserId('USR_3410');
      setCardLast4('8842');
      setCardIssuer('ICICI Bank');
      setVelocity(3);
      setGeoDistance(1200);
      setIsProxy(false);
    }
  };

  const handleDispatchPayment = async () => {
    setIsLoading(true);
    setLastResult(null);

    const payload = {
      user_id: userId,
      amount: Number(amount),
      payment_method: method,
      vpa: method === 'UPI' ? vpa : null,
      card_last4: method === 'CARD' ? cardLast4 : null,
      card_network: 'Visa',
      card_issuer: cardIssuer,
      geo_distance_km: Number(geoDistance),
      velocity_1h: Number(velocity),
      is_proxy: isProxy ? 1 : 0,
      device_id: isProxy ? 'DEV_FINGERPRINT_A9' : 'DEV_LOCAL_FINGERPRINT',
      merchant_category: 'electronics_high_value'
    };

    try {
      const res = await fetch('http://127.0.0.1:8000/api/gateway/simulate-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Gateway dispatch failed');

      setLastResult(data);
      if (onPaymentIngested && data.transaction) {
        onPaymentIngested(data.transaction);
      }
    } catch (err) {
      alert(`Ingestion error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 7, 11, 0.85)',
      backdropFilter: 'blur(12px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      boxSizing: 'border-box'
    }}>
      
      {/* MODAL CARD */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', stiffness: 450, damping: 30 }}
        style={{
          width: '100%',
          maxWidth: '720px',
          background: 'var(--bg-card)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          borderRadius: '12px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(14, 165, 233, 0.2)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh'
        }}
      >
        
        {/* HEADER */}
        <div style={{
          padding: '1.15rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(13, 18, 29, 0.8)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <Zap size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#fff', margin: 0 }}>
                Razorpay Payment Gateway & Webhook Sentinel
              </h3>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>
                Real-time pre-authorization ML scoring & instant ledger ingestion
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '6px'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* 1-CLICK PRESET BUTTONS */}
        <div style={{
          padding: '0.85rem 1.5rem',
          background: 'rgba(8, 11, 17, 0.6)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Instant Presets:
          </span>

          <button
            onClick={() => applyPreset('AUTHENTIC')}
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#34d399',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(52, 211, 153, 0.35)',
              padding: '4px 9px',
              borderRadius: '5px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <ShieldCheck size={12} />
            <span>Authentic UPI (₹1,499)</span>
          </button>

          <button
            onClick={() => applyPreset('CARD_TESTING')}
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#f87171',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(248, 113, 113, 0.35)',
              padding: '4px 9px',
              borderRadius: '5px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <ShieldAlert size={12} />
            <span>Attack Burst (₹42,800 + Proxy)</span>
          </button>

          <button
            onClick={() => applyPreset('HIGH_VALUE_STEPUP')}
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#fbbf24',
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(251, 191, 36, 0.35)',
              padding: '4px 9px',
              borderRadius: '5px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <AlertTriangle size={12} />
            <span>3DS Challenge (₹18,500)</span>
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="custom-scrollbar" style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* METHOD SELECTOR */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Payment Method
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['UPI', 'CARD', 'NETBANKING'].map(m => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    background: method === m ? 'rgba(59, 130, 246, 0.2)' : 'var(--bg-secondary)',
                    border: `1px solid ${method === m ? 'var(--accent)' : 'var(--border-subtle)'}`,
                    color: method === m ? '#fff' : 'var(--text-secondary)',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* FORM GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            
            {/* AMOUNT */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                Amount (INR ₹)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '8px 10px',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 700
                }}
              />
            </div>

            {/* USER ID */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                Customer User Account
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="mono"
                style={{
                  width: '100%',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '8px 10px',
                  color: '#fff',
                  fontSize: '13px'
                }}
              />
            </div>

            {/* UPI VPA OR CARD */}
            {method === 'UPI' && (
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  UPI ID (VPA)
                </label>
                <input
                  type="text"
                  value={vpa}
                  onChange={(e) => setVpa(e.target.value)}
                  placeholder="name@okhdfcbank"
                  className="mono"
                  style={{
                    width: '100%',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '8px 10px',
                    color: '#38bdf8',
                    fontSize: '13px'
                  }}
                />
              </div>
            )}

            {method === 'CARD' && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Card Last 4 Digits
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={cardLast4}
                    onChange={(e) => setCardLast4(e.target.value)}
                    className="mono"
                    style={{
                      width: '100%',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      padding: '8px 10px',
                      color: '#fff',
                      fontSize: '13px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Card Issuing Bank
                  </label>
                  <input
                    type="text"
                    value={cardIssuer}
                    onChange={(e) => setCardIssuer(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      padding: '8px 10px',
                      color: '#fff',
                      fontSize: '13px'
                    }}
                  />
                </div>
              </>
            )}

          </div>

          {/* TELEMETRY & ATTACK SIGNALS */}
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem'
          }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Simulated Telemetry & Threat Vector Toggles
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  1-Hour Velocity: <strong>{velocity} txns/hr</strong>
                </label>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={velocity}
                  onChange={(e) => setVelocity(e.target.value)}
                  style={{ width: '100%', accentColor: '#38bdf8' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Geo Jump Distance: <strong>{geoDistance} km</strong>
                </label>
                <input
                  type="range"
                  min="0"
                  max="8000"
                  step="200"
                  value={geoDistance}
                  onChange={(e) => setGeoDistance(e.target.value)}
                  style={{ width: '100%', accentColor: '#38bdf8' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <input
                type="checkbox"
                id="proxyCheck"
                checked={isProxy}
                onChange={(e) => setIsProxy(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#ef4444' }}
              />
              <label htmlFor="proxyCheck" style={{ fontSize: '12px', color: isProxy ? '#f87171' : 'var(--text-secondary)', fontWeight: isProxy ? 700 : 500, cursor: 'pointer' }}>
                Simulate Anonymized Tor / Proxy Egress Subnet (Datacenter IP)
              </label>
            </div>
          </div>

          {/* LAST EXECUTION VERDICT / LIVE RAZORPAY RESPONSE */}
          {lastResult && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'rgba(13, 18, 29, 0.95)',
                border: `1px solid ${lastResult.payment.cerberus_evaluation.action === 'BLOCK' ? '#ef4444' : (lastResult.payment.cerberus_evaluation.action === 'CHALLENGE_STEP_UP_OTP' ? '#f59e0b' : '#10b981')}`,
                borderRadius: '8px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="mono" style={{ fontWeight: 800, color: '#fff', fontSize: '13px' }}>
                    {lastResult.payment.id}
                  </span>
                  <span className="badge-source">Razorpay Test Gateway</span>
                </div>
                <span className={lastResult.payment.cerberus_evaluation.action === 'BLOCK' ? 'badge-blocked' : (lastResult.payment.cerberus_evaluation.action === 'CHALLENGE_STEP_UP_OTP' ? 'badge-review' : 'badge-allowed')}>
                  {lastResult.payment.cerberus_evaluation.action}
                </span>
              </div>

              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                <strong>Decision Rationale:</strong> {lastResult.payment.cerberus_evaluation.decision_rationale}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', paddingTop: '6px', borderTop: '1px solid var(--border-subtle)' }}>
                <span>Risk Score: <strong style={{ color: '#fff' }}>{lastResult.payment.cerberus_evaluation.risk_score}/100</strong></span>
                <span>Latency: <strong style={{ color: '#34d399' }}>{lastResult.payment.cerberus_evaluation.evaluation_latency_ms} ms</strong></span>
                <span>Gateway Status: <strong style={{ color: '#fff' }}>{lastResult.payment.status}</strong></span>
              </div>
            </motion.div>
          )}

        </div>

        {/* FOOTER ACTIONS */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(13, 18, 29, 0.8)'
        }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Emits authentic Razorpay payload with sub-5ms ML evaluation
          </span>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={onClose}
              className="btn-secondary-fintech"
            >
              Close
            </button>

            <button
              onClick={handleDispatchPayment}
              disabled={isLoading}
              className="btn-primary-fintech"
              style={{ padding: '8px 16px', gap: '6px' }}
            >
              {isLoading ? 'Dispatching...' : 'Dispatch to Gateway'}
              <Send size={13} />
            </button>
          </div>
        </div>

      </motion.div>

    </div>
  );
}
