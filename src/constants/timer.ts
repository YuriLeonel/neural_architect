import type { PomodoroConfig } from '../types/session';
import type { TimerPhase } from '../types/timer';

export const TIMER_PHASES = {
  FOCUS: 'focus' as const,
  BREAK: 'break' as const,
} as const;

export function getPhaseDuration(phase: TimerPhase, config: PomodoroConfig): number {
  switch (phase) {
    case TIMER_PHASES.FOCUS:
      return config.focusInterval;
    case TIMER_PHASES.BREAK:
      return config.breakInterval;
    default:
      return config.focusInterval;
  }
}
