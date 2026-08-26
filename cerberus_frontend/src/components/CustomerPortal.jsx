import React, { useState, useEffect } from 'react';
import { User, Lock, Mail, ShieldCheck, ShieldAlert, ArrowRight, CheckCircle2, AlertTriangle, LogOut, CreditCard, RefreshCw, Smartphone, Globe } from 'lucide-react';

export default function CustomerPortal({ user, token, onLoginSuccess, onLogout }) {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(null);
  const [authSuccess, setAuthSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Customer Dashboard State
  const [transactions, setTransactions] = useState([]);
  const [isLoadingTxns, setIsLoadingTxns] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(1450);
  const [paymentPreset, setPaymentPreset] = useState('normal'); // 'normal' | 'high_risk'
  const [paymentResult, setPaymentResult] = useState(null);
  const [isPaying, setIsPaying] = useState(false);

  // Load customer transactions
  const fetchCustomerTransactions = () => {
    if (!token) return;
    setIsLoadingTxns(true);
    fetch('http://127.0.0.1:8000/api/customer/transactions', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load transactions');
        return res.json();
      })
      .then(data => {
        setTransactions(data.transactions || []);
        setIsLoadingTxns(false);
      })
      .catch(err => {
        console.error('[Customer Portal] Error loading transactions:', err);
        setIsLoadingTxns(false);
      });
  };

  useEffect(() => {
    if (user && token) {
      fetchCustomerTransactions();
    }
  }, [user, token]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Registration failed');
      }

      setAuthSuccess('Account created successfully! Please log in with your credentials.');
      setAuthMode('login');
      setPassword('');
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Invalid email or password');
      }

      onLoginSuccess(data.user, data.access_token);
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMakePayment = async () => {
    if (isPaying) return;
    setIsPaying(true);
    setPaymentResult(null);

    const isHighRisk = paymentPreset === 'high_risk';
    const payload = {
      amount: parseFloat(paymentAmount),
      category: isHighRisk ? 'electronics' : 'ecommerce',
      velocity_1h: isHighRisk ? 14 : 1,
      geo_distance_km: isHighRisk ? 8200.0 : 12.0,
      device_trust_score: isHighRisk ? 0.15 : 0.95,
      is_proxy_vpn: isHighRisk ? 1 : 0,
      card_fails_24h: isHighRisk ? 4 : 0,
      user_account_age_days: isHighRisk ? 2 : 180,
      is_new_shipping_address: isHighRisk ? 1 : 0
    };

    try {
      const res = await fetch('http://127.0.0.1:8000/api/customer/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      setPaymentResult(data);
      fetchCustomerTransactions();
    } catch (err) {
      console.error('[Customer Payment Error]:', err);
      setPaymentResult({ status: 'error', security_message: err.message || 'Payment failed' });
    } finally {
      setIsPaying(false);
    }
  };

  // 1. UNAUTHENTICATED: LOGIN / REGISTER VIEW
  if (!user) {
    return (
      <div style={{ maxWidth: '440px', margin: '2rem auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* HEADER BRAND */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.75rem',
            color: '#fff'
          }}>
            <ShieldCheck size={24} />
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            CerberusPay Customer Portal
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {authMode === 'login' ? 'Sign in to access your cardholder account' : 'Create a new verified customer account'}
          </p>
        </div>

        {/* NOTIFICATIONS */}
        {authSuccess && (
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#34d399', padding: '10px 14px', borderRadius: '6px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} />
            <span>{authSuccess}</span>
          </div>
        )}
        {authError && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#f87171', padding: '10px 14px', borderRadius: '6px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={16} />
            <span>{authError}</span>
          </div>
        )}

        {/* AUTH CARD */}
        <div className="fintech-card" style={{ padding: '1.75rem' }}>
          
          {/* TAB TOGGLE */}
          <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: '6px', padding: '3px', marginBottom: '1.25rem', border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => { setAuthMode('login'); setAuthError(null); }}
              style={{
                flex: 1,
                padding: '7px 0',
                fontSize: '12px',
                fontWeight: 700,
                borderRadius: '4px',
                border: 'none',
                background: authMode === 'login' ? 'var(--bg-card)' : 'transparent',
                color: authMode === 'login' ? '#fff' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => { setAuthMode('register'); setAuthError(null); }}
              style={{
                flex: 1,
                padding: '7px 0',
                fontSize: '12px',
                fontWeight: 700,
                borderRadius: '4px',
                border: 'none',
                background: authMode === 'register' ? 'var(--bg-card)' : 'transparent',
                color: authMode === 'register' ? '#fff' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              Register
            </button>
          </div>

          <form onSubmit={authMode === 'login' ? handleLogin : handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {authMode === 'register' && (
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '5px', textTransform: 'uppercase' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={15} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Mercer"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px 9px 34px',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '13px'
                    }}
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '5px', textTransform: 'uppercase' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 34px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '13px'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '5px', textTransform: 'uppercase' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 34px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '13px'
                  }}
                />
              </div>
              {authMode === 'register' && (
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Must be at least 6 characters. Hashed using PBKDF2-SHA256.
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary-fintech"
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting ? 'Processing...' : (authMode === 'login' ? 'Sign In to Account' : 'Create Verified Account')}
              <ArrowRight size={14} />
            </button>

          </form>

        </div>

      </div>
    );
  }

  // 2. AUTHENTICATED: CUSTOMER DASHBOARD
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1050px', margin: '0 auto' }}>
      
      {/* PROFILE & SECURITY BANNER */}
      <div className="fintech-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: '18px'
          }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>{user.name}</h3>
              <span className="mono" style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                {user.user_id}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Registered Email: <strong style={{ color: '#fff' }}>{user.email}</strong> • Protected by Cerberus AI Shield
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={fetchCustomerTransactions}
            className="btn-secondary-fintech"
            style={{ fontSize: '12px' }}
          >
            <RefreshCw size={13} className={isLoadingTxns ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={onLogout}
            className="btn-secondary-fintech"
            style={{ fontSize: '12px', color: '#f87171', borderColor: 'rgba(239,68,68,0.3)' }}
          >
            <LogOut size={13} />
            Logout
          </button>
        </div>
      </div>

      {/* MAKE A TEST PAYMENT WIDGET */}
      <div className="fintech-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>
              Initiate Customer Payment
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Test real-time payment risk evaluation and dual email alert dispatch for your account (<code className="mono">{user.user_id}</code>).
            </p>
          </div>
        </div>

        {/* Preset Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
          <div
            onClick={() => { setPaymentPreset('normal'); setPaymentAmount(1450); }}
            style={{
              padding: '1rem',
              borderRadius: '8px',
              border: `1.5px solid ${paymentPreset === 'normal' ? '#10b981' : 'var(--border-subtle)'}`,
              background: paymentPreset === 'normal' ? 'rgba(16,185,129,0.06)' : 'var(--bg-secondary)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <CheckCircle2 size={16} color="#10b981" />
              <strong style={{ fontSize: '13px', color: '#fff' }}>Normal Everyday Checkout</strong>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              ₹1,450.00 • Local IP • Trusted Device • Instant Approval (No email spam)
            </p>
          </div>

          <div
            onClick={() => { setPaymentPreset('high_risk'); setPaymentAmount(46315); }}
            style={{
              padding: '1rem',
              borderRadius: '8px',
              border: `1.5px solid ${paymentPreset === 'high_risk' ? '#ef4444' : 'var(--border-subtle)'}`,
              background: paymentPreset === 'high_risk' ? 'rgba(239,68,68,0.06)' : 'var(--bg-secondary)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <ShieldAlert size={16} color="#ef4444" />
              <strong style={{ fontSize: '13px', color: '#fff' }}>Simulated High-Risk Anomaly</strong>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              ₹46,315.00 • 8,200 km Offset • VPN Proxy • Triggers <strong>Dual SMTP Emails</strong>!
            </p>
          </div>
        </div>

        {/* Action Button & Payment Response */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>CHECKOUT AMOUNT:</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginLeft: '8px' }}>
              ₹{parseFloat(paymentAmount || 0).toLocaleString('en-IN')}
            </span>
          </div>

          <button
            onClick={handleMakePayment}
            disabled={isPaying}
            className="btn-primary-fintech"
            style={{
              background: paymentPreset === 'high_risk' ? '#ef4444' : '#10b981',
              opacity: isPaying ? 0.7 : 1,
              cursor: isPaying ? 'not-allowed' : 'pointer'
            }}
          >
            <CreditCard size={14} />
            {isPaying ? 'Processing Checkout & AI Risk Assessment...' : `Pay ₹${parseFloat(paymentAmount || 0).toLocaleString('en-IN')}`}
          </button>
        </div>

        {/* PAYMENT RESULT BANNER */}
        {paymentResult && (
          <div style={{
            marginTop: '1.25rem',
            padding: '1rem',
            borderRadius: '6px',
            border: `1px solid ${paymentResult.action === 'BLOCK' ? '#ef4444' : '#10b981'}`,
            background: paymentResult.action === 'BLOCK' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {paymentResult.action === 'BLOCK' ? <ShieldAlert size={18} color="#f87171" /> : <CheckCircle2 size={18} color="#34d399" />}
                <strong style={{ fontSize: '13px', color: '#fff' }}>
                  {paymentResult.payment_status}: {paymentResult.security_message}
                </strong>
              </div>
              <span className="mono" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {paymentResult.transaction_id}
              </span>
            </div>
            {paymentResult.action === 'BLOCK' && (
              <p style={{ fontSize: '12px', color: '#f87171', marginTop: '6px', lineHeight: 1.4 }}>
                🚨 High-risk flags triggered. Automatic security email notifications have been dispatched to the Fraud Defense Team and to your registered inbox (<strong>{user.email}</strong>).
              </p>
            )}
          </div>
        )}

      </div>

      {/* MY TRANSACTION HISTORY */}
      <div className="fintech-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>
              My Transaction History
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Transactions associated with account <strong className="mono" style={{ color: '#fff' }}>{user.user_id}</strong>
            </p>
          </div>
          <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {transactions.length} Records
          </span>
        </div>

        {transactions.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', background: 'var(--bg-secondary)' }}>
                <th style={{ padding: '9px 14px', fontWeight: 600 }}>TRANSACTION ID</th>
                <th style={{ padding: '9px 14px', fontWeight: 600 }}>MERCHANT / CATEGORY</th>
                <th style={{ padding: '9px 14px', fontWeight: 600 }}>AMOUNT</th>
                <th style={{ padding: '9px 14px', fontWeight: 600 }}>TIMESTAMP</th>
                <th style={{ padding: '9px 14px', fontWeight: 600 }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '10px 14px' }}>
                    <span className="mono" style={{ fontWeight: 700, color: '#fff' }}>{tx.id}</span>
                  </td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                    {tx.merchant} • {tx.category}
                  </td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#fff' }}>
                    ₹{tx.amount?.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    {new Date(tx.timestamp).toLocaleString()}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    {tx.status === 'APPROVED' && <span className="badge-allowed">APPROVED</span>}
                    {tx.status === 'UNDER_REVIEW' && <span className="badge-review">UNDER REVIEW</span>}
                    {tx.status === 'BLOCKED' && <span className="badge-blocked">BLOCKED</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)', fontSize: '13px' }}>
            No transaction records found for your user ID. Make a test payment above to get started!
          </div>
        )}
      </div>

    </div>
  );
}
