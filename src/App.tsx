import { useEffect, useState } from 'react';
import { useTimerStore } from '@/stores/setup';
import { Header, MindPalaceView, SettingsSidebar, TimerView } from '@/components';
import { SystemFlowView, XpToast } from '@/components/palace';
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

  useEffect(() => {
    const handler = (e: Event) => {
      setActiveView((e as CustomEvent).detail as AppView);
    };
    window.addEventListener('neural-architect:navigate', handler);
    return () => window.removeEventListener('neural-architect:navigate', handler);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        onGoHome={() => setActiveView('timer')}
      />
      <main className="min-h-[calc(100vh-73px)] w-full">
        {activeView === 'timer' ? <TimerView /> : activeView === 'palace' ? <MindPalaceView /> : <SystemFlowView />}
      </main>
      <SettingsSidebar
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        activeView={activeView}
        onChangeView={setActiveView}
      />
      <XpToast />
    </div>
  );
}

export default App;
