import React, { useState } from 'react';
import { 
  Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff
} from 'lucide-react';

export default function AuthGate({ onAuthSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
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
      background: 'radial-gradient(ellipse 90% 60% at 50% 15%, rgba(14, 165, 233, 0.16) 0%, rgba(99, 102, 241, 0.1) 40%, #06090e 85%)',
      padding: '2rem 1.5rem',
      color: 'var(--text-primary)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* BACKGROUND GLOW ACCENTS */}
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
        
        {/* CUSTOM GENERATED GLOWING CERBERUS LOGO */}
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

      {/* VIBRANT GLASSMORPHIC LOGIN CARD */}
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

        {/* INTERNAL ANALYST LOGIN FORM */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
                placeholder="operator@cerberuspay.internal"
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

          {/* VIBRANT GRADIENT SUBMIT BUTTON */}
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
            {isLoading ? 'Authenticating Token...' : 'Sign In to Operations Console'}
            <ArrowRight size={15} />
          </button>
        </form>

      </div>

      {/* FOOTER */}
      <div style={{ marginTop: '1.75rem', fontSize: '11.5px', color: 'var(--text-muted)', textAlign: 'center', zIndex: 2 }}>
        CERBERUSPAY • Internal Risk Intelligence Engine • Zero-Trust Operations Platform
      </div>

    </div>
  );
}
