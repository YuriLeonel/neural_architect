import { describe, it, expect } from 'vitest';
import { formatTime } from '@/utils/formatTime';

describe('formatTime', () => {
  it('formats 90 seconds as "01:30"', () => {
    expect(formatTime(90)).toBe('01:30');
  });

  it('formats 0 seconds as "00:00"', () => {
    expect(formatTime(0)).toBe('00:00');
  });

  it('clamps negative seconds to "00:00"', () => {
    expect(formatTime(-5)).toBe('00:00');
  });

  it('formats 3661 seconds as "61:01"', () => {
    expect(formatTime(3661)).toBe('61:01');
  });

  it('formats 59 seconds as "00:59"', () => {
    expect(formatTime(59)).toBe('00:59');
  });
});
