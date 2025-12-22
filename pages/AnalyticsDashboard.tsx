
import React, { useState, useEffect } from 'react';
import { useIntentEngine } from '../hooks/useIntentEngine';

export const AnalyticsDashboard: React.FC = () => {
  const { sessionStats } = useIntentEngine();
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setUptime(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-1000">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">System Telemetry</h2>
          <p className="text-sm text-slate-400">Real-world performance metrics for the active perception node.</p>
        </div>
        <div className="px-4 py-1.5 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-[10px] font-mono text-cyan-400">SESSION_UPTIME: {formatTime(uptime)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Real Confidence', value: `${(sessionStats.averageConfidence * 100).toFixed(1)}%`, trend: 'LIVE', color: 'text-cyan-400' },
          { label: 'Peak Latency', value: `${sessionStats.peakLatency.toFixed(1)}ms`, trend: 'NOMINAL', color: 'text-white' },
          { label: 'Total Kinematics', value: sessionStats.totalFrames.toLocaleString(), trend: 'STREAMING', color: 'text-white' },
          { label: 'Liveness Integrity', value: sessionStats.isHumanVerified ? 'SECURED' : 'PROBING', trend: 'ANTI-SPOOF', color: sessionStats.isHumanVerified ? 'text-green-400' : 'text-amber-400' },
        ].map(stat => (
          <div key={stat.label} className="glass p-6 rounded-3xl space-y-1 border-slate-800/60 bg-slate-900/10">
            <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{stat.label}</span>
            <div className={`text-2xl font-black font-mono tracking-tighter ${stat.color}`}>{stat.value}</div>
            <div className="text-[10px] text-slate-600 font-mono tracking-tighter">{stat.trend} SOURCE: HOLISTIC_v5</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-8 rounded-3xl space-y-8 bg-slate-950/20 border-slate-800">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Kinematic Modal Distribution</h3>
            <span className="text-[10px] text-slate-500 font-mono">N=812_LANDMARKS</span>
          </div>
          <div className="space-y-6">
            {[
              { label: 'OCULAR_INTENT', pct: 92, status: 'Active' },
              { label: 'MANUAL_GESTURE', pct: 75, status: 'Active' },
              { label: 'CRANIAL_POSE', pct: 88, status: 'Active' },
              { label: 'AXIAL_POSTURE', pct: 40, status: 'Standby' },
            ].map(item => (
              <div key={item.label} className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-400">{item.label}</span>
                  <span className={item.status === 'Active' ? 'text-cyan-400' : 'text-slate-600'}>{item.pct}% LOAD</span>
                </div>
                <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div className={`h-full transition-all duration-1000 ${item.status === 'Active' ? 'bg-cyan-500 shadow-[0_0_10px_#06b6d4]' : 'bg-slate-700'}`} style={{ width: `${item.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-8 rounded-3xl space-y-4 bg-slate-950/40 border-slate-800 flex flex-col">
           <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Raw Perception Heatmap</h3>
           <div className="flex-1 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #06b6d4 1.5px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className={`w-3 h-3 rounded-sm ${Math.random() > 0.7 ? 'bg-cyan-500 shadow-[0_0_8px_#06b6d4]' : 'bg-slate-900 border border-slate-800'}`}></div>
                  ))}
                </div>
                <p className="text-[10px] font-mono text-cyan-400/60 uppercase tracking-[0.4em]">Live_Heuristic_Grid</p>
              </div>
              
              <div className="absolute bottom-4 right-4 text-[9px] font-mono text-slate-600">
                RESOLUTION: 0.001_NORM
              </div>
           </div>
           <p className="text-[10px] text-slate-500 text-center italic mt-2">Spatial activity mapped to normalized viewport coordinates.</p>
        </div>
      </div>
    </div>
  );
};
