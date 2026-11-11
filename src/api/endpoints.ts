/**
 * ALL API paths live here - one place to look, one place to change.
 * Paths are relative to `env.apiUrl` (https://dummyjson.com by default).
 * API docs: https://dummyjson.com/docs/products
 */
export const endpoints = {
  products: {
    list: '/products',
    search: '/products/search',
    categories: '/products/categories',
    create: '/products/add',
    byId: (id: number) => `/products/${id}`,
  },
} as const;
