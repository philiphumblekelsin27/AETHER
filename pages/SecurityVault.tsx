
import React, { useState, useEffect } from 'react';

export const SecurityVault: React.FC = () => {
  const [livenessThreshold, setLivenessThreshold] = useState(10);
  
  const updateBackendConfig = (val: number) => {
    // Attempt to find existing socket from global scope or a broadcast channel
    // In a real app, we'd use a context or a singleton for the WebSocket
    const socket = (window as any).aetherSocket;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: "SET_CONFIG",
        config: { liveness_threshold: val }
      }));
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setLivenessThreshold(val);
    updateBackendConfig(val);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Security Vault</h2>
          <p className="text-sm text-slate-400">Hardened identity protection and anti-spoofing protocols.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-3xl space-y-2">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Active Encryption</p>
          <div className="text-2xl font-bold text-white">AES-256 + RSA</div>
          <p className="text-[10px] text-green-500 font-mono">SALTED_HASH_SYNC_OK</p>
        </div>
        <div className="glass p-6 rounded-3xl space-y-2">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Liveness Sensitivity</p>
          <div className="text-2xl font-bold text-white font-mono">{livenessThreshold}%</div>
          <p className="text-[10px] text-cyan-500 font-mono">THRESHOLD_DYNAMIC</p>
        </div>
        <div className="glass p-6 rounded-3xl space-y-2">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Intent Audit Log</p>
          <div className="text-2xl font-bold text-white">Verified</div>
          <p className="text-[10px] text-slate-500 font-mono">HARDWARE_INTEGRITY_SAFE</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-8 rounded-3xl space-y-6 bg-slate-950/20">
          <h3 className="text-lg font-bold text-white">Anti-Spoofing Configuration</h3>
          
          <div className="space-y-4">
            <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
              <div className="flex justify-between items-center mb-4">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-widest">Micro-Movement Threshold</label>
                <span className="text-[10px] font-mono text-cyan-500">Value: {livenessThreshold}</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="100" 
                value={livenessThreshold}
                onChange={handleSliderChange}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between mt-2 text-[9px] text-slate-600 font-mono">
                <span>LOW_STABILITY</span>
                <span>HIGH_SENSITIVITY</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-4 leading-relaxed">
                Controls the amount of physiological jitter required to validate a human presence. Higher values make it harder for static photos or video loops to bypass security.
              </p>
            </div>
          </div>
        </div>

        <div className="glass p-8 rounded-3xl space-y-6">
          <h3 className="text-lg font-bold text-white">Security Policies</h3>
          <div className="space-y-4">
            {[
              { title: 'Replay Attack Prevention', desc: 'Prevents recorded video from triggering intents.', enabled: true },
              { title: 'Multi-Factor Intent', desc: 'Requires eye gaze + hand gesture for critical actions.', enabled: true },
              { title: 'Emergency Kill Gesture', desc: 'Instant shutdown when "X" gesture detected.', enabled: true },
              { title: 'Biometric Heartbeat', desc: 'Ensures the same person remains in frame.', enabled: true },
            ].map((policy, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">{policy.title}</p>
                  <p className="text-xs text-slate-500">{policy.desc}</p>
                </div>
                <div className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${policy.enabled ? 'bg-cyan-500' : 'bg-slate-700'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${policy.enabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
