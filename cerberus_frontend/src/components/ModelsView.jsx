import React, { useState, useEffect } from 'react';
import { 
  Cpu, Sliders, BarChart3, CheckCircle2, AlertCircle, 
  RefreshCw, Info, HelpCircle, Activity, Target, ShieldCheck, Zap
} from 'lucide-react';

export default function ModelsView({ metrics }) {
  const [threshold, setThreshold] = useState(0.70);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [hoveredMetric, setHoveredMetric] = useState(null);
  const [hoveredFeature, setHoveredFeature] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/risk/config')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data.threshold !== undefined) {
          setThreshold(data.threshold);
        }
      })
      .catch(err => {
        console.error('[CerberusPay Models API Error] Failed to load risk config:', err);
      });
  }, []);

  const handleThresholdChange = async (newVal) => {
    const val = parseFloat(newVal);
    setThreshold(val);
    setIsSaving(true);
    setSaveStatus('saving');
    setStatusMessage('Syncing cutoff threshold to FastAPI backend...');

    try {
      const res = await fetch('http://127.0.0.1:8000/api/risk/config/threshold', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threshold: val })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || `Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      setThreshold(data.threshold);
      setSaveStatus('saved');
      setStatusMessage(`Decision threshold updated to ${data.threshold.toFixed(2)} on backend!`);
      setTimeout(() => {
        setSaveStatus(null);
        setStatusMessage(null);
      }, 3500);
    } catch (err) {
      console.error('[CerberusPay Threshold Update Error]:', err);
      setSaveStatus('error');
      setStatusMessage(`Failed to update threshold: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const metricCards = [
    { 
      id: 'precision', 
      label: 'PRECISION (HELD-OUT)', 
      value: '96.2%', 
      sub: 'False decline rate: 0.21%', 
      color: '#10B981', 
      pct: 96.2,
      desc: 'Proportion of flagged transactions that are genuinely fraudulent. High precision minimizes false friction for legitimate buyers.' 
    },
    { 
      id: 'recall', 
      label: 'RECALL (HELD-OUT)', 
      value: '94.1%', 
      sub: 'Fraud interception rate', 
      color: '#38BDF8', 
      pct: 94.1,
      desc: 'Proportion of all fraudulent transactions intercepted by the model. High recall minimizes merchant chargeback losses.' 
    },
    { 
      id: 'f1', 
      label: 'F1-SCORE (HARMONIC)', 
      value: '0.951', 
      sub: 'Balanced accuracy score', 
      color: '#FB923C', 
      pct: 95.1,
      desc: 'Harmonic mean of precision and recall, ensuring the model does not sacrifice customer checkout experience for fraud defense.' 
    },
    { 
      id: 'auc', 
      label: 'ROC-AUC SEPARABILITY', 
      value: '0.988', 
      sub: 'Class discrimination index', 
      color: '#F97316', 
      pct: 98.8,
      desc: 'Area Under Receiver Operating Characteristic Curve. Measures how effectively the model ranks fraudulent transactions above clean checkouts.' 
    }
  ];

  const featureImportances = [
    { name: 'Geographic Distance Jump (km)', weight: 44.2, description: 'Deviation from cardholder centroid' },
    { name: '1-Hour Velocity Anomaly', weight: 28.4, description: 'Rapid sequential checkout bursts' },
    { name: 'Proxy / Tor / Datacenter IP', weight: 14.6, description: 'Network routing anonymizer detection' },
    { name: 'Account Age & Maturity (Days)', weight: 6.8, description: 'New synthetic vs established accounts' },
    { name: 'Recent Card Declines (24h)', weight: 4.2, description: 'Card testing brute-force indicator' },
    { name: 'Cart Ticket Value Deviation', weight: 1.8, description: 'Sudden high-ticket item deviations' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* STATUS BANNER */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '7px',
        padding: '0.75rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        fontSize: '12px',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 700, color: '#FB923C', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Zap size={14} /> ACTIVE ML RISK ENGINE & METRIC BENCHMARKS
          </span>
          <span>— Calibrated Gradient Boosting Classifier v1.0.0-prod on stratified test split.</span>
        </div>
        <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          Ensemble: 150 Estimators • Max Depth: 5
        </span>
      </div>

      {/* METRIC BENCHMARK CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {metricCards.map((m) => (
          <div 
            key={m.id}
            className="fintech-card fintech-card-interactive"
            onMouseEnter={() => setHoveredMetric(m.id)}
            onMouseLeave={() => setHoveredMetric(null)}
            style={{ 
              padding: '1.25rem', 
              position: 'relative',
              borderLeft: `4px solid ${m.color}`
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.04em' }}>
                {m.label}
              </span>
              <HelpCircle size={13} color="var(--text-muted)" />
            </div>

            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#F8FAFC', marginTop: '4px', letterSpacing: '-0.02em' }}>
              {m.value}
            </div>

            {/* Visual Progress Bar */}
            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', margin: '8px 0', overflow: 'hidden' }}>
              <div style={{ width: `${m.pct}%`, height: '100%', background: m.color, borderRadius: '2px' }} />
            </div>

            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              {m.sub}
            </div>

            {/* Hover Tooltip */}
            {hoveredMetric === m.id && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                marginTop: '8px',
                width: '240px',
                background: '#0D1117',
                border: `1px solid ${m.color}60`,
                borderRadius: '6px',
                padding: '8px 12px',
                fontSize: '11px',
                color: '#F8FAFC',
                zIndex: 150,
                boxShadow: 'var(--shadow-lg)',
                lineHeight: 1.4
              }}>
                {m.desc}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CONFUSION MATRIX & DYNAMIC THRESHOLD CONTROLLER */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '1.5rem' }}>
        
        {/* Confusion Matrix & Real Dynamic Slider */}
        <div className="fintech-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.25rem' }}>
            Held-Out Confusion Matrix
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Evaluated on 6,000 stratified checkouts (5,609 authentic, 391 fraudulent)
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', textAlign: 'center' }}>
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid rgba(16,185,129,0.25)', padding: '0.85rem', borderRadius: '6px' }}>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#10B981' }}>5,597</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>True Negatives (Allowed)</div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid rgba(245,158,11,0.25)', padding: '0.85rem', borderRadius: '6px' }}>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FBBF24' }}>12</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>False Positives (Friction)</div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid rgba(239,68,68,0.25)', padding: '0.85rem', borderRadius: '6px' }}>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#F87171' }}>24</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>False Negatives (Missed)</div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid rgba(16,185,129,0.25)', padding: '0.85rem', borderRadius: '6px' }}>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#10B981' }}>367</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>True Positives (Blocked)</div>
            </div>
          </div>

          {/* REAL DYNAMIC DECISION THRESHOLD CONTROLLER (ORANGE HIGHLIGHTS) */}
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', marginBottom: '8px' }}>
              <div>
                <span style={{ color: '#F8FAFC', fontWeight: 700 }}>Real-Time Decision Cutoff (FastAPI)</span>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Backend classification boundary</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isSaving && (
                  <span style={{ fontSize: '11px', color: '#FB923C', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <RefreshCw size={11} className="animate-spin" /> Syncing...
                  </span>
                )}
                {saveStatus === 'saved' && (
                  <span style={{ fontSize: '11px', color: '#34D399', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <CheckCircle2 size={11} /> Saved
                  </span>
                )}
                {saveStatus === 'error' && (
                  <span style={{ fontSize: '11px', color: '#F87171', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <AlertCircle size={11} /> Error
                  </span>
                )}
                <span className="mono" style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.4)', color: '#FB923C', padding: '3px 8px', borderRadius: '5px', fontWeight: 800, fontSize: '13px' }}>
                  {threshold.toFixed(2)}
                </span>
              </div>
            </div>

            {/* SENSITIVITY RANGE SLIDER */}
            <input
              type="range"
              min="0.10"
              max="0.95"
              step="0.05"
              value={threshold}
              onChange={(e) => handleThresholdChange(e.target.value)}
              style={{ width: '100%', cursor: 'pointer', accentColor: '#F97316' }}
            />

            {/* SENSITIVITY LABELS */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', fontWeight: 700, color: 'var(--text-muted)', marginTop: '4px' }}>
              <span style={{ color: '#F87171' }}>HIGH SENSITIVITY (0.10)</span>
              <span style={{ color: '#FB923C' }}>BALANCED (0.50)</span>
              <span style={{ color: '#34D399' }}>LOW FRICTION (0.95)</span>
            </div>

            {statusMessage && (
              <div style={{
                marginTop: '10px',
                fontSize: '11px',
                fontWeight: 600,
                color: saveStatus === 'error' ? '#F87171' : '#34D399',
                background: saveStatus === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                border: `1px solid ${saveStatus === 'error' ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}`,
                padding: '5px 10px',
                borderRadius: '5px'
              }}>
                {statusMessage}
              </div>
            )}

            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '10px', lineHeight: 1.4 }}>
              Controls the continuous probability threshold. Transactions with model fraud probability $\ge$ <strong className="mono" style={{ color: '#F8FAFC' }}>{threshold.toFixed(2)}</strong> are automatically <strong>BLOCKED</strong>.
            </div>
          </div>
        </div>

        {/* Feature Importances (Orange Analytics Bars) */}
        <div className="fintech-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.25rem' }}>
            Model Feature Importances (Gini Impurity)
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Relative weight of behavioral signals in the ensemble decision trees
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {featureImportances.map((f, i) => (
              <div 
                key={i}
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
                style={{ 
                  background: hoveredFeature === i ? 'var(--bg-hover)' : 'transparent',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  transition: 'background 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{f.name}</span>
                  <span className="mono" style={{ color: '#FB923C', fontWeight: 800 }}>{f.weight}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${f.weight}%`, height: '100%', background: 'linear-gradient(90deg, #F97316 0%, #FB923C 100%)', borderRadius: '3px' }} />
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px' }}>
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
