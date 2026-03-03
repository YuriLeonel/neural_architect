import type { NeuronState } from '@/types';
import { getNeuronSize, getNeuronStyle } from './neuronUtils';

interface NeuronNodeProps {
  neuron: NeuronState;
  isActive: boolean;
}

export function NeuronNode({ neuron, isActive }: NeuronNodeProps) {
  const unlocked = neuron.unlocked;
  const size = getNeuronSize(neuron.level);
  const style = getNeuronStyle(neuron.level, unlocked, isActive);

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
          ...style,
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
