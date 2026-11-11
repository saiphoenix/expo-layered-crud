# `src/shared`: code every module may use

Shared code is **business-agnostic**: it knows nothing about products, users or orders. You could
copy this folder into another app and it would still make sense. ESLint stops anything in here
from importing `@/modules/*` or `@/app/*`.

| Folder        | Contains                                                                                  |
| ------------- | ----------------------------------------------------------------------------------------- |
| `api/`        | `http-client.ts` (the **only** `fetch`), `ApiError`, `parseResponse` (zod validation)     |
| `ui/`         | React Native Reusables primitives (button, text, card, dialog…). Add with the RNR CLI     |
| `components/` | Our composed, app-wide components: screen states, form field, bottom sheet, settings row… |
| `hooks/`      | Generic hooks: debounced value, theme colors, theme preference, value-while-focused       |
| `lib/`        | Helpers and singletons: `query-client.ts`, `format.ts`, `haptics.ts`, `theme.ts`, `cn()`  |
| `config/`     | `env.ts`: typed `EXPO_PUBLIC_*` variables                                                 |
| `providers/`  | `AppProviders`: gestures, keyboard, React Query, navigation theme, bottom sheets          |
| `sandbox/`    | UI Sandbox building blocks for primitives and shared components                           |

**Rule of thumb:** code goes into `shared` only when (1) at least two modules need it **and**
(2) it has no business words in it. Otherwise keep it in the module.

Read more: [Bulletproof React: project structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)
