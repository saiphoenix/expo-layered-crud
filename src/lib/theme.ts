import { DarkTheme, DefaultTheme, type Theme } from 'expo-router';

/**
 * The same colors as the CSS variables in `src/global.css`, as plain strings.
 *
 * Use `className="bg-primary text-foreground"` whenever you can.
 * Use THESE values only where className is not supported:
 * navigation headers, bottom sheet backgrounds, icon `color` props, RefreshControl, etc.
 *
 * ⚠️ If you change a color in global.css, change it here too.
 */
export const THEME = {
  light: {
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(240 10% 3.9%)',
    card: 'hsl(0 0% 100%)',
    cardForeground: 'hsl(240 10% 3.9%)',
    popover: 'hsl(0 0% 100%)',
    popoverForeground: 'hsl(240 10% 3.9%)',
    primary: 'hsl(243 75% 59%)',
    primaryForeground: 'hsl(0 0% 100%)',
    secondary: 'hsl(240 4.8% 95.9%)',
    secondaryForeground: 'hsl(240 5.9% 10%)',
    muted: 'hsl(240 4.8% 95.9%)',
    mutedForeground: 'hsl(240 3.8% 46.1%)',
    accent: 'hsl(240 4.8% 95.9%)',
    accentForeground: 'hsl(240 5.9% 10%)',
    destructive: 'hsl(0 84.2% 60.2%)',
    success: 'hsl(142 71% 36%)',
    border: 'hsl(240 5.9% 90%)',
    input: 'hsl(240 5.9% 90%)',
    ring: 'hsl(243 75% 59%)',
    radius: '0.75rem',
  },
  dark: {
    background: 'hsl(240 10% 3.9%)',
    foreground: 'hsl(0 0% 98%)',
    card: 'hsl(240 6% 8%)',
    cardForeground: 'hsl(0 0% 98%)',
    popover: 'hsl(240 6% 8%)',
    popoverForeground: 'hsl(0 0% 98%)',
    primary: 'hsl(239 84% 74%)',
    primaryForeground: 'hsl(240 10% 3.9%)',
    secondary: 'hsl(240 3.7% 15.9%)',
    secondaryForeground: 'hsl(0 0% 98%)',
    muted: 'hsl(240 3.7% 15.9%)',
    mutedForeground: 'hsl(240 5% 64.9%)',
    accent: 'hsl(240 3.7% 15.9%)',
    accentForeground: 'hsl(0 0% 98%)',
    destructive: 'hsl(0 72% 63%)',
    success: 'hsl(142 69% 58%)',
    border: 'hsl(240 3.7% 18%)',
    input: 'hsl(240 3.7% 18%)',
    ring: 'hsl(239 84% 74%)',
    radius: '0.75rem',
  },
} as const;

export type ThemeColors = { [K in keyof (typeof THEME)['light']]: string };

/** Theme for React Navigation (headers, screen backgrounds). */
export const NAV_THEME: Record<'light' | 'dark', Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.primary,
      text: THEME.light.foreground,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
  },
};
