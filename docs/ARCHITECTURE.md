# Architecture

This app is split into **layers**. Each layer has one job and only talks to the layer directly
below it.

```
  UI layer             src/app/**, src/components/**
     │                 "Show things. React to taps."
     ▼
  React Query layer    src/queries/**
     │                 "Remember server data. Track loading/error. Keep the cache in sync."
     ▼
  Service layer        src/services/**
     │                 "What can we ask the backend? Is the answer valid?"
     ▼
  API layer            src/api/**
     │                 "Send HTTP requests. Turn every failure into an ApiError."
     ▼
  Server               https://dummyjson.com
```

Next to the layers sits `src/schemas/`, which **every layer** may import. It holds the zod
schemas and the TypeScript types made from them.

---

## Why layers?

| Without layers                                      | With layers                                               |
| --------------------------------------------------- | --------------------------------------------------------- |
| `fetch('https://...')` copy-pasted in 12 screens    | One `http-client.ts`. Changing the base URL is one line.  |
| Every screen has its own `useState(loading)` logic  | React Query gives `isPending`, `isError`, `data` for free |
| A changed API field crashes a random screen         | The zod schema fails in one place, with a clear error     |
| Can't test logic without rendering screens          | Services are plain functions, easy to unit-test           |
| Moving to a new backend means touching every screen | Change the services and API layer; screens don't change   |

---

## Layer by layer

### 1. API layer: `src/api/`

| File             | Responsibility                                                                               |
| ---------------- | -------------------------------------------------------------------------------------------- |
| `http-client.ts` | The **only** `fetch` in the app. Base URL, query strings, JSON, a 15 s timeout, cancellation |
| `endpoints.ts`   | Every API path in one object (`endpoints.products.byId(5)` → `/products/5`)                  |
| `api-error.ts`   | `ApiError` with a `kind`: `network` · `timeout` · `http` · `parse`                           |
| `parse.ts`       | `parseResponse(schema, data)`: validates server data with zod                                |

Every failure (no internet, timeout, 404, 500, unexpected JSON) becomes an **`ApiError`**, so the
rest of the app only handles one error type. `getErrorMessage(error)` gives a user-friendly message.

> **Adding auth later?** Add the `Authorization` header in `http-client.ts`, once, and every
> request gets it.

### 2. Service layer: `src/services/`

```ts
export const productsService = {
  list({ limit, skip, search }, signal?) { ... },   // GET /products or /products/search
  getById(id, signal?) { ... },                     // GET /products/:id
  create(payload) { ... },                          // POST /products/add
  update(id, payload) { ... },                      // PUT /products/:id
  remove(id) { ... },                               // DELETE /products/:id
  categories(signal?) { ... },                      // GET /products/categories
};
```

Rules:

- **No React.** No hooks, no components, no `useState`.
- Uses `http` from `@/api`, never `fetch`.
- **Validates every response** with a zod schema before returning it. Callers get typed,
  trusted data.

Because services are plain functions, they are tested with a fake `fetch`
(`src/services/__tests__/products.service.test.ts`).

### 3. React Query layer: `src/queries/`

This is the layer screens use. It turns services into **hooks**.

| File                     | Contains                                                                              |
| ------------------------ | ------------------------------------------------------------------------------------- |
| `query-keys.ts`          | `productKeys`: the cache "addresses"                                                  |
| `products.queries.ts`    | `productQueries` (reusable options) + `useProductList`, `useProduct`, `useCategories` |
| `products.mutations.ts`  | `useCreateProduct`, `useUpdateProduct`, `useDeleteProduct`                            |
| `products.cache.ts`      | Helpers that edit cached lists (add / replace / remove a product)                     |
| `local-only-products.ts` | Demo-API workaround. **Delete it when you use a real backend.**                       |
| `../lib/query-client.ts` | The `QueryClient` and its defaults (stale time, retry rules, app-focus/online wiring) |

#### Query keys

