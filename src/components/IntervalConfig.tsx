import { useMemo } from 'react';
import { useTimerStore } from '@/stores/setup';

const WORK_MIN_MINUTES = 5;
const WORK_MAX_MINUTES = 60;
const WORK_STEP_MINUTES = 5;

const BREAK_MIN_MINUTES = 1;
const BREAK_MAX_MINUTES = 30;
const BREAK_STEP_MINUTES = 1;

function normalizeToStep(value: number, min: number, max: number, step: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }

  const clamped = Math.min(max, Math.max(min, value));
  const steps = Math.round((clamped - min) / step);
  return min + steps * step;
}

interface StepperProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (nextValue: number) => void;
}

function IntervalStepper({ label, value, min, max, step, onChange }: StepperProps) {
  const canDecrease = value > min;
  const canIncrease = value < max;

  return (
    <div className="flex items-center justify-between rounded-lg bg-muted px-4 py-3">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(value - step)}
          disabled={!canDecrease}
          aria-label={`Decrease ${label.toLowerCase()}`}
          className="h-9 w-9 rounded-md border border-border bg-background text-lg text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          -
        </button>
        <output className="min-w-20 text-center text-sm font-semibold text-foreground">
          {value} min
        </output>
        <button
          type="button"
          onClick={() => onChange(value + step)}
          disabled={!canIncrease}
          aria-label={`Increase ${label.toLowerCase()}`}
          className="h-9 w-9 rounded-md border border-border bg-background text-lg text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          +
        </button>
      </div>
    </div>
  );
}

export function IntervalConfig() {
  const config = useTimerStore((state) => state.config);
  const setConfig = useTimerStore((state) => state.setConfig);

  const workMinutes = useMemo(
    () =>
      normalizeToStep(
        config.workInterval / 60,
        WORK_MIN_MINUTES,
        WORK_MAX_MINUTES,
        WORK_STEP_MINUTES,
      ),
    [config.workInterval],
  );

  const breakMinutes = useMemo(
    () =>
      normalizeToStep(
        config.breakInterval / 60,
        BREAK_MIN_MINUTES,
        BREAK_MAX_MINUTES,
        BREAK_STEP_MINUTES,
      ),
    [config.breakInterval],
  );

  return (
    <section className="w-full max-w-md space-y-3" aria-label="Interval configuration">
      <IntervalStepper
        label="Work Interval"
        value={workMinutes}
        min={WORK_MIN_MINUTES}
        max={WORK_MAX_MINUTES}
        step={WORK_STEP_MINUTES}
        onChange={(nextValue) => {
          const normalized = normalizeToStep(
            nextValue,
            WORK_MIN_MINUTES,
            WORK_MAX_MINUTES,
            WORK_STEP_MINUTES,
          );
          setConfig({ workInterval: normalized * 60 });
        }}
      />
      <IntervalStepper
        label="Break Interval"
        value={breakMinutes}
        min={BREAK_MIN_MINUTES}
        max={BREAK_MAX_MINUTES}
        step={BREAK_STEP_MINUTES}
        onChange={(nextValue) => {
          const normalized = normalizeToStep(
            nextValue,
            BREAK_MIN_MINUTES,
            BREAK_MAX_MINUTES,
            BREAK_STEP_MINUTES,
          );
          setConfig({ breakInterval: normalized * 60 });
        }}
      />
    </section>
  );
}
