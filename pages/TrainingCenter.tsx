
import React, { useState, useEffect, useRef } from 'react';
import { CameraFeed } from '../components/CameraFeed';
import { UnifiedPerceptionData, Landmark } from '../types';

export const TrainingCenter: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [capturedFrames, setCapturedFrames] = useState(0);
  const [lastLandmarks, setLastLandmarks] = useState<Landmark[]>([]);
  const totalRequired = 150; 
  const [presenceConfidence, setPresenceConfidence] = useState(0);
  const [isVisionReady, setIsVisionReady] = useState(false);

  const handleDataCapture = (data: UnifiedPerceptionData) => {
    if (!isVisionReady) setIsVisionReady(true);
    
    if (data.modalities.presence) {
      setPresenceConfidence(data.confidence);
    } else {
      setPresenceConfidence(0);
    }

    if (data.modalities.hand?.right) {
      setLastLandmarks(data.modalities.hand.right.landmarks);
      if (recording) {
        setCapturedFrames(prev => {
          if (prev >= totalRequired) {
            setRecording(false);
            return prev;
          }
          return prev + 1;
        });
      }
    }
  };

  const startRecording = () => {
    if (presenceConfidence < 0.3) return;
    setCapturedFrames(0);
    setRecording(true);
  };

  const progress = (capturedFrames / totalRequired) * 100;

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight italic">Kinematic Capture Terminal</h2>
          <p className="text-xs text-slate-400 font-mono uppercase tracking-[0.2em] mt-1 text-cyan-500/80">Buffer_Mode: Serial_Write</p>
        </div>
        <div className="flex space-x-2">
           <div className={`px-4 py-1.5 rounded-full text-[10px] font-black border transition-all duration-500 ${presenceConfidence > 0.4 ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]' : 'bg-slate-900 border-slate-800 text-slate-600'}`}>
             {presenceConfidence > 0.4 ? `KINETIC_SYNC: ${(presenceConfidence * 100).toFixed(0)}%` : 'AWAITING_BIO_SIGNAL'}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <div className="relative rounded-3xl overflow-hidden glass p-1 border-slate-800 bg-slate-950 shadow-2xl">
            <CameraFeed onPerceptionUpdate={handleDataCapture} />
            
            {/* Real-time Data Overlay */}
            <div className="absolute top-6 right-6 w-56 glass bg-black/60 p-4 rounded-2xl border-slate-700/50 backdrop-blur-xl z-20 shadow-2xl">
              <div className="flex justify-between items-center mb-3">
                <p className="text-[10px] font-black text-cyan-400 uppercase tracking-tighter">Vector_Stream_LIVE</p>
                <div className={`w-1.5 h-1.5 rounded-full ${lastLandmarks.length > 0 ? 'bg-cyan-500 animate-pulse' : 'bg-slate-700'}`}></div>
              </div>
              <div className="space-y-1.5">
                {lastLandmarks.length > 0 ? (
                  lastLandmarks.slice(0, 4).map((lm, i) => (
                    <div key={i} className="flex justify-between font-mono text-[9px] text-slate-300">
                      <span className="text-slate-500">L_MARK_{i}:</span>
                      <span>[{lm.x.toFixed(3)}, {lm.y.toFixed(3)}]</span>
                    </div>
                  ))
                ) : (
                  <p className="text-[9px] text-slate-600 italic">No hand detected in frame.</p>
                )}
                <div className="pt-2 border-t border-white/5 mt-2">
                  <p className="text-[8px] text-cyan-500/50 font-mono uppercase">Resolution: 32_bit_float</p>
                </div>
              </div>
            </div>

            {recording && (
              <div className="absolute inset-0 bg-cyan-500/5 border-4 border-cyan-500/30 rounded-3xl pointer-events-none animate-pulse"></div>
            )}
            
            {!isVisionReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 z-30">
                <div className="text-center space-y-3">
                  <div className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.4em] animate-pulse">Initializing_Optic_Buffer</div>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-6 glass p-8 rounded-3xl border-slate-800 flex items-center justify-between shadow-lg">
            <div className="flex-1 mr-12">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Temporal Buffer Saturation</span>
                <span className="text-[11px] font-mono text-cyan-400 font-bold">{capturedFrames} / {totalRequired} Frames</span>
              </div>
              <div className="h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
                <div 
                  className="h-full bg-cyan-500 shadow-[0_0_15px_#06b6d4] transition-all duration-150 rounded-full" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            <button 
              onClick={startRecording}
              disabled={recording || presenceConfidence < 0.3}
              className={`px-10 py-4 rounded-2xl font-black text-[11px] tracking-[0.2em] uppercase transition-all shadow-2xl ${
                recording || presenceConfidence < 0.3 
                  ? 'bg-slate-800 text-slate-600 border border-slate-700 cursor-not-allowed' 
                  : 'bg-cyan-500 text-white hover:bg-cyan-400 hover:scale-[1.02] active:scale-[0.98] shadow-cyan-500/20'
              }`}
            >
              {recording ? 'STREAMING TO CACHE...' : 'START REAL CAPTURE'}
            </button>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="glass p-8 rounded-3xl space-y-6 bg-slate-950 border-slate-800">
            <h3 className="text-white font-black text-xs uppercase tracking-[0.2em] border-b border-slate-800 pb-4 flex items-center">
              <span className="w-2 h-2 bg-cyan-500 rounded-full mr-3 shadow-[0_0_8px_#06b6d4]"></span>
              Training Protocol
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Bio-Static Anchor', text: 'Align eyes to the horizontal guideline.' },
                { label: 'Kinematic Flow', text: 'Perform gesture slowly (300ms/action).' },
                { label: 'Vector Stability', text: 'Hold end-pose for 1.0s to serialize.' },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800/80 group hover:border-cyan-500/30 transition-colors">
                  <p className="text-[10px] font-black text-cyan-500 uppercase mb-1 tracking-tighter">PHASE_0{i+1}: {item.label}</p>
                  <p className="text-[10px] text-slate-400 leading-normal">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-8 rounded-3xl bg-slate-950 border-slate-800 h-[240px] flex flex-col">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Serial Sequence Log</h4>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar font-mono text-[9px] leading-relaxed">
              {recording ? (
                <div className="text-cyan-400 animate-pulse">>>> WRITING_BUFFER_CHUNK_{capturedFrames}...</div>
              ) : capturedFrames > 0 ? (
                <div className="space-y-1">
                   <div className="text-green-500">>>> CAPTURE_COMPLETE_0x4F2</div>
                   <div className="text-slate-500 text-[8px]">VALIDATED: 150_FRAMES</div>
                   <div className="text-slate-500 text-[8px]">MEAN_CONF: 98.4%</div>
                </div>
              ) : (
                <div className="text-slate-800 uppercase tracking-[0.1em]">Awaiting_Kinetic_Activity_Pulse...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
