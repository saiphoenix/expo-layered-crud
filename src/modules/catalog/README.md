# Module reference: `catalog`

> **This is the reference module.** When you create a new module (`users`, `orders`, `auth`…),
> copy this folder's shape. The step-by-step recipe is in
> [docs/ADDING-A-MODULE.md](../../../docs/ADDING-A-MODULE.md).

The catalog module owns everything about **products**: listing, searching, viewing, creating,
editing and deleting them, plus a "top rated" widget that other modules can show.

---

## What is a module?

A **module** is one business area of the app (a
[bounded context](https://martinfowler.com/bliki/BoundedContext.html)). It is a mini-app inside
the app:

- It **owns its data**: endpoints, schemas, service, query keys, cache helpers.
- It is made of **features** (vertical slices), one folder per use case.
- It exposes a small **public API** (`index.ts`). Everything else is private.

Think of the app as a **modular monolith**: one codebase, but split into modules with clear
borders, so many people can work in parallel without stepping on each other.

---

## Folder map

```
src/modules/catalog/
├── README.md                ← you are here
├── index.ts                 ← PUBLIC API: the only file other code may import
├── catalog.routes.ts        ← route builders: catalogRoutes.detail(5) → /products/5
│
├── data/                    ← the module's data layer, shared by all its features
│   ├── catalog.endpoints.ts     every API path of this module
│   ├── product.schema.ts        zod schemas + TypeScript types (API data and form input)
│   ├── products.service.ts      plain async functions that call the API and validate answers
│   ├── product.keys.ts          query-key factory: the cache "addresses"
│   ├── product.queries.ts       queryOptions + READ hooks (useProductList, useProduct, …)
│   ├── product.cache.ts         helpers that edit cached lists after a write
│   ├── local-only-products.ts   DummyJSON workaround (delete with a real backend)
│   └── __tests__/               unit tests for the schema and the service
│
├── components/              ← UI shared by SEVERAL features of this module
│   ├── product-form.tsx         used by create-product and edit-product
│   ├── category-picker-sheet.tsx
│   ├── product-thumbnail.tsx
│   ├── stock-badge.tsx
│   └── catalog-showcase.tsx     this module's section of the UI Sandbox
│
└── features/                ← one folder per use case (vertical slice)
    ├── product-list/            ★ FEATURE REFERENCE (see its README)
    ├── product-detail/
    ├── create-product/
    ├── edit-product/
    ├── delete-product/          a feature with no screen: hook + dialog
    └── top-rated/               a widget feature, rendered by the Home module
```

### Where does a new file go?

| The code is used by…                      | Put it in…                                  |
| ----------------------------------------- | ------------------------------------------- |
| one feature only                          | that feature's folder                       |
| several features of this module           | `components/` (UI) or `data/` (data, types) |
| other modules too                         | export it from `index.ts`                   |
| any app, with no product knowledge at all | `src/shared/`                               |

Start **inside the feature**. Move code "up" only when a second feature needs it
([colocation](https://kentcdodds.com/blog/colocation)).

---

## How a request flows through the module

```
src/app/(tabs)/products.tsx              route: one line, renders the screen
  └─ features/product-list/product-list-screen.tsx      UI: renders loading / error / empty / data
       └─ data/product.queries.ts  useProductList()       React Query: cache, loading state, pagination
            └─ data/products.service.ts  list()           service: what can we ask the backend?
                 └─ @/shared/api  http.get(catalogEndpoints.products.list)
                      └─ fetch → https://dummyjson.com/products
                 └─ parseResponse(productListResponseSchema, json)   zod validation
```

The **layers** (UI → hooks → service → HTTP client) still exist. They now live **inside** each
module instead of in global `src/queries`, `src/services` folders. That's the "vertical" part:
one feature is a thin slice cut through all the layers.

---

## The public API (`index.ts`)

| Export                                                                                 | Used by                      |
| -------------------------------------------------------------------------------------- | ---------------------------- |
| `catalogRoutes`                                                                        | Home (buttons), any module   |
| `ProductListScreen`, `ProductDetailScreen`, `CreateProductScreen`, `EditProductScreen` | route files in `src/app`     |
| `TopRatedCarousel`, `useProductCount`, `useCategories`                                 | Home dashboard               |
| `Product`, `Category` types                                                            | anyone who needs the type    |
| `CatalogShowcase`                                                                      | UI Sandbox (settings module) |

Not exported on purpose: the service, query keys, cache helpers, mutation hooks. Other modules
can't break them because they can't reach them. ESLint blocks deep imports such as
`@/modules/catalog/data/products.service`.

---

## Rules for this module (and every module)

1. **Outside code imports only `@/modules/catalog`.** Inside the module, use relative paths.
2. **Features import each other only through their `index.ts`** (`../delete-product`, never
   `../delete-product/use-delete-product`).
3. **No URL strings** outside `data/catalog.endpoints.ts`.
4. **Every API response is validated** with zod in the service (`parseResponse`).
5. **Query keys only from `product.keys.ts`.**
6. **UI never imports the service.** It calls a hook.
7. **Navigation uses `catalogRoutes`**, not hand-typed paths.
8. A module **must not import another module's internals**, and two modules should not import
   each other (circular). If both need something, move it to `src/shared` (generic) or into a
   third module.

---

## The DummyJSON workaround

DummyJSON fakes writes: every new product comes back as id `195`, and fetching it later gives a 404. `data/local-only-products.ts` gives created products a unique local id and stops the hooks
from asking the server about them. It's all in `data/` plus the three write hooks. **To use a
real backend**, delete that file and follow the TypeScript errors; then you can add
`invalidateQueries` in the mutations' `onSuccess`.

---

## Read more

| Topic                                  | Article                                                                                                                     |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Vertical slices (the core idea)        | [Jimmy Bogard: Vertical Slice Architecture](https://www.jimmybogard.com/vertical-slice-architecture/)                       |
| Modules with clear borders             | [Kamil Grzybek: Modular Monolith, a Primer](https://www.kamilgrzybek.com/blog/posts/modular-monolith-primer)                |
| What a "business area" is              | [Martin Fowler: Bounded Context](https://martinfowler.com/bliki/BoundedContext.html)                                        |
| Feature folders in React               | [Bulletproof React: project structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md) |
| A full methodology for feature slicing | [Feature-Sliced Design: overview](https://feature-sliced.design/docs/get-started/overview)                                  |
| Layers inside a slice                  | [Martin Fowler: Presentation Domain Data Layering](https://martinfowler.com/bliki/PresentationDomainDataLayering.html)      |
| Keep code close to where it's used     | [Kent C. Dodds: Colocation](https://kentcdodds.com/blog/colocation)                                                         |
| Query key factories                    | [TkDodo: Effective React Query Keys](https://tkdodo.eu/blog/effective-react-query-keys)                                     |
| `queryOptions` objects                 | [TkDodo: The Query Options API](https://tkdodo.eu/blog/the-query-options-api)                                               |
| Validating API data                    | [Zod documentation](https://zod.dev/)                                                                                       |
| Enforcing the borders                  | [ESLint: no-restricted-imports](https://eslint.org/docs/latest/rules/no-restricted-imports)                                 |
