# Architecture

This app is built to **scale vertically**: code is grouped by **business feature**, not by
technical layer. The approach is called
[Vertical Slice Architecture](https://www.jimmybogard.com/vertical-slice-architecture/), organised
as a [modular monolith](https://www.kamilgrzybek.com/blog/posts/modular-monolith-primer).

> **Reference code:** the [catalog module](../src/modules/catalog/README.md) and its
> [product-list feature](../src/modules/catalog/features/product-list/README.md) are documented
> as the examples to copy.

---

## The big picture

```
src/
├── app/          ROUTES (Expo Router). Thin: read URL params, render a module's screen.
│
├── modules/      BUSINESS CODE. One folder per business area.
│   ├── catalog/      products: list, detail, create, edit, delete, top-rated   ★ module reference
│   │   ├── index.ts      public API (the only door in)
│   │   ├── data/         endpoints, schemas, service, query keys, read hooks, cache helpers
│   │   ├── components/   UI shared by several catalog features
│   │   └── features/     one folder per use case (vertical slice)
│   │       └── product-list/                                                 ★ feature reference
│   ├── home/         dashboard that composes other modules' widgets
│   └── settings/     preferences + UI Sandbox
│
├── shared/       BUSINESS-AGNOSTIC code every module may use
│   ├── api/          http-client (the only fetch), ApiError, parseResponse
│   ├── ui/           React Native Reusables primitives
│   ├── components/   app-wide composed components
│   ├── hooks/ lib/ config/ providers/ sandbox/
│
└── global.css    theme tokens (light + dark)
```

Three kinds of folders, three questions:

| Folder        | Answers                         | May import                                                       |
| ------------- | ------------------------------- | ---------------------------------------------------------------- |
| `src/app`     | "Which URL shows which screen?" | `@/modules/<name>` public APIs, `@/shared`                       |
| `src/modules` | "What does the business do?"    | its own files (relative), other modules' public APIs, `@/shared` |
| `src/shared`  | "What does any app need?"       | only `@/shared` and libraries. **Never** modules                 |

---

## Horizontal vs vertical

The first version of this starter was **horizontal**: `src/queries`, `src/services`,
`src/schemas`, `src/components/products`. Adding one feature meant touching five folders, and in a
big app each of those folders grows to hundreds of files owned by nobody in particular.

```
     HORIZONTAL (by layer)                    VERTICAL (by feature)
  screens/   ████████████████████          catalog/   orders/    users/
  hooks/     ████████████████████          ┌──────┐  ┌──────┐  ┌──────┐
  services/  ████████████████████          │screen│  │screen│  │screen│
  schemas/   ████████████████████          │hooks │  │hooks │  │hooks │
                                           │data  │  │data  │  │data  │
  one change = edit every row              └──────┘  └──────┘  └──────┘
                                           one change = edit one column
```

| Horizontal                                      | Vertical (this project)                                   |
| ----------------------------------------------- | --------------------------------------------------------- |
| Files for one feature are spread across folders | One feature = one folder                                  |
| Teams collide in the same shared folders        | Each team owns a module                                   |
| Deleting a feature leaves dead code behind      | Delete the folder, fix the route, done                    |
| Anything can import anything                    | Each module and feature has a small public API            |
| Hard to see what the app _does_                 | `src/modules/*/features/*` reads like a list of use cases |

**The layers didn't disappear.** Inside every feature the request still flows
screen → hook → service → HTTP client. Vertical slicing changes **where files live**, not the
good layering rules
([Presentation-Domain-Data layering](https://martinfowler.com/bliki/PresentationDomainDataLayering.html)).

---

## Module vs feature

| Term        | Is                                                                                      | Example                          | Contains                                                              |
| ----------- | --------------------------------------------------------------------------------------- | -------------------------------- | --------------------------------------------------------------------- |
| **Module**  | A business area ([bounded context](https://martinfowler.com/bliki/BoundedContext.html)) | `catalog`, `orders`, `auth`      | `index.ts`, `<module>.routes.ts`, `data/`, `components/`, `features/` |
| **Feature** | One use case: a vertical slice                                                          | `product-list`, `create-product` | `index.ts`, screen and/or widget, write hooks, private components     |

- A **module's `data/` folder** is shared by its features: the same product schema, service and
  cache are used by list, detail, create, edit and delete.
- **Read hooks** (`useProductList`, `useProduct`) live in `data/*.queries.ts` because many features
  read the same data.
- **Write hooks** (`useCreateProduct`) live in the feature that performs the write.
- A feature can be a **screen** (`product-list`), a **widget** (`top-rated`) or **behaviour with
  no screen** (`delete-product`: a hook + a dialog).

---

## The import rules (enforced by ESLint)

`eslint.config.js` fails the build if you break a border:

| #   | Rule                                                                       | Example of an error                                    |
| --- | -------------------------------------------------------------------------- | ------------------------------------------------------ |
| 1   | Outside a module, import **only its public API** `@/modules/<name>`        | `import … from '@/modules/catalog/data/product.keys'`  |
| 2   | `src/shared` **never** imports `@/modules/*` or `@/app/*`                  | a shared hook importing `@/modules/catalog`            |
| 3   | A feature imports a sibling feature **only via its index**                 | `import … from '../delete-product/use-delete-product'` |
| 4   | UI files (`.tsx`) never import a `*.service` or `@/shared/api/http-client` | a screen calling `productsService.list()`              |
| 5   | Only `src/shared/api/http-client.ts` may call `fetch`                      | `fetch('https://…')` in a hook                         |

Inside a module, use **relative** imports (`../../data/product.queries`). Use `@/shared/...` for
shared code and `@/modules/<name>` for other modules.

> Two modules should not import each other (a cycle). If both need the same thing, it either
> belongs in `src/shared` (no business words) or in a third module.

Reference: [ESLint no-restricted-imports](https://eslint.org/docs/latest/rules/no-restricted-imports).

---

## The layers inside a slice

```
  Route          src/app/(tabs)/products.tsx                  "Which screen for this URL?"
     │
  Feature UI     modules/catalog/features/product-list/       "Show things. React to taps."
     ▼
  Hooks          modules/catalog/data/product.queries.ts       "Remember server data. Track loading/error.
     │           modules/catalog/features/*/use-*.ts             Keep the cache in sync."
     ▼
  Service        modules/catalog/data/products.service.ts      "What can we ask the backend? Is the answer valid?"
     ▼
  HTTP client    shared/api/http-client.ts                     "Send HTTP requests. Turn every failure into an ApiError."
     ▼
  Server         https://dummyjson.com
```

### HTTP client: `src/shared/api/`

| File             | Responsibility                                                                               |
| ---------------- | -------------------------------------------------------------------------------------------- |
| `http-client.ts` | The **only** `fetch` in the app. Base URL, query strings, JSON, a 15 s timeout, cancellation |
| `api-error.ts`   | `ApiError` with a `kind`: `network` · `timeout` · `http` · `parse`                           |
| `parse.ts`       | `parseResponse(schema, data)`: validates server data with zod                                |

Every failure becomes an **`ApiError`**, so the rest of the app handles one error type.
`getErrorMessage(error)` gives a user-friendly message.

> **Adding auth later?** Add the `Authorization` header in `http-client.ts`, once, and every
> request in every module gets it.

### Endpoints: `src/modules/<module>/data/<module>.endpoints.ts`

Each module owns its API paths (`catalogEndpoints.products.byId(5)` → `/products/5`). No URL
strings anywhere else.

### Service: `src/modules/<module>/data/<resource>.service.ts`

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

- **No React.** Plain async functions.
- Uses `http` from `@/shared/api`, never `fetch`.
- **Validates every response** with zod before returning it.
- Tested with a fake `fetch` (`data/__tests__/products.service.test.ts`).

### Hooks: React Query

| File                         | Contains                                                                  |
| ---------------------------- | ------------------------------------------------------------------------- |
| `data/product.keys.ts`       | `productKeys`: the cache "addresses"                                      |
| `data/product.queries.ts`    | `productQueries` (reusable options) + read hooks used by several features |
| `data/product.cache.ts`      | Helpers that edit cached lists (add / replace / remove a product)         |
| `features/*/use-*.ts`        | Write hooks: `useCreateProduct`, `useUpdateProduct`, `useDeleteProduct`   |
| `shared/lib/query-client.ts` | The `QueryClient` and its defaults                                        |

#### Query keys

```ts
productKeys.all; // ['products']
productKeys.lists(); // ['products', 'list']
productKeys.list({ search: '' }); // ['products', 'list', { search: '' }]
productKeys.detail(5); // ['products', 'detail', 5]
productKeys.categories(); // ['products', 'categories']
```

Keys are hierarchical. `invalidateQueries({ queryKey: productKeys.lists() })` targets **every**
list. Never write key arrays by hand; each module has its own factory, starting with its own root
(`['products']`, `['users']`…) so modules never clash.
([Effective React Query Keys](https://tkdodo.eu/blog/effective-react-query-keys))

#### Default behaviour (`src/shared/lib/query-client.ts`)

| Setting             | Value                                   | Meaning                                                          |
| ------------------- | --------------------------------------- | ---------------------------------------------------------------- |
| `staleTime`         | 5 min                                   | Data counts as fresh for 5 min, so there's no refetch on revisit |
| `gcTime`            | 10 min                                  | Unused data stays in memory for 10 min                           |
| `retry` (queries)   | 2, but **never** on 4xx or parse errors | Retrying a 404 can't succeed                                     |
| `retry` (mutations) | off                                     | A retried POST could create duplicates                           |
| App focus           | `AppState` → `focusManager`             | Stale data refetches when the app returns to the foreground      |
| Online status       | `expo-network` → `onlineManager`        | Paused requests resume when the connection comes back            |

### UI

- **Route files** in `src/app` are one-liners (`export { ProductListScreen as default } from
'@/modules/catalog'`) or read URL params and pass them as props. Keep them thin: Expo Router
  treats every file in `src/app` as a screen
  ([non-route files go outside `app`](https://docs.expo.dev/router/reference/src-directory/)).
- **Feature screens** call hooks and render **loading → error → empty → data**.
- **Components** receive data and callbacks as props and don't fetch. (Widgets like
  `TopRatedCarousel` and `CategoryPickerSheet` own their data on purpose.)
- Component levels: `shared/ui` (primitives) → `shared/components` (app-wide) →
  `modules/<m>/components` (module-wide) → `modules/<m>/features/<f>` (one feature). See
  [THEMING.md](THEMING.md#component-layers-and-the-ui-sandbox).

---

## Navigation

```
Root Stack  (src/app/_layout.tsx)
├── (tabs)                       Bottom tab bar  (src/app/(tabs)/_layout.tsx)
│   ├── index        "/"           → modules/home         HomeScreen
│   ├── products     "/products"   → modules/catalog      ProductListScreen
│   └── settings     "/settings"   → modules/settings     SettingsScreen
├── products/[id]    "/products/5"  → ProductDetailScreen   ┐
├── products/[id]/edit              → EditProductScreen     │ pushed ON TOP of the tabs:
├── products/new                    → CreateProductScreen   │ full screen, no tab bar
└── ui-sandbox       "/ui-sandbox"  → UiSandboxScreen       ┘
```

- Screens navigate with **route builders** (`router.push(catalogRoutes.detail(5))`), so paths
  are typed once per module. They're checked by
  [typed routes](https://docs.expo.dev/router/reference/typed-routes/).
- A folder in parentheses, like `(tabs)`, is a **group**: it organises files without changing the URL.
- `unstable_settings.anchor = '(tabs)'` makes deep links (e.g. opening `/products/5`
  directly) still have the tabs underneath, so "back" works.
- `freezeOnBlur: true` stops hidden screens from re-rendering until you come back to them.

### A note on FlashList and hidden screens

When you delete a product from the details screen, the cached list shrinks while the Products
list is hidden underneath. FlashList v2 can crash in that situation
([Shopify/flash-list#2440](https://github.com/Shopify/flash-list/issues/2440), still open).
The product list therefore passes its data through `useValueWhileFocused`
(`src/shared/hooks/use-value-while-focused.ts`). Use the same hook for any FlashList whose data
can change while another screen is on top.

---

## Following each CRUD operation end to end

### READ: the list (`features/product-list`)

```
src/app/(tabs)/products.tsx → ProductListScreen
  └─ useProductList('phone')                            data/product.queries.ts
       └─ useInfiniteQuery(productQueries.list('phone'))
            key:      ['products', 'list', { search: 'phone' }]
            queryFn:  productsService.list({ limit: 20, skip: 0, search: 'phone' }, signal)
                        └─ http.get(catalogEndpoints.products.search, { query: { limit, skip, q } })
                             └─ fetch('https://dummyjson.com/products/search?limit=20&skip=0&q=phone')
                        └─ parseResponse(productListResponseSchema, json)
            getNextPageParam: skip + limit < total ? skip + limit : undefined
            select:   flattens pages → { products, total }
```

- Typing updates `search`; `useDebouncedValue` waits 400 ms, then the key changes.
- Scrolling near the end calls `fetchNextPage()`. Pull-to-refresh calls `refetch()`.
- Leaving the screen aborts the request (`signal`).

### READ: one product (`features/product-detail`)

```
src/app/products/[id]/index.tsx reads id → <ProductDetailScreen productId={5} />
  └─ useProduct(5)
       key: ['products', 'detail', 5]
       initialData: the product found in any cached list   ← renders instantly
       queryFn: productsService.getById(5)                  ← only if the list copy is stale
```

### CREATE (`features/create-product`)

```
CreateProductScreen → <ProductForm onSubmit=…>              components/product-form.tsx
  1. react-hook-form + zodResolver(productFormSchema) validate the inputs
  2. useCreateProduct().mutateAsync(values)                 features/create-product/use-create-product.ts
       mutationFn: productsService.create(values)  → POST /products/add
       onSuccess:  setQueryData(detail(id), product)
                   prependProductToList(...)        ← shows at the top of the list
  3. router.replace(catalogRoutes.detail(id))
  On error: the form shows an <Alert> with getErrorMessage(error)
```

### UPDATE (`features/edit-product`)

```
EditProductScreen → useProduct(id) to pre-fill → <ProductForm requireChanges>
  useUpdateProduct().mutateAsync({ id, payload })
    mutationFn: productsService.update(id, payload) → PUT /products/:id
    onSuccess:  setQueryData(detail(id), updated)
                replaceProductInLists(...)       ← every list showing it updates
  router.back()
```

### DELETE, optimistic (`features/delete-product`)

```
useDeleteProduct().mutate(id)
  onMutate:   cancel in-flight list fetches
              snapshot = current lists
              removeProductFromLists(id)        ← disappears immediately
  mutationFn: productsService.remove(id)        → DELETE /products/:id
  onError:    restore snapshot                  ← it comes back + an alert explains why
```

([Optimistic updates guide](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates))

---

## Mutations: "update the cache" vs "invalidate"

| Strategy                                  | How                                                                | When to use                                                                |
| ----------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| **Invalidate** (simplest)                 | `queryClient.invalidateQueries({ queryKey: productKeys.lists() })` | Real backend; you're happy to re-download the list                         |
| **Update the cache directly** (used here) | `setQueryData` / `setQueriesData` with the server response         | Faster UI, no spinner; needed when the backend doesn't persist (DummyJSON) |

With a real backend you can combine them: update the cache for instant feedback, _then_ invalidate.
([Mastering Mutations](https://tkdodo.eu/blog/mastering-mutations-in-react-query))

---

## The DummyJSON workaround

DummyJSON fakes writes: a new product always comes back as id `195`, and `GET /products/195`
returns 404 afterwards. `src/modules/catalog/data/local-only-products.ts` therefore gives each
created product a unique id on the device and tells the hooks not to call the server for those
ids. To switch to a real backend: delete that file, remove the `isLocalProduct` /
`toLocalProduct` usages (TypeScript shows you where), optionally add `invalidateQueries`.

---

## How this scales

| When the app grows to…      | Do this                                                                                     |
| --------------------------- | ------------------------------------------------------------------------------------------- |
| A new business area         | New module: [ADDING-A-MODULE.md](ADDING-A-MODULE.md)                                        |
| A new use case in an area   | New feature folder: [ADDING-A-FEATURE.md](ADDING-A-FEATURE.md)                              |
| Several teams               | Each team owns modules; add a `CODEOWNERS` file mapping `src/modules/<name>/` to a team     |
| A module that's too big     | Split it by sub-domain (e.g. `catalog` → `catalog` + `inventory`), each with its own API    |
| Logic shared by two modules | Generic → `src/shared`. Business → a new module both depend on                              |
| Very large codebase         | Each module can become a workspace package later; the public-API rule makes that move cheap |

---

## Read more

| Topic                                 | Link                                                                                                                                                                            |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vertical Slice Architecture           | [Jimmy Bogard](https://www.jimmybogard.com/vertical-slice-architecture/)                                                                                                        |
| Modular monolith                      | [Kamil Grzybek: Modular Monolith, a Primer](https://www.kamilgrzybek.com/blog/posts/modular-monolith-primer)                                                                    |
| Bounded contexts                      | [Martin Fowler](https://martinfowler.com/bliki/BoundedContext.html)                                                                                                             |
| Layers                                | [Martin Fowler: Presentation Domain Data Layering](https://martinfowler.com/bliki/PresentationDomainDataLayering.html)                                                          |
| Feature-Sliced Design (a full method) | [feature-sliced.design](https://feature-sliced.design/docs/get-started/overview)                                                                                                |
| React project structure               | [Bulletproof React](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md) · [Robin Wieruch](https://www.robinwieruch.de/react-folder-structure/) |
| Colocation                            | [Kent C. Dodds](https://kentcdodds.com/blog/colocation)                                                                                                                         |
| React Query                           | [Practical React Query](https://tkdodo.eu/blog/practical-react-query) · [Query Options API](https://tkdodo.eu/blog/the-query-options-api)                                       |
| Expo Router                           | [Introduction](https://docs.expo.dev/router/introduction/) · [src directory](https://docs.expo.dev/router/reference/src-directory/)                                             |
