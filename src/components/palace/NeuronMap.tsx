import { useMemo } from 'react';
import { usePalaceStore, useTimerStore } from '@/stores/setup';
import { NeuronNode } from './NeuronNode';
import { calculatePositions, getActiveNeuronIds, sortNeurons } from './neuronUtils';

export function NeuronMap() {
  const neurons = usePalaceStore((state) => state.neurons);
  const isRunning = useTimerStore((state) => state.isRunning);
  const phase = useTimerStore((state) => state.phase);
  const category = useTimerStore((state) => state.config.currentCategory);
  const activeTags = useTimerStore((state) => state.config.activeTags);

  const sortedNeurons = useMemo(() => Object.values(neurons).sort(sortNeurons), [neurons]);

  const activeNeuronIds = useMemo(
    () => getActiveNeuronIds(isRunning, phase, category, activeTags),
    [isRunning, phase, category, activeTags],
  );

  const positionedNeurons = useMemo(
    () => calculatePositions(sortedNeurons),
    [sortedNeurons],
  );

  return (
    <section
      className="relative flex min-h-[30rem] flex-1 items-center justify-center overflow-hidden rounded-3xl border border-white/20 bg-black/30 p-4 shadow-2xl backdrop-blur-md sm:p-6"
      aria-label="Neuron map"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1),_transparent_65%)]" />
      {positionedNeurons.length === 0 ? (
        <p className="relative z-10 max-w-sm text-center text-sm text-white/85">
          Complete a focus session to awaken your first neuron.
        </p>
      ) : (
        <div className="relative h-[30rem] w-full">
          {positionedNeurons.map(({ neuron, x, y }) => (
            <div
              key={neuron.id}
              style={{ left: `${x}%`, top: `${y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
            >
              <NeuronNode neuron={neuron} isActive={activeNeuronIds.has(neuron.id)} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
