import { colorScheme } from 'nativewind';
import { useSyncExternalStore } from 'react';

export type ThemePreference = 'light' | 'dark' | 'system';

/**
 * A tiny app-wide store for the user's theme choice (Light / Dark / System).
 * NativeWind applies the colors; this store only remembers what the user picked,
 * so the Settings screen and the header toggle always agree.
 *
 * Next step for a real app: persist the choice (e.g. with expo-sqlite/kv-store
 * or @react-native-async-storage/async-storage) and restore it at startup.
 */
let preference: ThemePreference = 'system';
const listeners = new Set<() => void>();

export function setThemePreference(next: ThemePreference) {
  preference = next;
  colorScheme.set(next);
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useThemePreference() {
  const value = useSyncExternalStore(subscribe, () => preference);
  return [value, setThemePreference] as const;
}
