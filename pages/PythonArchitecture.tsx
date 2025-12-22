
import React from 'react';

export const PythonArchitecture: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Python Brain (Architecture)</h2>
          <p className="text-sm text-slate-400">The authoritative processing engine for multi-modal intent.</p>
        </div>
        <div className="flex space-x-2">
           <button className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-lg hover:bg-slate-700 transition-all">Download SDK</button>
           <button className="px-4 py-2 bg-cyan-500/10 text-cyan-400 text-xs font-bold rounded-lg border border-cyan-500/20">Active Node: v2.4.0</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="glass p-6 rounded-3xl space-y-4">
            <h3 className="text-white font-bold flex items-center">
              <span className="mr-2">📂</span> Production Directory Tree
            </h3>
            <div className="mono text-[11px] space-y-1 text-cyan-400/80 p-4 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto">
              <p className="text-slate-500">python_core/</p>
              <p>├── core/ <span className="text-slate-600"># Lifecycle & engine</span></p>
              <p>├── perception/ <span className="text-slate-600"># MediaPipe/Eye trackers</span></p>
              <p>├── intent_engine/ <span className="text-slate-600"># Fusion logic</span></p>
              <p>├── control/ <span className="text-slate-600"># OS Bridges (PyAutoGUI)</span></p>
              <p>├── training/ <span className="text-slate-600"># Data collection</span></p>
              <p>├── security/ <span className="text-slate-600"># Encryption & salts</span></p>
              <p>└── api/ <span className="text-slate-600"># WebSocket servers</span></p>
            </div>
          </div>

          <div className="glass p-6 rounded-3xl space-y-4">
            <h3 className="text-white font-bold">Tech Stack Weapons</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Python 3.11', use: 'Core logic' },
                { name: 'MediaPipe', use: 'Perception' },
                { name: 'PyTorch', use: 'Training' },
                { name: 'FastAPI', use: 'Communication' },
                { name: 'PyAutoGUI', use: 'OS Control' },
                { name: 'OpenCV', use: 'Pre-processing' },
              ].map(tech => (
                <div key={tech.name} className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl">
                  <p className="text-white text-xs font-bold">{tech.name}</p>
                  <p className="text-[10px] text-slate-500">{tech.use}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass p-6 rounded-3xl space-y-4">
            <h3 className="text-white font-bold">Data Payload Schema</h3>
            <div className="mono text-[10px] bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300">
              <pre>{`{
  "timestamp": 1723456789,
  "confidence": 0.93,
  "modalities": {
    "hand": { 
      "hand": "left",
      "fingers": {
        "thumb": [0.1, 0.4, -0.01],
        "index": [0.15, 0.3, 0.0]
      }
    },
    "eye": { "gazeX": 0.42, "focusTime": 1.2 },
    "head": { "pitch": 5, "yaw": -2 }
  },
  "resolvedIntent": "SCROLL_DOWN"
}`}</pre>
            </div>
          </div>

          <div className="glass p-6 rounded-3xl space-y-4">
            <h3 className="text-white font-bold">Hygiene & PTZ CCTV Bridge</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              The Python Brain is optimized to run on low-power edge devices connected to CCTV systems. This enables 
              touchless control of public terminals, medical displays, and industrial robots without requiring users to 
              be within arm's reach of the hardware.
            </p>
            <div className="flex items-center space-x-3 text-xs text-cyan-400 font-bold mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              CCTV_ENCODING_READY
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
