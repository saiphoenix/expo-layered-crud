# Libraries: what, why and where

Always add libraries with **`npx expo install <name>`**. It picks the version that matches
Expo SDK 58.

## Core

| Library                                                  | What it does                                                                              | Where it's used       |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------- | --------------------- |
| `expo` (SDK 58)                                          | The framework: build tools, config, native modules                                        | everywhere            |
| `react-native` 0.88, `react` 19                          | The UI runtime                                                                            | everywhere            |
| `expo-router`                                            | File-based navigation. `src/app/products/[id]/edit.tsx` is the route `/products/123/edit` | `src/app/**`          |
| `react-native-screens`, `react-native-safe-area-context` | Native screen containers; notch/home-indicator padding (`useSafeAreaInsets`)              | layouts, FAB, footers |
| `typescript` (strict)                                    | Types. Run `npm run typecheck`                                                            | everywhere            |

**React Compiler** is enabled (`app.json → experiments.reactCompiler`). It memoizes components
automatically, so you rarely need `useMemo` / `useCallback`.

## Data

| Library                 | What it does                                                                     | Where                                       |
| ----------------------- | -------------------------------------------------------------------------------- | ------------------------------------------- |
| `@tanstack/react-query` | Server-state cache: loading/error flags, retries, pagination, background refresh | `src/queries/**`, `src/lib/query-client.ts` |
| `zod` (v4)              | Runtime validation + TypeScript types from one schema                            | `src/schemas/**`, `src/api/parse.ts`        |
| `expo-network`          | Tells React Query when the device goes offline/online                            | `src/lib/query-client.ts`                   |
| _(built-in)_ `fetch`    | HTTP. Wrapped once, no axios needed                                              | `src/api/http-client.ts` only               |

## UI & styling

| Library                                                                                           | What it does                                                          | Where                                                                    |
| ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `nativewind` v4 + `tailwindcss` v3                                                                | Tailwind `className` for React Native; CSS-variable tokens; dark mode | `global.css`, `tailwind.config.js`, `babel.config.js`, `metro.config.js` |
| React Native Reusables (`@rn-primitives/*`, `class-variance-authority`, `clsx`, `tailwind-merge`) | shadcn/ui-style components, copied into the repo                      | `src/components/ui/**`                                                   |
| `tailwindcss-animate`                                                                             | Animation utility classes (`animate-pulse` for skeletons)             | `tailwind.config.js`                                                     |
| `lucide-react-native` + `react-native-svg`                                                        | Icons                                                                 | everywhere, via `<Icon as={...} />`                                      |
| `react-native-reanimated` + `react-native-worklets`                                               | 60/120 fps animations on the UI thread                                | FAB, details screen, dialogs, bottom sheets                              |
| `react-native-gesture-handler`                                                                    | Native gestures (needed by bottom sheets)                             | `src/providers/app-providers.tsx`                                        |
| `@gorhom/bottom-sheet`                                                                            | Bottom sheets                                                         | `src/components/common/app-bottom-sheet.tsx`, product sheets             |
| `@shopify/flash-list` (v2)                                                                        | High-performance list that recycles rows                              | `src/app/index.tsx`                                                      |
| `expo-image`                                                                                      | Fast images with disk cache, fade-in, `recyclingKey` for lists        | `product-thumbnail.tsx`, details screen                                  |
| `react-native-keyboard-controller`                                                                | Keeps inputs visible above the keyboard                               | `product-form.tsx` (`KeyboardAwareScrollView`)                           |
| `expo-haptics`                                                                                    | Vibration feedback on success/error/press                             | `src/lib/haptics.ts`                                                     |

## Forms

| Library               | What it does                                            | Where              |
| --------------------- | ------------------------------------------------------- | ------------------ |
| `react-hook-form`     | Form state without re-rendering on every keystroke      | `product-form.tsx` |
| `@hookform/resolvers` | Connects zod schemas to react-hook-form (`zodResolver`) | `product-form.tsx` |

`productFormSchema` (in `src/schemas/product.schema.ts`) is the single source of truth: it
validates inputs, converts `"12.5"` text into the number `12.5`, and produces the
`ProductFormValues` type sent to the API.

## Tooling

| Tool                                                       | Command                                  | Config                     |
| ---------------------------------------------------------- | ---------------------------------------- | -------------------------- |
| ESLint (+ Expo config, TanStack Query plugin, layer rules) | `npm run lint`                           | `eslint.config.js`         |
| Prettier (+ Tailwind class sorting)                        | `npm run format`                         | `.prettierrc`              |
| Jest (`jest-expo` preset)                                  | `npm test`                               | `jest.config.js`           |
| GitHub Actions                                             | runs `npm run validate` on every push/PR | `.github/workflows/ci.yml` |
| expo-doctor                                                | `npm run doctor`                         | none                       |
