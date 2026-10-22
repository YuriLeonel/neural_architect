const VIBRATION_PATTERN: number[] = [100, 50, 100];

export function isVibrationSupported(): boolean {
  return typeof navigator !== 'undefined' && 'vibrate' in navigator;
}

export function playCompletionVibration(): void {
  if (!isVibrationSupported()) {
    return;
  }

  try {
    navigator.vibrate(VIBRATION_PATTERN);
  } catch {
  }
}
