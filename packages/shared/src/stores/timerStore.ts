import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import type { TimerState, TimerPhase, TimerConfig } from '../types';

export interface TimerStore extends TimerState {
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  tick: () => void;
  setPhase: (phase: TimerPhase) => void;
  setConfig: (config: Partial<TimerConfig>) => void;
  completeSession: () => void;
}

const defaultConfig: TimerConfig = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsUntilLongBreak: 4,
};

// Storage implementation (localStorage vs MMKV) should be configured at the app level
export function createTimerStore(storage: PersistOptions<TimerStore>['storage']) {
  return create<TimerStore>()(
    persist(
      (set, get): TimerStore => ({
        timeRemaining: defaultConfig.workDuration * 60,
        totalDuration: defaultConfig.workDuration * 60,
        isRunning: false,
        isPaused: false,
        phase: 'work',
        completedSessions: 0,
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
          set({
            timeRemaining: defaultConfig.workDuration * 60,
            totalDuration: defaultConfig.workDuration * 60,
            isRunning: false,
            isPaused: false,
            startedAt: null,
            pausedAt: null,
          });
        },

        tick: () => {
          const state = get();
          if (state.isRunning && state.timeRemaining > 0) {
            const elapsed = state.startedAt
              ? Math.floor((Date.now() - state.startedAt) / 1000)
              : 0;
            const newTimeRemaining = Math.max(0, state.totalDuration - elapsed);

            if (newTimeRemaining === 0) {
              get().completeSession();
            } else {
              set({ timeRemaining: newTimeRemaining });
            }
          }
        },

        setPhase: (phase: TimerPhase) => {
          const config = defaultConfig;
          let duration = 0;

          switch (phase) {
            case 'work':
              duration = config.workDuration * 60;
              break;
            case 'shortBreak':
              duration = config.shortBreakDuration * 60;
              break;
            case 'longBreak':
              duration = config.longBreakDuration * 60;
              break;
          }

          set({
            phase,
            timeRemaining: duration,
            totalDuration: duration,
            isRunning: false,
            isPaused: false,
            startedAt: null,
            pausedAt: null,
          });
        },

        setConfig: (newConfig: Partial<TimerConfig>) => {
          Object.assign(defaultConfig, newConfig);
        },

        completeSession: () => {
          const state = get();
          set({
            isRunning: false,
            isPaused: false,
            timeRemaining: 0,
            completedSessions: state.completedSessions + 1,
            startedAt: null,
            pausedAt: null,
          });
        },
      }),
      {
        name: 'neural-architect-timer',
        storage,
        onRehydrateStorage: () => (state) => {
          // Reset transient state on rehydration to prevent timers from auto-resuming
          if (state) {
            state.isRunning = false;
            state.isPaused = false;
            state.startedAt = null;
            state.pausedAt = null;
          }
        },
      }
    )
  );
}
