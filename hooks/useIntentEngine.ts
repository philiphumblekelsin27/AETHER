
import { useState, useCallback, useRef } from 'react';
import { UnifiedPerceptionData, Landmark, Vector3 } from '../types';

export const useIntentEngine = () => {
  const [activeIntent, setActiveIntent] = useState<string>('IDLE');
  const [lastPerception, setLastPerception] = useState<UnifiedPerceptionData | null>(null);
  const [visualPing, setVisualPing] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    totalFrames: 0,
    peakLatency: 0,
    averageConfidence: 0,
    isHumanVerified: false,
    rawSignal: ''
  });
  
  const movementBuffer = useRef<number[]>([]);
  const MAX_BUFFER = 30;

  const processPerception = useCallback((data: UnifiedPerceptionData) => {
    const startTime = performance.now();
    setLastPerception(data);
    let detectedIntent = 'IDLE';

    if (data.modalities.face?.landmarks) {
      const face = data.modalities.face.landmarks;
      const nose = face[1];
      const leftEye = face[33];
      const rightEye = face[263];

      // 1. Head Pose Estimation
      const yaw = (nose.x - (leftEye.x + rightEye.x) / 2) * 500;
      const pitch = (nose.y - (leftEye.y + rightEye.y) / 2) * 500;
      
      movementBuffer.current.push(nose.x + nose.y + (nose.z || 0));
      if (movementBuffer.current.length > MAX_BUFFER) movementBuffer.current.shift();
      
      const variance = movementBuffer.current.length === MAX_BUFFER 
        ? movementBuffer.current.reduce((a, b) => a + Math.pow(b - (movementBuffer.current.reduce((x, y) => x + y, 0) / MAX_BUFFER), 2), 0) / MAX_BUFFER
        : 0;

      const isVerified = variance > 0.0000001; 

      if (Math.abs(yaw) > 40) detectedIntent = yaw > 0 ? 'LOOK_RIGHT' : 'LOOK_LEFT';
      else if (Math.abs(pitch) > 30) detectedIntent = pitch > 0 ? 'LOOK_DOWN' : 'LOOK_UP';

      // 2. Gesture Detection
      if (data.modalities.hand?.right) {
        const { landmarks } = data.modalities.hand.right;
        const dist = Math.sqrt(Math.pow(landmarks[4].x - landmarks[8].x, 2) + Math.pow(landmarks[4].y - landmarks[8].y, 2));
        if (dist < 0.035) {
          detectedIntent = 'PRECISION_PINCH';
          // Trigger visual feedback ping
          setVisualPing(true);
          setTimeout(() => setVisualPing(false), 200);
        }
      }

      const rawDataString = `X:${nose.x.toFixed(3)} Y:${nose.y.toFixed(3)} Z:${nose.z?.toFixed(3)} V:${variance.toFixed(8)}`;

      const latency = performance.now() - startTime;
      setSessionStats(prev => ({
        ...prev,
        totalFrames: prev.totalFrames + 1,
        peakLatency: Math.max(prev.peakLatency, latency),
        averageConfidence: (prev.averageConfidence * 0.95) + (data.confidence * 0.05),
        isHumanVerified: isVerified,
        rawSignal: rawDataString
      }));
    }

    if (detectedIntent !== activeIntent) {
      setActiveIntent(detectedIntent);
    }
  }, [activeIntent]);

  const processLandmarks = useCallback((landmarks: Landmark[]) => {
    processPerception({
      timestamp: Date.now(),
      confidence: 0.95,
      source: 'CALIBRATION_PROBE',
      modalities: {
        presence: true,
        hand: { right: { hand: 'right', confidence: 0.95, landmarks } }
      }
    });
  }, [processPerception]);

  return { activeIntent, processPerception, processLandmarks, lastPerception, sessionStats, visualPing };
};
