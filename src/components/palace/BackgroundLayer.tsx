import { memo } from 'react';
import type { EnvironmentType } from '@/types';

const ENVIRONMENT_BACKGROUNDS: Record<Exclude<EnvironmentType, 'custom'>, string> = {
  library: '/Library-bg.png',
  coffee_shop: '/Coffee-Shop-bg.png',
  house: '/House-bg.png',
};

interface BackgroundLayerProps {
  environment: EnvironmentType;
  customBackgroundUrl: string | null;
}

function BackgroundLayerBase({ environment, customBackgroundUrl }: BackgroundLayerProps) {
  const hasCustomImage =
    environment === 'custom' &&
    typeof customBackgroundUrl === 'string' &&
    customBackgroundUrl.startsWith('data:image/');
  const backgroundUrl =
    environment === 'custom'
      ? hasCustomImage
        ? customBackgroundUrl
        : null
      : ENVIRONMENT_BACKGROUNDS[environment];
  const style = backgroundUrl
    ? {
        backgroundImage: `linear-gradient(160deg, rgba(9, 9, 11, 0.48), rgba(24, 24, 27, 0.22)), url("${backgroundUrl}")`,
      }
    : undefined;

  return (
    <div
      className="palace-bg"
      style={style}
      aria-hidden="true"
    />
  );
}

export const BackgroundLayer = memo(BackgroundLayerBase);
