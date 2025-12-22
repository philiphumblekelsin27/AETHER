
import React, { useRef, useEffect, useState } from 'react';
import { UnifiedPerceptionData, Landmark } from '../types';

interface CameraFeedProps {
  onPerceptionUpdate?: (data: UnifiedPerceptionData) => void;
  onHandUpdate?: (landmarks: Landmark[]) => void;
  showLandmarks?: boolean;
}

export const CameraFeed: React.FC<CameraFeedProps> = ({ onPerceptionUpdate, onHandUpdate, showLandmarks = true }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const fpsRef = useRef<number>(0);
  const frameCount = useRef<number>(0);
  const lastFpsUpdate = useRef<number>(0);
  const cameraInstance = useRef<any>(null);
  const holisticInstance = useRef<any>(null);

  const startCamera = async () => {
    setError(null);
    const win = window as any;
    
    // Explicitly check for all required MediaPipe constructors
    if (!win.Holistic || !win.Camera || !videoRef.current || !canvasRef.current) {
      console.log("Waiting for MediaPipe modules...", { 
        Holistic: !!win.Holistic, 
        Camera: !!win.Camera, 
        video: !!videoRef.current, 
        canvas: !!canvasRef.current 
      });
      setError("Waiting for Vision Engine initialization...");
      // Retry in 500ms if scripts are still loading
      setTimeout(startCamera, 500);
      return;
    }

    try {
      // Direct probe for hardware access to trigger browser prompt
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // We don't want to keep this stream open manually if we're handing it to MediaPipe Camera utility
      stream.getTracks().forEach(track => track.stop());
      setPermissionState('granted');

      if (!holisticInstance.current) {
        holisticInstance.current = new win.Holistic({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5.1675471629/${file}`,
        });

        holisticInstance.current.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
          refineFaceLandmarks: true,
        });

        holisticInstance.current.onResults((results: any) => {
          if (!canvasRef.current) return;

          const now = performance.now();
          frameCount.current++;
          if (now - lastFpsUpdate.current > 1000) {
            fpsRef.current = frameCount.current;
            frameCount.current = 0;
            lastFpsUpdate.current = now;
          }

          const ctx = canvasRef.current.getContext('2d')!;
          ctx.save();
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          ctx.scale(-1, 1);
          ctx.translate(-canvasRef.current.width, 0);

          if (showLandmarks) {
            const winMP = window as any;
            if (results.leftHandLandmarks) winMP.drawConnectors(ctx, results.leftHandLandmarks, winMP.HAND_CONNECTIONS, { color: '#06b6d4', lineWidth: 1.5 });
            if (results.rightHandLandmarks) winMP.drawConnectors(ctx, results.rightHandLandmarks, winMP.HAND_CONNECTIONS, { color: '#06b6d4', lineWidth: 1.5 });
            
            if (results.faceLandmarks) {
              winMP.drawConnectors(ctx, results.faceLandmarks, winMP.FACEMESH_TESSELATION, { color: '#06b6d411', lineWidth: 0.5 });
              const nose = results.faceLandmarks[1];
              ctx.beginPath();
              ctx.strokeStyle = '#06b6d4';
              ctx.lineWidth = 1;
              ctx.arc(nose.x * 640, nose.y * 480, 5, 0, Math.PI * 2);
              ctx.stroke();
            }
          }

          const data: UnifiedPerceptionData = {
            timestamp: Date.now(),
            confidence: results.poseLandmarks ? 0.95 : 0.1,
            source: 'LOCAL_OPTIC',
            modalities: {
              presence: !!results.poseLandmarks,
              hand: {
                left: results.leftHandLandmarks ? { hand: 'left', confidence: 0.9, landmarks: results.leftHandLandmarks } : undefined,
                right: results.rightHandLandmarks ? { hand: 'right', confidence: 0.9, landmarks: results.rightHandLandmarks } : undefined,
              },
              face: results.faceLandmarks ? { landmarks: results.faceLandmarks } : undefined,
              body: results.poseLandmarks ? {
                pose: results.poseLandmarks,
                posture: 'unknown',
                proximity: results.poseLandmarks[0].z,
              } : undefined,
            }
          };

          if (onPerceptionUpdate) onPerceptionUpdate(data);
          if (onHandUpdate && results.rightHandLandmarks) onHandUpdate(results.rightHandLandmarks);
          ctx.restore();
        });
      }

      if (!cameraInstance.current) {
        // Ensure win.Camera is used as a constructor
        const CameraConstructor = win.Camera;
        if (typeof CameraConstructor !== 'function') {
          throw new Error("MediaPipe Camera constructor is not a function. Check script loading.");
        }

        cameraInstance.current = new CameraConstructor(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current && holisticInstance.current) {
              await holisticInstance.current.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480,
        });

        await cameraInstance.current.start();
      }
      
      setIsReady(true);
    } catch (err: any) {
      console.error("Camera Initialization Error:", err);
      setError(err.message || "Failed to access camera.");
      setPermissionState('denied');
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (cameraInstance.current) {
        cameraInstance.current.stop();
        cameraInstance.current = null;
      }
      if (holisticInstance.current) {
        holisticInstance.current.close();
        holisticInstance.current = null;
      }
    };
  }, []);

  return (
    <div className="relative aspect-video bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden group">
      {!isReady && (
        <div className="absolute inset-0 bg-slate-950/90 z-20 flex flex-col items-center justify-center p-6 text-center">
          {error && !error.includes("Waiting") ? (
            <div className="space-y-4 max-w-xs">
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center mx-auto text-xl">⚠️</div>
              <p className="text-xs font-mono text-red-400">{error}</p>
              <button 
                onClick={startCamera}
                className="w-full py-2 bg-cyan-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-cyan-400 active:scale-95 transition-all"
              >
                Retry Hardware Sync
              </button>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 border-4 border-cyan-500/10 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
              <span className="text-[10px] font-mono text-cyan-400 animate-pulse uppercase tracking-[0.3em]">
                {error || "Initializing_Neural_Optics"}
              </span>
            </>
          )}
        </div>
      )}
      <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover scale-x-[-1]" playsInline muted />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10" width={640} height={480} />
      
      {/* HUD Overlay */}
      <div className="absolute inset-0 border-[1px] border-cyan-500/10 pointer-events-none"></div>
      <div className="absolute top-4 left-4 z-20 flex flex-col space-y-2">
        <div className="flex space-x-2">
          <span className={`px-2 py-0.5 ${isReady ? 'bg-cyan-500' : 'bg-slate-800'} text-white text-[8px] font-black rounded transition-colors uppercase tracking-widest`}>Aether Live Engine</span>
          <span className="px-2 py-0.5 bg-slate-900/90 border border-slate-700 text-cyan-400 text-[8px] font-mono rounded">SAMP_RATE: {fpsRef.current}Hz</span>
        </div>
      </div>
      
      <div className="absolute bottom-4 left-4 z-20">
        <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-md border border-white/5 rounded-full px-3 py-1">
          <div className={`w-1.5 h-1.5 rounded-full ${isReady ? 'bg-green-500' : 'bg-slate-600'} animate-pulse`}></div>
          <span className="text-[8px] font-mono text-slate-300 uppercase">Hardware_Status: {isReady ? 'CONNECTED' : 'OFFLINE'}</span>
        </div>
      </div>
    </div>
  );
};
