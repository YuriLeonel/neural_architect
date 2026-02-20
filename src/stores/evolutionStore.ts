import { create } from 'zustand';
import { persist, type PersistOptions } from 'zustand/middleware';
import type { ArchitectureTier, EvolutionState } from '../types';
import {
  calculateConnectionCount,
  calculateExperienceToNextLevel,
  calculateLevel,
  calculateNeuronCount,
  calculateTotalExperienceForLevel,
} from '../constants/evolution';

export interface EvolutionStore extends EvolutionState {
  addExperience: (amount: number) => void;
  levelUp: () => void;
  unlockFeature: (featureId: string) => void;
  updateNetworkState: (state: Partial<EvolutionState['networkState']>) => void;
}

export function createEvolutionStore(storage: PersistOptions<EvolutionStore>['storage']) {
  return create<EvolutionStore>()(
    persist(
      (set, get) => ({
        level: 1,
        experience: 0,
        experienceToNextLevel: calculateExperienceToNextLevel(1),
        totalExperience: 0,
        neuronCount: calculateNeuronCount(1),
        connectionCount: calculateConnectionCount(1),
        architectureTier: 'basic',
        unlockedFeatures: [],
        networkState: {
          neurons: [],
          connections: [],
        },
        addExperience: (amount: number) => {
          const state = get();
          const newTotalExperience = state.totalExperience + amount;
          const newLevel = calculateLevel(newTotalExperience);
          const wasLevelUp = newLevel > state.level;

          set({
            experience: newTotalExperience - calculateTotalExperienceForLevel(newLevel),
            totalExperience: newTotalExperience,
            level: newLevel,
            experienceToNextLevel: calculateExperienceToNextLevel(newLevel),
            neuronCount: calculateNeuronCount(newLevel),
            connectionCount: calculateConnectionCount(newLevel),
            architectureTier: getArchitectureTier(newLevel),
          });

          if (wasLevelUp) {
            get().levelUp();
          }
        },
        levelUp: () => {
          const state = get();
          console.log(`Level up! Now at level ${state.level}`);
        },
        unlockFeature: (featureId: string) => {
          const state = get();
          if (!state.unlockedFeatures.includes(featureId)) {
            set({
              unlockedFeatures: [...state.unlockedFeatures, featureId],
            });
          }
        },
        updateNetworkState: (networkState) => {
          set((state) => ({
            networkState: {
              ...state.networkState,
              ...networkState,
            },
          }));
        },
      }),
      {
        name: 'neural-architect-evolution',
        storage,
      },
    ),
  );
}

function getArchitectureTier(level: number): ArchitectureTier {
  if (level >= 50) return 'legendary';
  if (level >= 35) return 'master';
  if (level >= 25) return 'expert';
  if (level >= 15) return 'advanced';
  if (level >= 5) return 'intermediate';
  return 'basic';
}
