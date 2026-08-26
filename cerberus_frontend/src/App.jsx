import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthGate from './components/AuthGate';
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

  const [activeTab, setActiveTab] = useState('monitor');
  const [mode, setMode] = useState('SIMULATION');
  const [isStreamLive, setIsStreamLive] = useState(true);

  const [transactions, setTransactions] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [focusedNetworkTxn, setFocusedNetworkTxn] = useState(null);

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
      .then(res => res.json())
      .then(data => {
        if (data.transactions && data.transactions.length > 0) {
          setTransactions(data.transactions);
          const firstBlocked = data.transactions.find(t => t.action === 'BLOCK') || data.transactions[0];
          setSelectedTransaction(firstBlocked);
          setFocusedNetworkTxn(firstBlocked);
        }
      })
      .catch((err) => console.error('[CerberusPay] Failed to fetch transactions:', err));

    fetch('http://127.0.0.1:8000/api/risk/metrics')
      .then(res => res.json())
      .then(data => setMetrics(data))
      .catch((err) => console.error('[CerberusPay] Failed to fetch metrics:', err));
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
        device_trust_score: isFraud ? 0.25 : 0.95,
        is_proxy_vpn: proxy,
        card_fails_24h: isFraud ? 3 : 0,
        user_account_age_days: isFraud ? 4 : 280,
        is_new_shipping_address: isFraud ? 1 : 0,
        source: mode
      };

      fetch('http://127.0.0.1:8000/api/risk/evaluate-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(res => res.json())
      .then(data => {
        if (data.evaluation) {
          setTransactions(prev => [data.evaluation, ...prev.slice(0, 59)]);
        }
      })
      .catch((err) => console.error('[CerberusPay Stream Error]:', err));
    }, 3800);

    return () => clearInterval(interval);
  }, [isStreamLive, mode, currentOperator]);

  // Select transaction from Monitor
  const handleSelectTransaction = (tx) => {
    setSelectedTransaction(tx);
    setFocusedNetworkTxn(tx);
    setActiveTab('investigate');
  };

  // Real FastAPI Action Update Function
  const handleUpdateAction = async (txId, newAction) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/risk/transactions/${txId}/action`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: newAction
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server returned ${response.status}`);
      }

      const result = await response.json();
      const updatedTxn = result.transaction;

      setTransactions(prev => prev.map(t => (t.id === txId ? updatedTxn : t)));
      
      if (selectedTransaction?.id === txId) {
        setSelectedTransaction(updatedTxn);
      }
      if (focusedNetworkTxn?.id === txId) {
        setFocusedNetworkTxn(updatedTxn);
      }

      return updatedTxn;
    } catch (error) {
      console.error(`[CerberusPay Action Error] Failed to update ${txId} to ${newAction}:`, error);
      throw error;
    }
  };

  // Jump from Investigation to Networks
  const handleNavigateToNetworks = (txn) => {
    setFocusedNetworkTxn(txn || selectedTransaction);
    setActiveTab('networks');
  };

  // Jump from Chargebacks to Investigation
  const handleInvestigateDispute = (txId) => {
    const target = transactions.find(t => t.id === txId);
    if (target) {
      setSelectedTransaction(target);
      setFocusedNetworkTxn(target);
    }
    setActiveTab('investigate');
  };

  // 1. MANDATORY OPERATOR AUTHENTICATION GATE
  if (!currentOperator) {
    return <AuthGate onAuthSuccess={handleAuthSuccess} />;
  }

  // 2. AUTHENTICATED FRAUD OPERATIONS PLATFORM
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      
      {/* NAVBAR */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mode={mode}
        setMode={setMode}
        isStreamLive={isStreamLive}
        setIsStreamLive={setIsStreamLive}
        selectedTransaction={selectedTransaction}
        currentOperator={currentOperator}
        onLogout={handleLogout}
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
            onInvestigateDispute={handleInvestigateDispute}
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
        CERBERUSPAY • Internal Payment Risk Operations Platform • Authorized Personnel Only
      </footer>

    </div>
  );
}
