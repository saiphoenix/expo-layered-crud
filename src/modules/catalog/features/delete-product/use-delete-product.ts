import { useMutation, useQueryClient } from '@tanstack/react-query';

import { isLocalProduct } from '../../data/local-only-products';
import { removeProductFromLists, type ProductPages } from '../../data/product.cache';
import { productKeys } from '../../data/product.keys';
import { productsService } from '../../data/products.service';

/**
 * DELETE a product, with an OPTIMISTIC update:
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
