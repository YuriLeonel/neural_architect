import type { SessionCategory } from './session';

export type EnvironmentType = 'library' | 'coffee_shop' | 'house' | 'custom';

export interface NeuronState {
  id: string;
  label: string;
  totalXp: number;
  level: number;
  unlocked: boolean;
  lastXpGained: number;
  lastLeveledUpAt: string | null;
}

export interface XpActivityEntry {
  id: string;
  neuronLabel: string;
  neuronId: string;
  xpGained: number;
  source: 'tag' | 'category';
  sourceLabel: string;
  sessionCategory: SessionCategory;
  leveledUp: boolean;
  newLevel: number;
  occurredAt: string;
}

export interface MindPalaceState {
  categoryBackgrounds: Record<SessionCategory, EnvironmentType>;
  customBackgroundUrl: string | null;
  neurons: Record<string, NeuronState>;
  xpActivityLog: XpActivityEntry[];
}
