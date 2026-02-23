import { useEffect } from 'react';
import { useTimerStore } from '@/stores/setup';
import { formatTime } from '@/utils';

const RING_RADIUS = 140;
const RING_STROKE_WIDTH = 10;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export function TimerDisplay() {
  const timeRemaining = useTimerStore((state) => state.timeRemaining);
  const totalDuration = useTimerStore((state) => state.totalDuration);
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

  const boundedRemaining = Math.max(0, timeRemaining);
  const normalizedTotal = totalDuration > 0 ? totalDuration : 1;
  const progress = Math.min(1, boundedRemaining / normalizedTotal);
  const ringOffset = RING_CIRCUMFERENCE * (1 - progress);

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="relative h-96 w-96 sm:h-[28rem] sm:w-[28rem]">
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
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
          <span className="font-mono text-6xl font-bold tracking-tight text-foreground sm:text-7xl md:text-8xl">
            {formatTime(timeRemaining)}
          </span>
        </div>
      </div>
    </div>
  );
}
