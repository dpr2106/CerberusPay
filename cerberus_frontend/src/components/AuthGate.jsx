import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, User, ArrowRight, CheckCircle2, AlertCircle, KeyRound, RefreshCw } from 'lucide-react';

export default function AuthGate({ onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'verify_otp'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

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

      setSuccessMsg(`A 6-digit verification code was sent to ${email}. Please check your inbox!`);
      setMode('verify_otp');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Ensure backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Invalid verification code');
      }

      onAuthSuccess(data.user, data.access_token, data.user?.role || 'customer');
    } catch (err) {
      setErrorMsg(err.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (isResending || !email) return;
    setIsResending(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth/resend-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to resend code');

      setSuccessMsg(`A fresh verification code was dispatched to ${email}!`);
    } catch (err) {
      setErrorMsg(err.message || 'Unable to resend code');
    } finally {
      setIsResending(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        // If unverified, automatically redirect to OTP verification screen
        if (res.status === 403) {
          setMode('verify_otp');
          setSuccessMsg('Please verify your email address to unlock your account.');
          return;
        }
        throw new Error(data.detail || 'Invalid email or password');
      }

      onAuthSuccess(data.user, data.access_token, data.user?.role || 'analyst');
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed');
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
          Payment Risk Intelligence & Security Authentication Gate
        </p>
      </div>

      {/* CARD */}
      <div className="fintech-card" style={{ maxWidth: '440px', width: '100%', padding: '2rem', backdropFilter: 'blur(16px)' }}>
        
        {/* NOTIFICATIONS */}
        {successMsg && (
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#34d399', padding: '10px 14px', borderRadius: '6px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#f87171', padding: '10px 14px', borderRadius: '6px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* TAB TOGGLE: SIGN IN / REGISTER */}
        {mode !== 'verify_otp' && (
          <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: '6px', padding: '3px', marginBottom: '1.5rem', border: '1px solid var(--border-subtle)' }}>
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
        )}

        {/* 1. SIGN IN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary-fintech"
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.25rem', opacity: isLoading ? 0.7 : 1 }}
            >
              {isLoading ? 'Verifying Credentials...' : 'Sign In to Console'}
              <ArrowRight size={14} />
            </button>
          </form>
        )}

        {/* 2. REGISTRATION FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                A 6-digit confirmation code will be sent to this email.
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
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Hashed with PBKDF2-HMAC-SHA256 (100,000 rounds).
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary-fintech"
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.25rem', opacity: isLoading ? 0.7 : 1 }}
            >
              {isLoading ? 'Creating Account & Sending Email...' : 'Register & Send Verification Code'}
              <ArrowRight size={14} />
            </button>
          </form>
        )}

        {/* 3. 6-DIGIT EMAIL VERIFICATION OTP FORM */}
        {mode === 'verify_otp' && (
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'rgba(59, 130, 246, 0.15)',
                color: '#60a5fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem'
              }}>
                <KeyRound size={22} />
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>
                Enter 6-Digit Email Code
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '3px' }}>
                We sent a security code to <strong style={{ color: '#fff' }}>{email}</strong>
              </p>
            </div>

            <div>
              <input
                type="text"
                required
                maxLength={6}
                autoFocus
                placeholder="123456"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
                className="mono"
                style={{
                  width: '100%',
                  textAlign: 'center',
                  letterSpacing: '0.4em',
                  fontSize: '1.6rem',
                  fontWeight: 800,
                  padding: '12px',
                  background: 'var(--bg-secondary)',
                  border: '2px solid rgba(59, 130, 246, 0.4)',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || verificationCode.length < 6}
              className="btn-primary-fintech"
              style={{
                width: '100%',
                justifyContent: 'center',
                opacity: (isLoading || verificationCode.length < 6) ? 0.6 : 1,
                cursor: (isLoading || verificationCode.length < 6) ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? 'Verifying Security Code...' : 'Verify Code & Unlock Console'}
              <ArrowRight size={14} />
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isResending}
                style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}
              >
                <RefreshCw size={12} className={isResending ? 'animate-spin' : ''} />
                {isResending ? 'Sending...' : 'Resend Code'}
              </button>

              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(null); }}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px' }}
              >
                Back to Sign In
              </button>
            </div>

          </form>
        )}

      </div>

      {/* FOOTER */}
      <div style={{ marginTop: '1.5rem', fontSize: '11px', color: 'var(--text-muted)' }}>
        CERBERUSPAY • Permanent Encrypted Database & Multi-Factor SMTP Email Verification
      </div>

    </div>
  );
}
