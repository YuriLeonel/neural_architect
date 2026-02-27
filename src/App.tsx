import { useEffect } from 'react';
import { useSessionStore, useTimerStore } from '@/stores/setup';
import {
  CategorySelector,
  IntervalConfig,
  PhaseTabSelector,
  TimerControls,
  TimerDisplay,
} from '@/components';
import { useWakeLock } from '@/hooks/useWakeLock';

function App() {
  const tick = useTimerStore((state) => state.tick);
  const isRunning = useTimerStore((state) => state.isRunning);
  const completedSessions = useSessionStore((state) => state.sessionOrder.length);

  useWakeLock(isRunning);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        tick();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [tick]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-8 px-4 py-10 sm:px-6">
        <PhaseTabSelector />
        <TimerDisplay />
        <TimerControls />
        <CategorySelector />
        <IntervalConfig />
        <p className="text-sm font-medium text-muted-foreground">
          Completed sessions: {completedSessions}
        </p>
      </main>
    </div>
  );
}

export default App;
