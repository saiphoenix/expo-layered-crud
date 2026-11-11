# Feature: `create-product`

**User story:** _As a store manager, I can add a product with a title, description, price,
stock, category and brand._

Route: `/products/new` → `src/app/products/new.tsx`.

| File                        | Role                                                                     |
| --------------------------- | ------------------------------------------------------------------------ |
| `index.ts`                  | Public API                                                               |
| `create-product-screen.tsx` | Renders the shared `ProductForm`, then opens the new product             |
| `use-create-product.ts`     | **Write hook** (`useMutation`): calls the service, then writes the cache |

- The form (`../../components/product-form.tsx`) is shared with `edit-product`, so it lives in
  the module's `components/`.
- Validation: `productFormSchema` (zod) + react-hook-form turns `"12.50"` into `12.5`.
- After success: `setQueryData(detail)` + `prependProductToList` → no loading spinner.

Read more: [TkDodo: Mastering Mutations in React Query](https://tkdodo.eu/blog/mastering-mutations-in-react-query) ·
[React Hook Form: get started](https://react-hook-form.com/get-started) · [Zod](https://zod.dev/)
