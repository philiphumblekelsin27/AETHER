
import React, { useState } from 'react';
import { useIntentEngine } from '../hooks/useIntentEngine';
import { CameraFeed } from '../components/CameraFeed';
import { GestureMapping, HandType, FingerType, MotionType } from '../types';

const ACTIONS = ['Mouse Click', 'Scroll Up', 'Scroll Down', 'Volume Up', 'Volume Down', 'Take Photo', 'Answer Call', 'End Call', 'Next Slide', 'Prev Slide', 'Zoom In', 'Zoom Out', 'Enter Key', 'Escape Key'];
// Fixed MotionType values to match the uppercase string literals in types.ts
const MOTIONS: MotionType[] = ['PINCH', 'SPREAD', 'SWIPE_UP', 'SWIPE_DOWN', 'SWIPE_LEFT', 'SWIPE_RIGHT', 'ROTATE', 'HOLD', 'PALM_OPEN'];
const FINGERS: FingerType[] = ['Thumb', 'Index', 'Middle', 'Ring', 'Pinky'];
const HANDS: HandType[] = ['Left', 'Right', 'Both'];

export const GestureEditor: React.FC = () => {
  // processLandmarks is now exported from useIntentEngine
  const { activeIntent, processLandmarks } = useIntentEngine();
  const [mappings, setMappings] = useState<GestureMapping[]>([
    { id: '1', name: 'Primary Click', hand: 'Right', fingers: ['Thumb', 'Index'], motion: 'PINCH', action: 'Mouse Click', enabled: true },
    { id: '2', name: 'Browser Back', hand: 'Left', fingers: ['Index'], motion: 'SWIPE_LEFT', action: 'Prev Slide', enabled: true },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newMapping, setNewMapping] = useState<Partial<GestureMapping>>({
    hand: 'Right',
    fingers: ['Index'],
    motion: 'PINCH',
    action: 'Mouse Click',
    enabled: true
  });

  const toggleFinger = (finger: FingerType) => {
    setNewMapping(prev => {
      const current = prev.fingers || [];
      if (current.includes(finger)) {
        return { ...prev, fingers: current.filter(f => f !== finger) };
      }
      return { ...prev, fingers: [...current, finger] };
    });
  };

  const addMapping = () => {
    if (!newMapping.fingers?.length) return;
    const mapping: GestureMapping = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Intent_${mappings.length + 1}`,
      hand: newMapping.hand as HandType,
      fingers: newMapping.fingers as FingerType[],
      motion: newMapping.motion as MotionType,
      action: newMapping.action as string,
      enabled: true
    };
    setMappings([...mappings, mapping]);
    setIsAdding(false);
  };

  const removeMapping = (id: string) => {
    setMappings(mappings.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Intent Editor</h2>
          <p className="text-sm text-slate-400">Map precise human kinematics to executable system commands.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="px-6 py-2 bg-cyan-500 text-white text-sm font-bold rounded-xl hover:bg-cyan-600 transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
          >
            {isAdding ? 'Cancel' : '+ Create New Intent'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7 space-y-4">
          {isAdding && (
            <div className="glass p-6 rounded-3xl border border-cyan-500/50 bg-cyan-500/5 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
              <h3 className="text-white font-bold text-sm uppercase tracking-widest">New Intent Definition</h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 uppercase font-bold">Target Hand</label>
                  <div className="flex bg-slate-900 rounded-xl p-1">
                    {HANDS.map(h => (
                      <button 
                        key={h}
                        onClick={() => setNewMapping({...newMapping, hand: h})}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${newMapping.hand === h ? 'bg-cyan-500 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 uppercase font-bold">Kinematic Motion</label>
                  <select 
                    value={newMapping.motion}
                    onChange={(e) => setNewMapping({...newMapping, motion: e.target.value as MotionType})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white outline-none"
                  >
                    {MOTIONS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 uppercase font-bold">Fingers Involved</label>
                <div className="flex flex-wrap gap-2">
                  {FINGERS.map(f => (
                    <button 
                      key={f}
                      onClick={() => toggleFinger(f)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all ${newMapping.fingers?.includes(f) ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 uppercase font-bold">System Action</label>
                <select 
                  value={newMapping.action}
                  onChange={(e) => setNewMapping({...newMapping, action: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white outline-none"
                >
                  {ACTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>

              <button 
                onClick={addMapping}
                className="w-full py-3 bg-cyan-500 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-cyan-600"
              >
                Register Intent
              </button>
            </div>
          )}

          {mappings.map(m => (
            <div key={m.id} className={`glass p-6 rounded-3xl flex items-center justify-between group transition-all duration-300 border ${activeIntent === m.motion || (activeIntent === 'PRECISION_PINCH' && m.motion === 'PINCH') ? 'border-cyan-500 bg-cyan-500/5 shadow-lg shadow-cyan-500/10 scale-[1.01]' : 'border-slate-800 hover:border-slate-700'}`}>
              <div className="flex items-center space-x-8">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">{m.hand} Hand Source</span>
                  <div className="flex space-x-1.5">
                    {m.fingers.map(f => (
                      <span key={f} className="px-2 py-0.5 bg-slate-800 rounded text-[9px] font-bold text-slate-400 border border-slate-700 uppercase">{f}</span>
                    ))}
                  </div>
                </div>

                <div className="w-8 h-8 flex items-center justify-center text-slate-800 text-xl font-thin">➔</div>

                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Kinematic Trigger</span>
                  <span className={`text-base font-black tracking-tighter uppercase italic ${activeIntent === m.motion || (activeIntent === 'PRECISION_PINCH' && m.motion === 'PINCH') ? 'text-cyan-400 animate-pulse' : 'text-slate-300'}`}>
                    {m.motion}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Mapped Action</span>
                  <span className="text-xs font-mono font-bold text-cyan-500 bg-cyan-500/5 px-2 py-1 rounded-lg border border-cyan-500/10">
                    {m.action}
                  </span>
                </div>
                <button 
                  onClick={() => removeMapping(m.id)}
                  className="p-2.5 bg-slate-900/50 rounded-xl text-slate-600 hover:text-red-500 hover:bg-red-500/10 transition-all border border-slate-800"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}

          {mappings.length === 0 && !isAdding && (
            <div className="glass p-12 rounded-3xl border-dashed border-2 border-slate-800/50 flex flex-col items-center justify-center text-center">
              <p className="text-slate-500 text-sm italic">No intents registered. Use the button above to begin mapping.</p>
            </div>
          )}
        </div>

        <div className="col-span-12 lg:col-span-5 space-y-6">
           <div className="glass p-6 rounded-3xl space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-bold text-white">Live Intent Calibration</h3>
                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[8px] font-mono rounded">UPLINK_ACTIVE</span>
              </div>
              <CameraFeed onHandUpdate={(l) => processLandmarks(l)} />
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Active Engine Output:</span>
                <span className="text-sm font-black text-cyan-400 italic tracking-tighter uppercase neon-text">{activeIntent}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
                <p className="text-[10px] text-slate-500 font-bold mb-3 uppercase tracking-widest">Available Rule-Set</p>
                <div className="grid grid-cols-2 gap-2">
                  {MOTIONS.map(m => (
                    <div key={m} className={`px-2 py-1.5 rounded-lg border text-[9px] font-bold text-center transition-colors ${activeIntent === m || (activeIntent === 'PRECISION_PINCH' && m === 'PINCH') ? 'bg-cyan-500 border-cyan-400 text-white' : 'bg-slate-950 border-slate-800 text-slate-600'}`}>
                      {m}
                    </div>
                  ))}
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
