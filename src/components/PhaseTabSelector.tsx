import { TIMER_PHASES } from '@/constants';
import { useTimerStore } from '@/stores/setup';
import type { TimerPhase } from '@/types';

interface PhaseTab {
  label: string;
  value: TimerPhase;
}

const PHASE_TABS: PhaseTab[] = [
  { label: 'Focus', value: TIMER_PHASES.WORK },
  { label: 'Break', value: TIMER_PHASES.BREAK },
];

export function PhaseTabSelector() {
  const phase = useTimerStore((state) => state.phase);
  const setPhase = useTimerStore((state) => state.setPhase);

  return (
    <div
      role="tablist"
      aria-label="Timer phases"
      className="inline-flex items-center gap-2 rounded-lg bg-muted p-1"
    >
      {PHASE_TABS.map((tab) => {
        const isActive = phase === tab.value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => setPhase(tab.value)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-background hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
