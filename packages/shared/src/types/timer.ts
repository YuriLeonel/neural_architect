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
