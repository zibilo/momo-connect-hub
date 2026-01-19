import { useEffect, useRef } from 'react';

/**
 * A hook for polling a function at a regular interval.
 * @param callback - The function to call.
 * @param delay - The polling interval in milliseconds.
 */
export function usePolling(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
