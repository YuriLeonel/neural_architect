export interface EvolutionState {
  level: number;
  experience: number;
  experienceToNextLevel: number;
  totalExperience: number;
  neuronCount: number;
  connectionCount: number;
  architectureTier: ArchitectureTier;
  unlockedFeatures: string[];
  networkState: NetworkState;
}

export type ArchitectureTier =
  | 'basic'
  | 'intermediate'
  | 'advanced'
  | 'expert'
  | 'master'
  | 'legendary';

export interface NetworkState {
  neurons: Neuron[];
  connections: Connection[];
  animationFrame?: number;
}

export interface Neuron {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  activated: boolean;
  layer: number;
}

export interface Connection {
  id: string;
  from: string;
  to: string;
  weight: number;
  active: boolean;
}
