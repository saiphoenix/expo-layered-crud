# Adding a feature: step-by-step recipe

A **feature** is one use case inside a module, built as a
[vertical slice](https://www.jimmybogard.com/vertical-slice-architecture/): its screen, hooks
and private components live together in one folder.

> **Reference:** [src/modules/catalog/features/product-list/](../src/modules/catalog/features/product-list/README.md).
> Need a whole new business area instead? See [ADDING-A-MODULE.md](ADDING-A-MODULE.md).

Example: in the `catalog` module, add a **"Products by category"** feature: tap a category, see
its products. Route: `/products/category/[slug]`.

---

## 1. Decide where it lives

| Question                                          | Answer for our example      |
| ------------------------------------------------- | --------------------------- |
| Which business area?                              | Products → `catalog` module |
| Feature name (kebab-case, describes the use case) | `products-by-category`      |
| Screen, widget, or behaviour only?                | Screen                      |
| Reads data? Writes data?                          | Reads only                  |

```
src/modules/catalog/features/products-by-category/
├── README.md
├── index.ts
└── products-by-category-screen.tsx
```

## 2. Data: reuse first, then add

Check `data/` first: maybe the service, schema and hooks already exist. Here we need one more
endpoint, so the module's **data layer** gets small additions:

```ts
// data/catalog.endpoints.ts
byCategory: (slug: string) => `/products/category/${slug}`,

// data/product.keys.ts
byCategory: (slug: string) => [...productKeys.all, 'category', slug] as const,

// data/products.service.ts
async listByCategory(slug: string, signal?: AbortSignal) {
  const data = await http.get(catalogEndpoints.products.byCategory(slug), { signal });
  return parseResponse(productListResponseSchema, data);
},

// data/product.queries.ts
export function useProductsByCategory(slug: string) {
  return useQuery({
    queryKey: productKeys.byCategory(slug),
    queryFn: ({ signal }) => productsService.listByCategory(slug, signal),
    select: (data) => data.products,
  });
}
```

> **Read hooks** used by more than one feature go in `data/*.queries.ts`. A hook used by only
> this feature may live in the feature folder (`use-products-by-category.ts`). **Write hooks**
> (`useMutation`) always live in the feature that performs the write, like
> `create-product/use-create-product.ts`.

✅ Add a test for `listByCategory` in `data/__tests__/products.service.test.ts`.

## 3. Screen: `products-by-category-screen.tsx`

Take params as **props** (the route file reads the URL). Handle the four states.

```tsx
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { PackageSearch } from 'lucide-react-native';

import { EmptyState, ErrorState, LoadingState } from '@/shared/components/screen-states';

import { catalogRoutes } from '../../catalog.routes';
import { useProductsByCategory } from '../../data/product.queries';
import { ProductCard } from '../product-list';

export function ProductsByCategoryScreen({ slug }: { slug: string }) {
  const products = useProductsByCategory(slug);

  if (products.isPending) return <LoadingState />;
  if (products.isError) return <ErrorState error={products.error} onRetry={products.refetch} />;

  return (
    <FlashList
      data={products.data}
      keyExtractor={(p) => String(p.id)}
      renderItem={({ item }) => (
        <ProductCard
          product={item}
          onPress={(p) => router.push(catalogRoutes.detail(p.id))}
          onMorePress={() => {}}
        />
      )}
      ListEmptyComponent={<EmptyState icon={PackageSearch} title="No products in this category" />}
    />
  );
}
```

Note `import { ProductCard } from '../product-list'`: another feature, **through its index**.
`'../product-list/product-card'` would fail lint.

## 4. Public API of the feature: `index.ts`

```ts
export { ProductsByCategoryScreen } from './products-by-category-screen';
```

## 5. Route builder: `catalog.routes.ts`

```ts
byCategory: (slug: string) =>
  ({ pathname: '/products/category/[slug]', params: { slug } }) satisfies Href,
```

## 6. Export from the module: `src/modules/catalog/index.ts`

```ts
export { ProductsByCategoryScreen } from './features/products-by-category';
```

## 7. Route file: `src/app/products/category/[slug].tsx`

```tsx
import { useLocalSearchParams } from 'expo-router';

import { ProductsByCategoryScreen } from '@/modules/catalog';

export default function ProductsByCategoryRoute() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  return <ProductsByCategoryScreen slug={slug} />;
}
```

Register it in `src/app/_layout.tsx`:
`<Stack.Screen name="products/category/[slug]" options={{ title: 'Category' }} />`.

## 8. README

Copy the reference feature's README: user story, route, file table, what it uses, links.

## 9. Check everything

```bash
npm run validate
```

---

## Where does each piece go?

| Piece                                         | Location                             |
| --------------------------------------------- | ------------------------------------ |
| Screen, private components                    | `features/<feature>/`                |
| Write hook (`useMutation`)                    | `features/<feature>/use-<action>.ts` |
| Read hook used by several features            | `data/<resource>.queries.ts`         |
| Endpoint, schema, service, keys               | `data/`                              |
| UI used by several features of this module    | `components/`                        |
| UI used by several modules, no business words | `src/shared/components/`             |
| Route file                                    | `src/app/...` (thin)                 |

## Checklist

- [ ] One folder under `features/`, with `index.ts` and `README.md`
- [ ] Screen takes route params as props; the route file in `src/app` is thin
- [ ] Data via hooks; no service, URL or `fetch` in UI
- [ ] Loading, error, empty and data states handled
- [ ] Sibling features imported only through `../<feature>`
- [ ] Navigation through `catalogRoutes` (or your module's routes)
- [ ] Exported from the module's `index.ts` if routes or other modules need it
- [ ] Only theme color classes; checked in light and dark mode
- [ ] Tests for new service functions
- [ ] `npm run validate` passes

## Read more

- [Jimmy Bogard: Vertical Slice Architecture](https://www.jimmybogard.com/vertical-slice-architecture/)
- [Kent C. Dodds: Colocation](https://kentcdodds.com/blog/colocation)
- [Robin Wieruch: React Folder Structure in 5 Steps](https://www.robinwieruch.de/react-folder-structure/)
- [TkDodo: The Query Options API](https://tkdodo.eu/blog/the-query-options-api)
- [Expo Router: typed routes](https://docs.expo.dev/router/reference/typed-routes/)
