import {
  infiniteQueryOptions,
  queryOptions,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { productsService } from './products.service';

import { isLocalProduct } from './local-only-products';
import { findProductInLists } from './product.cache';
import { productKeys } from './product.keys';

export const PRODUCTS_PAGE_SIZE = 20;

/**
 * QUERY OPTIONS - key + fetch function kept together.
 * Reusable in hooks, for prefetching (`queryClient.prefetchQuery(...)`)
 * and for reading the cache (`queryClient.getQueryData(...)`), with full types.
 */
export const productQueries = {
  list: (search: string) =>
    infiniteQueryOptions({
      queryKey: productKeys.list({ search }),
      queryFn: ({ pageParam, signal }) =>
        productsService.list({ limit: PRODUCTS_PAGE_SIZE, skip: pageParam, search }, signal),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        const nextSkip = lastPage.skip + lastPage.limit;
        return nextSkip < lastPage.total ? nextSkip : undefined;
      },
    }),

  detail: (id: number) =>
    queryOptions({
      queryKey: productKeys.detail(id),
      queryFn: ({ signal }) => productsService.getById(id, signal),
    }),

  topRated: () =>
    queryOptions({
      queryKey: productKeys.topRated(),
      queryFn: ({ signal }) =>
        productsService.list({ limit: 10, skip: 0, sortBy: 'rating', order: 'desc' }, signal),
      select: (data) => data.products,
    }),

  categories: () =>
    queryOptions({
      queryKey: productKeys.categories(),
      queryFn: ({ signal }) => productsService.categories(signal),
      // Categories almost never change - keep them for an hour.
      staleTime: 60 * 60 * 1000,
    }),
};

/* -------------------------------------------------------------------------- */
/*  HOOKS - what screens actually call                                        */
/* -------------------------------------------------------------------------- */

/** Paginated (infinite scroll) product list, optionally filtered by a search term. */
export function useProductList(search: string) {
  return useInfiniteQuery({
    ...productQueries.list(search),
    // Flatten pages into one array, so screens don't care about pagination.
    select: (data) => ({
      products: data.pages.flatMap((page) => page.products),
      total: data.pages[0]?.total ?? 0,
    }),
  });
}

/** A single product. Shows the copy from the list instantly while the full version loads. */
export function useProduct(id: number) {
  const queryClient = useQueryClient();
  return useQuery({
    ...productQueries.detail(id),
    enabled: Number.isFinite(id) && !isLocalProduct(id),
    initialData: () => findProductInLists(queryClient, id)?.product,
    initialDataUpdatedAt: () => findProductInLists(queryClient, id)?.updatedAt,
  });
}

/** The 10 best-rated products (Home screen). */
export function useTopRatedProducts() {
  return useQuery(productQueries.topRated());
}

/** Total number of products. Shares its cache with the Products tab's first page. */
export function useProductCount() {
  return useInfiniteQuery({
    ...productQueries.list(''),
    select: (data) => data.pages[0]?.total ?? 0,
  });
}

export function useCategories() {
  return useQuery(productQueries.categories());
}
