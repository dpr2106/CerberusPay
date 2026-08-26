import React, { useState } from 'react';
import { 
  Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff, 
  KeyRound, ShieldCheck, RefreshCw, ArrowLeft, CheckCircle2, AlertTriangle
} from 'lucide-react';

export default function AuthGate({ onAuthSuccess }) {
  const [step, setStep] = useState('CREDENTIALS'); // 'CREDENTIALS' | 'OTP'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [infoMsg, setInfoMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resending, setResending] = useState(false);

  // Mask email for UI privacy (e.g. p***4@gmail.com)
  const maskEmail = (val) => {
    if (!val || !val.includes('@')) return 'registered operator email';
    const [user, domain] = val.split('@');
    if (user.length <= 2) return `${user[0]}*@${domain}`;
    return `${user[0]}${'*'.repeat(Math.min(user.length - 2, 4))}${user[user.length - 1]}@${domain}`;
  };

  // Step 1: Send Credentials & Request OTP
  const handleRequestOtp = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Invalid operator credentials. Access restricted.');
      }

      if (data.requires_otp || data.status === 'otp_sent') {
        setStep('OTP');
        setInfoMsg(`Security verification code dispatched. Please check your inbox or spam folder.`);
      } else if (data.access_token) {
        onAuthSuccess(data.operator, data.access_token);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication service unreachable. Ensure FastAPI backend is running on port 8000.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify 6-Digit OTP & Obtain Session Token
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    if (!otp || otp.trim().length !== 6) {
      setErrorMsg('Please enter the complete 6-digit numeric verification code.');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp: otp.trim() })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Invalid or expired verification code.');
      }

      onAuthSuccess(data.operator, data.access_token);
    } catch (err) {
      setErrorMsg(err.message || 'OTP verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setResending(true);
    setErrorMsg(null);
    setInfoMsg(null);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Unable to resend OTP.');
      }

      setInfoMsg(`Fresh verification code dispatched to ${maskEmail(email)}. Check your inbox and spam folder.`);
      setTimeout(() => setInfoMsg(null), 5000);
    } catch (err) {
      setErrorMsg(`Resend failed: ${err.message}`);
    } finally {
      setResending(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#07090C',
      padding: '2rem 1.5rem',
      color: '#F8FAFC'
    }}>

      {/* CLEAN LOGO & PROJECT HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: '10px',
          overflow: 'hidden',
          background: '#0D1117',
          border: '1px solid #252D38',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem'
        }}>
          <img 
            src="/cerberuspay_logo.png" 
            alt="CerberusPay Logo" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>

        <h1 style={{ 
          fontSize: '1.85rem', 
          fontWeight: 900, 
          color: '#F8FAFC', 
          letterSpacing: '-0.02em', 
          margin: 0
        }}>
          CERBERUS<span style={{ color: '#F97316' }}>PAY</span>
        </h1>
      </div>

      {/* CLEAN, CRISP AUTHENTICATION CARD */}
      <div 
        style={{ 
          maxWidth: '400px', 
          width: '100%', 
          padding: '2rem', 
          backgroundColor: '#11161E',
          border: '1px solid #252D38',
          borderRadius: '10px',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6)'
        }}
      >
        
        {/* NOTIFICATIONS */}
        {errorMsg && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.12)', 
            border: '1px solid rgba(239, 68, 68, 0.35)', 
            color: '#F87171', 
            padding: '9px 12px', 
            borderRadius: '6px', 
            fontSize: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            marginBottom: '1.25rem'
          }}>
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {infoMsg && (
          <div style={{ 
            background: 'rgba(249, 115, 22, 0.12)', 
            border: '1px solid rgba(249, 115, 22, 0.35)', 
            color: '#FB923C', 
            padding: '9px 12px', 
            borderRadius: '6px', 
            fontSize: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            marginBottom: '1.25rem'
          }}>
            <CheckCircle2 size={15} style={{ flexShrink: 0 }} />
            <span>{infoMsg}</span>
          </div>
        )}

        {/* STEP 1: OPERATOR CREDENTIALS */}
        {step === 'CREDENTIALS' && (
          <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '11px', 
                fontWeight: 700, 
                color: '#94A3B8', 
                marginBottom: '6px', 
                textTransform: 'uppercase', 
                letterSpacing: '0.04em' 
              }}>
                Operator Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={14} style={{ position: 'absolute', left: '11px', top: '12px', color: '#64748B' }} />
                <input
                  type="email"
                  required
                  placeholder="operator@cerberuspay.internal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 34px',
                    background: '#0A0D12',
                    border: '1px solid #252D38',
                    borderRadius: '6px',
                    color: '#F8FAFC',
                    fontSize: '13px',
                    outline: 'none',
                    transition: 'border-color 0.15s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#F97316'}
                  onBlur={(e) => e.target.style.borderColor = '#252D38'}
                />
              </div>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '11px', 
                fontWeight: 700, 
                color: '#94A3B8', 
                marginBottom: '6px', 
                textTransform: 'uppercase', 
                letterSpacing: '0.04em' 
              }}>
                Operator Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={14} style={{ position: 'absolute', left: '11px', top: '12px', color: '#64748B' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 36px 9px 34px',
                    background: '#0A0D12',
                    border: '1px solid #252D38',
                    borderRadius: '6px',
                    color: '#F8FAFC',
                    fontSize: '13px',
                    outline: 'none',
                    transition: 'border-color 0.15s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#F97316'}
                  onBlur={(e) => e.target.style.borderColor = '#252D38'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: showPassword ? '#F97316' : '#64748B',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '3px'
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* CLEAN PRIMARY BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                justifyContent: 'center',
                marginTop: '0.35rem',
                padding: '10px 16px',
                background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '6px',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '13px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                transition: 'opacity 0.15s ease',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {isLoading ? 'Sending Security OTP...' : 'Send Verification OTP'}
              <ArrowRight size={14} />
            </button>
          </form>
        )}

        {/* STEP 2: 2FA EMAIL OTP VERIFICATION */}
        {step === 'OTP' && (
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: 'rgba(249, 115, 22, 0.12)',
                border: '1px solid rgba(249, 115, 22, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.65rem',
                color: '#FB923C'
              }}>
                <KeyRound size={20} />
              </div>
              <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#F8FAFC', margin: 0 }}>
                Enter 6-Digit Security Code
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                A verification code was dispatched to:
              </p>
              <div className="mono" style={{ color: '#FB923C', fontWeight: 700, fontSize: '12px', marginTop: '2px' }}>
                {maskEmail(email)}
              </div>
            </div>

            {/* 6-DIGIT OTP INPUT */}
            <div>
              <input
                type="text"
                required
                maxLength={6}
                autoFocus
                placeholder="• • • • • •"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                className="mono"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: '#0A0D12',
                  border: '1.5px solid #252D38',
                  borderRadius: '6px',
                  color: '#F8FAFC',
                  fontSize: '20px',
                  fontWeight: 800,
                  textAlign: 'center',
                  letterSpacing: '8px',
                  outline: 'none',
                  transition: 'border-color 0.15s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#F97316'}
                onBlur={(e) => e.target.style.borderColor = '#252D38'}
              />
            </div>

            {/* SPAM FOLDER REMINDER NOTICE */}
            <div style={{
              background: 'rgba(249, 115, 22, 0.08)',
              border: '1px solid rgba(249, 115, 22, 0.25)',
              borderRadius: '6px',
              padding: '7px 11px',
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              fontSize: '11px',
              color: '#FED7AA'
            }}>
              <AlertTriangle size={13} color="#F97316" style={{ flexShrink: 0 }} />
              <span>Please check your <strong>Inbox</strong> or <strong>Spam folder</strong> for the OTP email.</span>
            </div>

            {/* VERIFY BUTTON */}
            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '10px 16px',
                background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '6px',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '13px',
                cursor: (isLoading || otp.length !== 6) ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                opacity: (isLoading || otp.length !== 6) ? 0.6 : 1
              }}
            >
              {isLoading ? 'Verifying Code...' : 'Verify Code & Unlock Console'}
              <ShieldCheck size={15} />
            </button>

            {/* RESEND & BACK BUTTONS */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px', marginTop: '3px' }}>
              <button
                type="button"
                onClick={() => {
                  setStep('CREDENTIALS');
                  setOtp('');
                  setErrorMsg(null);
                  setInfoMsg(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: 600
                }}
              >
                <ArrowLeft size={12} />
                <span>Change Credentials</span>
              </button>

              <button
                type="button"
                disabled={resending}
                onClick={handleResendOtp}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#F97316',
                  cursor: resending ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: 700,
                  opacity: resending ? 0.6 : 1
                }}
              >
                <RefreshCw size={11} className={resending ? 'animate-spin' : ''} />
                <span>{resending ? 'Resending...' : 'Resend Code'}</span>
              </button>
            </div>
          </form>
        )}

      </div>

      {/* FOOTER */}
      <div style={{ marginTop: '1.5rem', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>
        CERBERUSPAY • Internal Risk Intelligence Engine • Zero-Trust Operations Platform
      </div>

    </div>
  );
}
