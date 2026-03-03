import { useEffect, useState } from 'react';
import { useSessionStore, useTimerStore } from '@/stores/setup';
import {
  Header,
  MindPalaceView,
  PhaseTabSelector,
  SettingsSidebar,
  TimerControls,
  TimerDisplay,
} from '@/components';
import type { AppView } from '@/components/navigation';
import { useTheme } from '@/hooks/useTheme';
import { useWakeLock } from '@/hooks/useWakeLock';

function App() {
  useTheme();

  const tick = useTimerStore((state) => state.tick);
  const isRunning = useTimerStore((state) => state.isRunning);
  const completedSessions = useSessionStore((state) => state.sessionOrder.length);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeView, setActiveView] = useState<AppView>('timer');

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
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />
      <main
        className={
          activeView === 'palace'
            ? 'min-h-[calc(100vh-73px)] w-full'
            : 'mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-5xl flex-col items-center justify-center gap-8 px-4 py-10 sm:px-6'
        }
      >
        {activeView === 'timer' ? (
          <div className="flex w-full flex-col items-center gap-8">
            <PhaseTabSelector />
            <TimerDisplay />
            <TimerControls />
            <p className="text-sm font-medium text-muted-foreground">
              Completed sessions: {completedSessions}
            </p>
          </div>
        ) : (
          <MindPalaceView />
        )}
      </main>
      <SettingsSidebar
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        activeView={activeView}
        onChangeView={setActiveView}
      />
    </div>
  );
}

export default App;
