import { describe, it, expect } from 'vitest';
import { getPhaseDuration } from '@/constants/timer';
import type { PomodoroConfig } from '@/types/session';

const config: PomodoroConfig = {
  focusInterval: 1500,
  breakInterval: 300,
  currentCategory: 'work',
  activeTags: [],
};

describe('getPhaseDuration', () => {
  it('returns focusInterval for the focus phase', () => {
    expect(getPhaseDuration('focus', config)).toBe(config.focusInterval);
  });

  it('returns breakInterval for the break phase', () => {
    expect(getPhaseDuration('break', config)).toBe(config.breakInterval);
  });
});
