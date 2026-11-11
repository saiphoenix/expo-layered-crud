import { QueryClient, focusManager, onlineManager } from '@tanstack/react-query';
import * as Network from 'expo-network';
import { AppState, Platform, type AppStateStatus } from 'react-native';

import { isApiError } from '@/api';

/**
 * One QueryClient for the whole app (created once, outside React).
 *
 * staleTime: how long fetched data counts as "fresh". During this time,
 *            React Query shows the cached data and does not fetch again.
 * gcTime:    how long unused data stays in memory after the screen using it closes.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: (failureCount, error) => {
        // Retrying a 404 or a malformed response will never succeed.
        if (isApiError(error) && (error.isClientError || error.kind === 'parse')) return false;
        return failureCount < 2;
      },
    },
    mutations: {
      // Never auto-retry writes: a retried POST could create duplicates.
      retry: false,
    },
  },
});

/**
 * React Query was built for the browser. On a phone there is no "window focus"
 * or "online" event, so we tell it about them ourselves:
 *  - app comes back to the foreground  -> refetch stale queries
 *  - internet connection comes back    -> resume paused queries
 * Called once from the root providers.
 */
let isSetUp = false;
export function setupReactQueryForNative() {
  if (isSetUp || Platform.OS === 'web') return;
  isSetUp = true;

  focusManager.setEventListener((setFocused) => {
    const subscription = AppState.addEventListener('change', (status: AppStateStatus) => {
      setFocused(status === 'active');
    });
    return () => subscription.remove();
  });

  onlineManager.setEventListener((setOnline) => {
    const subscription = Network.addNetworkStateListener((state) => {
      setOnline(state.isConnected !== false);
    });
    return () => subscription.remove();
  });
}
