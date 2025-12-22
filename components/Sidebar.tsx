
import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  connected: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, connected }) => {
  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'editor', icon: '🎯', label: 'Intent Editor' },
    { id: 'training', icon: '🎓', label: 'Training Center' },
    { id: 'accessibility', icon: '♿', label: 'Accessibility' },
    { id: 'analytics', icon: '📈', label: 'Analytics' },
    { id: 'security', icon: '🛡️', label: 'Security Vault' },
    { id: 'python', icon: '🐍', label: 'Python Brain' },
  ];

  return (
    <aside className="w-64 glass border-r border-slate-800 flex flex-col shrink-0">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20">A</div>
          <h1 className="text-xl font-bold tracking-tight text-white neon-text">AETHER</h1>
        </div>
        <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-semibold">Touchless HMI Engine</p>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === item.id 
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-500/5' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 mt-auto space-y-3">
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
          <p className="text-[9px] uppercase font-black text-slate-500 mb-2 tracking-tighter">Vision Processor</p>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] font-mono text-slate-300">WASM_EDGE:ACTIVE</span>
          </div>
        </div>
        
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
          <p className="text-[9px] uppercase font-black text-slate-500 mb-2 tracking-tighter">Python Brain Uplink</p>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="text-[10px] font-mono text-slate-300">{connected ? 'LOCAL_NODE:8000' : 'OFFLINE'}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
