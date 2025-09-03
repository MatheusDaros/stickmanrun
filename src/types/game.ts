export interface GameStats {
  score: number;
  fencesDestroyed: number;
  combo: number;
  level: number;
  totalFencesDestroyed: number;
  highScore: number;
}

export interface PowerUp {
  id: string;
  type: 'speed' | 'strength' | 'shield';
  position: { x: number; z: number };
  active: boolean;
  duration?: number;
}

export interface FenceData {
  id: string;
  type: 'wooden' | 'metal' | 'stone';
  position: { x: number; z: number };
  health: number;
  maxHealth: number;
  destroyed: boolean;
}

export interface BullState {
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
  charging: boolean;
  powerUps: {
    speed: boolean;
    strength: boolean;
    shield: boolean;
  };
}