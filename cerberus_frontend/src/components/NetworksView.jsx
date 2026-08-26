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

      {/* TOPOLOGY GRAPH & METADATA DOSSIER */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        
        {/* INTERACTIVE NETWORK GRAPH */}
        <div className="fintech-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '14.5px', fontWeight: 800, color: '#fff' }}>Syndicate Graph Topology</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Select any node to trace correlated fraud clusters and shared hardware fingerprints
              </p>
            </div>
            <span className="badge-blocked" style={{ fontSize: '11px' }}>
              <ShieldAlert size={12} /> RING_DELTA_042 (Active)
            </span>
          </div>

          <div style={{ 
            background: 'var(--bg-secondary)', 
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

              {/* CLEAN SVG NODES WITH ACCURATE CO-ORDINATES */}
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
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Pulsing ring on active node */}
                    {node.active && (
                      <circle
                        r="20"
                        fill="none"
                        stroke="rgba(59, 130, 246, 0.35)"
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
                        filter: isSelected || isHovered ? `drop-shadow(0 0 10px ${color})` : 'none',
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
              <div 
                style={{
                  position: 'absolute',
                  top: Math.max(hoveredNode.y - 45, 10),
                  left: Math.min(hoveredNode.x + 25, 340),
                  background: 'rgba(18, 23, 34, 0.95)',
                  border: `1px solid ${getNodeColor(hoveredNode.risk)}`,
                  borderRadius: '6px',
                  padding: '6px 10px',
                  fontSize: '11px',
                  color: '#fff',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.6)',
                  pointerEvents: 'none',
                  zIndex: 20
                }}
              >
                <div style={{ fontWeight: 700, color: getNodeColor(hoveredNode.risk) }}>
                  [{hoveredNode.type}] {hoveredNode.label}
                </div>
                <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                  {hoveredNode.desc}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* NODE INSPECTION DOSSIER */}
        <div className="fintech-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '14.5px', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>
            Entity Cluster Intelligence
          </h3>

          {selectedNode ? (
            <div 
              key={selectedNode.id}
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div style={{ 
                background: 'var(--bg-secondary)', 
                border: `1px solid ${getNodeColor(selectedNode.risk)}`, 
                borderRadius: '8px', 
                padding: '1rem' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span className="badge-source">{selectedNode.type} ENTITY</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: getNodeColor(selectedNode.risk) }}>
                    RISK: {selectedNode.risk}
                  </span>
                </div>
                <div className="mono" style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>
                  {selectedNode.label}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {selectedNode.desc}
                </div>
              </div>

              {/* Cluster Statistics */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Connected Accounts:</span>
                  <strong style={{ color: '#fff' }}>4 Associated Users</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Syndicate Radius:</span>
                  <strong style={{ color: '#f87171' }}>3-Hop Correlation</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Total Value at Risk:</span>
                  <strong style={{ color: '#f87171' }}>₹5,72,835</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Detection Pattern:</span>
                  <strong style={{ color: '#fbbf24' }}>Card Testing Burst</strong>
                </div>
              </div>

              <div style={{ 
                background: 'rgba(239, 68, 68, 0.08)', 
                border: '1px solid var(--status-blocked-border)', 
                borderRadius: '8px', 
                padding: '0.85rem', 
                fontSize: '11.5px', 
                color: '#fca5a5' 
              }}>
                <strong>Graph Finding:</strong> Device <span className="mono">{activeDeviceId}</span> is reused across multiple synthetic identities originating from proxy IP subnets within 30-minute intervals.
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 1rem' }}>
              Click any node in the topology graph to inspect its syndicate metadata.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
