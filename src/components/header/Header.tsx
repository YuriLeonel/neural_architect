import { useMemo } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useEvolutionStore } from '@/stores/setup';
import { GearIcon, MoonIcon, SunIcon } from './HeaderIcons';

interface HeaderProps {
  onOpenSettings: () => void;
}

function clampPercentage(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export function Header({ onOpenSettings }: HeaderProps) {
  const level = useEvolutionStore((state) => state.level);
  const currentExperience = useEvolutionStore((state) => state.experience);
  const experienceToNextLevel = useEvolutionStore((state) => state.experienceToNextLevel);
  const { resolvedTheme, toggleTheme } = useTheme();

  const experienceProgress = useMemo(() => {
    if (experienceToNextLevel <= 0) {
      return 0;
    }

    return clampPercentage((currentExperience / experienceToNextLevel) * 100);
  }, [currentExperience, experienceToNextLevel]);

  return (
    <header className="border-b border-border bg-background-secondary/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <img
              src="/icon.png"
              alt="Neural Architect logo"
              className="h-8 w-auto shrink-0 sm:h-9"
            />
            <p className="truncate text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              Neural Architect
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden min-w-[180px] rounded-lg border border-border bg-background px-3 py-2 sm:block">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium text-muted-foreground">Level {level}</span>
              <span className="text-muted-foreground">
                {currentExperience} / {experienceToNextLevel} XP
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
                style={{ width: `${experienceProgress}%` }}
                role="progressbar"
                aria-label="Experience progress"
                aria-valuemin={0}
                aria-valuemax={experienceToNextLevel}
                aria-valuenow={currentExperience}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label={resolvedTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title={resolvedTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {resolvedTheme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Open settings"
            title="Open settings"
          >
            <GearIcon />
          </button>
        </div>
      </div>
    </header>
  );
}
