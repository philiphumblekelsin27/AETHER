
import React from 'react';

export const AccessibilityCenter: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Accessibility Center</h2>
          <p className="text-sm text-slate-400">Enable non-manual interaction modes for diverse user needs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass p-8 rounded-3xl space-y-6 border border-cyan-500/10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-2xl flex items-center justify-center text-2xl">👀</div>
            <div>
              <h3 className="text-lg font-bold text-white">Eye-Only Gaze Engine</h3>
              <p className="text-xs text-slate-400 font-mono">MODALITY: OCULAR_INTENT</p>
            </div>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Allows full system control using only eye movements and blinks. Optimized for ALS, paralysis, and surgical environments.
          </p>
          <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
            <span className="text-xs font-bold text-slate-300">Enable Gaze Navigation</span>
            <div className="w-12 h-6 bg-slate-700 rounded-full p-1 cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="glass p-8 rounded-3xl space-y-6 border border-amber-500/10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center text-2xl">👤</div>
            <div>
              <h3 className="text-lg font-bold text-white">Head-Pose Navigation</h3>
              <p className="text-xs text-slate-400 font-mono">MODALITY: CRANIAL_POSE</p>
            </div>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Uses head pitch, yaw, and roll to drive cursor movement and system triggers. Supports nodding for "Enter" and shaking for "Back".
          </p>
          <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
            <span className="text-xs font-bold text-slate-300">Enable Head Control</span>
            <div className="w-12 h-6 bg-slate-700 rounded-full p-1 cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="glass p-8 rounded-3xl space-y-4">
        <h3 className="text-lg font-bold text-white">Fatigue & Safety Limits</h3>
        <p className="text-xs text-slate-500">Automatically adjust interaction thresholds to prevent user exhaustion.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
             <span className="text-[10px] text-slate-500 uppercase font-bold mb-2 block">Dwell Time (ms)</span>
             <input type="range" className="w-full accent-cyan-500" />
          </div>
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
             <span className="text-[10px] text-slate-500 uppercase font-bold mb-2 block">Cranial Sensitivity</span>
             <input type="range" className="w-full accent-amber-500" />
          </div>
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
             <span className="text-[10px] text-slate-500 uppercase font-bold mb-2 block">Blink Validation (s)</span>
             <input type="range" className="w-full accent-green-500" />
          </div>
        </div>
      </div>
    </div>
  );
};
