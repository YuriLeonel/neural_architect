import {
  createPalaceStore,
  createSessionStore,
  createTimerStore,
  createUserStatsStore,
} from '@/stores';
import type { TimerNotificationPayload } from '@/types';
import { dispatchXpToast } from '@/components/palace/XpToast';
import { sendTimerNotification } from '@/utils/notificationService';
import { saveCustomBackground } from '@/utils/imageStorage';

function createJsonStorageAdapter() {
  return {
    getItem: (name: string) => {
      const value = localStorage.getItem(name);
      if (!value) {
        return null;
      }

      try {
        return JSON.parse(value);
      } catch (error) {
        console.warn('Failed to parse stored value for key:', name, error);
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

export const usePalaceStore = createPalaceStore(storage);

// One-time migration: base64 data URLs in customBackgroundUrl -> IndexedDB blob
(function migrateCustomBackground() {
  const customUrl = usePalaceStore.getState().customBackgroundUrl;
  if (typeof customUrl === 'string' && customUrl.startsWith('data:image/')) {
    fetch(customUrl)
      .then((r) => r.blob())
      .then((blob) => saveCustomBackground(blob))
      .then(() => {
        usePalaceStore.setState({ customBackgroundUrl: 'indexeddb' });
      })
      .catch(() => {
        // Migration failed — leave the existing data URL in place
      });
  }
})();

export const useUserStatsStore = createUserStatsStore(storage);

export const useSessionStore = createSessionStore(storage);

export const useTimerStore = createTimerStore(storage, {
  onFocusSessionCompleted: (record) => {
    useSessionStore.getState().recordSession(record);
    const entries = usePalaceStore.getState().distributeXp(record.category, record.tagIds, record.xpEarned);
    if (entries.length > 0) {
      dispatchXpToast(entries);
    }
  },
  onPhaseCompleted: (completedPhase) => {
    const payload: TimerNotificationPayload =
      completedPhase === 'focus'
        ? { type: 'FOCUS_COMPLETE' }
        : { type: 'BREAK_COMPLETE' };

    sendTimerNotification(payload);
  },
});
