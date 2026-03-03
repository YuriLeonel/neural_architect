import { getNeuronColor } from '@/constants/evolution';
import type { NeuronState } from '@/types';

const BASE_SIZE_PX = 56;
const MAX_SIZE_PX = 136;

interface NeuronNodeProps {
  neuron: NeuronState;
  isActive: boolean;
}

function getNeuronSize(level: number): number {
  const scaledSize = BASE_SIZE_PX * (1 + level * 0.1);
  return Math.min(MAX_SIZE_PX, Math.max(BASE_SIZE_PX, Math.round(scaledSize)));
}

export function NeuronNode({ neuron, isActive }: NeuronNodeProps) {
  const unlocked = neuron.unlocked;
  const neuronColor = getNeuronColor(neuron.level);
  const size = getNeuronSize(neuron.level);

  return (
    <article
      className="flex flex-col items-center gap-2 text-center"
      aria-label={`${neuron.label} neuron`}
    >
      <div
        className={[
          'neuron-node relative flex items-center justify-center rounded-full border text-white shadow-xl transition-transform duration-300',
          unlocked ? 'border-white/30' : 'border-white/15',
          unlocked && isActive ? 'animate-neuron-pulse' : '',
          unlocked && !isActive ? 'animate-neuron-glow' : '',
          !unlocked ? 'neuron-node--locked' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          background: `radial-gradient(circle at 30% 25%, rgba(255, 255, 255, 0.3), ${neuronColor})`,
          boxShadow: unlocked
            ? `0 0 0 1px rgba(255,255,255,0.2), 0 0 20px ${neuronColor}, 0 0 36px ${neuronColor}`
            : '0 0 0 1px rgba(255,255,255,0.12)',
        }}
      >
        <span className="text-xs font-semibold text-white/95 sm:text-sm">Lv {neuron.level}</span>
      </div>

      <div className="max-w-28 space-y-0.5">
        <p className="truncate text-xs font-semibold text-white sm:text-sm">{neuron.label}</p>
        <p className="text-[10px] text-white/80 sm:text-xs">{neuron.totalXp.toLocaleString()} XP</p>
      </div>
    </article>
  );
}
