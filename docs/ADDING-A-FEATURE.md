# Adding a feature: step-by-step recipe

Example: we want a **Users** screen using DummyJSON's `/users` endpoint.
Build it **bottom-up**, one layer at a time. Each step is small and testable.

> Tip: open the matching `products` file next to each new file and copy its structure.

---

## 1. Endpoints: `src/api/endpoints.ts`

```ts
export const endpoints = {
  products: { ... },
  users: {
    list: '/users',
    byId: (id: number) => `/users/${id}`,
  },
} as const;
```

## 2. Schema and types: `src/schemas/user.schema.ts`

Check the real response first, in your browser or with
`curl https://dummyjson.com/users?limit=1`. Only list the fields you use.

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

## 3. Service: `src/services/users.service.ts`

```ts
import { endpoints, http, parseResponse } from '@/api';
import { userListResponseSchema, userSchema } from '@/schemas/user.schema';

export const usersService = {
  async list({ limit, skip }: { limit: number; skip: number }, signal?: AbortSignal) {
    const data = await http.get(endpoints.users.list, { query: { limit, skip }, signal });
    return parseResponse(userListResponseSchema, data);
  },
  async getById(id: number, signal?: AbortSignal) {
    const data = await http.get(endpoints.users.byId(id), { signal });
    return parseResponse(userSchema, data);
  },
};
```

✅ Add a test in `src/services/__tests__/users.service.test.ts`, copying the products test.

## 4. Query keys + hooks: `src/queries/`

```ts
// query-keys.ts
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  detail: (id: number) => [...userKeys.all, 'detail', id] as const,
};
```

```ts
// users.queries.ts
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';
import { usersService } from '@/services/users.service';
import { userKeys } from './query-keys';

export const userQueries = {
  list: () =>
    infiniteQueryOptions({
      queryKey: userKeys.lists(),
      queryFn: ({ pageParam, signal }) => usersService.list({ limit: 20, skip: pageParam }, signal),
      initialPageParam: 0,
      getNextPageParam: (last) =>
        last.skip + last.limit < last.total ? last.skip + last.limit : undefined,
    }),
};

export function useUserList() {
  return useInfiniteQuery({
    ...userQueries.list(),
    select: (data) => data.pages.flatMap((page) => page.users),
  });
}
```

Export the hook from `src/queries/index.ts`.

## 5. Components: `src/components/users/user-card.tsx`

A pure component: props in, UI out. Use `Text`, `Card`, `Icon` from `@/components/ui` and
theme classes (`bg-card`, `text-muted-foreground`...).

## 6. Screen

Decide where it lives:

- **As a new tab:** `src/app/(tabs)/users.tsx`, and add a `<Tabs.Screen name="users" … />` with an
  icon in `src/app/(tabs)/_layout.tsx`.
- **As a full-screen page** (opened from somewhere else): `src/app/users/index.tsx`, and register
  it in `src/app/_layout.tsx`.

Example `src/app/(tabs)/users.tsx`:

```tsx
export default function UsersScreen() {
  const users = useUserList();

  if (users.isPending) return <LoadingState />;
  if (users.isError) return <ErrorState error={users.error} onRetry={users.refetch} />;

  return (
    <FlashList
      data={users.data}
      keyExtractor={(u) => String(u.id)}
      renderItem={({ item }) => <UserCard user={item} />}
      onEndReached={() => users.hasNextPage && users.fetchNextPage()}
      ListEmptyComponent={<EmptyState icon={Users} title="No users" />}
    />
  );
}
```

If other screens can delete users while this list is hidden, wrap the data with
`useValueWhileFocused` (see ARCHITECTURE.md → "A note on FlashList and hidden screens").

## 7. Check everything

```bash
npm run validate
```

---

## Checklist

- [ ] Endpoint added to `endpoints.ts` (no URLs anywhere else)
- [ ] zod schema matches the **real** API response
- [ ] Service validates responses with `parseResponse`
- [ ] Query keys use a factory; hooks exported from `@/queries`
- [ ] Screen handles **loading, error, empty and data**
- [ ] Only theme color classes, no hex colors
- [ ] Mutations update or invalidate the cache
- [ ] Service test added
- [ ] New shared components added to the UI Sandbox
- [ ] `npm run validate` passes
