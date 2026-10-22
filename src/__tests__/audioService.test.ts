import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('audioService', () => {
  let createOscillator: ReturnType<typeof vi.fn>;
  let createGain: ReturnType<typeof vi.fn>;
  let resume: ReturnType<typeof vi.fn>;
  let mockContext: {
    currentTime: number;
    state: string;
    destination: object;
    createOscillator: ReturnType<typeof vi.fn>;
    createGain: ReturnType<typeof vi.fn>;
    resume: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.resetModules();

    createOscillator = vi.fn(() => ({
      type: 'sine',
      frequency: { setValueAtTime: vi.fn() },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    }));
    createGain = vi.fn(() => ({
      gain: {
        setValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
    }));
    resume = vi.fn().mockResolvedValue(undefined);

    mockContext = {
      currentTime: 0,
      state: 'running',
      destination: {},
      createOscillator,
      createGain,
      resume,
    };

    function MockAudioContext() {
      return mockContext;
    }

    vi.stubGlobal('AudioContext', MockAudioContext);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('creates three oscillators for the chime', async () => {
    const { playCompletionChime } = await import('@/utils/audioService');
    playCompletionChime();

    expect(createOscillator).toHaveBeenCalledTimes(3);
    expect(createGain).toHaveBeenCalledTimes(3);
  });

  it('does nothing when AudioContext is unavailable', async () => {
    vi.unstubAllGlobals();

    const { playCompletionChime } = await import('@/utils/audioService');
    expect(() => playCompletionChime()).not.toThrow();
  });

  it('resumes context when suspended', async () => {
    mockContext.state = 'suspended';
    const { playCompletionChime } = await import('@/utils/audioService');
    playCompletionChime();

    expect(resume).toHaveBeenCalled();
  });
});
