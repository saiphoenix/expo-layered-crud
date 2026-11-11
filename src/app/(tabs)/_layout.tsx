import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';
import { House, type LucideIcon, Package, Settings } from 'lucide-react-native';

import { ThemeToggle } from '@/components/common/theme-toggle';
import { useThemeColors } from '@/hooks/use-theme-colors';

function tabIcon(IconComponent: LucideIcon) {
  // eslint-disable-next-line react/display-name
  return ({ color, size }: { color: ColorValue; size: number }) => (
    <IconComponent color={color as string} size={size} />
  );
}

/**
 * BOTTOM TABS. Each file in this `(tabs)` folder is one tab.
 * The `(tabs)` folder name is in parentheses, so it does NOT appear in the URL:
 * `(tabs)/products.tsx` is the route `/products`.
 */
export default function TabsLayout() {
  const colors = useThemeColors();

  return (
    <Tabs
      screenOptions={{
        headerShadowVisible: false,
        headerRight: () => <ThemeToggle />,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
        freezeOnBlur: true,
      }}>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: tabIcon(House) }} />
      <Tabs.Screen name="products" options={{ title: 'Products', tabBarIcon: tabIcon(Package) }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings', tabBarIcon: tabIcon(Settings) }} />
    </Tabs>
  );
}
