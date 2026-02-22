import type { TimerPhase } from './timer';

export type SessionCategory = 'work' | 'study' | 'training' | 'custom';

export interface SessionTag {
  id: string;
  label: string;
  category: SessionCategory;
}

export interface PomodoroConfig {
  workInterval: number;
  breakInterval: number;
  longBreakInterval: number;
  sessionsUntilLongBreak: number;
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
