import { MMKV } from 'react-native-mmkv';
import { createTimerStore, createEvolutionStore, createUserStatsStore } from '@neural-architect/shared/stores';

const storage = new MMKV();

const mmkvStorage = {
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: (name: string, value: unknown) => {
    storage.set(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    storage.delete(name);
  },
};

export const useTimerStore = createTimerStore(mmkvStorage);
export const useEvolutionStore = createEvolutionStore(mmkvStorage);
export const useUserStatsStore = createUserStatsStore(mmkvStorage);
