# Feature reference: `product-list`

> **This is the reference feature.** When you add a feature to any module, copy this folder's
> shape. The step-by-step recipe is in
> [docs/ADDING-A-FEATURE.md](../../../../../docs/ADDING-A-FEATURE.md).

**User story:** _As a shopper, I can scroll through all products, search them, pull to refresh,
and open, edit or delete a product from the list._

Route: `/products` (the Products tab), file `src/app/(tabs)/products.tsx`.

---

## What is a feature?

A **feature** is one use case, built as a **vertical slice**: a thin cut through every layer
(screen → hook → service → API), kept together in one folder. To understand, change or delete
the feature you open **one folder**, not five.

```
        HORIZONTAL (by layer)                 VERTICAL (by feature)  ← this project
  ┌──────────────────────────────┐      ┌────────┬────────┬────────┬────────┐
  │ screens/   (all screens)     │      │  list  │ detail │ create │ delete │
  ├──────────────────────────────┤      │ screen │ screen │ screen │ dialog │
  │ hooks/     (all hooks)       │      │ hooks  │ hooks  │ hooks  │ hooks  │
  ├──────────────────────────────┤      │   │    │   │    │   │    │   │    │
  │ services/  (all services)    │      │   ▼    │   ▼    │   ▼    │   ▼    │
  └──────────────────────────────┘      │  module data layer (data/)        │
  A change touches every layer folder   └───────────────────────────────────┘
                                         A change stays inside one column
```

---

## Files

| File                        | Role                                                     | Private?                      |
| --------------------------- | -------------------------------------------------------- | ----------------------------- |
| `index.ts`                  | **Public API** of the feature                            | public                        |
| `product-list-screen.tsx`   | The screen: search box, list, FAB, actions sheet, dialog | exported                      |
| `product-card.tsx`          | One row of the list                                      | exported (UI Sandbox uses it) |
| `product-list-skeleton.tsx` | Placeholder rows while the first page loads              | exported (UI Sandbox uses it) |
| `product-actions-sheet.tsx` | Bottom sheet: View / Edit / Delete                       | private                       |
| `README.md`                 | This file                                                | –                             |

### What it uses from outside the folder

| Import                                      | From                         | Why                                |
| ------------------------------------------- | ---------------------------- | ---------------------------------- |
| `useProductList`                            | `../../data/product.queries` | read hook shared by the module     |
| `Product` type                              | `../../data/product.schema`  | the data shape                     |
| `catalogRoutes`                             | `../../catalog.routes`       | navigate without typing paths      |
| `DeleteProductDialog`, `useDeleteProduct`   | `../delete-product`          | another feature, **via its index** |
| `ProductThumbnail`, `StockBadge`            | `../../components`           | UI shared inside the module        |
| `EmptyState`, `Input`, `useDebouncedValue`… | `@/shared/...`               | generic building blocks            |

Notice what's **missing**: no `fetch`, no URLs, no service import, no query keys. The screen only
renders UI and calls hooks.

---

## How it works

```
ProductListScreen
 ├─ search text ── useDebouncedValue(400 ms) ──► useProductList(search)
 │                                                 └─ useInfiniteQuery(productQueries.list(search))
 │                                                      key ['products','list',{search}]
 ├─ isPending   → <ProductListSkeleton />
 ├─ isError     → <ErrorState onRetry={refetch} />
 ├─ empty       → <EmptyState />
 └─ data        → <FlashList>
                    onEndReached → fetchNextPage()     (infinite scroll)
                    onRefresh    → refetch()            (pull to refresh)
                    long-press or ⋯ → ProductActionsSheet → View / Edit / Delete
                                                         └─ DeleteProductDialog → useDeleteProduct (optimistic)
```

Every data screen handles the **four states**: loading → error → empty → data.

`useValueWhileFocused` keeps the last list while the screen is hidden, which works around a
FlashList crash when items are deleted from another screen
([flash-list#2440](https://github.com/Shopify/flash-list/issues/2440)).

---

## Checklist for any new feature (copy this)

- [ ] One folder: `src/modules/<module>/features/<feature-name>/` (kebab-case, a verb or a noun
      phrase: `create-order`, `order-history`)
- [ ] `index.ts` exports only what other code needs
- [ ] A screen component (named export, e.g. `OrderHistoryScreen`), registered by a thin route
      file in `src/app`, and exported from the module's `index.ts`
- [ ] Data through hooks: reads from `data/*.queries.ts`; writes in a `use-<action>.ts` hook in
      the feature
- [ ] Loading, error, empty and data states
- [ ] Navigation through `<module>Routes`
- [ ] Only theme color classes (`bg-card`, `text-primary`…)
- [ ] Imports from siblings only via `../<feature>`
- [ ] A `README.md` with the user story and a file table like this one
- [ ] `npm run validate` passes

---

## Read more

| Topic                                 | Article                                                                                                                |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Vertical slices                       | [Jimmy Bogard: Vertical Slice Architecture](https://www.jimmybogard.com/vertical-slice-architecture/)                  |
| Keeping files together                | [Kent C. Dodds: Colocation](https://kentcdodds.com/blog/colocation)                                                    |
| Feature folders in React              | [Robin Wieruch: React Folder Structure in 5 Steps](https://www.robinwieruch.de/react-folder-structure/)                |
| Infinite queries & React Query basics | [TanStack Query overview](https://tanstack.com/query/latest/docs/framework/react/overview)                             |
| Practical React Query habits          | [TkDodo: Practical React Query](https://tkdodo.eu/blog/practical-react-query)                                          |
| Optimistic delete with rollback       | [TanStack Query: Optimistic Updates](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates) |
| Fast lists                            | [FlashList documentation](https://shopify.github.io/flash-list/)                                                       |
| Thinking in components                | [React: Thinking in React](https://react.dev/learn/thinking-in-react)                                                  |
