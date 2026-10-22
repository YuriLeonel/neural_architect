let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  const AudioContextClass =
    (globalThis as unknown as { AudioContext?: typeof AudioContext }).AudioContext ||
    (globalThis as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioContextClass) {
    return null;
  }

  if (audioContext) {
    return audioContext;
  }

  try {
    audioContext = new AudioContextClass();
    return audioContext;
  } catch {
    return null;
  }
}

function playTone(ctx: AudioContext, frequency: number, startTime: number, duration: number, peakGain: number): void {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency, startTime);

  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(peakGain, startTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(peakGain * 0.3, startTime + 0.2);
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

export function playCompletionChime(): void {
  const ctx = getAudioContext();
  if (!ctx) {
    return;
  }

  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  const startTime = ctx.currentTime;
  const duration = 3;

  playTone(ctx, 523.25, startTime, duration, 0.3);
  playTone(ctx, 659.25, startTime, duration, 0.2);
  playTone(ctx, 783.99, startTime + 0.05, duration - 0.05, 0.15);
}
