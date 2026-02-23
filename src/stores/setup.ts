import {
  createEvolutionStore,
  createSessionStore,
  createTimerStore,
  createUserStatsStore,
} from '@/stores';
import type { TimerNotificationPayload } from '@/types';
import { sendTimerNotification } from '@/utils/notificationService';

function createJsonStorageAdapter() {
  return {
    getItem: (name: string) => {
      const value = localStorage.getItem(name);
      if (!value) {
        return null;
      }

      try {
        return JSON.parse(value);
      } catch {
        localStorage.removeItem(name);
        return null;
      }
    },
    setItem: (name: string, value: unknown) => {
      localStorage.setItem(name, JSON.stringify(value));
    },
    removeItem: (name: string) => {
      localStorage.removeItem(name);
    },
  };
}

const storage = createJsonStorageAdapter();

export const useEvolutionStore = createEvolutionStore(storage);

export const useUserStatsStore = createUserStatsStore(storage);

export const useSessionStore = createSessionStore(storage);

export const useTimerStore = createTimerStore(storage, {
  onWorkSessionCompleted: (record) => {
    useSessionStore.getState().recordSession(record);
    useEvolutionStore.getState().addExperience(record.xpEarned);
  },
  onPhaseCompleted: (completedPhase) => {
    const payload: TimerNotificationPayload =
      completedPhase === 'work'
        ? { type: 'FOCUS_COMPLETE' }
        : { type: 'BREAK_COMPLETE' };

    sendTimerNotification(payload);
  },
});
