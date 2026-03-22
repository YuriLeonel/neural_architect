import { memo, useEffect, useRef, useState } from 'react';
import type { EnvironmentType } from '@/types';
import { getResponsiveBackgroundUrl } from '@/utils/backgroundImages';
import { useBackgroundImage } from '@/hooks/useBackgroundImage';
import { loadCustomBackground } from '@/utils/imageStorage';

interface BackgroundLayerProps {
  environment: EnvironmentType;
  customBackgroundUrl: string | null;
}

function BackgroundLayerBase({ environment, customBackgroundUrl }: BackgroundLayerProps) {
  const [resolvedBlobUrl, setResolvedBlobUrl] = useState<string | null>(null);
  const prevBlobUrlRef = useRef<string | null>(null);

  const isIndexedDb =
    environment === 'custom' && customBackgroundUrl === 'indexeddb';

  useEffect(() => {
    if (!isIndexedDb) {
      if (prevBlobUrlRef.current) {
        URL.revokeObjectURL(prevBlobUrlRef.current);
        prevBlobUrlRef.current = null;
      }
      setResolvedBlobUrl(null);
      return;
    }

    let cancelled = false;
    loadCustomBackground().then((url) => {
      if (cancelled) {
        if (url) URL.revokeObjectURL(url);
        return;
      }
      if (prevBlobUrlRef.current) {
        URL.revokeObjectURL(prevBlobUrlRef.current);
      }
      prevBlobUrlRef.current = url;
      setResolvedBlobUrl(url);
    });

    return () => {
      cancelled = true;
    };
  }, [isIndexedDb]);

  useEffect(() => {
    return () => {
      if (prevBlobUrlRef.current) {
        URL.revokeObjectURL(prevBlobUrlRef.current);
        prevBlobUrlRef.current = null;
      }
    };
  }, []);

  const backgroundUrl = (() => {
    if (environment !== 'custom') {
      return getResponsiveBackgroundUrl(environment);
    }
    if (isIndexedDb) {
      return resolvedBlobUrl;
    }
    return null;
  })();

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
