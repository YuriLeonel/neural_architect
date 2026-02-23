import { create } from 'zustand';
import { persist, type PersistOptions } from 'zustand/middleware';
import {
  SESSION_CATEGORIES,
  type PomodoroConfig,
  type SessionCategory,
  type SessionRecord,
  type TimerPhase,
  type TimerState,
} from '../types';
import { TIMER_PHASES, getPhaseDuration } from '../constants/timer';
import { calculateReward, createId } from '../utils';

export interface TimerStore extends TimerState {
  resetPending: boolean;
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

export interface TimerStoreIntegrations {
  onFocusSessionCompleted?: (record: SessionRecord) => void;
  onPhaseCompleted?: (completedPhase: TimerPhase) => void;
}

const DEFAULT_CONFIG: PomodoroConfig = {
  focusInterval: 1500,
  breakInterval: 300,
  currentCategory: 'work',
  activeTags: [],
};

function normalizePhase(phase: unknown): TimerPhase {
  if (phase === TIMER_PHASES.BREAK || phase === 'shortBreak' || phase === 'longBreak') {
    return TIMER_PHASES.BREAK;
  }

  return TIMER_PHASES.FOCUS;
}

function isSessionCategory(value: unknown): value is SessionCategory {
  return (
    typeof value === 'string' &&
    (SESSION_CATEGORIES as readonly string[]).includes(value)
  );
}

function normalizeInterval(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : fallback;
}

function normalizeConfig(config: unknown): PomodoroConfig {
  const candidate =
    typeof config === 'object' && config !== null
      ? (config as Partial<PomodoroConfig> & { workInterval?: unknown })
      : {};
  const activeTags = Array.isArray(candidate.activeTags)
    ? candidate.activeTags.filter((tag): tag is string => typeof tag === 'string')
    : [];
  const currentCategory = isSessionCategory(candidate.currentCategory)
    ? candidate.currentCategory
    : DEFAULT_CONFIG.currentCategory;

  return {
    focusInterval: normalizeInterval(
      candidate.focusInterval ?? candidate.workInterval,
      DEFAULT_CONFIG.focusInterval,
    ),
    breakInterval: normalizeInterval(candidate.breakInterval, DEFAULT_CONFIG.breakInterval),
    currentCategory,
    activeTags,
  };
}

export function createTimerStore(
  storage: PersistOptions<TimerStore>['storage'],
  integrations: TimerStoreIntegrations = {},
) {
  return create<TimerStore>()(
    persist(
      (set, get): TimerStore => ({
        config: DEFAULT_CONFIG,
        timeRemaining: DEFAULT_CONFIG.focusInterval,
        totalDuration: DEFAULT_CONFIG.focusInterval,
        isRunning: false,
        isPaused: false,
        phase: TIMER_PHASES.FOCUS,
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
          const duration = getPhaseDuration(phase, get().config);
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
            const mergedConfig = normalizeConfig({
              ...state.config,
              ...newConfig,
            });
            const duration = getPhaseDuration(state.phase, mergedConfig);

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
          if (state.phase !== TIMER_PHASES.FOCUS) {
            get().completeSession();
          }
        },
        requestReset: () => {
          set({ resetPending: true });
        },
        confirmReset: () => {
          const state = get();
          const duration = getPhaseDuration(state.phase, state.config);
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
          const completedPhase = state.phase;
          const completedDurationSeconds = getPhaseDuration(completedPhase, state.config);

          if (state.phase === TIMER_PHASES.FOCUS) {
            const xpEarned = Math.round(calculateReward(completedDurationSeconds / 60, 1));
            const sessionRecord: SessionRecord = {
              id: createId('session'),
              category: state.config.currentCategory,
              tagIds: state.config.activeTags,
              phase: completedPhase,
              durationSeconds: completedDurationSeconds,
              completedAt: new Date().toISOString(),
              xpEarned,
            };

            integrations.onFocusSessionCompleted?.(sessionRecord);
          }

          integrations.onPhaseCompleted?.(completedPhase);

          const nextPhase: TimerPhase =
            state.phase === TIMER_PHASES.FOCUS ? TIMER_PHASES.BREAK : TIMER_PHASES.FOCUS;
          get().setPhase(nextPhase);
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
            state.phase = normalizePhase(state.phase);
            state.config = normalizeConfig(state.config);

            const duration = getPhaseDuration(state.phase, state.config);
            state.timeRemaining = duration;
            state.totalDuration = duration;
          }
        },
      },
    ),
  );
}
