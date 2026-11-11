import type { z } from 'zod';

import { ApiError } from './api-error';

/**
 * Validate data coming from the server against a Zod schema.
 *
 * Why? TypeScript types disappear at runtime. If the API changes shape,
 * we want ONE clear error here - not a crash deep inside a screen.
 */
export function parseResponse<TSchema extends z.ZodType>(
  schema: TSchema,
  data: unknown
): z.output<TSchema> {
  const result = schema.safeParse(data);
  if (!result.success) {
    if (__DEV__) {
      console.warn('[api] Unexpected response shape:', result.error.issues);
    }
    throw new ApiError({
      kind: 'parse',
      message: 'The server sent data in an unexpected format.',
      data,
      cause: result.error,
    });
  }
  return result.data;
}
