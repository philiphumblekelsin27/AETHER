
import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { GestureEditor } from './pages/GestureEditor';
import { TrainingCenter } from './pages/TrainingCenter';
import { SecurityVault } from './pages/SecurityVault';
import { PythonArchitecture } from './pages/PythonArchitecture';
import { AccessibilityCenter } from './pages/AccessibilityCenter';
import { AnalyticsDashboard } from './pages/AnalyticsDashboard';
import { SystemState } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [systemState, setSystemState] = useState<SystemState>(SystemState.ACTIVE);
  const [lastIntent, setLastIntent] = useState<string>('Initializing Engine...');
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connectWS = () => {
      try {
        const socket = new WebSocket('ws://localhost:8000/ws');
        
        socket.onopen = () => {
          setConnected(true);
          setLastIntent('AETHER Brain Uplink: Active');
          // Expose socket for config messages
          (window as any).aetherSocket = socket;
        };
        
        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.resolvedIntent) {
            setLastIntent(data.resolvedIntent);
          }
        };
        
        socket.onclose = () => {
          setConnected(false);
          setLastIntent('AETHER Brain Uplink: Offline');
          (window as any).aetherSocket = null;
          setTimeout(connectWS, 5000);
        };

        socketRef.current = socket;
      } catch (err) {
        setLastIntent('Uplink Error');
      }
    };

    connectWS();
    return () => socketRef.current?.close();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard lastIntent={lastIntent} connected={connected} />;
      case 'editor': return <GestureEditor />;
      case 'training': return <TrainingCenter />;
      case 'security': return <SecurityVault />;
      case 'python': return <PythonArchitecture />;
      case 'accessibility': return <AccessibilityCenter />;
      case 'analytics': return <AnalyticsDashboard />;
      default: return <Dashboard lastIntent={lastIntent} connected={connected} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} connected={connected} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header systemState={systemState} setSystemState={setSystemState} lastIntent={lastIntent} connected={connected} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
