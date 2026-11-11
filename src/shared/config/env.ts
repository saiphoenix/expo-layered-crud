/**
 * App configuration read from environment variables.
 *
 * Expo only exposes variables that start with `EXPO_PUBLIC_` to the app.
 * Put them in a `.env` file (see `.env.example`). Never put secrets here:
 * everything in EXPO_PUBLIC_* ends up inside the app bundle.
 */
export const env = {
  /** Base URL of the REST API. Defaults to the public DummyJSON API. */
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'https://dummyjson.com',
  /** How long (ms) to wait for a response before giving up. */
  apiTimeoutMs: Number(process.env.EXPO_PUBLIC_API_TIMEOUT_MS ?? 15_000),
} as const;
