import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useState<NodeJS.Timeout | null>(null)[0];

  return ((...args: Parameters<T>) => {
    if (timeoutRef) {
      clearTimeout(timeoutRef);
    }

    setTimeout(() => {
      callback(...args);
    }, delay);
  }) as T;
}
