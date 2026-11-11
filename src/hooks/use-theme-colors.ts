import { useColorScheme } from 'nativewind';

import { THEME } from '@/lib/theme';

/** Current theme colors as strings - for props that cannot use className. */
export function useThemeColors() {
  const { colorScheme } = useColorScheme();
  return THEME[colorScheme === 'dark' ? 'dark' : 'light'];
}