```ts
productKeys.all; // ['products']
productKeys.lists(); // ['products', 'list']
productKeys.list({ search: '' }); // ['products', 'list', { search: '' }]
productKeys.detail(5); // ['products', 'detail', 5]
productKeys.categories(); // ['products', 'categories']
```

Keys are hierarchical. `invalidateQueries({ queryKey: productKeys.lists() })` targets **every**
list, whatever the search term. Never write key arrays by hand; always use the factory.

#### Default behaviour (`src/lib/query-client.ts`)

| Setting             | Value                                   | Meaning                                                          |
| ------------------- | --------------------------------------- | ---------------------------------------------------------------- |
| `staleTime`         | 5 min                                   | Data counts as fresh for 5 min, so there's no refetch on revisit |
| `gcTime`            | 10 min                                  | Unused data stays in memory for 10 min                           |
| `retry` (queries)   | 2, but **never** on 4xx or parse errors | Retrying a 404 can't succeed                                     |
| `retry` (mutations) | off                                     | A retried POST could create duplicates                           |
| App focus           | `AppState` → `focusManager`             | Stale data refetches when the app returns to the foreground      |
| Online status       | `expo-network` → `onlineManager`        | Paused requests resume when the connection comes back            |

### 4. UI layer: `src/app/` and `src/components/`

- `src/app/` contains **screens** (Expo Router routes). They call hooks from `@/queries` and decide
  what to render for each state: **loading → error → empty → data**.
