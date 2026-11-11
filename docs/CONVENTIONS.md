# Conventions and team rules

## Folder rules

The app is split into **modules** (business areas) made of **features** (vertical slices). See
[ARCHITECTURE.md](ARCHITECTURE.md).

| Put this…                                        | …here                                                                      |
| ------------------------------------------------ | -------------------------------------------------------------------------- |
| A new business area                              | `src/modules/<module>/` ([recipe](ADDING-A-MODULE.md))                     |
| A new use case (screen, widget, action)          | `src/modules/<module>/features/<feature>/` ([recipe](ADDING-A-FEATURE.md)) |
| A route (URL)                                    | `src/app/...`, a thin file that renders a module's screen                  |
| A tab                                            | `src/app/(tabs)/` (+ register it in `(tabs)/_layout.tsx`)                  |
| A full-screen page (details, form)               | `src/app/` (outside `(tabs)`), registered in `src/app/_layout.tsx`         |
| An API path                                      | `src/modules/<module>/data/<module>.endpoints.ts`                          |
| A data shape or form validation                  | `src/modules/<module>/data/<resource>.schema.ts`                           |
| A function that calls the backend                | `src/modules/<module>/data/<resource>.service.ts`                          |
| Query keys                                       | `src/modules/<module>/data/<resource>.keys.ts`                             |
| A read hook used by several features             | `src/modules/<module>/data/<resource>.queries.ts`                          |
| A write hook (`useMutation`)                     | `src/modules/<module>/features/<feature>/use-<action>.ts`                  |
| A component used by one feature                  | that feature's folder                                                      |
| A component used by several features of a module | `src/modules/<module>/components/`                                         |
| Route builders (`xRoutes.detail(id)`)            | `src/modules/<module>/<module>.routes.ts`                                  |
| A component used everywhere, no business words   | `src/shared/components/`                                                   |
| A shadcn-style primitive                         | `src/shared/ui/` (via the RNR CLI)                                         |
| A generic hook                                   | `src/shared/hooks/`                                                        |
| A helper function / singleton                    | `src/shared/lib/`                                                          |

**Never** put non-route files inside `src/app/`: Expo Router would treat them as screens.

## Naming

- Files: `kebab-case.tsx` (`product-card.tsx`, `use-debounced-value.ts`)
- Components: `PascalCase` (`ProductCard`)
- Hooks: start with `use` (`useProductList`)
- File suffixes: `*.endpoints.ts`, `*.schema.ts`, `*.service.ts`, `*.keys.ts`, `*.queries.ts`,
  `*.cache.ts`, `*.routes.ts`, `*-screen.tsx`, `use-*.ts`
- Folders: modules are nouns (`catalog`, `orders`); features describe a use case
  (`product-list`, `create-order`)
- Tests: `__tests__/<file>.test.ts` next to the code

## Code rules

1. **Import a module only through its public API** (`@/modules/catalog`). ESLint enforces it.
2. **Inside a module, use relative imports.** Between features, only `../<feature>` (its index).
3. **`src/shared` never imports modules or routes.**
4. **UI never imports a service or the HTTP client.** It calls a hook.
5. **No `fetch` outside `src/shared/api/http-client.ts`.**
6. **No URLs outside `<module>.endpoints.ts`** (and `.env` for the base URL).
7. **Validate API responses with zod** in the service.
8. **Every data screen handles 4 states**: loading, error (with retry), empty, data.
9. **Only theme tokens for colors** (`bg-primary`, not `bg-indigo-500` or `#4f46e5`).
10. **Text goes inside `<Text>` from `@/shared/ui/text`.**
11. **Navigate with route builders** (`catalogRoutes.detail(id)`), not hand-typed paths.
12. **Secrets never go in `EXPO_PUBLIC_*` variables**: they end up inside the app.
13. **Add libraries with `npx expo install`.**
14. **Add every new shared component to the UI Sandbox** (`src/shared/sandbox/`), and module
    components to that module's showcase.
15. **Every module and feature has a `README.md`** (copy the references in `src/modules/catalog`).

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
