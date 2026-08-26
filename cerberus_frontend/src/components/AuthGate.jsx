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
        setInfoMsg(`Security verification code sent to ${data.email || email}. Check your inbox or spam folder.`);
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

      setInfoMsg(`Fresh verification code dispatched to ${email}. Check your inbox and spam folder.`);
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
      background: 'radial-gradient(ellipse 90% 60% at 50% 15%, rgba(14, 165, 233, 0.16) 0%, rgba(99, 102, 241, 0.1) 40%, #06090e 85%)',
      padding: '2rem 1.5rem',
      color: 'var(--text-primary)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* BACKGROUND AMBIENT MESH GLOW */}
      <div style={{
        position: 'absolute',
        top: '12%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '500px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(79, 70, 229, 0.08) 50%, transparent 80%)',
        filter: 'blur(50px)',
        pointerEvents: 'none'
      }} />

      {/* BRANDING & LOGO HEADER - CLEAN PROJECT NAME ONLY */}
      <div style={{ textAlign: 'center', marginBottom: '1.75rem', position: 'relative', zIndex: 2 }}>
        <div style={{
          position: 'relative',
          width: '76px',
          height: '76px',
          borderRadius: '20px',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #0284c7 0%, #1e1b4b 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem',
          boxShadow: '0 0 35px rgba(14, 165, 233, 0.65), 0 0 15px rgba(99, 102, 241, 0.4)',
          border: '2px solid rgba(56, 189, 248, 0.7)',
          cursor: 'pointer',
          transition: 'transform 0.2s ease'
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
          fontSize: '2.15rem', 
          fontWeight: 900, 
          color: '#ffffff', 
          letterSpacing: '-0.03em', 
          margin: 0,
          textShadow: '0 0 20px rgba(255,255,255,0.2)'
        }}>
          CERBERUS<span style={{ color: '#38bdf8', textShadow: '0 0 25px rgba(56, 189, 248, 0.8)' }}>PAY</span>
        </h1>
      </div>

      {/* GLASSMORPHIC AUTHENTICATION CARD */}
      <div 
        className="fintech-card" 
        style={{ 
          maxWidth: '420px', 
          width: '100%', 
          padding: '2.25rem', 
          background: 'rgba(13, 18, 30, 0.82)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '16px',
          boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.8), 0 0 35px -5px rgba(14, 165, 233, 0.2)',
          position: 'relative',
          zIndex: 2
        }}
      >
        
        {/* NOTIFICATIONS */}
        {errorMsg && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.15)', 
            border: '1px solid #ef4444', 
            color: '#f87171', 
            padding: '10px 14px', 
            borderRadius: '8px', 
            fontSize: '12.5px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            marginBottom: '1.25rem',
            boxShadow: '0 0 15px rgba(239, 68, 68, 0.2)'
          }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {infoMsg && (
          <div style={{ 
            background: 'rgba(14, 165, 233, 0.15)', 
            border: '1px solid #0284c7', 
            color: '#7dd3fc', 
            padding: '10px 14px', 
            borderRadius: '8px', 
            fontSize: '12.5px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            marginBottom: '1.25rem',
            boxShadow: '0 0 15px rgba(14, 165, 233, 0.2)'
          }}>
            <CheckCircle2 size={16} />
            <span>{infoMsg}</span>
          </div>
        )}

        {/* STEP 1: OPERATOR CREDENTIALS */}
        {step === 'CREDENTIALS' && (
          <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '11px', 
                fontWeight: 800, 
                color: '#94a3b8', 
                marginBottom: '6px', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em' 
              }}>
                Operator Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
                <input
                  type="email"
                  required
                  placeholder="prashanthraodugyala34@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    background: 'rgba(8, 11, 17, 0.8)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '13px',
                    outline: 'none',
                    transition: 'all 0.18s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#38bdf8';
                    e.target.style.boxShadow = '0 0 15px rgba(56, 189, 248, 0.3)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(56, 189, 248, 0.3)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '11px', 
                fontWeight: 800, 
                color: '#94a3b8', 
                marginBottom: '6px', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em' 
              }}>
                Operator Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 38px 10px 36px',
                    background: 'rgba(8, 11, 17, 0.8)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '13px',
                    outline: 'none',
                    transition: 'all 0.18s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#38bdf8';
                    e.target.style.boxShadow = '0 0 15px rgba(56, 189, 248, 0.3)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(56, 189, 248, 0.3)';
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
                    color: showPassword ? '#38bdf8' : '#64748b',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px',
                    transition: 'color 0.15s ease'
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* SEND SECURITY OTP BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                justifyContent: 'center',
                marginTop: '0.5rem',
                padding: '11px 18px',
                background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 50%, #4f46e5 100%)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '9px',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '13.5px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 20px rgba(37, 99, 235, 0.55), 0 0 15px rgba(14, 165, 233, 0.4)',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                opacity: isLoading ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 28px rgba(37, 99, 235, 0.7), 0 0 25px rgba(14, 165, 233, 0.6)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(37, 99, 235, 0.55), 0 0 15px rgba(14, 165, 233, 0.4)';
              }}
            >
              {isLoading ? 'Sending Security OTP...' : 'Send Verification OTP'}
              <ArrowRight size={15} />
            </button>
          </form>
        )}

        {/* STEP 2: 2FA EMAIL OTP VERIFICATION */}
        {step === 'OTP' && (
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(99, 102, 241, 0.3) 100%)',
                border: '1px solid rgba(56, 189, 248, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem',
                color: '#38bdf8'
              }}>
                <KeyRound size={22} />
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#fff', margin: 0 }}>
                Enter 6-Digit Security Code
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                A verification code was dispatched to:
              </p>
              <div className="mono" style={{ color: '#38bdf8', fontWeight: 700, fontSize: '12.5px', marginTop: '2px' }}>
                {email}
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
                  padding: '12px 14px',
                  background: 'rgba(8, 11, 17, 0.9)',
                  border: '1.5px solid rgba(56, 189, 248, 0.45)',
                  borderRadius: '9px',
                  color: '#fff',
                  fontSize: '22px',
                  fontWeight: 900,
                  textAlign: 'center',
                  letterSpacing: '10px',
                  outline: 'none',
                  boxShadow: '0 0 20px rgba(56, 189, 248, 0.2)',
                  transition: 'all 0.18s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#38bdf8';
                  e.target.style.boxShadow = '0 0 25px rgba(56, 189, 248, 0.4)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(56, 189, 248, 0.45)';
                  e.target.style.boxShadow = '0 0 20px rgba(56, 189, 248, 0.2)';
                }}
              />
            </div>

            {/* SPAM FOLDER REMINDER NOTICE */}
            <div style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '7px',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '11px',
              color: '#fde68a'
            }}>
              <AlertTriangle size={14} color="#f59e0b" style={{ flexShrink: 0 }} />
              <span>Please check your <strong>Inbox</strong> or <strong>Spam folder</strong> for the OTP email.</span>
            </div>

            {/* VERIFY BUTTON */}
            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '11px 18px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '9px',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '13.5px',
                cursor: (isLoading || otp.length !== 6) ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 20px rgba(16, 185, 129, 0.55)',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                opacity: (isLoading || otp.length !== 6) ? 0.6 : 1
              }}
            >
              {isLoading ? 'Verifying Code...' : 'Verify Code & Unlock Console'}
              <ShieldCheck size={16} />
            </button>

            {/* RESEND & BACK BUTTONS */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px', marginTop: '4px' }}>
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
                  color: '#38bdf8',
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
      <div style={{ marginTop: '1.75rem', fontSize: '11.5px', color: 'var(--text-muted)', textAlign: 'center', zIndex: 2 }}>
        CERBERUSPAY • Internal Risk Intelligence Engine • Zero-Trust Operations Platform
      </div>

    </div>
  );
}
