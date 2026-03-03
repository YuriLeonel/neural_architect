import { useMemo } from 'react';
import { usePalaceStore } from '@/stores/setup';
import { BackgroundLayer } from './BackgroundLayer';
import { EnvironmentSelector } from './EnvironmentSelector';
import { NeuronMap } from './NeuronMap';

export function MindPalaceView() {
  const activeEnvironment = usePalaceStore((state) => state.activeEnvironment);
  const customBackgroundUrl = usePalaceStore((state) => state.customBackgroundUrl);
  const neurons = usePalaceStore((state) => state.neurons);

  const unlockedCount = useMemo(
    () => Object.values(neurons).filter((neuron) => neuron.unlocked).length,
    [neurons],
  );

  return (
    <section
      className="relative min-h-[calc(100vh-73px)] w-full overflow-hidden bg-background-secondary/20"
      aria-label="Mind Palace"
    >
      <BackgroundLayer environment={activeEnvironment} customBackgroundUrl={customBackgroundUrl} />
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/45 via-black/35 to-black/50" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-8">
        <div className="space-y-3 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-white drop-shadow-sm">Mind Palace</h2>
          <p className="text-sm text-white/85">Watch your XP growth take shape as living neurons.</p>
        </div>

        <NeuronMap />

        <div className="rounded-2xl border border-white/20 bg-black/35 p-5 text-sm shadow-xl backdrop-blur-md">
          <p className="text-white/80">Unlocked neurons</p>
          <p className="mt-1 text-2xl font-semibold text-white">{unlockedCount}</p>
          <p className="mt-2 text-xs text-white/85">
            Active environment:{' '}
            <span className="font-medium capitalize text-white">{activeEnvironment.replace('_', ' ')}</span>
          </p>
        </div>

        <div className="mt-auto">
          <EnvironmentSelector />
        </div>
      </div>
    </section>
  );
}
