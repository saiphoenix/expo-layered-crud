import { useEffect, useState } from 'react';

/**
 * Returns `value`, but only after it stopped changing for `delayMs`.
 * Used for search: we don't want an API call on every key press.
 */
export function useDebouncedValue<T>(value: T, delayMs = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
