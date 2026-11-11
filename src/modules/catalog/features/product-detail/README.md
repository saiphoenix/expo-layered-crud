# Feature: `product-detail`

**User story:** _As a shopper, I can open a product to see its images, price, discount, rating,
stock and description, and edit or delete it._

Route: `/products/:id` → `src/app/products/[id]/index.tsx` reads `id` from the URL and renders
`<ProductDetailScreen productId={…} />`.

| File                        | Role                                                     |
| --------------------------- | -------------------------------------------------------- |
| `index.ts`                  | Public API                                               |
| `product-detail-screen.tsx` | Screen. Takes `productId` as a prop (easy to reuse/test) |

- **Data:** `useProduct(id)` from `../../data/product.queries`. Its `initialData` is the copy
  already in a cached list, so the screen renders instantly.
- **Uses features:** `../delete-product` (dialog + optimistic delete).
- **Navigation:** `catalogRoutes.edit(id)`.

Read more: [TkDodo: The Query Options API](https://tkdodo.eu/blog/the-query-options-api) ·
[Expo Router: dynamic routes](https://docs.expo.dev/router/introduction/)
