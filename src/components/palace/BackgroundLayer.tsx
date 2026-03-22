import { memo } from 'react';
import type { EnvironmentType } from '@/types';
import { getResponsiveBackgroundUrl } from '@/utils/backgroundImages';
import { useBackgroundImage } from '@/hooks/useBackgroundImage';

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
      : getResponsiveBackgroundUrl(environment);

  const { loaded } = useBackgroundImage(backgroundUrl);

  const style = backgroundUrl && loaded
    ? {
        backgroundImage: `linear-gradient(160deg, rgba(9, 9, 11, 0.48), rgba(24, 24, 27, 0.22)), url("${backgroundUrl}")`,
      }
    : undefined;

  return (
    <div
      className={`palace-bg${loaded ? ' palace-bg--loaded' : ''}`}
      style={style}
      aria-hidden="true"
    />
  );
}

export const BackgroundLayer = memo(BackgroundLayerBase);
