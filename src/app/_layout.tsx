import '../global.css';

import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';

import { AppProviders } from '@/providers/app-providers';

// Shows a friendly error screen (with a retry button) if a screen crashes while rendering.
export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  // Deep links (e.g. /products/5) still get the tabs underneath, so "back" works.
  anchor: '(tabs)',
};

/**
 * ROOT LAYOUT - a Stack navigator that wraps everything.
 *
 *   (tabs)               → the bottom tab bar: Home · Products · Settings
 *   products/[id]        → details, pushed ON TOP of the tabs (full screen, no tab bar)
 *   products/[id]/edit   → edit form
 *   products/new         → create form
 *   ui-sandbox           → every UI component on one screen (opened from Settings)
 *
 * This "tabs inside a stack" layout is the standard pattern in most production apps.
 */
export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <AppProviders>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerBackButtonDisplayMode: 'minimal',
          headerShadowVisible: false,
          // Screens that are not visible stop re-rendering until you come back to them.
          // Saves work, and avoids list glitches when data changes in the background.
          freezeOnBlur: true,
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="products/new" options={{ title: 'New product' }} />
        <Stack.Screen name="products/[id]/index" options={{ title: 'Product' }} />
        <Stack.Screen name="products/[id]/edit" options={{ title: 'Edit product' }} />
        <Stack.Screen name="ui-sandbox" options={{ title: 'UI Sandbox' }} />
      </Stack>
      {/* Needed by React Native Reusables dialogs: they render "on top of" everything here. */}
      <PortalHost />
    </AppProviders>
  );
}
