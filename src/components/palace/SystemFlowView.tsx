import { useMemo } from 'react';
import { usePalaceStore, useSessionStore, useTimerStore } from '@/stores/setup';
import { getNeuronColor, calculateExperienceToNextLevel, calculateTotalExperienceForLevel } from '@/constants/evolution';
import type { NeuronState, SessionCategory, SessionTag } from '@/types';
import { BackgroundLayer } from './BackgroundLayer';

const CATEGORY_LABELS: Record<SessionCategory, string> = {
  work: 'Work',
  study: 'Study',
  read: 'Reading',
  custom: 'Custom',
};

const FOCUS_DURATION_MINUTES = 25;

function StepCard({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <div className="relative rounded-2xl border border-white/20 bg-black/35 p-6 shadow-xl backdrop-blur-md">
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/80 text-sm font-bold text-primary-foreground">
          {step}
        </span>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export function SystemFlowView() {
  const config = useTimerStore((state) => state.config);
  const tags = useSessionStore((state) => state.tags);
  const neurons = usePalaceStore((state) => state.neurons);

  const currentCategory = useTimerStore((state) => state.config.currentCategory);
  const categoryBackgrounds = usePalaceStore((state) => state.categoryBackgrounds);
  const customBackgroundUrl = usePalaceStore((state) => state.customBackgroundUrl);
  const activeEnvironment = categoryBackgrounds[currentCategory];

  const activeTags = useMemo(
    () => config.activeTags.map((id) => tags[id]).filter((t): t is SessionTag => t !== undefined),
    [config.activeTags, tags],
  );

  const neuronsArray = useMemo(
    () => Object.values(neurons).filter((n) => n.unlocked),
    [neurons],
  );
  const totalXp = useMemo(
    () => neuronsArray.reduce((s, n) => s + n.totalXp, 0),
    [neuronsArray],
  );
  const highestLevel = useMemo(
    () => (neuronsArray.length > 0 ? Math.max(...neuronsArray.map((n) => n.level)) : 0),
    [neuronsArray],
  );

  const affectedNeurons = useMemo(() => {
    if (activeTags.length > 0) {
      return activeTags
        .map((tag) => neuronsArray.find((n) => n.id === tag.id))
        .filter((n): n is NeuronState => n !== undefined);
    }
    return neuronsArray.filter((n) => n.id === config.currentCategory);
  }, [activeTags, neuronsArray, config.currentCategory]);

  const relevantNeurons = affectedNeurons.length > 0 ? affectedNeurons : neuronsArray.slice(0, 3);
  const relevantNeuron = relevantNeurons[0];
  const xpPerSession = 50;

  return (
    <section
      className="relative min-h-[calc(100vh-73px)] w-full overflow-y-auto bg-background-secondary/20"
      aria-label="System Flow"
    >
      <BackgroundLayer environment={activeEnvironment} customBackgroundUrl={customBackgroundUrl} />
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/45 via-black/35 to-black/50 pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8 sm:px-8">
        <div className="space-y-3 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-white drop-shadow-sm">How It Works</h2>
          <p className="text-sm text-white/85">Your focus sessions power a living system of growth.</p>
        </div>

        {/* Step 1: Choose Your Session */}
        <StepCard step={1} title="Choose Your Session">
          <p className="mb-3 text-sm text-white/70">
            Each session has a category and optional tags. These determine where your XP goes.
          </p>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-wide text-white/50">Category</span>
              <span className="rounded-md bg-primary/20 px-2 py-0.5 text-sm text-primary">
                {CATEGORY_LABELS[config.currentCategory]}
              </span>
            </div>
            {activeTags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium uppercase tracking-wide text-white/50">Tags</span>
                {activeTags.map((tag) => (
                  <span
                    key={tag.id}
                    className="rounded-md bg-white/10 px-2 py-0.5 text-sm text-white/80"
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            )}
            {activeTags.length === 0 && (
              <p className="text-sm text-white/50">No tags selected — XP will go to the category neuron.</p>
            )}
          </div>
        </StepCard>

        {/* Step 2: Complete a Focus Session */}
        <StepCard step={2} title="Complete a Focus Session">
          <p className="mb-3 text-sm text-white/70">
            Every completed {FOCUS_DURATION_MINUTES}-minute focus session earns XP.
          </p>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-white/80">
              Session duration: <span className="font-semibold text-white">{FOCUS_DURATION_MINUTES} min</span>
            </p>
            <p className="text-sm text-white/80">
              XP earned: <span className="font-semibold text-white">+{xpPerSession} XP</span>
            </p>
          </div>
        </StepCard>

        {/* Step 3: XP Finds Its Home */}
        <StepCard step={3} title="XP Finds Its Home">
          <p className="mb-3 text-sm text-white/70">
            XP flows to neurons matching your active tags. If no tags are selected, it goes to your category neuron.
          </p>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3 flex items-center gap-2 text-xs text-white/50">
              <span className="rounded bg-white/10 px-2 py-0.5">{activeTags.length > 0 ? 'Tags' : 'Category'}</span>
              <span className="text-white/30">→</span>
              <span className="rounded bg-white/10 px-2 py-0.5">Neurons</span>
            </div>
            <div className="space-y-2">
              {relevantNeurons.length === 0 && (
                <p className="text-sm text-white/50">No matching neurons yet. Complete a session to create them.</p>
              )}
              {relevantNeurons.map((neuron) => (
                <div
                  key={neuron.id}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: getNeuronColor(neuron.level) }}
                    />
                    <span className="text-sm text-white/90">{neuron.label}</span>
                  </div>
                  <span className="text-xs text-white/50">Lv.{neuron.level} ({neuron.totalXp} XP)</span>
                </div>
              ))}
            </div>
          </div>
        </StepCard>

        {/* Step 4: Neurons Grow */}
        <StepCard step={4} title="Neurons Grow">
          <p className="mb-3 text-sm text-white/70">
            When a neuron accumulates enough XP, it levels up. Higher levels unlock new capabilities.
          </p>
          {relevantNeuron ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: getNeuronColor(relevantNeuron.level) }}
                  />
                  <span className="font-medium text-white">{relevantNeuron.label}</span>
                </div>
                <span className="rounded-md bg-white/10 px-2 py-0.5 text-xs text-white/70">
                  Level {relevantNeuron.level}
                </span>
              </div>
              {relevantNeuron.level >= 50 ? (
                <p className="text-xs text-white/50">MAX LEVEL</p>
              ) : (
                <ProgressBar
                  xpInLevel={relevantNeuron.totalXp - calculateTotalExperienceForLevel(relevantNeuron.level)}
                  xpToNext={calculateExperienceToNextLevel(relevantNeuron.level)}
                  color={getNeuronColor(relevantNeuron.level)}
                />
              )}
              {relevantNeuron.lastLeveledUpAt && (
                <p className="text-xs text-white/50">
                  Last leveled up{' '}
                  {Math.floor(
                    (Date.now() - new Date(relevantNeuron.lastLeveledUpAt).getTime()) / 86400000,
                  )}{' '}
                  days ago
                </p>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-white/50">No neurons yet. Start a focus session to grow your first one.</p>
            </div>
          )}
        </StepCard>

        {/* Footer: Your Stats */}
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center shadow-xl backdrop-blur-md">
          <h3 className="mb-4 text-lg font-semibold text-white">Your Progress</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-2xl font-bold text-white">{totalXp}</p>
              <p className="text-xs text-white/60">Total XP</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{neuronsArray.length}</p>
              <p className="text-xs text-white/60">Neurons</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {highestLevel > 0 ? `Lv.${highestLevel}` : '\u2014'}
              </p>
              <p className="text-xs text-white/60">Highest Level</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProgressBar({ xpInLevel, xpToNext, color }: { xpInLevel: number; xpToNext: number; color: string }) {
  return (
    <div className="mb-2">
      <div className="flex items-center justify-between text-xs text-white/50">
        <span>Progress</span>
        <span>
          {xpInLevel} / {xpToNext} XP
        </span>
      </div>
      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${Math.min(100, (xpInLevel / xpToNext) * 100)}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}
