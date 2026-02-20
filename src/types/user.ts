export interface UserStats {
  totalWorkTime: number;
  totalSessions: number;
  currentStreak: number;
  longestStreak: number;
  lastSessionDate: string | null;
  tasksCompleted: number;
  achievements: Achievement[];
  preferences: UserPreferences;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt: string;
  icon?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserPreferences {
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  theme: 'light' | 'dark' | 'auto';
  defaultWorkDuration: number;
  defaultBreakDuration: number;
}
