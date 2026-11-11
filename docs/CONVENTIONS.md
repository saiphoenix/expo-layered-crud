# Conventions and team rules

## Folder rules

| Put this…                            | …here                                                              |
| ------------------------------------ | ------------------------------------------------------------------ |
| A tab                                | `src/app/(tabs)/` (+ register it in `(tabs)/_layout.tsx`)          |
| A full-screen page (details, form)   | `src/app/` (outside `(tabs)`), registered in `src/app/_layout.tsx` |
| An API path                          | `src/api/endpoints.ts`                                             |
| A function that calls the backend    | `src/services/<resource>.service.ts`                               |
| A hook that reads/writes server data | `src/queries/<resource>.queries.ts` / `.mutations.ts`              |
| A data shape or form validation      | `src/schemas/<resource>.schema.ts`                                 |
| A component used by one feature      | `src/components/<feature>/`                                        |
| A component used everywhere          | `src/components/common/`                                           |
| A shadcn-style primitive             | `src/components/ui/` (via the RNR CLI)                             |
| A generic hook                       | `src/hooks/`                                                       |
| A helper function / singleton        | `src/lib/`                                                         |

**Never** put non-route files inside `src/app/`: Expo Router would treat them as screens.

## Naming

- Files: `kebab-case.tsx` (`product-card.tsx`, `use-debounced-value.ts`)
- Components: `PascalCase` (`ProductCard`)
- Hooks: start with `use` (`useProductList`)
- Layer suffixes: `*.service.ts`, `*.queries.ts`, `*.mutations.ts`, `*.schema.ts`
- Tests: `__tests__/<file>.test.ts` next to the code

## Code rules

1. **Respect the layers.** UI → `@/queries` → `@/services` → `@/api`. ESLint enforces it.
2. **No `fetch` outside `src/api/http-client.ts`.**
3. **No URLs outside `src/api/endpoints.ts`** (and `.env` for the base URL).
4. **Validate API responses with zod** in the service layer.
5. **Every data screen handles 4 states**: loading, error (with retry), empty, data.
6. **Only theme tokens for colors** (`bg-primary`, not `bg-indigo-500` or `#4f46e5`).
7. **Text goes inside `<Text>` from `@/components/ui/text`.**
8. **Use the `@/` import alias** (`@/components/ui/button`), not long `../../..` paths.
9. **Secrets never go in `EXPO_PUBLIC_*` variables**: they end up inside the app.
10. **Add libraries with `npx expo install`.**
11. **Add every new shared component to the UI Sandbox** (`src/components/sandbox/`).

## Git workflow

1. Create a branch from `main`: `git checkout -b feat/user-list`
2. Commit small, focused changes with [Conventional Commits](https://www.conventionalcommits.org):
   - `feat: add users list screen`
   - `fix: keep search text after refresh`
   - `docs: explain cache strategy`
   - `refactor: extract product thumbnail`
   - `chore: bump expo-image`
3. Run `npm run validate` before pushing.
4. Open a pull request and fill in the template.

## Pull request checklist

- [ ] `npm run validate` passes
- [ ] Tested on at least one platform (iOS / Android / web). Mention which one in the PR.
- [ ] Checked light **and** dark mode
- [ ] Loading, error and empty states handled
- [ ] No hard-coded colors, URLs, or `console.log` left behind
- [ ] New shared components added to the UI Sandbox
- [ ] Docs updated if behaviour or setup changed
