import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Custom Hook for Typewriter Effect
function useTypewriter(text, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let index = 0;
    let timer = null;

    const startTimer = setTimeout(() => {
      timer = setInterval(() => {
        if (index < text.length) {
          setDisplayed(text.slice(0, index + 1));
          index++;
        } else {
          setDone(true);
          clearInterval(timer);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(startTimer);
      if (timer) clearInterval(timer);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}

export default function HeroLanding({ onLaunchConsole, onSelectFeature }) {
  const videoRef = useRef(null);
  const prevXRef = useRef(null);
  const targetTimeRef = useRef(0);
  const isSeekingRef = useRef(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pillButtonsVisible, setPillButtonsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const typewriterText = "Glad you stopped in. Good taste tends to find us. Now, what are we building?";
  const { displayed, done } = useTypewriter(typewriterText, 38, 600);

  // Show pill buttons 400ms after initial mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setPillButtonsVisible(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Mouse-Scrub Video Controller
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const SENSITIVITY = 0.8;

    const handleMouseMove = (e) => {
      if (!video || isNaN(video.duration) || video.duration === 0) return;

      const currentX = e.clientX;
      if (prevXRef.current !== null) {
        const delta = currentX - prevXRef.current;
        const timeOffset = (delta / window.innerWidth) * SENSITIVITY * video.duration;
        let newTarget = targetTimeRef.current + timeOffset;

        // Clamp between 0 and duration
        newTarget = Math.max(0, Math.min(newTarget, video.duration));
        targetTimeRef.current = newTarget;

        if (!isSeekingRef.current) {
          isSeekingRef.current = true;
          video.currentTime = newTarget;
        }
      }
      prevXRef.current = currentX;
    };

    const handleSeeked = () => {
      isSeekingRef.current = false;
      if (video && Math.abs(video.currentTime - targetTimeRef.current) > 0.05) {
        isSeekingRef.current = true;
        video.currentTime = targetTimeRef.current;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    video.addEventListener('seeked', handleSeeked);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (video) {
        video.removeEventListener('seeked', handleSeeked);
      }
    };
  }, []);

  const handleCopyEmail = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText("hello@mainframe.co");
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#07090e',
      color: '#ffffff',
      overflow: 'hidden',
      fontFamily: 'var(--font-body, "HelveticaNowDisplayW01-Rg", "Helvetica Neue", Arial, sans-serif)',
    }}>
      
      {/* 1. MOUSE-SCRUB CONTROLLED BACKGROUND VIDEO */}
      <video
        ref={videoRef}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_041744_63efcd78-bf7d-4039-99e2-2461e8a61903.mp4"
        muted
        playsInline
        preload="auto"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          objectFit: 'cover',
          objectPosition: '70% center',
          pointerEvents: 'none',
          opacity: 0.85
        }}
      />

      {/* SUBTLE DARK VIGNETTE FOR PRISTINE CONTRAST */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(7,9,14,0.15) 0%, rgba(7,9,14,0.7) 100%)',
        zIndex: 1,
        pointerEvents: 'none'
      }} />

      {/* 2. FIXED NAVBAR (z-index: 10) */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.25rem 2rem',
        boxSizing: 'border-box'
      }}>
        
        {/* LOGO (LEFT) */}
        <div 
          onClick={onLaunchConsole}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            cursor: 'pointer',
            userSelect: 'none' 
          }}
        >
          <span style={{
            fontFamily: 'var(--font-heading, "HelveticaNowDisplay-Medium", "Helvetica Neue", Arial, sans-serif)',
            fontSize: 'clamp(21px, 2.5vw, 26px)',
            letterSpacing: '-0.02em',
            fontWeight: 600,
            color: '#fff'
          }}>
            Mainframe&reg;
          </span>
          <span style={{
            fontSize: 'clamp(24px, 3vw, 30px)',
            color: '#fff',
            letterSpacing: '-0.02em',
            userSelect: 'none',
            display: 'inline-block',
            lineHeight: 1
          }}>
            &#10035;&#xfe0e;
          </span>
        </div>

        {/* DESKTOP NAV LINKS (CENTER) */}
        <div className="desktop-nav-links" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: 'clamp(18px, 2vw, 23px)',
          color: '#fff',
          fontWeight: 400
        }}>
          {['Labs', 'Studio', 'Openings', 'Shop'].map((item, idx, arr) => (
            <React.Fragment key={item}>
              <span
                onClick={() => onSelectFeature ? onSelectFeature(item.toLowerCase()) : onLaunchConsole()}
                style={{
                  cursor: 'pointer',
                  transition: 'opacity 0.2s ease',
                  opacity: 1
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.6'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                {item}
              </span>
              {idx < arr.length - 1 && <span style={{ marginRight: '6px' }}>, </span>}
            </React.Fragment>
          ))}
        </div>

        {/* DESKTOP CTA (RIGHT) */}
        <div className="desktop-cta">
          <a
            onClick={onLaunchConsole}
            style={{
              fontSize: 'clamp(18px, 2vw, 23px)',
              color: '#fff',
              textDecoration: 'underline',
              textUnderlineOffset: '4px',
              cursor: 'pointer',
              transition: 'opacity 0.2s ease',
              fontWeight: 400
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.6'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            Get in touch
          </a>
        </div>

        {/* MOBILE HAMBURGER BUTTON */}
        <button
          className="mobile-hamburger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
          style={{
            display: 'none',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '5px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            zIndex: 20
          }}
        >
          <span style={{
            display: 'block',
            width: '24px',
            height: '2px',
            backgroundColor: '#ffffff',
            transition: 'transform 0.3s ease',
            transform: mobileMenuOpen ? 'translateY(7px) rotate(45deg)' : 'none'
          }} />
          <span style={{
            display: 'block',
            width: '24px',
            height: '2px',
            backgroundColor: '#ffffff',
            transition: 'opacity 0.3s ease',
            opacity: mobileMenuOpen ? 0 : 1
          }} />
          <span style={{
            display: 'block',
            width: '24px',
            height: '2px',
            backgroundColor: '#ffffff',
            transition: 'transform 0.3s ease',
            transform: mobileMenuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none'
          }} />
        </button>

      </nav>

      {/* MOBILE OVERLAY (z-index: 9) */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.92)',
        backdropFilter: 'blur(16px)',
        zIndex: 9,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '2rem',
        gap: '2rem',
        opacity: mobileMenuOpen ? 1 : 0,
        pointerEvents: mobileMenuOpen ? 'auto' : 'none',
        transition: 'opacity 0.3s ease'
      }}>
        {['Labs', 'Studio', 'Openings', 'Shop'].map((item) => (
          <div
            key={item}
            onClick={() => {
              setMobileMenuOpen(false);
              if (onSelectFeature) onSelectFeature(item.toLowerCase());
              else onLaunchConsole();
            }}
            style={{
              fontSize: '32px',
              fontWeight: 500,
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            {item}
          </div>
        ))}
        <div
          onClick={() => {
            setMobileMenuOpen(false);
            onLaunchConsole();
          }}
          style={{
            fontSize: '32px',
            fontWeight: 500,
            color: '#fff',
            textDecoration: 'underline',
            cursor: 'pointer',
            marginTop: '1rem'
          }}
        >
          Get in touch
        </div>
      </div>

      {/* 3. HERO SECTION (z-index: 2) */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 clamp(1.25rem, 5vw, 2.5rem)',
        maxWidth: '42rem',
        boxSizing: 'border-box'
      }}>
        
        {/* 1. BLURRED INTRO LABEL */}
        <div style={{
          pointerEvents: 'none',
          userSelect: 'none',
          marginBottom: '1.25rem',
          fontSize: 'clamp(18px, 4vw, 26px)',
          lineHeight: 1.3,
          fontWeight: 400,
          color: '#ffffff',
          filter: 'blur(4px)',
          opacity: 0.95
        }}>
          Hey there, meet A.R.I.A,<br />
          Mainframe's Adaptive Response Interface Agent
        </div>

        {/* 2. TYPEWRITER TEXT */}
        <p style={{
          fontSize: 'clamp(18px, 4vw, 26px)',
          lineHeight: 1.35,
          fontWeight: 400,
          color: '#ffffff',
          marginBottom: '1.5rem',
          minHeight: '54px'
        }}>
          {displayed}
          {!done && (
            <span style={{
              display: 'inline-block',
              width: '2px',
              height: '1.1em',
              backgroundColor: '#ffffff',
              verticalAlign: 'middle',
              marginLeft: '2px',
              animation: 'blink 1s step-end infinite'
            }} />
          )}
        </p>

        {/* 3. ACTION PILL BUTTONS */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.4rem 0.35rem',
          opacity: pillButtonsVisible ? 1 : 0,
          transform: pillButtonsVisible ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.4s ease, transform 0.4s ease'
        }}>
          
          {/* WHITE PILL BUTTON 1 */}
          <button
            onClick={onLaunchConsole}
            className="action-pill-white"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#ffffff',
              color: '#000000',
              border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: '9999px',
              fontSize: 'clamp(13px, 1.8vw, 15px)',
              padding: '0.35em 1.25em',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'all 0.2s ease'
            }}
          >
            Pitch us an idea
          </button>

          {/* WHITE PILL BUTTON 2 */}
          <button
            onClick={() => onSelectFeature ? onSelectFeature('models') : onLaunchConsole()}
            className="action-pill-white"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#ffffff',
              color: '#000000',
              border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: '9999px',
              fontSize: 'clamp(13px, 1.8vw, 15px)',
              padding: '0.35em 1.25em',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'all 0.2s ease'
            }}
          >
            Come work here
          </button>

          {/* WHITE PILL BUTTON 3 */}
          <button
            onClick={() => onSelectFeature ? onSelectFeature('monitor') : onLaunchConsole()}
            className="action-pill-white"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#ffffff',
              color: '#000000',
              border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: '9999px',
              fontSize: 'clamp(13px, 1.8vw, 15px)',
              padding: '0.35em 1.25em',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'all 0.2s ease'
            }}
          >
            Send a brief hello
          </button>

          {/* WHITE PILL BUTTON 4 */}
          <button
            onClick={() => onSelectFeature ? onSelectFeature('networks') : onLaunchConsole()}
            className="action-pill-white"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#ffffff',
              color: '#000000',
              border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: '9999px',
              fontSize: 'clamp(13px, 1.8vw, 15px)',
              padding: '0.35em 1.25em',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'all 0.2s ease'
            }}
          >
            See how we operate
          </button>

          {/* OUTLINE PILL BUTTON (COPY EMAIL) */}
          <button
            onClick={handleCopyEmail}
            className="action-pill-outline"
            title="Click to copy email address"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'clamp(0.4rem, 1vw, 0.65rem)',
              backgroundColor: 'transparent',
              color: '#ffffff',
              border: '1px solid #ffffff',
              borderRadius: '9999px',
              fontSize: 'clamp(13px, 1.8vw, 15px)',
              padding: '0.35em 1.25em',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'all 0.2s ease'
            }}
          >
            <span>
              {copied ? 'Copied to clipboard!' : (
                <>Reach us: <span style={{ textDecoration: 'underline', textUnderlineOffset: '2px' }}>hello@mainframe.co</span></>
              )}
            </span>
            
            {/* 12x12 COPY SVG ICON */}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>

        </div>

      </div>

      {/* EMBEDDED STYLES FOR RESPONSIVE BEHAVIOR & HOVER INVERSIONS */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .action-pill-white:hover {
          background-color: #000000 !important;
          color: #ffffff !important;
          border-color: #ffffff !important;
        }

        .action-pill-outline:hover {
          background-color: #ffffff !important;
          color: #000000 !important;
        }

        @media (max-width: 768px) {
          .desktop-nav-links, .desktop-cta {
            display: none !important;
          }
          .mobile-hamburger {
            display: flex !important;
          }
        }
      `}</style>

    </div>
  );
}
