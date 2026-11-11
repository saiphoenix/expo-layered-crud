import type { InfiniteData, QueryClient } from '@tanstack/react-query';

import type { Product, ProductListResponse } from './product.schema';

import { productKeys } from './product.keys';

/** Shape of a paginated list in the cache: { pages: [page0, page1, ...], pageParams: [...] } */
export type ProductPages = InfiniteData<ProductListResponse, number>;

/**
 * CACHE HELPERS - small functions that edit cached lists after a mutation,
 * so the UI updates instantly without re-downloading everything.
 */

/** Look for a product inside any cached list (used to show details instantly). */
export function findProductInLists(queryClient: QueryClient, id: number) {
  const queries = queryClient.getQueryCache().findAll({ queryKey: productKeys.lists() });
  for (const query of queries) {
    const data = query.state.data as ProductPages | undefined;
    const product = data?.pages.flatMap((page) => page.products).find((p) => p.id === id);
    if (product) return { product, updatedAt: query.state.dataUpdatedAt };
  }
  return undefined;
}

/** Replace a product everywhere it appears in cached lists. */
export function replaceProductInLists(queryClient: QueryClient, product: Product) {
  queryClient.setQueryData<ProductListResponse>(productKeys.topRated(), (data) =>
    data
      ? { ...data, products: data.products.map((p) => (p.id === product.id ? product : p)) }
      : data
  );
  queryClient.setQueriesData<ProductPages>({ queryKey: productKeys.lists() }, (data) =>
    data
      ? {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            products: page.products.map((p) => (p.id === product.id ? product : p)),
          })),
        }
      : data
  );
}

/** Put a new product at the top of the main (not searched) list. */
export function prependProductToList(queryClient: QueryClient, product: Product) {
  queryClient.setQueryData<ProductPages>(productKeys.list({ search: '' }), (data) => {
    const [firstPage, ...otherPages] = data?.pages ?? [];
    if (!data || !firstPage) return data;
    return {
      ...data,
      pages: [
        { ...firstPage, products: [product, ...firstPage.products], total: firstPage.total + 1 },
        ...otherPages,
      ],
    };
  });
}

/** Remove a product from every cached list. */
export function removeProductFromLists(queryClient: QueryClient, id: number) {
  queryClient.setQueryData<ProductListResponse>(productKeys.topRated(), (data) =>
    data ? { ...data, products: data.products.filter((p) => p.id !== id) } : data
  );
  queryClient.setQueriesData<ProductPages>({ queryKey: productKeys.lists() }, (data) => {
    if (!data) return data;
    const wasInList = data.pages.some((page) => page.products.some((p) => p.id === id));
    if (!wasInList) return data;
    return {
      ...data,
      pages: data.pages.map((page) => ({
        ...page,
        products: page.products.filter((p) => p.id !== id),
        total: Math.max(0, page.total - 1),
      })),
    };
  });
}
