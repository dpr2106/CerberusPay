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
      background: 'radial-gradient(ellipse 80% 50% at 50% 20%, rgba(249, 115, 22, 0.12) 0%, rgba(194, 65, 12, 0.04) 50%, #07090C 90%)',
      padding: '2rem 1.5rem',
      color: '#F8FAFC',
      position: 'relative',
      overflow: 'hidden',
      boxSizing: 'border-box'
    }}>

      {/* AMBIENT ORANGE BACKDROP GLOW */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '450px',
        height: '280px',
        background: 'radial-gradient(circle, rgba(249, 115, 22, 0.15) 0%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />

      {/* BRANDING & LOGO HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '1.75rem', position: 'relative', zIndex: 2 }}>
        <div style={{
          position: 'relative',
          width: '64px',
          height: '64px',
          borderRadius: '14px',
          overflow: 'hidden',
          background: '#0D1117',
          border: '1.5px solid rgba(249, 115, 22, 0.5)',
          boxShadow: '0 0 25px rgba(249, 115, 22, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.15rem',
          cursor: 'pointer',
          transition: 'transform 0.2s ease',
          boxSizing: 'border-box'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
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
          fontSize: '2rem', 
          fontWeight: 900, 
          color: '#F8FAFC', 
          letterSpacing: '-0.02em', 
          margin: 0,
          textShadow: '0 0 16px rgba(255, 255, 255, 0.15)'
        }}>
          CERBERUS<span style={{ color: '#F97316', textShadow: '0 0 20px rgba(249, 115, 22, 0.65)' }}>PAY</span>
        </h1>
      </div>

      {/* GLOWING GLASSMORPHIC CARD (FIXED WITH ZERO OVERFLOW) */}
      <div 
        style={{ 
          maxWidth: '420px', 
          width: '100%', 
          padding: '2.25rem', 
          backgroundColor: 'rgba(17, 22, 30, 0.92)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(249, 115, 22, 0.25)',
          borderRadius: '12px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(249, 115, 22, 0.15)',
          position: 'relative',
          zIndex: 2,
          boxSizing: 'border-box'
        }}
      >
        
        {/* NOTIFICATIONS */}
        {errorMsg && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.15)', 
            border: '1px solid rgba(239, 68, 68, 0.4)', 
            color: '#F87171', 
            padding: '9px 12px', 
            borderRadius: '6px', 
            fontSize: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            marginBottom: '1.25rem',
            boxSizing: 'border-box'
          }}>
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {infoMsg && (
          <div style={{ 
            background: 'rgba(249, 115, 22, 0.15)', 
            border: '1px solid rgba(249, 115, 22, 0.4)', 
            color: '#FB923C', 
            padding: '9px 12px', 
            borderRadius: '6px', 
            fontSize: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            marginBottom: '1.25rem',
            boxSizing: 'border-box'
          }}>
            <CheckCircle2 size={15} style={{ flexShrink: 0 }} />
            <span>{infoMsg}</span>
          </div>
        )}

        {/* STEP 1: OPERATOR CREDENTIALS */}
        {step === 'CREDENTIALS' && (
          <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', boxSizing: 'border-box' }}>
            
            {/* EMAIL FIELD */}
            <div style={{ width: '100%', boxSizing: 'border-box' }}>
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
              <div style={{ position: 'relative', width: '100%', boxSizing: 'border-box' }}>
                <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B', pointerEvents: 'none' }} />
                <input
                  type="email"
                  required
                  placeholder="operator@cerberuspay.internal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '10px 12px 10px 36px',
                    background: '#0A0D12',
                    border: '1px solid #252D38',
                    borderRadius: '7px',
                    color: '#F8FAFC',
                    fontSize: '13px',
                    outline: 'none',
                    transition: 'all 0.18s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#F97316';
                    e.target.style.boxShadow = '0 0 14px rgba(249, 115, 22, 0.35)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#252D38';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* PASSWORD FIELD */}
            <div style={{ width: '100%', boxSizing: 'border-box' }}>
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
              <div style={{ position: 'relative', width: '100%', boxSizing: 'border-box' }}>
                <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B', pointerEvents: 'none' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '10px 38px 10px 36px',
                    background: '#0A0D12',
                    border: '1px solid #252D38',
                    borderRadius: '7px',
                    color: '#F8FAFC',
                    fontSize: '13px',
                    outline: 'none',
                    transition: 'all 0.18s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#F97316';
                    e.target.style.boxShadow = '0 0 14px rgba(249, 115, 22, 0.35)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#252D38';
                    e.target.style.boxShadow = 'none';
                  }}
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
                    padding: '4px',
                    transition: 'color 0.15s ease'
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* GLOWING ORANGE PRIMARY SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                justifyContent: 'center',
                marginTop: '0.35rem',
                padding: '11px 16px',
                background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '7px',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '13.5px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 20px rgba(249, 115, 22, 0.45)',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                opacity: isLoading ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(-1.5px)';
                  e.currentTarget.style.boxShadow = '0 6px 26px rgba(249, 115, 22, 0.65)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(249, 115, 22, 0.45)';
              }}
            >
              {isLoading ? 'Sending Security OTP...' : 'Send Verification OTP'}
              <ArrowRight size={15} />
            </button>
          </form>
        )}

        {/* STEP 2: 2FA EMAIL OTP VERIFICATION */}
        {step === 'OTP' && (
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'rgba(249, 115, 22, 0.15)',
                border: '1px solid rgba(249, 115, 22, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem',
                color: '#FB923C'
              }}>
                <KeyRound size={22} />
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#F8FAFC', margin: 0 }}>
                Enter 6-Digit Security Code
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                A verification code was dispatched to:
              </p>
              <div className="mono" style={{ color: '#FB923C', fontWeight: 700, fontSize: '12.5px', marginTop: '2px' }}>
                {maskEmail(email)}
              </div>
            </div>

            {/* 6-DIGIT OTP INPUT */}
            <div style={{ width: '100%', boxSizing: 'border-box' }}>
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
                  boxSizing: 'border-box',
                  padding: '11px 12px',
                  background: '#0A0D12',
                  border: '1.5px solid rgba(249, 115, 22, 0.45)',
                  borderRadius: '7px',
                  color: '#F8FAFC',
                  fontSize: '22px',
                  fontWeight: 800,
                  textAlign: 'center',
                  letterSpacing: '8px',
                  outline: 'none',
                  boxShadow: '0 0 16px rgba(249, 115, 22, 0.2)',
                  transition: 'all 0.18s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#F97316';
                  e.target.style.boxShadow = '0 0 22px rgba(249, 115, 22, 0.45)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(249, 115, 22, 0.45)';
                  e.target.style.boxShadow = '0 0 16px rgba(249, 115, 22, 0.2)';
                }}
              />
            </div>

            {/* SPAM FOLDER REMINDER NOTICE */}
            <div style={{
              background: 'rgba(249, 115, 22, 0.1)',
              border: '1px solid rgba(249, 115, 22, 0.3)',
              borderRadius: '7px',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '11.5px',
              color: '#FED7AA',
              boxSizing: 'border-box'
            }}>
              <AlertTriangle size={14} color="#F97316" style={{ flexShrink: 0 }} />
              <span>Please check your <strong>Inbox</strong> or <strong>Spam folder</strong> for the OTP email.</span>
            </div>

            {/* VERIFY BUTTON */}
            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                justifyContent: 'center',
                padding: '11px 16px',
                background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '7px',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '13.5px',
                cursor: (isLoading || otp.length !== 6) ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 20px rgba(249, 115, 22, 0.45)',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                opacity: (isLoading || otp.length !== 6) ? 0.6 : 1
              }}
            >
              {isLoading ? 'Verifying Code...' : 'Verify Code & Unlock Console'}
              <ShieldCheck size={16} />
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
                <ArrowLeft size={13} />
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
                <RefreshCw size={12} className={resending ? 'animate-spin' : ''} />
                <span>{resending ? 'Resending...' : 'Resend Code'}</span>
              </button>
            </div>
          </form>
        )}

      </div>

      {/* FOOTER */}
      <div style={{ marginTop: '1.75rem', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', zIndex: 2 }}>
        CERBERUSPAY • Internal Risk Intelligence Engine • Zero-Trust Operations Platform
      </div>

    </div>
  );
}
