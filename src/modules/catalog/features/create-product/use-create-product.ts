import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toLocalProduct } from '../../data/local-only-products';
import { prependProductToList } from '../../data/product.cache';
import { productKeys } from '../../data/product.keys';
import type { ProductPayload } from '../../data/product.schema';
import { productsService } from '../../data/products.service';

/**
 * CREATE a product.
 *
 * With a REAL backend, the usual pattern after a successful write is simply:
 *     queryClient.invalidateQueries({ queryKey: productKeys.lists() })
 * which marks lists as stale and re-downloads them.
 *
 * DummyJSON does not save writes, so re-downloading would bring back the old data.
 * Instead we write the result straight into the cache (also the faster,
 * "no-loading-spinner" pattern used by many production apps).
 */
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
