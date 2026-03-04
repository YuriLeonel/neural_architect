import { useTheme } from '@/hooks/useTheme';
import { GearIcon, MoonIcon, SunIcon } from './HeaderIcons';

interface HeaderProps {
  onOpenSettings: () => void;
  onGoHome: () => void;
}

export function Header({ onOpenSettings, onGoHome }: HeaderProps) {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <header className="border-b border-border bg-background-secondary/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="min-w-0">
          <button
            type="button"
            onClick={onGoHome}
            className="flex items-center gap-2 rounded-md px-1 py-1 text-left transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Go to timer homepage"
            title="Go to timer homepage"
          >
            <img
              src="/icon.png"
              alt="Neural Architect logo"
              className="h-8 w-auto shrink-0 sm:h-9"
            />
            <p className="truncate text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              Neural Architect
            </p>
          </button>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
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