- `src/components/` holds **presentational** components, in three levels (see
  [THEMING.md → Component layers](THEMING.md#component-layers-and-the-ui-sandbox)). They receive data and callbacks as props
  and don't fetch anything. (Exception: `CategoryPickerSheet` calls `useCategories()`, because the
  sheet owns its data and loads it only when opened.)
- `src/components/ui/` is **React Native Reusables**: generic, unstyled-by-business building blocks.

### Enforced by ESLint

`eslint.config.js` contains rules that fail the build if you skip a layer:

```
✖ src/app/** or src/components/** imports '@/services/...'
     "UI must not call services directly. Use a hook from @/queries instead."
✖ src/app/** or src/components/** imports '@/api/http-client'
✖ any file except src/api/http-client.ts uses fetch(...)
```

---

## Navigation

```
Root Stack  (src/app/_layout.tsx)
├── (tabs)                       Bottom tab bar  (src/app/(tabs)/_layout.tsx)
│   ├── index        "/"           Home
│   ├── products     "/products"   Products list
│   └── settings     "/settings"   Settings
├── products/[id]    "/products/5"        details       ┐
├── products/[id]/edit                    edit form     │ pushed ON TOP of the tabs:
├── products/new                          create form   │ full screen, no tab bar
└── ui-sandbox       "/ui-sandbox"        UI Sandbox    ┘
```

This "tabs inside a stack" layout is what most production apps use. Detail and form screens cover
the tab bar, and the back button returns to the tab you came from.

- A folder in parentheses, like `(tabs)`, is a **group**: it organises files without changing the URL.
- `unstable_settings.initialRouteName = '(tabs)'` makes deep links (e.g. opening `/products/5`
  directly) still have the tabs underneath, so "back" works.
- `freezeOnBlur: true` stops hidden screens from re-rendering until you come back to them.

### A note on FlashList and hidden screens

When you delete a product from the details screen, the cached list shrinks while the Products
list is hidden underneath. FlashList v2 can crash in that situation
([Shopify/flash-list#2440](https://github.com/Shopify/flash-list/issues/2440), still open).
The Products screen therefore passes its data through `useValueWhileFocused`
(`src/hooks/use-value-while-focused.ts`): while the screen is hidden, the list keeps its last
data and only updates once it's visible again. Use the same hook for any FlashList whose data
can change while another screen is on top.

---

## Following each CRUD operation end to end

### READ: the list

```
ProductsScreen (src/app/(tabs)/products.tsx)
  └─ useProductList('phone')                            src/queries/products.queries.ts
       └─ useInfiniteQuery(productQueries.list('phone'))
            key:      ['products', 'list', { search: 'phone' }]
            queryFn:  productsService.list({ limit: 20, skip: 0, search: 'phone' }, signal)
                        └─ http.get('/products/search', { query: { limit, skip, q } })
                             └─ fetch('https://dummyjson.com/products/search?limit=20&skip=0&q=phone')
                        └─ parseResponse(productListResponseSchema, json)
            getNextPageParam: skip + limit < total ? skip + limit : undefined
            select:   flattens pages → { products, total }
```

- Typing in the search box updates `search`. `useDebouncedValue` waits 400 ms, then the key
  changes and React Query fetches (or reuses the cached result for that term).
- Scrolling near the end calls `fetchNextPage()`.
- Pull-to-refresh calls `refetch()`.
- If the user leaves before the request finishes, React Query aborts it (`signal`).

### READ: one product

```
ProductDetailScreen → useProduct(5)
  key: ['products', 'detail', 5]
  initialData: the product found in any cached list   ← the screen renders instantly
  queryFn: productsService.getById(5)                  ← only if the list copy is stale
```

### CREATE

```
NewProductScreen → <ProductForm onSubmit=…>
  1. react-hook-form + zodResolver(productFormSchema) validate the inputs
     ("12.5" text → 12.5 number, title length, category required, ...)
  2. useCreateProduct().mutateAsync(values)
       mutationFn: productsService.create(values)  → POST /products/add
       onSuccess:  setQueryData(detail(id), product)
                   prependProductToList(...)        ← new item shows at the top of the list
  3. router.replace('/products/[id]')               ← show the new product
  On error: the form shows an <Alert> with getErrorMessage(error)
```

### UPDATE

```
EditProductScreen → useProduct(id) to pre-fill → <ProductForm requireChanges>
  useUpdateProduct().mutateAsync({ id, payload })
    mutationFn: productsService.update(id, payload) → PUT /products/:id
    onSuccess:  setQueryData(detail(id), updated)
                replaceProductInLists(...)       ← every list showing it updates
  router.back()
```

### DELETE (optimistic)

```
useDeleteProduct().mutate(id)
  onMutate:   cancel in-flight list fetches
              snapshot = current lists
              removeProductFromLists(id)        ← disappears from the UI immediately
  mutationFn: productsService.remove(id)        → DELETE /products/:id
  onError:    restore snapshot                  ← it comes back + an alert explains why
```

---

## Mutations: "update the cache" vs "invalidate"

There are two standard ways to refresh the UI after a write:

| Strategy                                  | How                                                                | When to use                                                                |
| ----------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| **Invalidate** (simplest)                 | `queryClient.invalidateQueries({ queryKey: productKeys.lists() })` | Real backend; you're happy to re-download the list                         |
| **Update the cache directly** (used here) | `setQueryData` / `setQueriesData` with the server response         | Faster UI, no spinner; needed when the backend doesn't persist (DummyJSON) |

With a real backend you can combine them: update the cache for instant feedback, _then_ invalidate
to make sure everything matches the server.

---

## The DummyJSON workaround

DummyJSON fakes writes: a new product always comes back as id `195`, and `GET /products/195`
returns 404 afterwards. `src/queries/local-only-products.ts` therefore:

1. gives each created product a unique id on the device (`100000`, `100001`, ...), and
2. tells `useProduct` / `useUpdateProduct` / `useDeleteProduct` **not to call the server** for
   those ids.

It is clearly marked, and all of it lives in the React Query layer. **Services, the API client
and the screens contain no demo-specific code.** To switch to a real backend:

1. Delete `src/queries/local-only-products.ts`.
2. Remove the `isLocalProduct` / `toLocalProduct` usages (TypeScript shows you where).
3. Optionally add `invalidateQueries` in the mutations' `onSuccess`.
