import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'expo-router';
import { useColorScheme } from 'nativewind';
import type { PropsWithChildren } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import { queryClient, setupReactQueryForNative } from '@/shared/lib/query-client';
import { NAV_THEME } from '@/shared/lib/theme';

setupReactQueryForNative();

/**
 * Every app-wide "provider" in one place, so `_layout.tsx` stays readable.
 * Order matters: outer providers are available to everything inside them.
 */
export function AppProviders({ children }: PropsWithChildren) {
  const { colorScheme } = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider value={NAV_THEME[colorScheme === 'dark' ? 'dark' : 'light']}>
            <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
