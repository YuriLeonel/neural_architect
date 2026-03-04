import { usePalaceStore, useSessionStore, useTimerStore } from '@/stores/setup';
import { BackgroundLayer } from '@/components/palace';
import { PhaseTabSelector } from './PhaseTabSelector';
import { TimerControls } from './TimerControls';
import { TimerDisplay } from './TimerDisplay';

export function TimerView() {
  const currentCategory = useTimerStore((state) => state.config.currentCategory);
  const completedSessions = useSessionStore((state) => state.sessionOrder.length);
  const categoryBackgrounds = usePalaceStore((state) => state.categoryBackgrounds);
  const customBackgroundUrl = usePalaceStore((state) => state.customBackgroundUrl);
  const activeEnvironment = categoryBackgrounds[currentCategory];

  return (
    <section
      className="relative min-h-[calc(100vh-73px)] w-full overflow-hidden bg-background-secondary/20"
      aria-label="Timer"
    >
      <BackgroundLayer environment={activeEnvironment} customBackgroundUrl={customBackgroundUrl} />
      <div
        className="absolute inset-0 z-[1] bg-gradient-to-b from-black/45 via-black/35 to-black/50"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-5xl flex-col items-center justify-center gap-8 px-4 py-10 sm:px-6">
        <div className="flex w-full max-w-xl flex-col items-center gap-8 rounded-3xl border border-white/20 bg-black/25 px-6 py-8 shadow-2xl backdrop-blur-sm">
          <PhaseTabSelector />
          <TimerDisplay />
          <TimerControls />
          <p className="text-sm font-medium text-white/85 drop-shadow-sm">Completed sessions: {completedSessions}</p>
        </div>
      </div>
    </section>
  );
}
