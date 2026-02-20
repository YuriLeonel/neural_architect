/**
 * Formats seconds into MM:SS format
 * @param seconds - Total seconds to format (can be negative, will be clamped to 0)
 * @returns Formatted time string in MM:SS format (e.g., "25:00", "05:30")
 */
export function formatTime(seconds: number): string {
  // Clamp to 0 to handle negative values
  const clampedSeconds = Math.max(0, Math.floor(seconds));
  
  const minutes = Math.floor(clampedSeconds / 60);
  const remainingSeconds = clampedSeconds % 60;
  
  // Format with leading zeros
  const minutesStr = minutes.toString().padStart(2, '0');
  const secondsStr = remainingSeconds.toString().padStart(2, '0');
  
  return `${minutesStr}:${secondsStr}`;
}
