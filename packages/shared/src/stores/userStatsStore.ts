import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import type { UserStats, Achievement, UserPreferences } from '../types';

interface UserStatsStore extends UserStats {
  addWorkTime: (seconds: number) => void;
  incrementSessions: () => void;
  updateStreak: () => void;
  completeTask: () => void;
  unlockAchievement: (achievement: Achievement) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
}

const defaultPreferences: UserPreferences = {
  soundEnabled: true,
  notificationsEnabled: true,
  theme: 'dark',
  defaultWorkDuration: 25,
  defaultBreakDuration: 5,
};

export function createUserStatsStore(storage: PersistOptions<UserStatsStore>['storage']) {
  return create<UserStatsStore>()(
    persist(
      (set, get) => ({
        totalWorkTime: 0,
        totalSessions: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastSessionDate: null,
        tasksCompleted: 0,
        achievements: [],
        preferences: defaultPreferences,
        addWorkTime: (seconds: number) => {
          set((state) => ({
            totalWorkTime: state.totalWorkTime + seconds,
          }));
        },

        incrementSessions: () => {
          set((state) => ({
            totalSessions: state.totalSessions + 1,
          }));
          get().updateStreak();
        },

        updateStreak: () => {
          const state = get();
          const today = new Date().toISOString().split('T')[0];
          const lastDate = state.lastSessionDate;

          if (lastDate === today) {
            return;
          }

          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          
          if (!yesterdayStr) {
            return;
          }

          let newStreak = state.currentStreak;

          // Streak continues if last session was yesterday, otherwise starts new streak
          if (lastDate === yesterdayStr) {
            newStreak = state.currentStreak + 1;
          } else if (lastDate === null || (lastDate && lastDate < yesterdayStr)) {
            newStreak = 1;
          }

          set({
            currentStreak: newStreak,
            longestStreak: Math.max(state.longestStreak, newStreak),
            lastSessionDate: today,
          });
        },

        completeTask: () => {
          set((state) => ({
            tasksCompleted: state.tasksCompleted + 1,
          }));
        },

        unlockAchievement: (achievement: Achievement) => {
          const state = get();
          if (!state.achievements.find((a) => a.id === achievement.id)) {
            set({
              achievements: [...state.achievements, achievement],
            });
          }
        },

        updatePreferences: (newPreferences: Partial<UserPreferences>) => {
          set((state) => ({
            preferences: {
              ...state.preferences,
              ...newPreferences,
            },
          }));
        },
      }),
      {
        name: 'neural-architect-user-stats',
        storage,
      }
    )
  );
}
