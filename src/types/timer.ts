export interface TimerState {
  timeRemaining: number;
  totalDuration: number;
  isRunning: boolean;
  isPaused: boolean;
  phase: TimerPhase;
  completedSessions: number;
  startedAt: number | null;
  pausedAt: number | null;
}

export type TimerPhase = 'work' | 'shortBreak' | 'longBreak';

export interface TimerConfig {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
}

export interface TimerActions {
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  tick: () => void;
  setPhase: (phase: TimerPhase) => void;
  setConfig: (config: Partial<TimerConfig>) => void;
  completeSession: () => void;
}
