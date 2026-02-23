import { useCallback, useEffect, useRef } from 'react';

function isWakeLockSupported(): boolean {
  return typeof navigator !== 'undefined' && 'wakeLock' in navigator;
}

export function useWakeLock(isActive: boolean): void {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  const releaseWakeLock = useCallback(async () => {
    const currentWakeLock = wakeLockRef.current;

    if (!currentWakeLock) {
      return;
    }

    try {
      await currentWakeLock.release();
    } catch (error) {
      console.warn('Wake lock release failed:', error);
    } finally {
      if (wakeLockRef.current === currentWakeLock) {
        wakeLockRef.current = null;
      }
    }
  }, []);

  const acquireWakeLock = useCallback(async () => {
    if (!isActive || !isWakeLockSupported() || document.visibilityState !== 'visible') {
      return;
    }

    const existingWakeLock = wakeLockRef.current;
    if (existingWakeLock && !existingWakeLock.released) {
      return;
    }

    try {
      const nextWakeLock = await navigator.wakeLock.request('screen');

      wakeLockRef.current = nextWakeLock;

      const handleWakeLockRelease = () => {
        if (wakeLockRef.current === nextWakeLock) {
          wakeLockRef.current = null;
        }
        nextWakeLock.removeEventListener('release', handleWakeLockRelease);
      };

      nextWakeLock.addEventListener('release', handleWakeLockRelease);
    } catch (error) {
      console.warn('Wake lock request rejected:', error);
    }
  }, [isActive]);

  useEffect(() => {
    if (!isWakeLockSupported()) {
      return;
    }

    if (isActive) {
      void acquireWakeLock();
    } else {
      void releaseWakeLock();
    }

    return () => {
      void releaseWakeLock();
    };
  }, [acquireWakeLock, isActive, releaseWakeLock]);

  useEffect(() => {
    if (!isWakeLockSupported()) {
      return;
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isActive) {
        void acquireWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [acquireWakeLock, isActive]);
}
