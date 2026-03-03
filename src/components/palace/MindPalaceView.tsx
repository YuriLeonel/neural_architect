import { useMemo } from 'react';
import { usePalaceStore } from '@/stores/setup';

export function MindPalaceView() {
  const activeEnvironment = usePalaceStore((state) => state.activeEnvironment);
  const neurons = usePalaceStore((state) => state.neurons);

  const unlockedCount = useMemo(
    () => Object.values(neurons).filter((neuron) => neuron.unlocked).length,
    [neurons],
  );

  return (
    <section
      className="w-full rounded-2xl border border-border bg-background-secondary/40 p-8"
      aria-label="Mind Palace"
    >
      <div className="space-y-3 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Mind Palace</h2>
        <p className="text-sm text-muted-foreground">
          Visualization shell ready. Neuron map and environments are coming in the next step.
        </p>
      </div>

      <div className="mt-8 grid gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-muted-foreground">Active environment</p>
          <p className="mt-1 font-medium capitalize text-foreground">
            {activeEnvironment.replace('_', ' ')}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-muted-foreground">Unlocked neurons</p>
          <p className="mt-1 font-medium text-foreground">{unlockedCount}</p>
        </div>
      </div>
    </section>
  );
}
