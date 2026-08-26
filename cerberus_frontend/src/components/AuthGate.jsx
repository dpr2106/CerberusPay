import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export default function AuthGate({ onAuthSuccess }) {
  const [email, setEmail] = useState('security.operator@cerberuspay.internal');
  const [password, setPassword] = useState('operator123');
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Invalid operator credentials. Access restricted.');
      }

      onAuthSuccess(data.operator, data.access_token);
    } catch (err) {
      setErrorMsg(err.message || 'Authentication service unreachable. Ensure FastAPI backend is running on port 8000.');
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
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '5px', fontWeight: 600, letterSpacing: '0.02em' }}>
          Payment Risk Operations
        </p>
        <div style={{
          display: 'inline-block',
          marginTop: '8px',
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          color: '#f87171',
          padding: '3px 10px',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.05em',
          textTransform: 'uppercase'
        }}>
          Authorized Personnel Only
        </div>
      </div>

      {/* LOGIN CARD */}
      <div className="fintech-card" style={{ maxWidth: '420px', width: '100%', padding: '2rem', backdropFilter: 'blur(16px)' }}>
        
        {/* NOTIFICATIONS */}
        {errorMsg && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#f87171', padding: '10px 14px', borderRadius: '6px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* INTERNAL ANALYST LOGIN FORM */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Operator Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
              <input
                type="email"
                required
                placeholder="security.operator@cerberuspay.internal"
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
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Operator Password
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
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', opacity: isLoading ? 0.7 : 1 }}
          >
            {isLoading ? 'Verifying Security Token...' : 'Sign In to Operations Console'}
            <ArrowRight size={14} />
          </button>
        </form>

      </div>

      {/* FOOTER */}
      <div style={{ marginTop: '1.5rem', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>
        CERBERUSPAY • Internal Risk Intelligence Engine • Zero-Trust Operations Platform
      </div>

    </div>
  );
}
