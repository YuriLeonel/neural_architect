import { useMemo } from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useTimerStore } from '@/stores/setup';

const FOCUS_MIN_MINUTES = 5;
const FOCUS_MAX_MINUTES = 60;
const BREAK_MIN_MINUTES = 5;
const BREAK_MAX_MINUTES = 30;
const STEP_INTERVAL_MINUTES = 5;

function toSeconds(minutes: number): number {
  return Math.round(minutes * 60);
}

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
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <RemoveIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        <output className="min-w-20 text-center text-sm font-semibold text-foreground">
          {value} min
        </output>
        <button
          type="button"
          onClick={() => onChange(value + step)}
          disabled={!canIncrease}
          aria-label={`Increase ${label.toLowerCase()}`}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <AddIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export function IntervalConfig() {
  const config = useTimerStore((state) => state.config);
  const setConfig = useTimerStore((state) => state.setConfig);

  const focusMinutes = useMemo(
    () =>
      normalizeToStep(
        config.focusInterval / 60,
        FOCUS_MIN_MINUTES,
        FOCUS_MAX_MINUTES,
        STEP_INTERVAL_MINUTES,
      ),
    [config.focusInterval],
  );

  const breakMinutes = useMemo(
    () =>
      normalizeToStep(
        config.breakInterval / 60,
        BREAK_MIN_MINUTES,
        BREAK_MAX_MINUTES,
        STEP_INTERVAL_MINUTES,
      ),
    [config.breakInterval],
  );

  return (
    <section className="w-full max-w-md space-y-3" aria-label="Interval configuration">
      <IntervalStepper
        label="Focus Interval"
        value={focusMinutes}
        min={FOCUS_MIN_MINUTES}
        max={FOCUS_MAX_MINUTES}
        step={STEP_INTERVAL_MINUTES}
        onChange={(nextValue) => {
          const normalized = normalizeToStep(
            nextValue,
            FOCUS_MIN_MINUTES,
            FOCUS_MAX_MINUTES,
            STEP_INTERVAL_MINUTES,
          );
          setConfig({ focusInterval: toSeconds(normalized) });
        }}
      />
      <IntervalStepper
        label="Break Interval"
        value={breakMinutes}
        min={BREAK_MIN_MINUTES}
        max={BREAK_MAX_MINUTES}
        step={STEP_INTERVAL_MINUTES}
        onChange={(nextValue) => {
          const normalized = normalizeToStep(
            nextValue,
            BREAK_MIN_MINUTES,
            BREAK_MAX_MINUTES,
            STEP_INTERVAL_MINUTES,
          );
          setConfig({ breakInterval: toSeconds(normalized) });
        }}
      />
    </section>
  );
}
