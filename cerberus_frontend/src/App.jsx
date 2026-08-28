import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthGate from './components/AuthGate';
import HeroLanding from './components/HeroLanding';
import MonitorView from './components/MonitorView';
import InvestigationView from './components/InvestigationView';
import NetworksView from './components/NetworksView';
import ModelsView from './components/ModelsView';
import ChargebacksView from './components/ChargebacksView';
import SystemStatusView from './components/SystemStatusView';

export default function App() {
  // Operator Authentication Session State
  const [currentOperator, setCurrentOperator] = useState(() => {
    try {
      const saved = localStorage.getItem('cerberus_operator_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [operatorToken, setOperatorToken] = useState(() => {
    return localStorage.getItem('cerberus_operator_token') || null;
  });

  // Toggle between Hero Landing & SOC Console
  const [showLanding, setShowLanding] = useState(() => {
    return !localStorage.getItem('cerberus_operator_session');
  });

  const [activeTab, setActiveTab] = useState('monitor');
  const [mode, setMode] = useState('SIMULATION');
  const [isStreamLive, setIsStreamLive] = useState(true);

  const [transactions, setTransactions] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [focusedNetworkTxn, setFocusedNetworkTxn] = useState(null);
  const [focusedChargebackTxId, setFocusedChargebackTxId] = useState(null);

  // Authentication Handlers
  const handleAuthSuccess = (operatorObj, tokenStr) => {
    setCurrentOperator(operatorObj);
    setOperatorToken(tokenStr);
    localStorage.setItem('cerberus_operator_session', JSON.stringify(operatorObj));
    localStorage.setItem('cerberus_operator_token', tokenStr);
    setShowLanding(false);
    setActiveTab('monitor');
  };

  const handleLogout = () => {
    setCurrentOperator(null);
    setOperatorToken(null);
    localStorage.removeItem('cerberus_operator_session');
    localStorage.removeItem('cerberus_operator_token');
    setShowLanding(true);
    setActiveTab('monitor');
  };

  // Initial Fetch of Shared Unified Transactions & Metrics from FastAPI
  useEffect(() => {
    if (!currentOperator) return;

    fetch('http://127.0.0.1:8000/api/risk/transactions?limit=60')
      .then(res => {
        if (!res.ok) throw new Error(`Transactions API status ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data.transactions && data.transactions.length > 0) {
          setTransactions(data.transactions);
          const firstBlocked = data.transactions.find(t => t.action === 'BLOCK') || data.transactions[0];
          setSelectedTransaction(firstBlocked);
          setFocusedNetworkTxn(firstBlocked);
        }
      })
      .catch((err) => console.error('[CerberusPay API Error] Failed to fetch transactions:', err));

    fetch('http://127.0.0.1:8000/api/risk/metrics')
      .then(res => {
        if (!res.ok) throw new Error(`Metrics API status ${res.status}`);
        return res.json();
      })
      .then(data => setMetrics(data))
      .catch((err) => console.error('[CerberusPay API Error] Failed to fetch metrics:', err));
  }, [currentOperator]);

  // Background Stream Ingestion (Simulates payment gateway traffic)
  useEffect(() => {
    if (!isStreamLive || !currentOperator) return;

    const customers = ["USR_8921", "USR_1049", "USR_3410", "USR_5192", "USR_7820", "USR_9941"];

    const interval = setInterval(() => {
      const isFraud = Math.random() < 0.25;
      const amount = isFraud ? Math.floor(Math.random() * 38000 + 12000) : Math.floor(Math.random() * 2600 + 350);
      const geo = isFraud ? Math.floor(Math.random() * 7200 + 1800) : Math.floor(Math.random() * 25 + 2);
      const vel = isFraud ? Math.floor(Math.random() * 11 + 5) : Math.floor(Math.random() * 2 + 1);
      const proxy = isFraud ? (Math.random() < 0.85 ? 1 : 0) : 0;
      const randomUser = customers[Math.floor(Math.random() * customers.length)];

      const payload = {
        user_id: randomUser,
        amount: amount,
        category: isFraud ? 'electronics' : 'ecommerce',
        velocity_1h: vel,
        geo_distance_km: geo,
        is_proxy: proxy,
        payment_method: 'card',
        merchant_category: 'electronics_high_value'
      };

      fetch('http://127.0.0.1:8000/api/risk/evaluate-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(res => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then(newEvaluation => {
        const enrichedTx = {
          id: newEvaluation.transaction_id || `TXN_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
          user_id: randomUser,
          amount: amount,
          timestamp: new Date().toISOString(),
          risk_score: Math.round(newEvaluation.fraud_probability * 100),
          risk_level: newEvaluation.fraud_probability >= 0.70 ? 'CRITICAL' : (newEvaluation.fraud_probability >= 0.40 ? 'MEDIUM' : 'LOW'),
          action: newEvaluation.action,
          signals: {
            geo_distance_km: geo,
            velocity_1h: vel,
            is_proxy: proxy === 1,
            anomaly_score: Number((newEvaluation.fraud_probability * 0.95).toFixed(2)),
            device_id: isFraud ? 'DEV_FINGERPRINT_A9' : `DEV_${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
            ip_address: isFraud ? '185.220.101.4 (Proxy)' : '103.21.144.12'
          },
          decision_rationale: newEvaluation.decision_rationale,
          source: 'SIMULATED'
        };

        setTransactions(prev => [enrichedTx, ...prev.slice(0, 79)]);
      })
      .catch((err) => {
        // Silent catch for background simulator to keep UX clean
      });

    }, 3800);

    return () => clearInterval(interval);
  }, [isStreamLive, currentOperator]);

  // Navigate to Investigation Dossier
  const handleSelectTransaction = (tx) => {
    setSelectedTransaction(tx);
    setActiveTab('investigate');
  };

  // Override / Update Transaction Action
  const handleUpdateAction = (txId, newAction, rationale) => {
    setTransactions(prev => prev.map(t => {
      if (t.id === txId) {
        return {
          ...t,
          action: newAction,
          decision_rationale: rationale ? `[OPERATOR MANUAL OVERRIDE] ${rationale}` : t.decision_rationale
        };
      }
      return t;
    }));

    if (selectedTransaction && selectedTransaction.id === txId) {
      setSelectedTransaction(prev => ({
        ...prev,
        action: newAction,
        decision_rationale: rationale ? `[OPERATOR MANUAL OVERRIDE] ${rationale}` : prev.decision_rationale
      }));
    }
  };

  // Cross-Navigation to Networks Graph
  const handleNavigateToNetworks = (tx) => {
    setFocusedNetworkTxn(tx);
    setActiveTab('networks');
  };

  // Cross-Navigation to Chargebacks View
  const handleNavigateToChargebacks = (tx) => {
    setFocusedChargebackTxId(tx.id);
    setActiveTab('chargebacks');
  };

  // Cross-Navigation from Chargebacks to Investigation Dossier
  const handleInvestigateDispute = (txId) => {
    const foundTx = transactions.find(t => t.id === txId);
    if (foundTx) {
      setSelectedTransaction(foundTx);
    } else {
      setSelectedTransaction({
        id: txId,
        user_id: 'USR_8921',
        amount: 34999,
        timestamp: new Date().toISOString(),
        risk_score: 92,
        risk_level: 'CRITICAL',
        action: 'BLOCK',
        signals: {
          geo_distance_km: 4850,
          velocity_1h: 9,
          is_proxy: true,
          anomaly_score: 0.94,
          device_id: 'DEV_FINGERPRINT_A9',
          ip_address: '185.220.101.4 (Proxy)'
        },
        decision_rationale: 'High velocity transaction anomaly with proxy egress detection across shared hardware fingerprint.'
      });
    }
    setActiveTab('investigate');
  };

  // 1. RENDER HERO LANDING PAGE
  if (showLanding) {
    return (
      <HeroLanding
        onLaunchConsole={() => setShowLanding(false)}
        onSelectFeature={(feature) => {
          setShowLanding(false);
          const mapped = {
            'labs': 'monitor',
            'studio': 'investigate',
            'openings': 'models',
            'shop': 'chargebacks',
            'models': 'models',
            'monitor': 'monitor',
            'networks': 'networks',
            'chargebacks': 'chargebacks'
          };
          setActiveTab(mapped[feature] || 'monitor');
        }}
      />
    );
  }

  // 2. RENDER 2FA OPERATOR AUTHENTICATION GATE IF NOT LOGGED IN
  if (!currentOperator) {
    return (
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowLanding(true)}
          style={{
            position: 'absolute',
            top: '1.25rem',
            left: '1.5rem',
            zIndex: 100,
            background: 'rgba(13, 18, 29, 0.8)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            padding: '6px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>&larr;</span>
          <span>Back to Overview</span>
        </button>
        <AuthGate onAuthSuccess={handleAuthSuccess} />
      </div>
    );
  }

  // 3. RENDER SOC CONSOLE
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      
      {/* NAVBAR */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'chargebacks') {
            setFocusedChargebackTxId(null);
          }
          setActiveTab(tab);
        }}
        mode={mode}
        setMode={setMode}
        isStreamLive={isStreamLive}
        setIsStreamLive={setIsStreamLive}
        selectedTransaction={selectedTransaction}
        currentOperator={currentOperator}
        onLogout={handleLogout}
        onShowLanding={() => setShowLanding(true)}
      />

      {/* MAIN OPERATIONS CANVAS */}
      <main style={{ flex: 1, maxWidth: '1440px', width: '100%', margin: '0 auto', padding: '1.5rem' }}>
        
        {activeTab === 'monitor' && (
          <MonitorView
            transactions={transactions}
            mode={mode}
            onSelectTransaction={handleSelectTransaction}
          />
        )}

        {activeTab === 'investigate' && (
          <InvestigationView
            transaction={selectedTransaction}
            onUpdateAction={handleUpdateAction}
            onNavigateToNetworks={handleNavigateToNetworks}
            onNavigateToChargebacks={handleNavigateToChargebacks}
          />
        )}

        {activeTab === 'networks' && (
          <NetworksView
            focusedTransaction={focusedNetworkTxn}
            onBackToInvestigation={() => setActiveTab('investigate')}
          />
        )}

        {activeTab === 'models' && (
          <ModelsView metrics={metrics} />
        )}

        {activeTab === 'chargebacks' && (
          <ChargebacksView
            targetTransactionId={focusedChargebackTxId}
            onInvestigateDispute={handleInvestigateDispute}
            onClearTransactionFilter={() => setFocusedChargebackTxId(null)}
          />
        )}

        {activeTab === 'system' && (
          <SystemStatusView mode={mode} />
        )}

      </main>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '0.85rem 1.5rem',
        textAlign: 'center',
        fontSize: '11px',
        color: 'var(--text-muted)',
        background: 'var(--bg-secondary)'
      }}>
        CERBERUSPAY • Internal Payment Risk Operations Platform • Synchronized Chargeback Operations
      </footer>

    </div>
  );
}
