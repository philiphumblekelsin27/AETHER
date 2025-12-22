
import React from 'react';
import { SystemState } from '../types';

interface HeaderProps {
  systemState: SystemState;
  setSystemState: (s: SystemState) => void;
  lastIntent: string;
  // Fix: Added missing connected property to resolve TypeScript error in App.tsx
  connected: boolean;
}

export const Header: React.FC<HeaderProps> = ({ systemState, setSystemState, lastIntent, connected }) => {
  return (
    <header className="h-20 glass border-b border-slate-800 px-8 flex items-center justify-between z-10">
      <div className="flex flex-col">
        <div className="flex items-center space-x-3">
          {/* Added visual status indicator for the connection */}
          <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="text-sm font-mono text-cyan-500">LIVE_INTENT:</span>
          <span className="text-lg font-bold text-white tracking-wide">{lastIntent}</span>
        </div>
        <span className="text-[10px] text-slate-500 uppercase tracking-tighter">Real-time perception stream active</span>
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 bg-slate-900/80 px-4 py-2 rounded-full border border-slate-800">
          <span className="text-xs text-slate-400">System Mode:</span>
          <select 
            value={systemState}
            onChange={(e) => setSystemState(e.target.value as SystemState)}
            className="bg-transparent text-xs font-bold text-cyan-400 outline-none cursor-pointer"
          >
            {Object.values(SystemState).map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        <button className="px-5 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest">
          Emergency Kill
        </button>
      </div>
    </header>
  );
};
