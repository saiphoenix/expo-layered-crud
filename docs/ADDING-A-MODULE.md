# Adding a module: step-by-step recipe

Example: a **users** module, using DummyJSON's `/users` endpoint, with a "Users" tab (list) and a
user details page.

> **Reference:** open [src/modules/catalog/](../src/modules/catalog/README.md) next to you and copy
> the matching file each time. Create a module only for a **new business area**. A new screen in
> an existing area is a _feature_: see [ADDING-A-FEATURE.md](ADDING-A-FEATURE.md).

Final shape:

```
src/modules/users/
├── README.md
├── index.ts
├── users.routes.ts
├── data/
│   ├── users.endpoints.ts
│   ├── user.schema.ts
│   ├── users.service.ts
│   ├── user.keys.ts
│   ├── user.queries.ts
│   └── __tests__/users.service.test.ts
└── features/
    ├── user-list/      index.ts · user-list-screen.tsx · user-card.tsx · README.md
    └── user-detail/    index.ts · user-detail-screen.tsx · README.md
```

Build it **bottom-up**: data first, then features, then routes. Run `npm run typecheck` after
each step.

---

## 1. Endpoints: `data/users.endpoints.ts`

```ts
export const usersEndpoints = {
  list: '/users',
  byId: (id: number) => `/users/${id}`,
} as const;
```

## 2. Schema and types: `data/user.schema.ts`

Look at the real response first: `curl "https://dummyjson.com/users?limit=1"`. List only the
fields you use; zod drops the rest.

```ts
import { z } from 'zod';

export const userSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  image: z.string().optional(),
});

export const userListResponseSchema = z.object({
  users: z.array(userSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export type User = z.output<typeof userSchema>;
```

## 3. Service: `data/users.service.ts`

```ts
import { http, parseResponse } from '@/shared/api';

import { usersEndpoints } from './users.endpoints';
import { userListResponseSchema, userSchema } from './user.schema';

export const usersService = {
  async list({ limit, skip }: { limit: number; skip: number }, signal?: AbortSignal) {
    const data = await http.get(usersEndpoints.list, { query: { limit, skip }, signal });
    return parseResponse(userListResponseSchema, data);
  },
  async getById(id: number, signal?: AbortSignal) {
    const data = await http.get(usersEndpoints.byId(id), { signal });
    return parseResponse(userSchema, data);
  },
};
```

✅ Add `data/__tests__/users.service.test.ts` by copying
`catalog/data/__tests__/products.service.test.ts`.

## 4. Query keys: `data/user.keys.ts`

Start with the module's own root (`'users'`) so keys never clash with other modules.

```ts
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  detail: (id: number) => [...userKeys.all, 'detail', id] as const,
};
```

## 5. Read hooks: `data/user.queries.ts`

```ts
import {
  infiniteQueryOptions,
  queryOptions,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';

import { userKeys } from './user.keys';
import { usersService } from './users.service';

export const userQueries = {
  list: () =>
    infiniteQueryOptions({
      queryKey: userKeys.lists(),
      queryFn: ({ pageParam, signal }) => usersService.list({ limit: 20, skip: pageParam }, signal),
      initialPageParam: 0,
      getNextPageParam: (last) =>
        last.skip + last.limit < last.total ? last.skip + last.limit : undefined,
    }),
  detail: (id: number) =>
    queryOptions({
      queryKey: userKeys.detail(id),
      queryFn: ({ signal }) => usersService.getById(id, signal),
    }),
};

export function useUserList() {
  return useInfiniteQuery({
    ...userQueries.list(),
    select: (data) => data.pages.flatMap((page) => page.users),
  });
}

export function useUser(id: number) {
  return useQuery({ ...userQueries.detail(id), enabled: Number.isFinite(id) });
}
```

## 6. Routes: `users.routes.ts`

```ts
import type { Href } from 'expo-router';

export const usersRoutes = {
  list: '/users' as const satisfies Href,
  detail: (id: number) => ({ pathname: '/users/[id]', params: { id: String(id) } }) satisfies Href,
};
```

> TypeScript only knows `/users` after the route **files** exist (step 9) and the dev server has
> regenerated typed routes. If you see an error here, finish step 9 and run `npx expo start` once.

## 7. Features

Follow [ADDING-A-FEATURE.md](ADDING-A-FEATURE.md) for each one:

- `features/user-list/` → `UserListScreen` (copy `catalog/features/product-list`)
- `features/user-detail/` → `UserDetailScreen({ userId })` (copy `catalog/features/product-detail`)

## 8. Public API: `index.ts`

Export only what routes and other modules need:

```ts
export { usersRoutes } from './users.routes';
export { UserListScreen } from './features/user-list';
export { UserDetailScreen } from './features/user-detail';
export type { User } from './data/user.schema';
```

## 9. Route files in `src/app`

- **As a tab:** `src/app/(tabs)/users.tsx`

  ```ts
  export { UserListScreen as default } from '@/modules/users';
  ```

  and add `<Tabs.Screen name="users" options={{ title: 'Users', tabBarIcon: tabIcon(Users) }} />`
  to `src/app/(tabs)/_layout.tsx`.

- **Detail page:** `src/app/users/[id].tsx`

  ```tsx
  import { useLocalSearchParams } from 'expo-router';
  import { UserDetailScreen } from '@/modules/users';

  export default function UserDetailRoute() {
    const { id } = useLocalSearchParams<{ id: string }>();
    return <UserDetailScreen userId={Number(id)} />;
  }
  ```

  and register `<Stack.Screen name="users/[id]" options={{ title: 'User' }} />` in
  `src/app/_layout.tsx`.

## 10. README and sandbox

- Add `src/modules/users/README.md`: what the module owns, folder map, public API table.
- Components other modules could reuse? Export a `UsersShowcase` and add it to the UI Sandbox
  "Modules" tab (`src/modules/settings/features/ui-sandbox/ui-sandbox-screen.tsx`).

## 11. Check everything

```bash
npm run validate
```

---

## Checklist

- [ ] `src/modules/<name>/` with `index.ts`, `<name>.routes.ts`, `data/`, `features/`, `README.md`
- [ ] Endpoints only in `data/<name>.endpoints.ts`
- [ ] zod schema matches the **real** API response
- [ ] Service validates responses with `parseResponse`; service test added
- [ ] Query keys use a factory with the module's own root key
- [ ] Route files in `src/app` are thin and import only `@/modules/<name>`
- [ ] No imports into another module's internals (ESLint passes)
- [ ] Every screen handles loading, error, empty and data
- [ ] Only theme color classes, no hex colors
- [ ] `npm run validate` passes

## Read more

- [Kamil Grzybek: Modular Monolith, a Primer](https://www.kamilgrzybek.com/blog/posts/modular-monolith-primer): why modules have public APIs
- [Martin Fowler: Bounded Context](https://martinfowler.com/bliki/BoundedContext.html): how to decide where one module ends
- [Bulletproof React: project structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)
- [TkDodo: Effective React Query Keys](https://tkdodo.eu/blog/effective-react-query-keys)
- [Expo Router: introduction](https://docs.expo.dev/router/introduction/)
