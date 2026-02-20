import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import type { TimerState, TimerPhase, TimerConfig } from '../types';
import { TIMER_PHASES, getPhaseDuration } from '../constants/timer';

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

// Storage implementation should be configured at the app level
export function createTimerStore(storage: PersistOptions<TimerStore>['storage']) {
  return create<TimerStore>()(
    persist(
      (set, get): TimerStore => ({
        timeRemaining: defaultConfig.workDuration * 60,
        totalDuration: defaultConfig.workDuration * 60,
        isRunning: false,
        isPaused: false,
        phase: TIMER_PHASES.WORK,
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
          const state = get();
          const config = defaultConfig;
          const duration = getPhaseDuration(state.phase, config);

          set({
            timeRemaining: duration,
            totalDuration: duration,
            isRunning: false,
            isPaused: false,
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
          const config = defaultConfig;
          const duration = getPhaseDuration(phase, config);

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
          const config = defaultConfig;
          let nextPhase: TimerPhase;
          let newCompletedSessions = state.completedSessions;

          if (state.phase === TIMER_PHASES.WORK) {
            newCompletedSessions = state.completedSessions + 1;
            if (newCompletedSessions % config.sessionsUntilLongBreak === 0) {
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
            state.startedAt = null;
            state.pausedAt = null;
          }
        },
      }
    )
  );
}
