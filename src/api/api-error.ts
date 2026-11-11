/**
 * The ONE error type that leaves the API layer.
 *
 * Screens never need to know about `fetch`, HTTP status codes or Zod.
 * They only check `error.kind` / `error.message`.
 */
export type ApiErrorKind =
  | 'network' // no internet / server unreachable
  | 'timeout' // the server took too long
  | 'http' // the server answered with 4xx / 5xx
  | 'parse'; // the server answered with data we did not expect

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;
  readonly data?: unknown;

  constructor(params: {
    kind: ApiErrorKind;
    message: string;
    status?: number;
    data?: unknown;
    cause?: unknown;
  }) {
    super(params.message, { cause: params.cause });
    this.name = 'ApiError';
    this.kind = params.kind;
    this.status = params.status;
    this.data = params.data;
  }

  get isNotFound() {
    return this.status === 404;
  }

  /** 4xx errors are caused by the request itself, so retrying will not help. */
  get isClientError() {
    return this.status !== undefined && this.status >= 400 && this.status < 500;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/** Turn any thrown value into a message that is safe to show to the user. */
export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) return error.message;
  if (error instanceof Error) return error.message;
  return 'Something went wrong. Please try again.';
}
