export function formatTime(seconds: number): string {
  const clampedSeconds = Math.max(0, Math.floor(seconds));

  const minutes = Math.floor(clampedSeconds / 60);
  const remainingSeconds = clampedSeconds % 60;

  const minutesStr = minutes.toString().padStart(2, '0');
  const secondsStr = remainingSeconds.toString().padStart(2, '0');

  return `${minutesStr}:${secondsStr}`;
}
