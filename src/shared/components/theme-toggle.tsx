import { MoonStar, Sun } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';
import { setThemePreference } from '@/shared/hooks/use-theme-preference';

/** Header button that switches between light and dark mode. */
export function ThemeToggle() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Button
      variant="ghost"
      size="icon"
      className="mr-2 rounded-full"
      onPress={() => setThemePreference(isDark ? 'light' : 'dark')}
      accessibilityLabel={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
      <Icon as={isDark ? Sun : MoonStar} className="size-5" />
    </Button>
  );
}
