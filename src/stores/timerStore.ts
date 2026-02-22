import { create } from 'zustand';
import { persist, type PersistOptions } from 'zustand/middleware';
import type { PomodoroConfig, TimerPhase, TimerState } from '../types';
import { TIMER_PHASES } from '../constants/timer';

export interface TimerStore extends TimerState {
  resetPending: boolean;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  tick: () => void;
  setPhase: (phase: TimerPhase) => void;
  setConfig: (config: Partial<PomodoroConfig>) => void;
  skipBreak: () => void;
  requestReset: () => void;
  confirmReset: () => void;
  cancelReset: () => void;
  completeSession: () => void;
}

const DEFAULT_CONFIG: PomodoroConfig = {
  workInterval: 1500,
  breakInterval: 300,
  longBreakInterval: 900,
  sessionsUntilLongBreak: 4,
  currentCategory: 'work',
  activeTags: [],
};

function getPhaseDurationFromConfig(phase: TimerPhase, config: PomodoroConfig): number {
  switch (phase) {
    case TIMER_PHASES.WORK:
      return config.workInterval;
    case TIMER_PHASES.SHORT_BREAK:
      return config.breakInterval;
    case TIMER_PHASES.LONG_BREAK:
      return config.longBreakInterval;
    default:
      return config.workInterval;
  }
}

export function createTimerStore(storage: PersistOptions<TimerStore>['storage']) {
  return create<TimerStore>()(
    persist(
      (set, get): TimerStore => ({
        config: DEFAULT_CONFIG,
        timeRemaining: DEFAULT_CONFIG.workInterval,
        totalDuration: DEFAULT_CONFIG.workInterval,
        isRunning: false,
        isPaused: false,
        phase: TIMER_PHASES.WORK,
        completedSessions: 0,
        resetPending: false,
        startedAt: null,
        pausedAt: null,
        start: () => {
          const state = get();
          if (!state.isRunning && !state.isPaused) {
            set({
              isRunning: true,
              startedAt: Date.now(),
              pausedAt: null,
            });
          }
        },
        pause: () => {
          const state = get();
          if (state.isRunning) {
            set({
              isRunning: false,
              isPaused: true,
              pausedAt: Date.now(),
            });
          }
        },
        resume: () => {
          const state = get();
          if (state.isPaused && state.pausedAt) {
            const pausedDuration = Date.now() - state.pausedAt;
            const adjustedStartTime = (state.startedAt ?? Date.now()) + pausedDuration;
            set({
              isRunning: true,
              isPaused: false,
              startedAt: adjustedStartTime,
              pausedAt: null,
            });
          }
        },
        reset: () => {
          const state = get();
          const duration = getPhaseDurationFromConfig(state.phase, state.config);
          set({
            timeRemaining: duration,
            totalDuration: duration,
            isRunning: false,
            isPaused: false,
            resetPending: false,
            startedAt: null,
            pausedAt: null,
          });
        },
        tick: () => {
          const state = get();
          if (!state.isRunning || !state.startedAt) {
            return;
          }

          const elapsed = Math.floor((Date.now() - state.startedAt) / 1000);
          const newTimeRemaining = Math.max(0, state.totalDuration - elapsed);

          if (newTimeRemaining === 0) {
            get().completeSession();
          } else if (newTimeRemaining !== state.timeRemaining) {
            set({ timeRemaining: newTimeRemaining });
          }
        },
        setPhase: (phase: TimerPhase) => {
          const duration = getPhaseDurationFromConfig(phase, get().config);
          set({
            phase,
            timeRemaining: duration,
            totalDuration: duration,
            isRunning: false,
            isPaused: false,
            resetPending: false,
            startedAt: null,
            pausedAt: null,
          });
        },
        setConfig: (newConfig: Partial<PomodoroConfig>) => {
          set((state) => {
            const mergedConfig: PomodoroConfig = {
              ...state.config,
              ...newConfig,
            };
            const duration = getPhaseDurationFromConfig(state.phase, mergedConfig);

            return {
              config: mergedConfig,
              timeRemaining: duration,
              totalDuration: duration,
              isRunning: false,
              isPaused: false,
              startedAt: null,
              pausedAt: null,
            };
          });
        },
        skipBreak: () => {
          const state = get();
          if (state.phase !== TIMER_PHASES.WORK) {
            get().completeSession();
          }
        },
        requestReset: () => {
          set({ resetPending: true });
        },
        confirmReset: () => {
          const state = get();
          const duration = getPhaseDurationFromConfig(state.phase, state.config);
          set({
            timeRemaining: duration,
            totalDuration: duration,
            isRunning: false,
            isPaused: false,
            resetPending: false,
            startedAt: null,
            pausedAt: null,
          });
        },
        cancelReset: () => {
          set({ resetPending: false });
        },
        completeSession: () => {
          const state = get();
          let nextPhase: TimerPhase;
          let newCompletedSessions = state.completedSessions;

          if (state.phase === TIMER_PHASES.WORK) {
            newCompletedSessions = state.completedSessions + 1;
            if (newCompletedSessions % state.config.sessionsUntilLongBreak === 0) {
              nextPhase = TIMER_PHASES.LONG_BREAK;
            } else {
              nextPhase = TIMER_PHASES.SHORT_BREAK;
            }
          } else {
            nextPhase = TIMER_PHASES.WORK;
          }

          get().setPhase(nextPhase);

          if (newCompletedSessions !== state.completedSessions) {
            set({ completedSessions: newCompletedSessions });
          }
        },
      }),
      {
        name: 'neural-architect-timer',
        storage,
        onRehydrateStorage: () => (state) => {
          if (state) {
            state.isRunning = false;
            state.isPaused = false;
            state.resetPending = false;
            state.startedAt = null;
            state.pausedAt = null;

            const persistedConfig = state.config;
            state.config = {
              ...DEFAULT_CONFIG,
              ...persistedConfig,
            };

            if (!persistedConfig) {
              const duration = getPhaseDurationFromConfig(state.phase, state.config);
              state.timeRemaining = duration;
              state.totalDuration = duration;
            }
          }
        },
      },
    ),
  );
}
