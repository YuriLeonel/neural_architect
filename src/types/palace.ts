import type { SessionCategory } from './session';

export type EnvironmentType = 'library' | 'coffee_shop' | 'house' | 'custom';

export interface NeuronState {
  id: string;
  label: string;
  totalXp: number;
  level: number;
  unlocked: boolean;
}

export interface MindPalaceState {
  categoryBackgrounds: Record<SessionCategory, EnvironmentType>;
  customBackgroundUrl: string | null;
  neurons: Record<string, NeuronState>;
}
