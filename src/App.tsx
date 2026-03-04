import { useEffect, useState } from 'react';
import { useTimerStore } from '@/stores/setup';
import { Header, MindPalaceView, SettingsSidebar, TimerView } from '@/components';
import type { AppView } from '@/components/navigation';
import { useTheme } from '@/hooks/useTheme';
import { useWakeLock } from '@/hooks/useWakeLock';

function App() {
  useTheme();

  const tick = useTimerStore((state) => state.tick);
  const isRunning = useTimerStore((state) => state.isRunning);
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
      <main className="min-h-[calc(100vh-73px)] w-full">
        {activeView === 'timer' ? <TimerView /> : <MindPalaceView />}
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
