import { describe, it, expect } from 'vitest';
import { calculateReward } from '@/utils/rewards';

describe('calculateReward', () => {
  it('returns 250 for 25 minutes with multiplier 1', () => {
    expect(calculateReward(25, 1)).toBe(250);
  });

  it('returns 500 for 25 minutes with multiplier 2', () => {
    expect(calculateReward(25, 2)).toBe(500);
  });

  it('returns 0 for 0 minutes with multiplier 1', () => {
    expect(calculateReward(0, 1)).toBe(0);
  });

  it('returns 5 for 0.5 minutes with multiplier 1', () => {
    expect(calculateReward(0.5, 1)).toBe(5);
  });
});
