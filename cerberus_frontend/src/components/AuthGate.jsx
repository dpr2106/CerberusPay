import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, User, ArrowRight, CheckCircle2, AlertCircle, ShieldAlert, Key } from 'lucide-react';

export default function AuthGate({ onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [role, setRole] = useState('analyst'); // 'analyst' | 'customer'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 1-Click Quick Demo Sign In
  const handleQuickSignIn = (roleType) => {
    setIsLoading(true);
    setTimeout(() => {
      if (roleType === 'analyst') {
        const analystUser = {
          user_id: 'OPR_CHIEF_ANALYST',
          name: 'Chief Risk Officer',
          email: 'security.operator@cerberuspay.internal',
          role: 'analyst'
        };
        const token = 'eyJhbGciOiAiSFMyNTYiLCAidHlwIjoiSldUIn0.mock_analyst_token';
        onAuthSuccess(analystUser, token, 'analyst');
      } else {
        const customerUser = {
          user_id: 'USR_8921',
          name: 'Alex Mercer',
          email: 'alex.mercer@example.com',
          role: 'customer'
        };
        const token = 'eyJhbGciOiAiSFMyNTYiLCAidHlwIjoiSldUIn0.mock_customer_token';
        onAuthSuccess(customerUser, token, 'customer');
      }
      setIsLoading(false);
    }, 400);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    const endpoint = mode === 'register' ? 'http://127.0.0.1:8000/api/auth/register' : 'http://127.0.0.1:8000/api/auth/login';
    const payload = mode === 'register' ? { name, email, password } : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || (mode === 'register' ? 'Registration failed' : 'Invalid email or password'));
      }

      if (mode === 'register') {
        setSuccessMsg('Account created successfully! Please sign in with your credentials.');
        setMode('login');
        setPassword('');
      } else {
        onAuthSuccess(data.user, data.access_token, role);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication service unreachable. Ensure FastAPI backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'radial-gradient(circle at 50% 20%, rgba(59, 130, 246, 0.08) 0%, var(--bg-primary) 70%)',
      padding: '1.5rem',
      color: 'var(--text-primary)'
    }}>
      
      {/* BRANDING */}
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          color: '#fff',
          boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)'
        }}>
          <ShieldCheck size={32} />
        </div>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', margin: 0 }}>
          CERBERUSPAY
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '5px' }}>
          Payment Risk Intelligence & Real-Time Fraud Defense Engine
        </p>
      </div>

      {/* LOGIN CARD */}
      <div className="fintech-card" style={{ maxWidth: '440px', width: '100%', padding: '2rem', backdropFilter: 'blur(16px)' }}>
        
        {/* NOTIFICATIONS */}
        {successMsg && (
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#34d399', padding: '10px 14px', borderRadius: '6px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#f87171', padding: '10px 14px', borderRadius: '6px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* TAB TOGGLE: SIGN IN / REGISTER */}
        <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: '6px', padding: '3px', marginBottom: '1.25rem', border: '1px solid var(--border-subtle)' }}>
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(null); }}
            style={{
              flex: 1,
              padding: '7px 0',
              fontSize: '12px',
              fontWeight: 700,
              borderRadius: '4px',
              border: 'none',
              background: mode === 'login' ? 'var(--bg-card)' : 'transparent',
              color: mode === 'login' ? '#fff' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(null); }}
            style={{
              flex: 1,
              padding: '7px 0',
              fontSize: '12px',
              fontWeight: 700,
              borderRadius: '4px',
              border: 'none',
              background: mode === 'register' ? 'var(--bg-card)' : 'transparent',
              color: mode === 'register' ? '#fff' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            Create Account
          </button>
        </div>

        {/* ROLE TOGGLE (For Sign-In) */}
        {mode === 'login' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '1.25rem' }}>
            <div
              onClick={() => setRole('analyst')}
              style={{
                padding: '8px 10px',
                borderRadius: '6px',
                border: `1px solid ${role === 'analyst' ? '#3b82f6' : 'var(--border-subtle)'}`,
                background: role === 'analyst' ? 'rgba(59,130,246,0.1)' : 'var(--bg-secondary)',
                cursor: 'pointer',
                textAlign: 'center',
                fontSize: '12px',
                fontWeight: 600,
                color: role === 'analyst' ? '#fff' : 'var(--text-muted)'
              }}
            >
              🛡️ Fraud Analyst
            </div>
            <div
              onClick={() => setRole('customer')}
              style={{
                padding: '8px 10px',
                borderRadius: '6px',
                border: `1px solid ${role === 'customer' ? '#3b82f6' : 'var(--border-subtle)'}`,
                background: role === 'customer' ? 'rgba(59,130,246,0.1)' : 'var(--bg-secondary)',
                cursor: 'pointer',
                textAlign: 'center',
                fontSize: '12px',
                fontWeight: 600,
                color: role === 'customer' ? '#fff' : 'var(--text-muted)'
              }}
            >
              👤 Customer Account
            </div>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {mode === 'register' && (
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
                placeholder={role === 'analyst' && mode === 'login' ? 'security.operator@cerberuspay.internal' : 'your.email@example.com'}
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
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary-fintech"
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.25rem', opacity: isLoading ? 0.7 : 1 }}
          >
            {isLoading ? 'Authenticating...' : (mode === 'login' ? 'Sign In & Open Console' : 'Create Account')}
            <ArrowRight size={14} />
          </button>

        </form>

        {/* QUICK DEMO ACCESS (1-CLICK UNLOCK) */}
        {mode === 'login' && (
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.65rem', textAlign: 'center' }}>
              ⚡ QUICK-ACCESS DEMO LOGIN
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <button
                type="button"
                onClick={() => handleQuickSignIn('analyst')}
                className="btn-secondary-fintech"
                style={{ width: '100%', justifyContent: 'center', fontSize: '12px', borderColor: 'rgba(59,130,246,0.3)' }}
              >
                <ShieldCheck size={13} color="#60a5fa" />
                <span>Enter as <strong>Fraud Operations Analyst</strong></span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSignIn('customer')}
                className="btn-secondary-fintech"
                style={{ width: '100%', justifyContent: 'center', fontSize: '12px' }}
              >
                <User size={13} />
                <span>Enter as <strong>Customer (Alex Mercer)</strong></span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* FOOTER */}
      <div style={{ marginTop: '1.5rem', fontSize: '11px', color: 'var(--text-muted)' }}>
        CERBERUSPAY • Zero-Trust Enterprise Risk Platform • 256-bit Encrypted Gate
      </div>

    </div>
  );
}
