# Feature: `edit-product`

**User story:** _As a store manager, I can change a product's details and see the change
everywhere in the app immediately._

Route: `/products/:id/edit` → `src/app/products/[id]/edit.tsx`.

| File                      | Role                                                              |
| ------------------------- | ----------------------------------------------------------------- |
| `index.ts`                | Public API                                                        |
| `edit-product-screen.tsx` | Loads the product, pre-fills the shared `ProductForm`             |
| `use-update-product.ts`   | **Write hook**: `PUT /products/:id`, then `replaceProductInLists` |

`requireChanges` keeps "Save" disabled until something changed.

Read more: [TkDodo: Mastering Mutations in React Query](https://tkdodo.eu/blog/mastering-mutations-in-react-query)
