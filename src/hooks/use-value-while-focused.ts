import { useIsFocused } from 'expo-router';
import { useState } from 'react';

/**
 * Returns `value` while the screen is visible. While the screen is hidden
 * (another screen is on top of it), it keeps returning the LAST visible value.
 *
 * Why: when you delete a product from the details screen, the cached list
 * shrinks while the list screen is hidden. FlashList v2 can crash when its
 * data shrinks while it isn't laid out (Shopify/flash-list#2440). With this
 * hook the list only receives the new data once it is visible again.
 */
export function useValueWhileFocused<T>(value: T): T {
  const isFocused = useIsFocused();
  const [lastFocusedValue, setLastFocusedValue] = useState(value);

  // Updating state during render is React's recommended way to "remember" a derived value.
  if (isFocused && lastFocusedValue !== value) {
    setLastFocusedValue(value);
  }

  return isFocused ? value : lastFocusedValue;
}
