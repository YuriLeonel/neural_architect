import { useEffect } from 'react';
import { useTimerStore } from '@/stores/setup';
import { TIMER_PHASES } from '@/constants';
import { formatTime } from '@/utils';

const RING_RADIUS = 140;
const RING_STROKE_WIDTH = 10;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export function TimerDisplay() {
  const timeRemaining = useTimerStore((state) => state.timeRemaining);
  const totalDuration = useTimerStore((state) => state.totalDuration);
  const phase = useTimerStore((state) => state.phase);
  const isRunning = useTimerStore((state) => state.isRunning);
  const tick = useTimerStore((state) => state.tick);

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

  const boundedRemaining = Math.max(0, timeRemaining);
  const normalizedTotal = totalDuration > 0 ? totalDuration : 1;
  const progress = Math.min(1, boundedRemaining / normalizedTotal);
  const ringOffset = RING_CIRCUMFERENCE * (1 - progress);

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:text-sm">
        {phaseLabels[phase] ?? phase}
      </div>
      <div className="relative h-80 w-80 sm:h-96 sm:w-96">
        <svg
          className="h-full w-full -rotate-90"
          viewBox="0 0 320 320"
          role="img"
          aria-label="Timer progress"
        >
          <circle
            cx="160"
            cy="160"
            r={RING_RADIUS}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={RING_STROKE_WIDTH}
            className="text-muted/40"
          />
          <circle
            cx="160"
            cy="160"
            r={RING_RADIUS}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={RING_STROKE_WIDTH}
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={ringOffset}
            strokeLinecap="round"
            className="text-primary transition-all duration-500 ease-linear"
          />
        </svg>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-7xl font-bold tracking-tight text-foreground sm:text-8xl md:text-9xl">
            {formatTime(timeRemaining)}
          </span>
        </div>
      </div>
    </div>
  );
}
