import { useEffect } from 'react';
import { useTimerStore } from '@/stores/setup';
import { formatTime } from '@neural-architect/shared/utils';
import { TIMER_PHASES } from '@neural-architect/shared/constants';

export function TimerDisplay() {
  const timeRemaining = useTimerStore((state) => state.timeRemaining);
  const phase = useTimerStore((state) => state.phase);
  const isRunning = useTimerStore((state) => state.isRunning);
  const tick = useTimerStore((state) => state.tick);

  // Set up interval to call tick() every second when timer is running
  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const intervalId = setInterval(() => {
      tick();
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning, tick]);

  const phaseLabels: Record<string, string> = {
    [TIMER_PHASES.WORK]: 'Work',
    [TIMER_PHASES.SHORT_BREAK]: 'Short Break',
    [TIMER_PHASES.LONG_BREAK]: 'Long Break',
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
        {phaseLabels[phase] || phase}
      </div>
      <div className="text-7xl font-mono font-bold text-foreground">
        {formatTime(timeRemaining)}
      </div>
    </div>
  );
}
