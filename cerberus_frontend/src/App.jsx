import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthGate from './components/AuthGate';
import MonitorView from './components/MonitorView';
import InvestigationView from './components/InvestigationView';
import NetworksView from './components/NetworksView';
import ModelsView from './components/ModelsView';
import ChargebacksView from './components/ChargebacksView';
import SystemStatusView from './components/SystemStatusView';
import PaymentIngestModal from './components/PaymentIngestModal';

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

  const [activeTab, setActiveTab] = useState('monitor');
  const [mode, setMode] = useState('SIMULATION');
  const [isStreamLive, setIsStreamLive] = useState(true);
  const [isIngestModalOpen, setIsIngestModalOpen] = useState(false);

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
    setActiveTab('monitor');
  };

  const handleLogout = () => {
    setCurrentOperator(null);
    setOperatorToken(null);
    localStorage.removeItem('cerberus_operator_session');
    localStorage.removeItem('cerberus_operator_token');
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

  // Background ULB Real Bank Benchmark Stream Ingestion
  useEffect(() => {
    if (!isStreamLive || !currentOperator) return;

    const interval = setInterval(() => {
      fetch('http://127.0.0.1:8000/api/stream/next-event')
        .then(res => {
          if (!res.ok) throw new Error(`Stream API status ${res.status}`);
          return res.json();
        })
        .then(data => {
          if (data && data.event) {
            setTransactions(prev => [data.event, ...prev.slice(0, 79)]);
          }
        })
        .catch(() => {
          // Fallback resilience
        });
    }, 3800);

    return () => clearInterval(interval);
  }, [isStreamLive, currentOperator]);

  // Handle Ingested Payment from Modal
  const handlePaymentIngested = (newTxn) => {
    setTransactions(prev => [newTxn, ...prev.slice(0, 79)]);
    setSelectedTransaction(newTxn);
    setFocusedNetworkTxn(newTxn);
  };

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

  // 1. RENDER 2FA OPERATOR AUTHENTICATION GATE IF NOT LOGGED IN
  if (!currentOperator) {
    return (
      <AuthGate onAuthSuccess={handleAuthSuccess} />
    );
  }

  // 2. RENDER MAIN SOC OPERATIONS CONSOLE
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
        onOpenIngestModal={() => setIsIngestModalOpen(true)}
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

      {/* RAZORPAY GATEWAY INGESTION MODAL */}
      <PaymentIngestModal
        isOpen={isIngestModalOpen}
        onClose={() => setIsIngestModalOpen(false)}
        onPaymentIngested={handlePaymentIngested}
      />

    </div>
  );
}
