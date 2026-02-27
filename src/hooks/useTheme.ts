import { useCallback, useEffect, useMemo, useState } from 'react';
import { useUserStatsStore } from '@/stores/setup';
import type { UserPreferences } from '@/types';

const THEME_MEDIA_QUERY = '(prefers-color-scheme: dark)';

function getSystemPrefersDark(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia(THEME_MEDIA_QUERY).matches;
}

type ThemePreference = UserPreferences['theme'];
type ResolvedTheme = 'light' | 'dark';

export function useTheme() {
  const theme = useUserStatsStore((state) => state.preferences.theme);
  const updatePreferences = useUserStatsStore((state) => state.updatePreferences);
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(getSystemPrefersDark);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQueryList = window.matchMedia(THEME_MEDIA_QUERY);
    const handleThemeChange = (event: MediaQueryListEvent) => {
      setSystemPrefersDark(event.matches);
    };

    setSystemPrefersDark(mediaQueryList.matches);
    mediaQueryList.addEventListener('change', handleThemeChange);

    return () => {
      mediaQueryList.removeEventListener('change', handleThemeChange);
    };
  }, []);

  const resolvedTheme = useMemo<ResolvedTheme>(() => {
    if (theme === 'auto') {
      return systemPrefersDark ? 'dark' : 'light';
    }

    return theme;
  }, [systemPrefersDark, theme]);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
  }, [resolvedTheme]);

  const setTheme = useCallback(
    (nextTheme: ThemePreference) => {
      updatePreferences({ theme: nextTheme });
    },
    [updatePreferences],
  );

  const toggleTheme = useCallback(() => {
    const nextTheme: ThemePreference = resolvedTheme === 'dark' ? 'light' : 'dark';
    updatePreferences({ theme: nextTheme });
  }, [resolvedTheme, updatePreferences]);

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  };
}
