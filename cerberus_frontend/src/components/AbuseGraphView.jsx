import React, { useState } from 'react';
import { Layers, ShieldAlert, AlertTriangle, Smartphone, Globe, CreditCard, User, Store } from 'lucide-react';

export default function AbuseGraphView() {
  const [selectedRing, setSelectedRing] = useState({
    id: 'RING_DELTA_042',
    name: 'Card Testing Burst Syndicate',
    accounts: 14,
    devices: 2,
    ips: 3,
    volume: 420000.0,
    confidence: 98.4,
    status: 'BLOCKED & ISOLATED',
    description: '14 synthetic buyer accounts sharing identical Canvas hash fingerprint across 3 VPN exit subnets.'
  });

  const [selectedNode, setSelectedNode] = useState(null);

  // Nodes for the visual network graph
  const nodes = [
    { id: 'U1', label: 'USR_8921', type: 'USER', x: 120, y: 80, risk: 'HIGH' },
    { id: 'U2', label: 'USR_8922', type: 'USER', x: 120, y: 160, risk: 'HIGH' },
    { id: 'U3', label: 'USR_8923', type: 'USER', x: 120, y: 240, risk: 'HIGH' },
    { id: 'U4', label: 'USR_8924', type: 'USER', x: 120, y: 320, risk: 'HIGH' },
    
    { id: 'D1', label: 'DEV_FINGERPRINT_A9', type: 'DEVICE', x: 280, y: 140, risk: 'CRITICAL' },
    { id: 'D2', label: 'DEV_FINGERPRINT_B2', type: 'DEVICE', x: 280, y: 260, risk: 'CRITICAL' },
    
    { id: 'IP1', label: '185.220.101.4 (Proxy)', type: 'IP', x: 440, y: 120, risk: 'HIGH' },
    { id: 'IP2', label: '45.154.255.88 (Proxy)', type: 'IP', x: 440, y: 220, risk: 'HIGH' },
    
    { id: 'C1', label: 'CARD_4111_9210', type: 'CARD', x: 280, y: 380, risk: 'CRITICAL' },
    { id: 'M1', label: 'Digital Gift Cards Gateway', type: 'MERCHANT', x: 440, y: 360, risk: 'NORMAL' },
  ];

  const links = [
    { from: 'U1', to: 'D1' },
    { from: 'U2', to: 'D1' },
    { from: 'U3', to: 'D2' },
    { from: 'U4', to: 'D2' },
    { from: 'D1', to: 'IP1' },
    { from: 'D2', to: 'IP2' },
    { from: 'U1', to: 'C1' },
    { from: 'U2', to: 'C1' },
    { from: 'U3', to: 'C1' },
    { from: 'C1', to: 'M1' }
  ];

  const getNodeIcon = (type) => {
    switch(type) {
      case 'USER': return <User size={12} />;
      case 'DEVICE': return <Smartphone size={12} />;
      case 'IP': return <Globe size={12} />;
      case 'CARD': return <CreditCard size={12} />;
      case 'MERCHANT': return <Store size={12} />;
      default: return <Layers size={12} />;
    }
  };

  const getNodeColor = (risk) => {
    if (risk === 'CRITICAL') return '#ef4444';
    if (risk === 'HIGH') return '#f87171';
    if (risk === 'NORMAL') return '#10b981';
    return '#3b82f6';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* SIMULATED ENVIRONMENT NOTICE (RULE 7) */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '6px',
        padding: '0.65rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '12px',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 700, color: '#f59e0b' }}>
            ● SIMULATED ABUSE TOPOLOGY
          </span>
          <span>— Entity relationship clustering derived from synthetic cardholder graph.</span>
        </div>
        <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          Active Rings: 2 • Graph Density: 0.42
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        
        {/* INTERACTIVE GRAPH CANVAS */}
        <div className="fintech-card" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>
                Entity Relationship Network
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Visualizing correlated accounts, shared hardware fingerprints, and common payment targets
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', fontSize: '11px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ef4444' }}>
                ● Critical Entity
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981' }}>
                ● Normal Target
              </span>
            </div>
          </div>

          {/* SVG GRAPH RENDER */}
          <div style={{ background: '#090b10', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '1rem', minHeight: '440px' }}>
            <svg width="100%" height="420" viewBox="0 0 540 420" style={{ overflow: 'visible' }}>
              
              {/* Links */}
              {links.map((link, idx) => {
                const source = nodes.find(n => n.id === link.from);
                const target = nodes.find(n => n.id === link.to);
                return (
                  <line
                    key={idx}
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    stroke="rgba(239, 68, 68, 0.4)"
                    strokeWidth="1.5"
                    strokeDasharray={link.to === 'M1' ? '4 2' : 'none'}
                  />
                );
              })}

              {/* Nodes */}
              {nodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const color = getNodeColor(node.risk);
                return (
                  <g 
                    key={node.id} 
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={() => setSelectedNode(node)}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle
                      r={isSelected ? 16 : 13}
                      fill="var(--bg-card)"
                      stroke={color}
                      strokeWidth={isSelected ? 3 : 2}
                    />
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      fill={color}
                      fontSize="9"
                      fontWeight="bold"
                    >
                      {node.type[0]}
                    </text>
                    <text
                      x="0"
                      y="24"
                      textAnchor="middle"
                      fill="var(--text-secondary)"
                      fontSize="10"
                      className="mono"
                    >
                      {node.label.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '0.75rem', textAlign: 'center' }}>
            Click any node on the graph to inspect entity relations and risk profiles.
          </div>
        </div>

        {/* CLUSTER INSPECTOR DOSSIER */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div className="fintech-card" style={{ padding: '1.25rem', borderLeft: '3px solid #ef4444' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span className="badge-blocked">ABUSE RING DETECTED</span>
              <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{selectedRing.id}</span>
            </div>

            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
              {selectedRing.name}
            </h4>

            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
              {selectedRing.description}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '12px', background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Linked Accounts:</span>
                <strong style={{ color: '#fff' }}>{selectedRing.accounts} Accounts</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Shared Devices:</span>
                <strong style={{ color: '#fff' }}>{selectedRing.devices} Fingerprints</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Proxy IPs Involved:</span>
                <strong style={{ color: '#fff' }}>{selectedRing.ips} Datacenter Nodes</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Transaction Volume:</span>
                <strong style={{ color: '#f87171' }}>₹{selectedRing.volume.toLocaleString('en-IN')}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Detection Confidence:</span>
                <strong style={{ color: '#10b981' }}>{selectedRing.confidence}%</strong>
              </div>
            </div>
          </div>

          {/* Node Specific Details */}
          {selectedNode && (
            <div className="fintech-card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
                Selected Entity Details
              </div>
              <div className="mono" style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>
                {selectedNode.label}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Type: <strong>{selectedNode.type}</strong> • Risk Level: <strong style={{ color: getNodeColor(selectedNode.risk) }}>{selectedNode.risk}</strong>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}