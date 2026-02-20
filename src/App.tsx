import { useEffect } from 'react';
import { useTimerStore } from '@/stores/setup';
import { TimerDisplay } from '@/components/TimerDisplay';
import { TimerControls } from '@/components/TimerControls';

function App() {
  const tick = useTimerStore((state) => state.tick);

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
    <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground">
      <h1 className="text-4xl font-bold text-center mb-8">Neural Architect</h1>
      <p className="text-center text-muted-foreground mb-12">
        Gamified Pomodoro Application
      </p>
      <div className="flex flex-col items-center justify-center space-y-8">
        <TimerDisplay />
        <TimerControls />
      </div>
    </div>
  );
}

export default App;
