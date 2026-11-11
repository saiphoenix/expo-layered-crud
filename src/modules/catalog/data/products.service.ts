import { http, parseResponse } from '@/shared/api';

import { catalogEndpoints } from './catalog.endpoints';
import {
  categoryListSchema,
  productListResponseSchema,
  productSchema,
  type ProductPayload,
} from './product.schema';

export interface ListProductsParams {
  limit: number;
  skip: number;
  /** When set, uses the search endpoint instead of the list endpoint. */
  search?: string;
  /** Sort by a field, e.g. 'rating' or 'price'. */
  sortBy?: 'title' | 'price' | 'rating';
  order?: 'asc' | 'desc';
}

/**
 * SERVICE LAYER - "what can we ask the backend?"
 *
 * Rules for this layer:
 *  - Plain async functions. No React, no hooks, no UI code.
 *  - Talks to the API only through `http` (never `fetch` directly).
 *  - Validates every response with a Zod schema, so callers get typed, trusted data.
 *
 * Because it has no React in it, it is easy to unit-test and could be reused
 * anywhere (another app, a background task, a script).
 */
export const productsService = {
  async list({ limit, skip, search, sortBy, order }: ListProductsParams, signal?: AbortSignal) {
    const term = search?.trim();
    const data = await http.get(
      term ? catalogEndpoints.products.search : catalogEndpoints.products.list,
      {
        query: { limit, skip, q: term, sortBy, order },
        signal,
      }
    );
    return parseResponse(productListResponseSchema, data);
  },

  async getById(id: number, signal?: AbortSignal) {
    const data = await http.get(catalogEndpoints.products.byId(id), { signal });
    return parseResponse(productSchema, data);
  },

  async create(payload: ProductPayload) {
    const data = await http.post(catalogEndpoints.products.create, payload);
    return parseResponse(productSchema, data);
  },

  async update(id: number, payload: Partial<ProductPayload>) {
    const data = await http.put(catalogEndpoints.products.byId(id), payload);
    return parseResponse(productSchema, data);
  },

  async remove(id: number) {
    await http.delete(catalogEndpoints.products.byId(id));
  },

  async categories(signal?: AbortSignal) {
    const data = await http.get(catalogEndpoints.products.categories, { signal });
    return parseResponse(categoryListSchema, data);
  },
};
