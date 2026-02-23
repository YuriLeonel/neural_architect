import type { TimerPhase } from '../types/timer';

export const TIMER_PHASES = {
  WORK: 'work' as const,
  BREAK: 'break' as const,
} as const;

export type TimerPhaseValue = typeof TIMER_PHASES[keyof typeof TIMER_PHASES];

export function getPhaseDuration(
  phase: TimerPhase,
  config: { workDuration: number; breakDuration: number },
): number {
  switch (phase) {
    case TIMER_PHASES.WORK:
      return config.workDuration * 60;
    case TIMER_PHASES.BREAK:
      return config.breakDuration * 60;
    default:
      return config.workDuration * 60;
  }
}
