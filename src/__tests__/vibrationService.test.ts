import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('vibrationService', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('calls navigator.vibrate with [100, 50, 100] pattern', async () => {
    const vibrate = vi.fn();
    vi.stubGlobal('navigator', { vibrate });

    const { playCompletionVibration } = await import('@/utils/vibrationService');
    playCompletionVibration();

    expect(vibrate).toHaveBeenCalledWith([100, 50, 100]);
  });

  it('does nothing when vibrate is not supported', async () => {
    vi.stubGlobal('navigator', {});

    const { playCompletionVibration, isVibrationSupported } = await import('@/utils/vibrationService');
    expect(isVibrationSupported()).toBe(false);
    expect(() => playCompletionVibration()).not.toThrow();
  });

  it('reports vibration support correctly', async () => {
    vi.stubGlobal('navigator', { vibrate: vi.fn() });

    const { isVibrationSupported } = await import('@/utils/vibrationService');
    expect(isVibrationSupported()).toBe(true);
  });
});
