# Feature: `delete-product`

**User story:** _As a store manager, I can delete a product after confirming, and it disappears
immediately._

This feature has **no screen**. It is a hook plus a dialog that other features (`product-list`,
`product-detail`) use through `index.ts`. Features don't have to be screens.

| File                        | Role                                                               |
| --------------------------- | ------------------------------------------------------------------ |
| `index.ts`                  | Public API: `useDeleteProduct`, `DeleteProductDialog`              |
| `use-delete-product.ts`     | **Optimistic** delete: remove from cache first, roll back on error |
| `delete-product-dialog.tsx` | "Are you sure?" dialog                                             |

```
onMutate  → cancel list fetches, snapshot lists, remove the product   (UI updates instantly)
mutationFn→ DELETE /products/:id
onError   → restore the snapshot                                      (it comes back + alert)
```

Read more: [TanStack Query: Optimistic Updates](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates)
