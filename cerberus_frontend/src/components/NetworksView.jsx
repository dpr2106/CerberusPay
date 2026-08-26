import React, { useState, useEffect } from 'react';
import { Layers, ShieldAlert, Smartphone, Globe, CreditCard, User, Store, ArrowLeft } from 'lucide-react';

export default function NetworksView({ focusedTransaction, onBackToInvestigation }) {
  const [selectedNode, setSelectedNode] = useState(null);

  // Focus on the specific entities from the investigated transaction if available
  const activeUserId = focusedTransaction?.user_id || 'USR_8921';
  const activeDeviceId = focusedTransaction?.signals?.device_id || 'DEV_FINGERPRINT_A9';
  const activeIp = focusedTransaction?.signals?.ip_address || '185.220.101.4 (Proxy)';
  const activeCard = focusedTransaction?.signals?.card_mask || 'CARD_4111_9210';
  const isThreat = (focusedTransaction?.risk_score || 85) >= 70;

  const nodes = [
    { id: 'U1', label: activeUserId, type: 'USER', x: 120, y: 80, risk: isThreat ? 'HIGH' : 'LOW', active: true },
    { id: 'U2', label: 'USR_8922', type: 'USER', x: 120, y: 160, risk: 'HIGH', active: false },
    { id: 'U3', label: 'USR_3410', type: 'USER', x: 120, y: 240, risk: 'HIGH', active: false },
    { id: 'U4', label: 'USR_5192', type: 'USER', x: 120, y: 320, risk: 'HIGH', active: false },
    
    { id: 'D1', label: activeDeviceId, type: 'DEVICE', x: 280, y: 140, risk: isThreat ? 'CRITICAL' : 'LOW', active: true },
    { id: 'D2', label: 'DEV_FINGERPRINT_B2', type: 'DEVICE', x: 280, y: 260, risk: 'CRITICAL', active: false },
    
    { id: 'IP1', label: activeIp, type: 'IP', x: 440, y: 120, risk: isThreat ? 'HIGH' : 'LOW', active: true },
    { id: 'IP2', label: '45.154.255.88 (Proxy)', type: 'IP', x: 440, y: 220, risk: 'HIGH', active: false },
    
    { id: 'C1', label: activeCard, type: 'CARD', x: 280, y: 380, risk: isThreat ? 'CRITICAL' : 'LOW', active: true },
    { id: 'M1', label: 'Digital Goods & High Ticket Gateway', type: 'MERCHANT', x: 440, y: 360, risk: 'NORMAL', active: false },
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

  useEffect(() => {
    // Set default selected node to the investigated user
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
        borderRadius: '6px',
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {focusedTransaction && (
            <button
              onClick={onBackToInvestigation}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <ArrowLeft size={13} /> Back to Dossier ({focusedTransaction.id})
            </button>
          )}
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Investigating Entity Correlation for: <strong style={{ color: '#fff' }}>{activeUserId}</strong> ({activeDeviceId})
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px', fontSize: '11px' }}>
          <span style={{ color: '#ef4444' }}>● High Risk Node</span>
          <span style={{ color: '#3b82f6' }}>● Investigated Entity</span>
          <span style={{ color: '#10b981' }}>● Safe / Destination</span>
        </div>
      </div>

      {/* GRAPH CANVAS & CLUSTER INSPECTOR */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        
        {/* GRAPH CANVAS */}
        <div className="fintech-card" style={{ padding: '1.5rem', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>
                Syndicate & Entity Topology Graph
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Highlighting multi-account device collisions and proxy gateway patterns
              </p>
            </div>
          </div>

          <div style={{ background: '#090b10', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '1rem', minHeight: '430px' }}>
            <svg width="100%" height="410" viewBox="0 0 540 410" style={{ overflow: 'visible' }}>
              {links.map((link, idx) => {
                const source = nodes.find(n => n.id === link.from);
                const target = nodes.find(n => n.id === link.to);
                return (
                  <line
                    key={idx}
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.x}
                    stroke="rgba(239, 68, 68, 0.4)"
                    strokeWidth="1.5"
                    strokeDasharray={link.to === 'M1' ? '4 2' : 'none'}
                  />
                );
              })}

              {nodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const color = node.active ? '#3b82f6' : getNodeColor(node.risk);
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
                      strokeWidth={isSelected ? 3 : (node.active ? 2.5 : 1.5)}
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
                      fill={node.active ? '#60a5fa' : 'var(--text-secondary)'}
                      fontSize="10"
                      fontWeight={node.active ? 'bold' : 'normal'}
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
            Click any node on the graph to inspect correlated records and entity properties.
          </div>
        </div>

        {/* NODE & SYNDICATE DETAIL PANEL (RULE 3) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Syndicate Card */}
          <div className="fintech-card" style={{ padding: '1.25rem', borderLeft: '3px solid #ef4444' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span className="badge-blocked">SYNDICATE CLUSTER</span>
              <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>RING_DELTA_042</span>
            </div>

            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>
              Card Testing Burst Syndicate
            </h4>

            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.85rem' }}>
              Correlated multi-account cluster sharing hardware fingerprint <strong>{activeDeviceId}</strong> and datacenter egress proxy <strong>{activeIp}</strong>.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '12px', background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '6px' }}>
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
                <span style={{ color: 'var(--text-muted)' }}>Confidence:</span>
                <strong style={{ color: '#10b981' }}>98.4%</strong>
              </div>
            </div>
          </div>

          {/* Selected Node Details */}
          {selectedNode && (
            <div className="fintech-card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                SELECTED NODE DETAILS
              </div>
              <div className="mono" style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>
                {selectedNode.label}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Entity Type: <strong>{selectedNode.type}</strong>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Status: <strong style={{ color: selectedNode.active ? '#60a5fa' : getNodeColor(selectedNode.risk) }}>
                  {selectedNode.active ? 'ACTIVE INVESTIGATION TARGET' : `${selectedNode.risk} RISK`}
                </strong>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}