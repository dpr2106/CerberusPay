import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MonitorView from './components/MonitorView';
import InvestigationView from './components/InvestigationView';
import NetworksView from './components/NetworksView';
import ModelsView from './components/ModelsView';
import ChargebacksView from './components/ChargebacksView';
import SystemStatusView from './components/SystemStatusView';

export default function App() {
  const [activeTab, setActiveTab] = useState('monitor'); // 'monitor' | 'investigate' | 'networks' | 'models' | 'chargebacks' | 'system'
  const [mode, setMode] = useState('SIMULATION'); // 'SIMULATION' or 'SANDBOX'
  const [isStreamLive, setIsStreamLive] = useState(true);

  const [transactions, setTransactions] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Initial Fetch of Transactions & Metrics from FastAPI
  useEffect(() => {
    fetch('http://localhost:8000/api/risk/transactions?limit=60')
      .then(res => res.json())
      .then(data => {
        if (data.transactions && data.transactions.length > 0) {
          setTransactions(data.transactions);
          // Preselect first blocked transaction for instant investigation readiness
          const firstBlocked = data.transactions.find(t => t.action === 'BLOCK');
          if (firstBlocked) setSelectedTransaction(firstBlocked);
        }
      })
      .catch(() => {});

    fetch('http://localhost:8000/api/risk/metrics')
      .then(res => res.json())
      .then(data => setMetrics(data))
      .catch(() => {});
  }, []);

  // Background Stream Ingestion
  useEffect(() => {
    if (!isStreamLive) return;

    const interval = setInterval(() => {
      const isFraud = Math.random() < 0.22;
      const amount = isFraud ? Math.floor(Math.random() * 45000 + 6000) : Math.floor(Math.random() * 2800 + 200);
      const geo = isFraud ? Math.floor(Math.random() * 7500 + 1500) : Math.floor(Math.random() * 30 + 2);
      const vel = isFraud ? Math.floor(Math.random() * 12 + 5) : Math.floor(Math.random() * 2 + 1);
      const proxy = isFraud ? (Math.random() < 0.8 ? 1 : 0) : 0;

      const payload = {
        user_id: `USR_${Math.floor(Math.random() * 8999 + 1000)}`,
        amount: amount,
        category: isFraud ? 'electronics' : 'ecommerce',
        velocity_1h: vel,
        geo_distance_km: geo,
        device_trust_score: isFraud ? 0.25 : 0.95,
        is_proxy_vpn: proxy,
        card_fails_24h: isFraud ? 3 : 0,
        user_account_age_days: isFraud ? 3 : 320,
        is_new_shipping_address: isFraud ? 1 : 0,
        source: mode
      };

      fetch('http://localhost:8000/api/risk/evaluate-transaction', {
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
      .catch(() => {});
    }, 3500);

    return () => clearInterval(interval);
  }, [isStreamLive, mode]);

  const handleSelectTransaction = (tx) => {
    setSelectedTransaction(tx);
    setActiveTab('investigate');
  };

  const handleUpdateAction = (txId, newAction) => {
    setTransactions(prev => prev.map(t => {
      if (t.id === txId) {
        return { ...t, action: newAction };
      }
      return t;
    }));
    if (selectedTransaction?.id === txId) {
      setSelectedTransaction(prev => ({ ...prev, action: newAction }));
    }
  };

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
      />

      {/* MAIN FRAUD OPERATIONS CANVAS */}
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
            onNavigateToNetworks={() => setActiveTab('networks')}
          />
        )}

        {activeTab === 'networks' && (
          <NetworksView />
        )}

        {activeTab === 'models' && (
          <ModelsView metrics={metrics} />
        )}

        {activeTab === 'chargebacks' && (
          <ChargebacksView />
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
        CERBERUSPAY • Payment Risk Intelligence Platform • Razorpay AI Buildathon Track 02
      </footer>

    </div>
  );
}