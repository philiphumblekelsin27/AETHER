
import React from 'react';

export const HandSkeleton: React.FC = () => {
  // Simple representation of hand landmarks
  return (
    <div className="relative aspect-video bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center p-8 group">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500 to-transparent"></div>
      
      <svg className="w-full h-full max-w-[200px]" viewBox="0 0 100 120">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Palm base */}
        <circle cx="50" cy="100" r="4" fill="#06b6d4" filter="url(#glow)" />
        
        {/* Fingers (simplified lines for demo) */}
        <path d="M50 100 L30 80 L20 60" stroke="#06b6d4" strokeWidth="1" fill="none" className="opacity-40" />
        <path d="M50 100 L40 70 L35 45" stroke="#06b6d4" strokeWidth="1" fill="none" className="opacity-40" />
        <path d="M50 100 L55 65 L60 35" stroke="#06b6d4" strokeWidth="1" fill="none" className="opacity-40" />
        <path d="M50 100 L70 70 L75 50" stroke="#06b6d4" strokeWidth="1" fill="none" className="opacity-40" />
        <path d="M50 100 L85 85 L95 75" stroke="#06b6d4" strokeWidth="1" fill="none" className="opacity-40" />
        
        {/* Active landmarks with animation */}
        {[
          [30, 80], [20, 60], [40, 70], [35, 45], [55, 65], [60, 35], [70, 70], [75, 50], [85, 85], [95, 75]
        ].map(([x, y], i) => (
          <circle 
            key={i} 
            cx={x} 
            cy={y} 
            r="1.5" 
            fill="#06b6d4" 
            className="animate-pulse"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </svg>
      
      <div className="absolute top-4 left-4 flex space-x-2">
        <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-[10px] font-mono rounded border border-cyan-500/30">L_HAND</span>
        <span className="px-2 py-1 bg-slate-800 text-slate-400 text-[10px] font-mono rounded border border-slate-700">CONF: 98%</span>
      </div>
    </div>
  );
};
