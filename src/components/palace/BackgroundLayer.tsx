import { memo } from 'react';
import type { EnvironmentType } from '@/types';

interface BackgroundLayerProps {
  environment: EnvironmentType;
  customBackgroundUrl: string | null;
}

function BackgroundLayerBase({ environment, customBackgroundUrl }: BackgroundLayerProps) {
  const hasCustomImage =
    environment === 'custom' &&
    typeof customBackgroundUrl === 'string' &&
    customBackgroundUrl.startsWith('data:image/');

  return (
    <div
      className={[
        'palace-bg',
        environment === 'library' && 'palace-bg--library',
        environment === 'coffee_shop' && 'palace-bg--coffee_shop',
        environment === 'house' && 'palace-bg--house',
        environment === 'custom' && 'palace-bg--custom',
      ]
        .filter(Boolean)
        .join(' ')}
      style={
        hasCustomImage
          ? {
              backgroundImage: `linear-gradient(160deg, rgba(9, 9, 11, 0.48), rgba(24, 24, 27, 0.22)), url("${customBackgroundUrl}")`,
            }
          : undefined
      }
      aria-hidden="true"
    />
  );
}

export const BackgroundLayer = memo(BackgroundLayerBase);
