import type { CSSProperties } from 'react';
import { getNeuronColor } from '@/constants/evolution';
import type { NeuronState, SessionCategory, TimerPhase } from '@/types';

export interface PositionedNeuron {
  neuron: NeuronState;
  x: number;
  y: number;
}

export const BASE_SIZE_PX = 56;
export const MAX_SIZE_PX = 136;

export function sortNeurons(a: NeuronState, b: NeuronState): number {
  const aIsCategory = a.id.startsWith('cat:');
  const bIsCategory = b.id.startsWith('cat:');

  if (aIsCategory !== bIsCategory) {
    return aIsCategory ? -1 : 1;
  }

  return a.label.localeCompare(b.label);
}

export function getRadius(totalNeurons: number): number {
  if (totalNeurons <= 1) {
    return 0;
  }

  return Math.min(42, Math.max(24, 18 + totalNeurons * 2.2));
}

export function calculatePositions(neurons: NeuronState[]): PositionedNeuron[] {
  if (neurons.length === 0) {
    return [];
  }

  if (neurons.length === 1) {
    const [singleNeuron] = neurons;
    if (!singleNeuron) {
      return [];
    }
    return [{ neuron: singleNeuron, x: 50, y: 50 }];
  }

  const radius = getRadius(neurons.length);

  return neurons.map((neuron, index) => {
    const angle = (index / neurons.length) * 2 * Math.PI;
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    return { neuron, x, y };
  });
}

export function getActiveNeuronIds(
  isRunning: boolean,
  phase: TimerPhase,
  category: SessionCategory,
  activeTags: string[],
): Set<string> {
  if (!isRunning || phase !== 'focus') {
    return new Set<string>();
  }

  if (activeTags.length > 0) {
    return new Set(activeTags);
  }

  if (category === 'custom') {
    return new Set<string>();
  }

  return new Set<string>([`cat:${category}`]);
}

export function getNeuronSize(level: number): number {
  const scaledSize = BASE_SIZE_PX * (1 + level * 0.1);
  return Math.min(MAX_SIZE_PX, Math.max(BASE_SIZE_PX, Math.round(scaledSize)));
}

export function getNeuronStyle(level: number, unlocked: boolean, _isActive: boolean): CSSProperties {
  const neuronColor = getNeuronColor(level);

  return {
    background: `radial-gradient(circle at 30% 25%, rgba(255, 255, 255, 0.3), ${neuronColor})`,
    boxShadow: unlocked
      ? `0 0 0 1px rgba(255,255,255,0.2), 0 0 20px ${neuronColor}, 0 0 36px ${neuronColor}`
      : '0 0 0 1px rgba(255,255,255,0.12)',
  };
}
