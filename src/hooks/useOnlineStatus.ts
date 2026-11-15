import { useEffect, useRef, useState } from 'react';

export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

/**
 * Returns the current online status and fires `onBackOnline` once each time
 * the connection transitions from offline → online. The callback is stable
 * (captured via ref) so callers don't need to memoize it.
 */
export function useOnlineStatusWithTransition(onBackOnline?: () => void): boolean {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const callbackRef = useRef(onBackOnline);
  callbackRef.current = onBackOnline;

  // Track whether we were previously offline so we can detect the transition
  const wasOfflineRef = useRef(!isOnline);

  useEffect(() => {
    const handleOnline = () => {
      if (wasOfflineRef.current) {
        callbackRef.current?.();
      }
      wasOfflineRef.current = false;
      setIsOnline(true);
    };
    const handleOffline = () => {
      wasOfflineRef.current = true;
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
