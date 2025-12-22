
import React, { useState, useEffect } from 'react';
import { CameraFeed } from '../components/CameraFeed';
import { useIntentEngine } from '../hooks/useIntentEngine';
import { UnifiedPerceptionData } from '../types';

export const Dashboard: React.FC<{ lastIntent: string, connected: boolean }> = ({ lastIntent, connected }) => {
  const { activeIntent, processPerception, lastPerception, sessionStats, visualPing } = useIntentEngine();
  const [logs, setLogs] = useState<string[]>([]);
  
  const handlePerception = (data: UnifiedPerceptionData) => {
    processPerception(data);
  };

  useEffect(() => {
    if (activeIntent !== 'IDLE') {
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] -> EXECUTE: ${activeIntent}`, ...prev].slice(0, 15));
    }
  }, [activeIntent]);

  return (
    <div className="grid grid-cols-12 gap-6 animate-in fade-in duration-700">
      <div className="col-span-12 lg:col-span-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Neural Visual Node</label>
            <div className={`relative transition-all duration-200 rounded-3xl ${visualPing ? 'ring-4 ring-cyan-500/50 scale-[1.01]' : 'ring-0'}`}>
              <CameraFeed onPerceptionUpdate={handlePerception} />
              {visualPing && (
                <div className="absolute inset-0 bg-cyan-500/10 rounded-3xl pointer-events-none animate-ping"></div>
              )}
            </div>
            <div className="glass p-3 rounded-xl border-slate-800 bg-black/40 mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-mono text-cyan-500 uppercase">Kinematic_Direct_Feed</span>
                <span className={`w-1.5 h-1.5 rounded-full ${lastPerception?.modalities.presence ? 'bg-cyan-500' : 'bg-red-500'} animate-pulse`}></span>
              </div>
              <div className="text-[10px] font-mono text-slate-400 truncate">
                {sessionStats.rawSignal || "AWAITING_LOCAL_SENSORS..."}
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Neural Resolution</label>
            
            <div className={`glass p-8 rounded-3xl border-cyan-500/20 bg-cyan-500/5 relative overflow-hidden flex flex-col justify-center min-h-[160px] shadow-2xl transition-all ${visualPing ? 'bg-cyan-500/20' : ''}`}>
              <div className="absolute top-0 right-0 p-4">
                <div className={`px-2 py-0.5 rounded text-[8px] font-bold border ${connected ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-red-500/10 border-red-500 text-red-500'}`}>
                  {connected ? 'CORE_UPLINK_LIVE' : 'CORE_OFFLINE'}
                </div>
              </div>
              <p className="text-[10px] text-cyan-500 uppercase font-black mb-1 tracking-[0.2em]">Active Intent</p>
              <div className="text-5xl font-black text-white tracking-tighter uppercase italic neon-text transition-all duration-75">
                {activeIntent}
              </div>
              <p className="text-[10px] text-slate-600 mt-4 font-mono uppercase">Confidence_Threshold: {(sessionStats.averageConfidence * 100).toFixed(2)}%</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="glass p-4 rounded-2xl border-slate-800/50 bg-slate-900/30">
                  <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">Neural Delay</p>
                  <div className="text-lg font-mono text-cyan-400 font-bold">
                    {sessionStats.peakLatency.toFixed(2)}<span className="text-[10px] ml-1 opacity-50">ms</span>
                  </div>
               </div>
               <div className="glass p-4 rounded-2xl border-slate-800/50 bg-slate-900/30">
                  <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">Human ID</p>
                  <div className={`text-lg font-mono font-bold ${sessionStats.isHumanVerified ? 'text-green-400' : 'text-slate-600'}`}>
                    {sessionStats.isHumanVerified ? 'VERIFIED' : 'SCANNING'}
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="glass p-8 rounded-3xl relative overflow-hidden bg-slate-950/20">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kinematic Signal Waveform</h3>
          </div>
          <div className="h-24 flex items-end justify-between space-x-0.5">
            {Array.from({ length: 120 }).map((_, i) => (
              <div 
                key={i} 
                className={`w-full transition-all duration-75 ${lastPerception?.modalities.presence ? 'bg-cyan-500' : 'bg-slate-800'}`}
                style={{ 
                  height: `${5 + (lastPerception?.modalities.presence ? Math.random() * 95 : 2)}%`, 
                  opacity: 0.1 + (i / 120),
                  backgroundColor: visualPing ? '#06b6d4' : undefined 
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-4 space-y-6">
        <div className="glass p-8 rounded-3xl bg-slate-950 border-slate-800 h-[600px] flex flex-col shadow-inner">
          <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
            <h3 className="text-xs font-black text-white uppercase tracking-widest">Neural Terminal</h3>
            <span className="text-[9px] font-mono text-cyan-500 animate-pulse">v2.4.0_STABLE</span>
          </div>
          <div className="flex-1 space-y-4 font-mono text-[10px] overflow-y-auto custom-scrollbar pr-2 scroll-smooth">
            {logs.map((log, i) => (
              <div key={i} className={`p-2 rounded border transition-all ${log.includes('EXECUTE') ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-100' : 'text-slate-600 border-slate-900'}`}>
                <span className="text-cyan-500 mr-2">>>></span> {log}
              </div>
            ))}
            {logs.length === 0 && <div className="text-slate-800 uppercase tracking-widest">Waiting_for_kinematic_input...</div>}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800">
            <p className="text-[9px] text-slate-600 uppercase font-black mb-2 tracking-tighter">Hardware Status</p>
            <div className="flex flex-wrap gap-2">
              <span className={`px-2 py-1 rounded border text-[8px] font-black uppercase transition-colors ${lastPerception?.modalities.presence ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-slate-900 text-slate-700 border-slate-800'}`}>
                CAM_01:{lastPerception?.modalities.presence ? 'ACTIVE' : 'IDLE'}
              </span>
              <span className="px-2 py-1 bg-cyan-500/10 text-cyan-500 rounded border border-cyan-500/20 text-[8px] font-black uppercase">NEURAL_ENGINE:ON</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
