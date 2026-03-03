import { create } from 'zustand';
import { persist, type PersistOptions } from 'zustand/middleware';
import { calculateLevel } from '../constants/evolution';
import type { EnvironmentType, MindPalaceState, SessionCategory } from '../types';

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
  distributeXp: (category: SessionCategory, tagIds: string[], totalXp: number) => void;
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
              },
            },
          }));
        },
        distributeXp: (category: SessionCategory, tagIds: string[], totalXp: number) => {
          if (!Number.isFinite(totalXp) || totalXp <= 0) {
            return;
          }

          if (tagIds.length > 0) {
            const baseXp = Math.floor(totalXp / tagIds.length);
            const remainder = totalXp - baseXp * tagIds.length;

            set((state) => {
              const updatedNeurons = { ...state.neurons };

              tagIds.forEach((tagId, index) => {
                const gainedXp = baseXp + (index < remainder ? 1 : 0);
                const neuron = updatedNeurons[tagId] ?? {
                  id: tagId,
                  label: getTagLabelFromId(tagId),
                  totalXp: 0,
                  level: 1,
                  unlocked: false,
                };
                const nextTotalXp = neuron.totalXp + gainedXp;

                updatedNeurons[tagId] = {
                  ...neuron,
                  totalXp: nextTotalXp,
                  level: calculateLevel(nextTotalXp),
                  unlocked: nextTotalXp > 0,
                };
              });

              return { neurons: updatedNeurons };
            });
            return;
          }

          if (category === 'custom') {
            return;
          }

          const categoryNeuronId = getCategoryNeuronId(category);
          const categoryLabel = CATEGORY_NEURON_LABELS[category];

          set((state) => {
            const neuron = state.neurons[categoryNeuronId] ?? {
              id: categoryNeuronId,
              label: categoryLabel,
              totalXp: 0,
              level: 1,
              unlocked: false,
            };
            const nextTotalXp = neuron.totalXp + totalXp;

            return {
              neurons: {
                ...state.neurons,
                [categoryNeuronId]: {
                  ...neuron,
                  totalXp: nextTotalXp,
                  level: calculateLevel(nextTotalXp),
                  unlocked: nextTotalXp > 0,
                },
              },
            };
          });
        },
      }),
      {
        name: 'neural-architect-palace',
        storage,
      },
    ),
  );
}
