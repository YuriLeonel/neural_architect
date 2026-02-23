export function createId(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  const safePrefix = prefix.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '-') || 'id';
  return `${safePrefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
