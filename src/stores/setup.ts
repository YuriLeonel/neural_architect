import {
  createEvolutionStore,
  createSessionStore,
  createTimerStore,
  createUserStatsStore,
} from '@/stores';

export const useEvolutionStore = createEvolutionStore({
  getItem: (name: string) => {
    const value = localStorage.getItem(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: (name: string, value: unknown) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
});

export const useUserStatsStore = createUserStatsStore({
  getItem: (name: string) => {
    const value = localStorage.getItem(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: (name: string, value: unknown) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
});

export const useSessionStore = createSessionStore({
  getItem: (name: string) => {
    const value = localStorage.getItem(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: (name: string, value: unknown) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
});

export const useTimerStore = createTimerStore(
  {
    getItem: (name: string) => {
      const value = localStorage.getItem(name);
      return value ? JSON.parse(value) : null;
    },
    setItem: (name: string, value: unknown) => {
      localStorage.setItem(name, JSON.stringify(value));
    },
    removeItem: (name: string) => {
      localStorage.removeItem(name);
    },
  },
  {
    onWorkSessionCompleted: (record) => {
      useSessionStore.getState().recordSession(record);
      useEvolutionStore.getState().addExperience(record.xpEarned);
    },
  },
);
