import type { TimerPhase } from '../types/timer';

/**
 * Timer phase constants
 * Centralized definition of all timer phases to avoid hardcoding throughout the codebase
 */
export const TIMER_PHASES = {
  WORK: 'work' as const,
  SHORT_BREAK: 'shortBreak' as const,
  LONG_BREAK: 'longBreak' as const,
} as const;

/**
 * Type-safe timer phase values
 */
export type TimerPhaseValue = typeof TIMER_PHASES[keyof typeof TIMER_PHASES];

/**
 * Helper function to get phase duration from config
 */
export function getPhaseDuration(
  phase: TimerPhase,
  config: { workDuration: number; shortBreakDuration: number; longBreakDuration: number }
): number {
  switch (phase) {
    case TIMER_PHASES.WORK:
      return config.workDuration * 60;
    case TIMER_PHASES.SHORT_BREAK:
      return config.shortBreakDuration * 60;
    case TIMER_PHASES.LONG_BREAK:
      return config.longBreakDuration * 60;
    default:
      return config.workDuration * 60;
  }
}
