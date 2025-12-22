
export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Landmark {
  x: number;
  y: number;
  z?: number;
}

export interface HandModality {
  hand: 'left' | 'right';
  confidence: number;
  landmarks: Landmark[];
}

export interface EyeModality {
  leftGaze: Vector3;
  rightGaze: Vector3;
  focusPoint: Landmark;
  blink: { left: boolean; right: boolean };
}

export interface HeadModality {
  rotation: { pitch: number; yaw: number; roll: number };
  position: Vector3;
}

export interface BodyModality {
  pose: Landmark[];
  posture: 'standing' | 'sitting' | 'leaning_left' | 'leaning_right' | 'unknown';
  proximity: number;
}

export interface UnifiedPerceptionData {
  timestamp: number;
  confidence: number;
  source: string;
  modalities: {
    hand?: { left?: HandModality; right?: HandModality };
    eye?: EyeModality;
    head?: HeadModality;
    face?: { landmarks: Landmark[] };
    body?: BodyModality;
    presence: boolean;
  };
}

export interface IntentPayload {
  intent: string;
  triggers: string[];
  confidence: number;
  metadata?: Record<string, any>;
}

export enum SystemState {
  IDLE = 'IDLE',
  ACTIVE = 'ACTIVE',
  LOCKED = 'LOCKED',
  TRAINING = 'TRAINING',
  SECURITY_HALT = 'SECURITY_HALT',
  EMERGENCY_STOP = 'EMERGENCY_STOP'
}

export type MotionType = 'PINCH' | 'SPREAD' | 'SWIPE_UP' | 'SWIPE_DOWN' | 'SWIPE_LEFT' | 'SWIPE_RIGHT' | 'ROTATE' | 'HOLD' | 'PALM_OPEN' | 'EYE_BLINK' | 'HEAD_NOD' | 'HEAD_SHAKE' | 'BODY_LEAN';

// Added missing HandType and FingerType exports
export type HandType = 'Left' | 'Right' | 'Both';
export type FingerType = 'Thumb' | 'Index' | 'Middle' | 'Ring' | 'Pinky';

export interface GestureMapping {
  id: string;
  name: string;
  // Updated to match usage in GestureEditor.tsx
  hand: HandType;
  fingers: FingerType[];
  motion: MotionType;
  action: string;
  enabled: boolean;
  securityLevel?: 1 | 2 | 3;
}
