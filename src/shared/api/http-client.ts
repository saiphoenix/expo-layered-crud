import { env } from '@/shared/config/env';

import { ApiError } from './api-error';

type QueryValue = string | number | boolean | null | undefined;
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestOptions {
  method?: HttpMethod;
  /** Added to the URL as `?key=value`. `undefined`/`null`/'' values are skipped. */
  query?: Record<string, QueryValue>;
  /** Sent as JSON. */
  body?: unknown;
  headers?: Record<string, string>;
  /** Lets React Query cancel the request (e.g. when the user leaves the screen). */
  signal?: AbortSignal;
  timeoutMs?: number;
}

function buildUrl(path: string, query?: RequestOptions['query']): string {
  const url = `${env.apiUrl.replace(/\/$/, '')}${path}`;
  if (!query) return url;

  const params = Object.entries(query)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');

  return params ? `${url}?${params}` : url;
}

async function parseBody(response: Response): Promise<unknown> {
  if (response.status === 204) return null;
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function messageFromBody(body: unknown): string | undefined {
  if (body && typeof body === 'object' && 'message' in body && typeof body.message === 'string') {
    return body.message;
  }
  return undefined;
}

/**
 * Low-level HTTP client: the ONLY place in the app that calls `fetch`.
 *
 * It handles: base URL, query strings, JSON encoding/decoding, timeouts,
 * cancellation and converting every failure into an `ApiError`.
 * Want auth? Add the `Authorization` header here, once, for every request.
 */
export async function request<T = unknown>(
  path: string,
  {
    method = 'GET',
    query,
    body,
    headers,
    signal,
    timeoutMs = env.apiTimeoutMs,
  }: RequestOptions = {}
): Promise<T> {
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  // If React Query cancels the request, cancel our fetch too.
  const forwardAbort = () => controller.abort();
  signal?.addEventListener('abort', forwardAbort);

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (error) {
    if (timedOut) {
      throw new ApiError({
        kind: 'timeout',
        message: 'The server took too long to respond. Please try again.',
        cause: error,
      });
    }
    // Cancelled by React Query: re-throw as-is so React Query can ignore it.
    if (signal?.aborted) throw error;
    throw new ApiError({
      kind: 'network',
      message: 'Could not reach the server. Check your internet connection.',
      cause: error,
    });
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', forwardAbort);
  }

  const data = await parseBody(response);

  if (!response.ok) {
    throw new ApiError({
      kind: 'http',
      status: response.status,
      message: messageFromBody(data) ?? `Request failed with status ${response.status}.`,
      data,
    });
  }

  return data as T;
}

type Options = Omit<RequestOptions, 'method' | 'body'>;

/** Small helpers so call sites read like `http.get('/products')`. */
export const http = {
  get: (path: string, options?: Options) => request(path, { ...options, method: 'GET' }),
  post: (path: string, body?: unknown, options?: Options) =>
    request(path, { ...options, method: 'POST', body }),
  put: (path: string, body?: unknown, options?: Options) =>
    request(path, { ...options, method: 'PUT', body }),
  patch: (path: string, body?: unknown, options?: Options) =>
    request(path, { ...options, method: 'PATCH', body }),
  delete: (path: string, options?: Options) => request(path, { ...options, method: 'DELETE' }),
};
