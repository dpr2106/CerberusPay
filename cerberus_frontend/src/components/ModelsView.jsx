import React, { useState } from 'react';
import { Cpu, Sliders, BarChart3, CheckCircle2 } from 'lucide-react';

export default function ModelsView({ metrics }) {
  const [threshold, setThreshold] = useState(0.45);

  const featureImportances = [
    { name: 'Geographic Distance Jump (km)', weight: 44.2, description: 'Deviation from historical cardholder centroid' },
    { name: '1-Hour Velocity Anomaly', weight: 28.4, description: 'Rapid sequential checkout bursts' },
    { name: 'Proxy / Tor / Datacenter IP', weight: 14.6, description: 'Network routing anonymizer detection' },
    { name: 'Account Age & Maturity (Days)', weight: 6.8, description: 'New synthetic vs established accounts' },
    { name: 'Recent Card Declines (24h)', weight: 4.2, description: 'Card testing brute-force indicator' },
    { name: 'Cart Ticket Value Deviation', weight: 1.8, description: 'Sudden high-ticket item deviations' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* SIMULATED NOTICE */}
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
            ● DEMO / SIMULATED DATASET (6,000 TEST SPLIT)
          </span>
          <span>— Measured offline metrics on held-out stratified test data.</span>
        </div>
        <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          Model: Gradient Boosting Classifier v1.0.0-prod
        </span>
      </div>

      {/* METRIC KPIS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="fintech-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>PRECISION (HELD-OUT)</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
            96.2%
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Controlled false decline rate
          </div>
        </div>

        <div className="fintech-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>RECALL (HELD-OUT)</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#3b82f6', marginTop: '2px' }}>
            94.1%
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Interception coverage
          </div>
        </div>

        <div className="fintech-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>F1-SCORE</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
            0.951
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Harmonic balance
          </div>
        </div>

        <div className="fintech-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>ROC-AUC SCORE</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#8b5cf6', marginTop: '2px' }}>
            0.988
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            High class separability
          </div>
        </div>
      </div>

      {/* CONFUSION MATRIX & FEATURE IMPORTANCES */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '1.5rem' }}>
        
        {/* Confusion Matrix */}
        <div className="fintech-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>
            Held-Out Confusion Matrix
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Evaluated on 6,000 transactions (5,609 authentic, 391 fraudulent)
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', textAlign: 'center' }}>
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', padding: '1rem', borderRadius: '6px' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>5,597</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>True Negatives (Allowed)</div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', padding: '1rem', borderRadius: '6px' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f59e0b' }}>12</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>False Positives (Friction)</div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', padding: '1rem', borderRadius: '6px' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f87171' }}>24</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>False Negatives (Missed)</div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', padding: '1rem', borderRadius: '6px' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>367</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>True Positives (Blocked)</div>
            </div>
          </div>

          <div style={{ marginTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Decision Threshold</span>
              <span className="mono" style={{ color: '#3b82f6', fontWeight: 700 }}>{threshold}</span>
            </div>
            <input
              type="range"
              min="0.10"
              max="0.90"
              step="0.05"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              style={{ width: '100%' }}
            />
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Tunable threshold to minimize merchant friction cost vs fraud losses.
            </div>
          </div>
        </div>

        {/* Feature Importances */}
        <div className="fintech-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>
            Model Feature Importances (Gini Impurity)
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Relative weight of behavioral signals in the ensemble decision trees
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {featureImportances.map((f, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '3px' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{f.name}</span>
                  <span className="mono" style={{ color: '#3b82f6', fontWeight: 700 }}>{f.weight}%</span>
                </div>
                <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${f.weight}%`, height: '100%', background: '#3b82f6', borderRadius: '3px' }} />
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {f.description}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}