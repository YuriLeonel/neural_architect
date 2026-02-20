const BASE_EXP_MULTIPLIER = 100;
const EXP_CURVE_EXPONENT = 1.5;

export function calculateExperienceToNextLevel(level: number): number {
  return Math.floor(BASE_EXP_MULTIPLIER * Math.pow(level, EXP_CURVE_EXPONENT));
}

export function calculateTotalExperienceForLevel(targetLevel: number): number {
  let total = 0;
  for (let i = 1; i < targetLevel; i++) {
    total += calculateExperienceToNextLevel(i);
  }
  return total;
}

export function calculateLevel(totalExperience: number): number {
  let level = 1;
  let expRequired = 0;

  while (expRequired <= totalExperience) {
    expRequired += calculateExperienceToNextLevel(level);
    if (expRequired > totalExperience) {
      break;
    }
    level++;
  }

  return level;
}

const BASE_NEURON_COUNT = 3;
const NEURON_GROWTH_RATE = 1.15;

export function calculateNeuronCount(level: number): number {
  return Math.floor(BASE_NEURON_COUNT * Math.pow(NEURON_GROWTH_RATE, level - 1));
}

const CONNECTION_DENSITY = 1.5;

export function calculateConnectionCount(level: number): number {
  const neuronCount = calculateNeuronCount(level);
  return Math.floor(neuronCount * CONNECTION_DENSITY * Math.pow(level, 0.3));
}

export const EXPERIENCE_REWARDS = {
  WORK_SESSION: 50,
  SHORT_BREAK: 10,
  LONG_BREAK: 25,
  TASK_COMPLETION: 20,
  DAILY_STREAK: 15,
  MILESTONE: 100,
} as const;

export const LEVEL_MILESTONES = [
  { level: 5, feature: 'unlock_intermediate_architecture' },
  { level: 10, feature: 'unlock_advanced_visualizations' },
  { level: 15, feature: 'unlock_advanced_architecture' },
  { level: 20, feature: 'unlock_custom_themes' },
  { level: 25, feature: 'unlock_expert_architecture' },
  { level: 30, feature: 'unlock_network_customization' },
  { level: 35, feature: 'unlock_master_architecture' },
  { level: 40, feature: 'unlock_advanced_analytics' },
  { level: 50, feature: 'unlock_legendary_architecture' },
] as const;
