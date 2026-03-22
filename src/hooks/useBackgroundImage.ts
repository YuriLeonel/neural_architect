import { useState, useEffect } from 'react';

export function useBackgroundImage(url: string | null): { loaded: boolean } {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!url) {
      setLoaded(false);
      return;
    }

    setLoaded(false);

    const img = new Image();

    const handleLoad = () => setLoaded(true);
    img.addEventListener('load', handleLoad);
    img.src = url;

    if (img.complete) {
      setLoaded(true);
    }

    return () => {
      img.removeEventListener('load', handleLoad);
    };
  }, [url]);

  return { loaded };
}
