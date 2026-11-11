import { useMutation, useQueryClient } from '@tanstack/react-query';

import { productSchema, type Product, type ProductPayload } from '@/schemas/product.schema';
import { productsService } from '@/services/products.service';

import { isLocalProduct, toLocalProduct } from './local-only-products';
import {
  findProductInLists,
  prependProductToList,
  removeProductFromLists,
  replaceProductInLists,
  type ProductPages,
} from './products.cache';
import { productKeys } from './query-keys';

/**
 * MUTATIONS - create / update / delete.
 *
 * With a REAL backend, the usual pattern after a successful write is simply:
 *     queryClient.invalidateQueries({ queryKey: productKeys.lists() })
 * which marks lists as stale and re-downloads them.
 *
 * DummyJSON does not save writes, so re-downloading would bring back the old data.
 * Instead we write the result straight into the cache (which is also the faster,
 * "no-loading-spinner" pattern used by many production apps).
 */

/** CREATE */
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ProductPayload) =>
      toLocalProduct(await productsService.create(payload)),
    onSuccess: (product) => {
      queryClient.setQueryData(productKeys.detail(product.id), product);
      prependProductToList(queryClient, product);
    },
  });
}

/** UPDATE */
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: ProductPayload }) => {
      if (isLocalProduct(id)) {
        // The server doesn't know this product (see local-only-products.ts).
        const current =
          queryClient.getQueryData<Product>(productKeys.detail(id)) ??
          findProductInLists(queryClient, id)?.product;
        return productSchema.parse({ ...current, ...payload, id });
      }
      return productsService.update(id, payload);
    },
    onSuccess: (product) => {
      queryClient.setQueryData(productKeys.detail(product.id), product);
      replaceProductInLists(queryClient, product);
    },
  });
}

/**
 * DELETE - with an OPTIMISTIC update:
 * the product disappears from the list immediately, and comes back
 * if the server reports an error (rollback).
 */
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      if (isLocalProduct(id)) return;
      await productsService.remove(id);
    },
    onMutate: async (id) => {
      // Stop in-flight list fetches so they don't overwrite our optimistic change.
      await queryClient.cancelQueries({ queryKey: productKeys.lists() });
      const previousLists = [
        ...queryClient.getQueriesData<ProductPages>({ queryKey: productKeys.lists() }),
        ...queryClient.getQueriesData({ queryKey: productKeys.topRated() }),
      ];
      removeProductFromLists(queryClient, id);
      return { previousLists };
    },
    onError: (_error, _id, context) => {
      // Roll back to the lists we saved in onMutate.
      context?.previousLists.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
  });
}
