export type EnvironmentType = 'library' | 'coffee_shop' | 'house' | 'custom';

export interface NeuronState {
  id: string;
  label: string;
  totalXp: number;
  level: number;
  unlocked: boolean;
}

export interface MindPalaceState {
  activeEnvironment: EnvironmentType;
  customBackgroundUrl: string | null;
  neurons: Record<string, NeuronState>;
}
