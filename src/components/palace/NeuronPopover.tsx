import { useEffect, useRef } from 'react';
import { calculateExperienceToNextLevel } from '@/constants/evolution';
import type { NeuronState } from '@/types';

interface NeuronPopoverProps {
  neuron: NeuronState;
  x: number;
  y: number;
  onClose: () => void;
}

export function NeuronPopover({ neuron, x, y, onClose }: NeuronPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  const xpToNext = calculateExperienceToNextLevel(neuron.level);
  const pct = Math.min(100, Math.round((neuron.totalXp / xpToNext) * 100));
  const maxLevel = neuron.level >= 50;

  return (
    <div
      ref={ref}
      role="dialog"
      className="absolute z-50 w-64 -translate-x-1/2 -translate-y-full -mt-4 rounded-xl border border-white/20 bg-black/80 p-4 shadow-2xl backdrop-blur-xl"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-white">{neuron.label}</span>
        <span className="text-xs font-medium text-white/70 bg-white/10 rounded-full px-2 py-0.5">Lv {neuron.level}</span>
      </div>
      <div className="mb-3">
        <div className="flex justify-between text-xs text-white/70 mb-1">
          <span>{neuron.totalXp.toLocaleString()} XP</span>
          {maxLevel ? <span>MAX LEVEL</span> : <span>{xpToNext.toLocaleString()} to next</span>}
        </div>
        {!maxLevel && (
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${pct}%` }} />
          </div>
        )}
      </div>
      {neuron.lastXpGained > 0 && (
        <p className="text-xs text-white/80">
          +{neuron.lastXpGained} XP from last session
          {neuron.lastLeveledUpAt && <span className="ml-1 text-yellow-400">✦ Level up!</span>}
        </p>
      )}
      {neuron.lastXpGained === 0 && neuron.totalXp === 0 && (
        <p className="text-xs text-white/50">No activity yet</p>
      )}
    </div>
  );
}
