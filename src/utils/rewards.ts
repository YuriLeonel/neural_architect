export function calculateReward(
  durationMinutes: number,
  multiplier: number,
): number {
  return durationMinutes * 10 * multiplier;
}
