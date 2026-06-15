import { create } from 'zustand';
import { persist, type PersistOptions } from 'zustand/middleware';
import { calculateLevel } from '../constants/evolution';
import { createId } from '../utils';
import type { EnvironmentType, MindPalaceState, NeuronState, SessionCategory, XpActivityEntry } from '../types';

const CATEGORY_NEURON_LABELS: Record<Exclude<SessionCategory, 'custom'>, string> = {
  work: 'Work',
  study: 'Study',
  read: 'Read',
};

function getCategoryNeuronId(category: Exclude<SessionCategory, 'custom'>): string {
  return `cat:${category}`;
}

function getTagLabelFromId(tagId: string): string {
  return tagId
    .replace(/^tag_/, '')
    .replace(/[_-]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

export interface PalaceStore extends MindPalaceState {
  setCategoryBackground: (
    category: SessionCategory,
    environment: EnvironmentType,
    customUrl?: string,
  ) => void;
  distributeXp: (category: SessionCategory, tagIds: string[], totalXp: number) => XpActivityEntry[];
  ensureNeuron: (id: string, label: string) => void;
}

export function createPalaceStore(storage: PersistOptions<PalaceStore>['storage']) {
  return create<PalaceStore>()(
    persist<PalaceStore>(
      (set, get): PalaceStore => ({
        categoryBackgrounds: {
          work: 'coffee_shop',
          study: 'library',
          read: 'house',
          custom: 'custom',
        },
        customBackgroundUrl: null,
        neurons: {},
        xpActivityLog: [],
        setCategoryBackground: (
          category: SessionCategory,
          environment: EnvironmentType,
          customUrl?: string,
        ) => {
          set((state) => ({
            categoryBackgrounds: {
              ...state.categoryBackgrounds,
              [category]: environment,
            },
            customBackgroundUrl:
              environment === 'custom'
                ? (customUrl ?? state.customBackgroundUrl)
                : state.customBackgroundUrl,
          }));
        },
        ensureNeuron: (id: string, label: string) => {
          const existingNeuron = get().neurons[id];
          if (existingNeuron) {
            if (existingNeuron.label !== label) {
              set((state) => ({
                neurons: {
                  ...state.neurons,
                  [id]: {
                    ...existingNeuron,
                    label,
                    lastXpGained: typeof existingNeuron.lastXpGained === 'number' ? existingNeuron.lastXpGained : 0,
                    lastLeveledUpAt: typeof existingNeuron.lastLeveledUpAt === 'string' ? existingNeuron.lastLeveledUpAt : null,
                  },
                },
              }));
            }
            return;
          }

          set((state) => ({
            neurons: {
              ...state.neurons,
              [id]: {
                id,
                label,
                totalXp: 0,
                level: 1,
                unlocked: false,
                lastXpGained: 0,
                lastLeveledUpAt: null,
              },
            },
          }));
        },
        distributeXp: (category: SessionCategory, tagIds: string[], totalXp: number) => {
          if (!Number.isFinite(totalXp) || totalXp <= 0) {
            return [];
          }

          const entries: XpActivityEntry[] = [];
          const now = new Date().toISOString();

          if (tagIds.length > 0) {
            const baseXp = Math.floor(totalXp / tagIds.length);
            const remainder = totalXp - baseXp * tagIds.length;

            set((state) => {
              const updatedNeurons = { ...state.neurons };

              tagIds.forEach((tagId, index) => {
                const gainedXp = baseXp + (index < remainder ? 1 : 0);
                const existing = updatedNeurons[tagId];
                const neuron: NeuronState = existing ?? {
                  id: tagId,
                  label: getTagLabelFromId(tagId),
                  totalXp: 0,
                  level: 1,
                  unlocked: false,
                  lastXpGained: 0,
                  lastLeveledUpAt: null,
                };
                const nextTotalXp = neuron.totalXp + gainedXp;
                const newLevel = calculateLevel(nextTotalXp);
                const leveledUp = newLevel > neuron.level;

                updatedNeurons[tagId] = {
                  ...neuron,
                  totalXp: nextTotalXp,
                  level: newLevel,
                  unlocked: nextTotalXp > 0,
                  lastXpGained: gainedXp,
                  lastLeveledUpAt: leveledUp ? now : (neuron.lastLeveledUpAt ?? null),
                };

                entries.push({
                  id: createId('xp_activity'),
                  neuronLabel: neuron.label,
                  neuronId: tagId,
                  xpGained: gainedXp,
                  source: 'tag',
                  sourceLabel: neuron.label,
                  sessionCategory: category,
                  leveledUp,
                  newLevel,
                  occurredAt: now,
                });
              });

              return { neurons: updatedNeurons };
            });
          } else if (category !== 'custom') {
            const categoryNeuronId = getCategoryNeuronId(category);
            const categoryLabel = CATEGORY_NEURON_LABELS[category];

            set((state) => {
              const existing = state.neurons[categoryNeuronId];
              const neuron: NeuronState = existing ?? {
                id: categoryNeuronId,
                label: categoryLabel,
                totalXp: 0,
                level: 1,
                unlocked: false,
                lastXpGained: 0,
                lastLeveledUpAt: null,
              };
              const nextTotalXp = neuron.totalXp + totalXp;
              const newLevel = calculateLevel(nextTotalXp);
              const leveledUp = newLevel > neuron.level;

              entries.push({
                id: createId('xp_activity'),
                neuronLabel: neuron.label,
                neuronId: categoryNeuronId,
                xpGained: totalXp,
                source: 'category',
                sourceLabel: categoryLabel,
                sessionCategory: category,
                leveledUp,
                newLevel,
                occurredAt: now,
              });

              return {
                neurons: {
                  ...state.neurons,
                  [categoryNeuronId]: {
                    ...neuron,
                    totalXp: nextTotalXp,
                    level: newLevel,
                    unlocked: nextTotalXp > 0,
                    lastXpGained: totalXp,
                    lastLeveledUpAt: leveledUp ? now : (neuron.lastLeveledUpAt ?? null),
                  },
                },
              };
            });
          }

          if (entries.length > 0) {
            set((state) => ({
              xpActivityLog: [...state.xpActivityLog, ...entries].slice(-50),
            }));
          }

          return entries;
        },
      }),
      {
        name: 'neural-architect-palace',
        storage,
        onRehydrateStorage: () => (state) => {
          if (state) {
            state.neurons = Object.fromEntries(
              Object.entries(state.neurons).map(([id, neuron]) => [
                id,
                {
                  ...neuron,
                  lastXpGained: typeof neuron.lastXpGained === 'number' ? neuron.lastXpGained : 0,
                  lastLeveledUpAt: typeof neuron.lastLeveledUpAt === 'string' ? neuron.lastLeveledUpAt : null,
                },
              ]),
            );
            state.xpActivityLog = Array.isArray(state.xpActivityLog)
              ? state.xpActivityLog.slice(-50)
              : [];
          }
        },
      },
    ),
  );
}
