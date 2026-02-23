import type { TimerPhase } from './timer';

export const SESSION_CATEGORIES = ['work', 'study', 'training', 'custom'] as const;

export type SessionCategory = (typeof SESSION_CATEGORIES)[number];

export interface SessionTag {
  id: string;
  label: string;
  category: SessionCategory;
}

export interface PomodoroConfig {
  workInterval: number;
  breakInterval: number;
  currentCategory: SessionCategory;
  activeTags: string[];
}

export interface SessionRecord {
  id: string;
  category: SessionCategory;
  tagIds: string[];
  phase: TimerPhase;
  durationSeconds: number;
  completedAt: string;
  xpEarned: number;
}
