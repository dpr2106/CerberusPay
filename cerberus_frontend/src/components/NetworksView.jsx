import React, { useState, useEffect } from 'react';
import { 
  Layers, ShieldAlert, Smartphone, Globe, CreditCard, 
  User, Store, ArrowLeft, Info, Activity, AlertTriangle, CheckCircle2 
} from 'lucide-react';

export default function NetworksView({ focusedTransaction, onBackToInvestigation }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [hoveredLink, setHoveredLink] = useState(null);

  const activeUserId = focusedTransaction?.user_id || 'USR_8921';
  const activeDeviceId = focusedTransaction?.signals?.device_id || 'DEV_FINGERPRINT_A9';
  const activeIp = focusedTransaction?.signals?.ip_address || '185.220.101.4 (Proxy)';
  const activeCard = focusedTransaction?.signals?.card_mask || 'CARD_4111_9210';
  const isThreat = (focusedTransaction?.risk_score || 85) >= 70;

  const nodes = [
    { id: 'U1', label: activeUserId, type: 'USER', x: 110, y: 70, risk: isThreat ? 'HIGH' : 'LOW', active: true, desc: 'Target Consumer Account' },
    { id: 'U2', label: 'USR_8922', type: 'USER', x: 110, y: 150, risk: 'HIGH', active: false, desc: 'Correlated Velocity Burst Account' },
    { id: 'U3', label: 'USR_3410', type: 'USER', x: 110, y: 230, risk: 'HIGH', active: false, desc: 'Synthetic ID Farm Account' },
    { id: 'U4', label: 'USR_5192', type: 'USER', x: 110, y: 310, risk: 'HIGH', active: false, desc: 'Rapid Sequential Card Attempt' },
    
    { id: 'D1', label: activeDeviceId, type: 'DEVICE', x: 280, y: 130, risk: isThreat ? 'CRITICAL' : 'LOW', active: true, desc: 'Shared Hardware Canvas Fingerprint' },
    { id: 'D2', label: 'DEV_FINGERPRINT_B2', type: 'DEVICE', x: 280, y: 250, risk: 'CRITICAL', active: false, desc: 'Secondary Emulated Mobile Device' },
    
    { id: 'IP1', label: activeIp, type: 'IP', x: 450, y: 110, risk: isThreat ? 'HIGH' : 'LOW', active: true, desc: 'Anonymized Datacenter Egress Node' },
    { id: 'IP2', label: '45.154.255.88 (Proxy)', type: 'IP', x: 450, y: 210, risk: 'HIGH', active: false, desc: 'Tor Exit / VPN Gateway' },
    
    { id: 'C1', label: activeCard, type: 'CARD', x: 280, y: 370, risk: isThreat ? 'CRITICAL' : 'LOW', active: true, desc: 'Target Payment Card Instrument' },
    { id: 'M1', label: 'High-Ticket Electronics Gateway', type: 'MERCHANT', x: 450, y: 350, risk: 'NORMAL', active: false, desc: 'Target Checkout Destination' },
  ];

  const links = [
    { from: 'U1', to: 'D1', label: 'Device Binding' },
    { from: 'U2', to: 'D1', label: 'Device Collision' },
    { from: 'U3', to: 'D2', label: 'Emulated Device' },
    { from: 'U4', to: 'D2', label: 'Fingerprint Collision' },
    { from: 'D1', to: 'IP1', label: 'Proxy Routing' },
    { from: 'D2', to: 'IP2', label: 'Tor Routing' },
    { from: 'U1', to: 'C1', label: 'Card Attempt' },
    { from: 'U2', to: 'C1', label: 'Card Testing' },
    { from: 'U3', to: 'C1', label: 'BIN Attack' },
    { from: 'C1', to: 'M1', label: 'Checkout Request' }
  ];

  useEffect(() => {
    setSelectedNode(nodes[0]);
  }, [focusedTransaction?.id]);

  const getNodeColor = (risk) => {
    if (risk === 'CRITICAL') return '#ef4444';
    if (risk === 'HIGH') return '#f87171';
    if (risk === 'NORMAL') return '#10b981';
    return '#3b82f6';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* CONTEXT BANNER */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        padding: '0.85rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.85rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {focusedTransaction && (
            <button
              onClick={onBackToInvestigation}
              className="btn-secondary-fintech"
              style={{ padding: '4px 10px', fontSize: '11px', gap: '5px' }}
            >
              <ArrowLeft size={13} />
              <span>Back to Dossier ({focusedTransaction.id})</span>
            </button>
          )}
          <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
            Investigating Syndicate Entity Collision for: <strong style={{ color: '#fff' }}>{activeUserId}</strong> ({activeDeviceId})
          </span>
        </div>

        <div style={{ display: 'flex', gap: '12px', fontSize: '11px', fontWeight: 600 }}>
          <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }} /> High Risk Node
          </span>
          <span style={{ color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6' }} /> Investigated Target
          </span>
          <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} /> Merchant Endpoint
          </span>
        </div>
      </div>

      {/* GRAPH CANVAS & CLUSTER INSPECTOR */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        
        {/* GRAPH CANVAS */}
        <div className="fintech-card" style={{ padding: '1.5rem', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '14.5px', fontWeight: 800, color: '#fff' }}>
                Syndicate & Entity Topology Graph
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Visualizing multi-account device collisions, proxy clusters, and card-testing rings
              </p>
            </div>
          </div>

          <div style={{ 
            background: '#070a0f', 
            border: '1px solid var(--border-subtle)', 
            borderRadius: '8px', 
            padding: '1rem', 
            minHeight: '430px',
            position: 'relative' 
          }}>
            <svg width="100%" height="410" viewBox="0 0 560 410" style={{ overflow: 'visible' }}>
              
              {/* LINKS */}
              {links.map((link, idx) => {
                const source = nodes.find(n => n.id === link.from);
                const target = nodes.find(n => n.id === link.to);
                const isHovered = (hoveredNode && (hoveredNode.id === link.from || hoveredNode.id === link.to)) || (hoveredLink === idx);
                return (
                  <g key={idx} onMouseEnter={() => setHoveredLink(idx)} onMouseLeave={() => setHoveredLink(null)}>
                    <line
                      x1={source.x}
                      y1={source.y}
                      x2={target.x}
                      y2={target.y}
                      stroke={isHovered ? '#60a5fa' : 'rgba(239, 68, 68, 0.4)'}
                      strokeWidth={isHovered ? '2.5' : '1.5'}
                      strokeDasharray={link.to === 'M1' ? '4 3' : 'none'}
                      style={{ transition: 'all 0.15s ease' }}
                    />
                  </g>
                );
              })}

              {/* NODES */}
              {nodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const isHovered = hoveredNode?.id === node.id;
                const color = node.active ? '#3b82f6' : getNodeColor(node.risk);
                
                return (
                  <g 
                    key={node.id} 
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={() => setSelectedNode(node)}
                    onMouseEnter={() => setHoveredNode(node)}
                    onMouseLeave={() => setHoveredNode(null)}
                    style={{ cursor: 'pointer', transition: 'transform 0.15s ease' }}
                  >
                    {/* Pulsing ring on active node */}
                    {node.active && (
                      <circle
                        r="20"
                        fill="none"
                        stroke="rgba(59, 130, 246, 0.3)"
                        strokeWidth="1.5"
                        className="animate-pulse"
                      />
                    )}
                    
                    <circle
                      r={isSelected || isHovered ? 16 : 13}
                      fill="var(--bg-card)"
                      stroke={color}
                      strokeWidth={isSelected ? 3 : (node.active ? 2.5 : 1.8)}
                      style={{
                        filter: isSelected || isHovered ? `drop-shadow(0 0 8px ${color})` : 'none',
                        transition: 'all 0.15s ease'
                      }}
                    />
                    
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      fill={color}
                      fontSize="9.5"
                      fontWeight="800"
                    >
                      {node.type[0]}
                    </text>
                    
                    <text
                      x="0"
                      y="25"
                      textAnchor="middle"
                      fill={node.active ? '#60a5fa' : (isSelected ? '#fff' : 'var(--text-secondary)')}
                      fontSize="10"
                      fontWeight={node.active || isSelected ? '700' : '500'}
                      className="mono"
                    >
                      {node.label.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* HOVER TOOLTIP ON NODE */}
            {hoveredNode && (
              <div style={{
                position: 'absolute',
                top: Math.max(hoveredNode.y - 45, 10),
                left: Math.min(hoveredNode.x + 25, 340),
                background: 'rgba(18, 23, 34, 0.95)',
                border: `1px solid ${getNodeColor(hoveredNode.risk)}`,
                borderRadius: '6px',
                padding: '6px 10px',
                fontSize: '11px',
                color: '#fff',
                zIndex: 100,
                boxShadow: 'var(--shadow-lg)',
                pointerEvents: 'none'
              }}>
                <div className="mono" style={{ fontWeight: 800 }}>{hoveredNode.label}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '10px' }}>{hoveredNode.desc}</div>
              </div>
            )}
          </div>

          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '0.75rem', textAlign: 'center' }}>
            Hover or click any node to inspect multi-entity correlations and shared hardware artifacts.
          </div>
        </div>

        {/* NODE & SYNDICATE DETAIL PANEL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Syndicate Card */}
          <div className="fintech-card" style={{ padding: '1.25rem', borderLeft: '4px solid #ef4444', boxShadow: 'var(--shadow-glow-red)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span className="badge-blocked">SYNDICATE CLUSTER</span>
              <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>RING_DELTA_042</span>
            </div>

            <h4 style={{ fontSize: '14.5px', fontWeight: 800, color: '#fff', marginBottom: '0.35rem' }}>
              Card Testing Burst Syndicate
            </h4>

            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.85rem' }}>
              Correlated multi-account ring sharing hardware fingerprint <strong className="mono" style={{ color: '#fff' }}>{activeDeviceId}</strong> and datacenter egress proxy <strong className="mono" style={{ color: '#fff' }}>{activeIp}</strong>.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '12px', background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: '7px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Correlated Accounts:</span>
                <strong style={{ color: '#fff' }}>14 Synthetic Users</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Shared Fingerprint:</span>
                <span className="mono" style={{ color: '#60a5fa' }}>{activeDeviceId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Total Exposure:</span>
                <strong style={{ color: '#f87171' }}>₹4,20,000</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Clustering Confidence:</span>
                <strong style={{ color: '#10b981' }}>98.4%</strong>
              </div>
            </div>
          </div>

          {/* Selected Node Details */}
          {selectedNode && (
            <div className="fintech-card" style={{ padding: '1.25rem', borderLeft: `4px solid ${selectedNode.active ? '#3b82f6' : getNodeColor(selectedNode.risk)}` }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.04em' }}>
                SELECTED ENTITY DETAILS
              </div>
              <div className="mono" style={{ fontSize: '14.5px', fontWeight: 800, color: '#fff' }}>
                {selectedNode.label}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Entity Type: <strong style={{ color: '#fff' }}>{selectedNode.type}</strong> • Role: <strong style={{ color: 'var(--text-muted)' }}>{selectedNode.desc}</strong>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Topology Risk: <strong style={{ color: selectedNode.active ? '#60a5fa' : getNodeColor(selectedNode.risk) }}>
                  {selectedNode.active ? 'ACTIVE INVESTIGATION TARGET' : `${selectedNode.risk} RISK COLLISION`}
                </strong>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
