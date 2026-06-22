import { describe, it, expect } from 'vitest';
import {
  calculateExperienceToNextLevel,
  calculateTotalExperienceForLevel,
  calculateLevel,
  calculateNeuronCount,
  getNeuronColor,
  getArchitectureTier,
  NEURON_LEVEL_COLORS,
} from '@/constants/evolution';

describe('calculateExperienceToNextLevel', () => {
  it('returns 100 for level 1', () => {
    expect(calculateExperienceToNextLevel(1)).toBe(100);
  });

  it('returns 282 for level 2 (floor(100 * 2^1.5))', () => {
    expect(calculateExperienceToNextLevel(2)).toBe(282);
  });
});

describe('calculateTotalExperienceForLevel', () => {
  it('returns 0 for level 1 (no XP needed to reach starting level)', () => {
    expect(calculateTotalExperienceForLevel(1)).toBe(0);
  });

  it('returns 100 for level 2 (XP for level 1)', () => {
    expect(calculateTotalExperienceForLevel(2)).toBe(100);
  });

  it('returns 382 for level 3 (100 + 282)', () => {
    expect(calculateTotalExperienceForLevel(3)).toBe(382);
  });

  it('returns 901 for level 4 (100 + 282 + 519)', () => {
    expect(calculateTotalExperienceForLevel(4)).toBe(901);
  });
});

describe('calculateLevel', () => {
  it('returns 1 for 0 total experience', () => {
    expect(calculateLevel(0)).toBe(1);
  });

  it('returns 1 for 99 total experience (below level-2 threshold)', () => {
    expect(calculateLevel(99)).toBe(1);
  });

  it('returns 2 for exactly 100 total experience', () => {
    expect(calculateLevel(100)).toBe(2);
  });
});

describe('calculateNeuronCount', () => {
  it('returns 3 for level 1', () => {
    expect(calculateNeuronCount(1)).toBe(3);
  });
});

describe('getNeuronColor', () => {
  it('returns BASIC color at level 1', () => {
    expect(getNeuronColor(1)).toBe(NEURON_LEVEL_COLORS.BASIC);
  });

  it('returns INTERMEDIATE color at level 5', () => {
    expect(getNeuronColor(5)).toBe(NEURON_LEVEL_COLORS.INTERMEDIATE);
  });

  it('returns ADVANCED color at level 10', () => {
    expect(getNeuronColor(10)).toBe(NEURON_LEVEL_COLORS.ADVANCED);
  });

  it('returns EXPERT color at level 15', () => {
    expect(getNeuronColor(15)).toBe(NEURON_LEVEL_COLORS.EXPERT);
  });

  it('returns MASTER color at level 20', () => {
    expect(getNeuronColor(20)).toBe(NEURON_LEVEL_COLORS.MASTER);
  });
});

describe('getArchitectureTier', () => {
  it('returns "basic" at level 1', () => {
    expect(getArchitectureTier(1)).toBe('basic');
  });

  it('returns "intermediate" at level 5', () => {
    expect(getArchitectureTier(5)).toBe('intermediate');
  });

  it('returns "advanced" at level 15', () => {
    expect(getArchitectureTier(15)).toBe('advanced');
  });

  it('returns "expert" at level 25', () => {
    expect(getArchitectureTier(25)).toBe('expert');
  });

  it('returns "master" at level 35', () => {
    expect(getArchitectureTier(35)).toBe('master');
  });

  it('returns "legendary" at level 50', () => {
    expect(getArchitectureTier(50)).toBe('legendary');
  });
});
