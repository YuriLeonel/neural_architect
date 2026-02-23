import type { PomodoroConfig } from '../types/session';
import type { TimerPhase } from '../types/timer';

export const TIMER_PHASES = {
  WORK: 'work' as const,
  BREAK: 'break' as const,
} as const;

export function getPhaseDuration(phase: TimerPhase, config: PomodoroConfig): number {
  switch (phase) {
    case TIMER_PHASES.WORK:
      return config.workInterval;
    case TIMER_PHASES.BREAK:
      return config.breakInterval;
    default:
      return config.workInterval;
  }
}
