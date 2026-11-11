import type { Href } from 'expo-router';

/** Every route of the SETTINGS module. Route files live in `src/app/(tabs)/settings.tsx` and `src/app/ui-sandbox.tsx`. */
export const settingsRoutes = {
  settings: '/settings' as const satisfies Href,
  uiSandbox: '/ui-sandbox' as const satisfies Href,
};
