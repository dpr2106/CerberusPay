import React from 'react';
import { ShieldCheck, Activity, Search, Layers, Cpu, FileText, Server, User, LogOut, Lock } from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  mode, 
  setMode, 
  isStreamLive, 
  setIsStreamLive, 
  selectedTransaction,
  currentUser,
  onLogout
}) {
  const isCustomerRole = currentUser?.role === 'customer';

  const analystTabs = [
    { id: 'monitor', label: 'Monitor', icon: Activity },
    { id: 'investigate', label: selectedTransaction ? `Investigate (${selectedTransaction.id})` : 'Investigate', icon: Search },
    { id: 'networks', label: 'Networks', icon: Layers },
    { id: 'models', label: 'Models', icon: Cpu },
  ];

  const secondaryTabs = [
    { id: 'chargebacks', label: 'Chargebacks', icon: FileText },
    { id: 'system', label: 'System', icon: Server },
    { id: 'customer', label: 'Customer Portal', icon: User },
  ];

  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--bg-secondary)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* BRAND & STATUS HEADER */}
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0.65rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        
        {/* BRAND */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <ShieldCheck size={16} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 800, letterSpacing: '-0.01em', color: '#fff' }}>
                CERBERUSPAY
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Payment Risk Intelligence
            </div>
          </div>
        </div>

        {/* STATUS & CONTROLS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            fontWeight: 600,
            color: '#10b981',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            padding: '2px 8px',
            borderRadius: '4px'
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
            SYSTEM ONLINE
          </div>

          <div 
            onClick={() => setMode(mode === 'SIMULATION' ? 'SANDBOX' : 'SIMULATION')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: 600,
              color: mode === 'SIMULATION' ? '#f59e0b' : '#3b82f6',
              background: mode === 'SIMULATION' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.1)',
              border: `1px solid ${mode === 'SIMULATION' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(59, 130, 246, 0.25)'}`,
              padding: '2px 8px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            title="Click to toggle Simulation / Sandbox"
          >
            <span>● {mode} MODE</span>
          </div>

          <button
            onClick={() => setIsStreamLive(!isStreamLive)}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              color: isStreamLive ? '#10b981' : 'var(--text-muted)',
              borderRadius: '4px',
              padding: '2px 8px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {isStreamLive ? 'Stream: Live' : 'Stream: Paused'}
          </button>

          {/* AUTHENTICATED USER BADGE & LOGOUT */}
          {currentUser && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: currentUser.role === 'customer' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                border: `1px solid ${currentUser.role === 'customer' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                color: currentUser.role === 'customer' ? '#60a5fa' : '#34d399'
              }}>
                <User size={12} />
                <span style={{ fontWeight: 600 }}>{currentUser.name}</span>
                <span className="mono" style={{ opacity: 0.75 }}>({currentUser.user_id})</span>
              </div>

              <button
                onClick={onLogout}
                title="Lock Session & Sign Out"
                className="btn-secondary-fintech"
                style={{ padding: '3px 8px', fontSize: '11px', color: '#f87171', borderColor: 'rgba(239,68,68,0.3)' }}
              >
                <Lock size={11} />
                <span>Lock / Sign Out</span>
              </button>
            </div>
          )}

        </div>

      </div>

      {/* STREAMLINED NAVIGATION */}
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '1px solid var(--border-subtle)',
        overflowX: 'auto'
      }}>
        
        {/* PRIMARY TABS (FOR ANALYST / OPERATORS) */}
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          {analystTabs.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? '2px solid #3b82f6' : '2px solid transparent',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '13px',
                  padding: '0.65rem 0.85rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.15s ease'
                }}
              >
                <Icon size={15} color={isActive ? '#3b82f6' : 'var(--text-muted)'} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* SECONDARY TABS */}
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          {secondaryTabs.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isCustomerTab = item.id === 'customer';
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? (isCustomerTab ? '2px solid #3b82f6' : '2px solid var(--text-muted)') : '2px solid transparent',
                  color: isActive ? '#fff' : (isCustomerTab ? '#60a5fa' : 'var(--text-muted)'),
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '12px',
                  padding: '0.65rem 0.65rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={13} color={isCustomerTab ? '#60a5fa' : undefined} />
                {item.label}
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
