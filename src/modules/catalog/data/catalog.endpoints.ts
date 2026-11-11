/**
 * Every API path of the CATALOG module lives here - one place to look, one place to change.
 * Paths are relative to `env.apiUrl` (https://dummyjson.com by default).
 * API docs: https://dummyjson.com/docs/products
 *
 * Each module owns its own `<module>.endpoints.ts`. No URL strings anywhere else.
 */
export const catalogEndpoints = {
  products: {
    list: '/products',
    search: '/products/search',
    categories: '/products/categories',
    create: '/products/add',
    byId: (id: number) => `/products/${id}`,
  },
} as const;
