import { useTimerStore } from '@/stores/setup';

export function TimerControls() {
  const isRunning = useTimerStore((state) => state.isRunning);
  const isPaused = useTimerStore((state) => state.isPaused);
  const start = useTimerStore((state) => state.start);
  const pause = useTimerStore((state) => state.pause);
  const resume = useTimerStore((state) => state.resume);
  const reset = useTimerStore((state) => state.reset);

  const handleStartPause = () => {
    if (isRunning) {
      pause();
    } else if (isPaused) {
      resume();
    } else {
      start();
    }
  };

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={handleStartPause}
        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        {isRunning ? 'Pause' : isPaused ? 'Resume' : 'Start'}
      </button>
      <button
        onClick={reset}
        className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
      >
        Reset
      </button>
    </div>
  );
}
