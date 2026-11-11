import { useMutation, useQueryClient } from '@tanstack/react-query';

import { isLocalProduct } from '../../data/local-only-products';
import { findProductInLists, replaceProductInLists } from '../../data/product.cache';
import { productKeys } from '../../data/product.keys';
import { productSchema, type Product, type ProductPayload } from '../../data/product.schema';
import { productsService } from '../../data/products.service';

/** UPDATE a product, then write the result into every cached copy (detail + lists). */
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: ProductPayload }) => {
      if (isLocalProduct(id)) {
        // The server doesn't know this product (see data/local-only-products.ts).
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
