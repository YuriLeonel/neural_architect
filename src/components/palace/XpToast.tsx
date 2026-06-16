import { useCallback, useEffect, useState } from 'react';
import type { XpActivityEntry } from '@/types';

const XP_TOAST_EVENT = 'neural-architect:xp-toast';

export function dispatchXpToast(entries: XpActivityEntry[]) {
  window.dispatchEvent(new CustomEvent(XP_TOAST_EVENT, { detail: entries }));
}

export function XpToast() {
  const [visible, setVisible] = useState(false);
  const [entries, setEntries] = useState<XpActivityEntry[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      setEntries((e as CustomEvent).detail as XpActivityEntry[]);
      setVisible(true);
    };
    window.addEventListener(XP_TOAST_EVENT, handler);
    return () => window.removeEventListener(XP_TOAST_EVENT, handler);
  }, []);

  const dismiss = useCallback(() => setVisible(false), []);
  const goPalace = useCallback(() => {
    window.dispatchEvent(new CustomEvent('neural-architect:navigate', { detail: 'palace' }));
    dismiss();
  }, [dismiss]);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(dismiss, 6000);
    return () => clearTimeout(t);
  }, [visible, dismiss]);

  if (!visible || entries.length === 0) return null;

  const totalXp = entries.reduce((s, e) => s + e.xpGained, 0);
  const shown = entries.slice(0, 5);

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm rounded-xl border border-white/20 bg-black/80 p-4 shadow-2xl backdrop-blur-xl">
      <button type="button" onClick={dismiss} className="absolute top-2 right-2 text-white/50 hover:text-white/80 text-sm" aria-label="Dismiss">✕</button>
      <p className="text-sm font-semibold text-white mb-2">Focus complete! +{totalXp} XP</p>
      <ul className="space-y-1">
        {shown.map((entry) => (
          <li key={entry.id} className="flex justify-between text-xs text-white/80">
            <span>→ {entry.sourceLabel}</span>
            <span>+{entry.xpGained} XP{entry.leveledUp && <span className="ml-1 text-yellow-400">✦</span>}</span>
          </li>
        ))}
      </ul>
      {entries.length > 5 && <p className="text-xs text-white/50 mt-1">and {entries.length - 5} more...</p>}
      <button type="button" onClick={goPalace} className="mt-2 text-xs text-primary hover:text-primary/80 underline">View in Mind Palace</button>
    </div>
  );
}
