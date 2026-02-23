import type { PomodoroConfig } from './session';

export interface TimerState {
  timeRemaining: number;
  totalDuration: number;
  isRunning: boolean;
  isPaused: boolean;
  phase: TimerPhase;
  startedAt: number | null;
  pausedAt: number | null;
  config: PomodoroConfig;
}

export type TimerPhase = 'work' | 'break';

export interface TimerActions {
  start: () => void;
  pause: () => void;
  resume: () => void;
  tick: () => void;
  setPhase: (phase: TimerPhase) => void;
  setConfig: (config: Partial<PomodoroConfig>) => void;
  skipBreak: () => void;
  requestReset: () => void;
  confirmReset: () => void;
  cancelReset: () => void;
  completeSession: () => void;
}
