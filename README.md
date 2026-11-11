# Expo Layered CRUD

A **production-style starter app** built with [Expo](https://expo.dev) and React Native.
It shows how to build a real **CRUD** feature (**C**reate, **R**ead, **U**pdate, **D**elete) with a
clean, layered architecture, using a real public API ([DummyJSON](https://dummyjson.com/docs/products)).
It has no fake backend and no mock server.

> **New to the project?** Start with [docs/GETTING-STARTED.md](docs/GETTING-STARTED.md).
> It takes you from an empty laptop to a running app, step by step.

---

## Table of contents

1. [What the app does](#what-the-app-does)
2. [Tech stack](#tech-stack)
3. [Quick start](#quick-start)
4. [Available scripts](#available-scripts)
5. [Project structure](#project-structure)
6. [Architecture in 60 seconds](#architecture-in-60-seconds)
7. [About the API (please read)](#about-the-api-please-read)
8. [Theming and dark mode](#theming-and-dark-mode)
9. [Known issues](#known-issues)
10. [Troubleshooting](#troubleshooting)
11. [Further documentation](#further-documentation)

---

## What the app does

The app has **three bottom tabs**, plus full-screen pages that open on top of them:

| Tab / screen      | What's in it                                                                                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 🏠 **Home**       | Dashboard: product and category counts, quick actions, a "Top rated" carousel, an architecture overview                                                      |
| 📦 **Products**   | The CRUD feature (table below)                                                                                                                               |
| ⚙️ **Settings**   | Theme (Light / Dark / System), **UI Sandbox**, "Reset cached data", app info                                                                                 |
| 🎨 **UI Sandbox** | Every UI component in one place: **Primitives** (React Native Reusables) and **Composed** (our own components built on them). Open it from Settings or Home. |

| Operation  | Where                                        | What happens                                                                                |
| ---------- | -------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **Read**   | Products tab (`src/app/(tabs)/products.tsx`) | Infinite-scroll list, debounced search, pull-to-refresh, skeleton loader                    |
| **Read**   | Product details (`products/[id]`)            | Image gallery, price and discount, rating, stock, tags; opens instantly from the list cache |
| **Create** | `+` button → New product                     | Form validated with zod; category picked from a bottom sheet                                |
| **Update** | Details → Edit, or `⋮` → Edit product        | Same form, pre-filled; the Save button is enabled only when something changed               |
| **Delete** | Details → Delete, or `⋮` → Delete            | Confirmation dialog, then an **optimistic** delete (rolls back on error)                    |

Also included: a light/dark mode toggle, loading/error/empty states, haptic feedback,
data fetching that knows when the phone is offline, and unit tests.

---

## Tech stack

| Concern       | Library                                                                        | Why                                                         |
| ------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| Framework     | [Expo SDK 58](https://docs.expo.dev/) + React Native 0.88 + React 19           | The standard way to build React Native apps today           |
| Navigation    | [Expo Router](https://docs.expo.dev/router/introduction/)                      | File-based routing: every file in `src/app` is a screen     |
| Server state  | [TanStack Query v5](https://tanstack.com/query/latest) (React Query)           | Caching, loading states, retries, pagination                |
| Styling       | [NativeWind v4](https://www.nativewind.dev/) (Tailwind CSS for React Native)   | `className="..."`, theme tokens as CSS variables, dark mode |
| UI components | [React Native Reusables](https://reactnativereusables.com/) (shadcn/ui for RN) | Copied into `src/components/ui`, so you own the code        |
| Icons         | [lucide-react-native](https://lucide.dev/)                                     | A clean, consistent icon set                                |
| Animation     | [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/) | Runs animations on the UI thread, so they stay smooth       |
| Bottom sheets | [@gorhom/bottom-sheet](https://gorhom.dev/react-native-bottom-sheet/)          | Native-feeling sheets                                       |
| Lists         | [@shopify/flash-list](https://shopify.github.io/flash-list/)                   | Fast lists that reuse rows                                  |
| Images        | [expo-image](https://docs.expo.dev/versions/latest/sdk/image/)                 | Caching, transitions, recycling support                     |
| Forms         | [react-hook-form](https://react-hook-form.com/) + [zod](https://zod.dev/)      | Fast forms, with one schema for both validation and types   |
| Quality       | TypeScript (strict), ESLint, Prettier, Jest, GitHub Actions CI                 | Catch bugs before users do                                  |

A longer explanation of each library, with the files where it is used, is in
[docs/LIBRARIES.md](docs/LIBRARIES.md).

---

## Quick start

### Prerequisites

| Tool            | Version                                                                                   | Check with      |
| --------------- | ----------------------------------------------------------------------------------------- | --------------- |
| Node.js         | **22 LTS** (or 20.19.4+ / 24.3+)                                                          | `node -v`       |
| npm             | comes with Node                                                                           | `npm -v`        |
| Git             | any recent version                                                                        | `git --version` |
| A way to run it | iOS Simulator (Mac + Xcode), Android Emulator (Android Studio), a phone, or a web browser |                 |

### Run it

```bash
# 1. Get the code
git clone <this-repo-url> expo-layered-crud
cd expo-layered-crud

# 2. Install dependencies (always use npm in this project; package-lock.json is committed)
npm install

# 3. (Optional) create your .env file. The defaults already work.
cp .env.example .env

# 4. Start the development server
npm start
```

When the dev server is running, press a key in the terminal:

| Key | Opens the app on         |
| --- | ------------------------ |
| `i` | iOS Simulator (Mac only) |
| `a` | Android Emulator         |
| `w` | Web browser              |
| `r` | Reload the app           |
| `m` | Open the developer menu  |

### Running on a physical phone

This project uses **Expo SDK 58**, the SDK supported by the current Expo Go app in the App Store /
Play Store. On a **physical phone**:

1. **Expo Go (quickest):** install Expo Go from the store, run `npm start`, then scan the QR code
   (iOS: Camera app; Android: Expo Go's scanner). Phone and computer must be on the same Wi-Fi.
   If they can't see each other, use `npx expo start --tunnel`.
2. **Development build (recommended for teams):** `npx expo run:ios` or `npx expo run:android`
   (needs Xcode / Android Studio), or build in the cloud with
   [EAS Build](https://docs.expo.dev/develop/development-builds/create-a-build/).

On **simulators and emulators** you don't need to do anything: `npm start`, then `i` or `a`,
installs the correct Expo Go version automatically.

---

## Available scripts

| Command             | What it does                                                        |
| ------------------- | ------------------------------------------------------------------- |
| `npm start`         | Start the Expo dev server                                           |
| `npm run ios`       | Start and open the iOS Simulator                                    |
| `npm run android`   | Start and open the Android Emulator                                 |
| `npm run web`       | Start and open in the browser                                       |
| `npm run typecheck` | Check TypeScript types                                              |
| `npm run lint`      | Run ESLint (includes the **layer rules**, see below)                |
| `npm run lint:fix`  | Auto-fix lint problems                                              |
| `npm run format`    | Format every file with Prettier (also sorts Tailwind classes)       |
| `npm test`          | Run the unit tests (Jest)                                           |
| `npm run validate`  | **Run before every commit / PR**: typecheck + lint + format + tests |
| `npm run doctor`    | Check Expo dependencies and config for problems                     |

CI (`.github/workflows/ci.yml`) runs `npm run validate` on every push and pull request.

---

## Project structure

```
src/
├── app/                        # SCREENS (Expo Router: file name = URL)
│   ├── _layout.tsx             #   root Stack: providers + (tabs) + full-screen pages
│   ├── (tabs)/                 #   BOTTOM TABS ("(tabs)" is not part of the URL)
│   │   ├── _layout.tsx         #     tab bar: Home · Products · Settings
│   │   ├── index.tsx           #     "/"          Home dashboard
│   │   ├── products.tsx        #     "/products"  products list   (READ)
│   │   └── settings.tsx        #     "/settings"  theme, UI Sandbox link, app info
│   ├── ui-sandbox.tsx          #   "/ui-sandbox"          every UI component
│   ├── products/new.tsx        #   "/products/new"        create form     (CREATE)
│   ├── products/[id]/index.tsx #   "/products/123"        details         (READ + DELETE)
│   ├── products/[id]/edit.tsx  #   "/products/123/edit"   edit form       (UPDATE)
│   └── +not-found.tsx          #   any unknown route
│
├── queries/                    # REACT QUERY LAYER (the hooks screens use)
│   ├── query-keys.ts           #   cache key factory
│   ├── products.queries.ts     #   useProductList, useProduct, useCategories
│   ├── products.mutations.ts   #   useCreateProduct, useUpdateProduct, useDeleteProduct
│   ├── products.cache.ts       #   helpers that edit cached lists after a mutation
│   └── local-only-products.ts  #   ⚠️ demo-API workaround (see "About the API")
│
├── services/                   # SERVICE LAYER (plain async functions, no React)
│   └── products.service.ts     #   list / getById / create / update / remove / categories
│
├── api/                        # API LAYER (the only place that talks HTTP)
│   ├── http-client.ts          #   fetch wrapper: base URL, timeout, JSON, errors
│   ├── endpoints.ts            #   ALL API paths in one place
│   ├── api-error.ts            #   ApiError: the one error type the app handles
│   └── parse.ts                #   validates responses with zod
│
├── schemas/                    # DATA SHAPES (zod): API models + form validation + TS types
│   └── product.schema.ts
│
├── components/
│   ├── ui/                     #   1. PRIMITIVES: React Native Reusables (Button, Text, Input, Dialog, ...)
│   ├── common/                 #   2. COMPOSED: app-wide components built from primitives
│   ├── products/               #   3. FEATURE: product-specific UI (card, form, sheets, dialog)
│   └── sandbox/                #   the UI Sandbox showcases
│
├── providers/app-providers.tsx # all app-wide providers in one place
├── lib/                        # query client, theme, utils, formatting, haptics
├── hooks/                      # reusable hooks (debounce, theme colors)
├── config/env.ts               # environment variables
└── global.css                  # THEME TOKENS (light + dark colors)
```

---

## Architecture in 60 seconds

```
┌────────────────────────────┐
│  Screens & Components      │  src/app, src/components  → only render UI and call hooks
└─────────────┬──────────────┘
              │ useProductList(), useCreateProduct(), ...
┌─────────────▼──────────────┐
│  React Query layer         │  src/queries              → caching, loading/error state,
└─────────────┬──────────────┘                             pagination, cache updates
              │ productsService.list(), .create(), ...
┌─────────────▼──────────────┐
│  Service layer             │  src/services             → "what can we ask the backend?"
└─────────────┬──────────────┘                             + validates responses with zod
              │ http.get('/products'), http.post(...)
┌─────────────▼──────────────┐
│  API layer                 │  src/api                  → the ONLY place that calls fetch
└─────────────┬──────────────┘
              ▼
       https://dummyjson.com
```

**The one rule:** each layer only talks to the layer directly below it.
ESLint enforces this: if a screen imports from `@/services` or calls `fetch`, `npm run lint` fails.

For the full explanation, with a step-by-step trace of every CRUD operation, see
**[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**.

---

## About the API (please read)

We use **DummyJSON** (`https://dummyjson.com/products`), a free public REST API.

- **Reads are real.** 194 real products, with search and pagination.
- **Writes are simulated.** `POST` / `PUT` / `DELETE` respond exactly like a real server
  (status codes, returned JSON), **but nothing is saved on the server.**

What that means while you test:

| You do this                      | You see this                                                              |
| -------------------------------- | ------------------------------------------------------------------------- |
| Create / edit / delete a product | The change appears instantly (we update the React Query cache)            |
| Pull to refresh, or restart app  | The original server data comes back. **This is expected with DummyJSON.** |

DummyJSON always returns the same id (`195`) for a new product, and the product doesn't exist on
the server afterwards. So `src/queries/local-only-products.ts` gives each new product a unique id
on the device. **When you connect a real backend, delete that file.** Then, in the mutations, you
can replace the cache updates with `queryClient.invalidateQueries(...)` if you prefer re-fetching.
See the comments in `src/queries/products.mutations.ts`.

To use your own API, set `EXPO_PUBLIC_API_URL` in `.env`, then update `src/api/endpoints.ts`
and `src/schemas/product.schema.ts`.

---

## Theming and dark mode

- All colors are **tokens** (CSS variables) in [`src/global.css`](src/global.css): one block for
  light mode (`:root`) and one for dark mode (`.dark:root`).
- Use them through Tailwind classes: `bg-background`, `text-foreground`, `bg-primary`,
  `text-muted-foreground`, `border-border`, `bg-destructive`, ...
- **Never hard-code colors** like `#fff` or `text-gray-500` in components. Then dark mode works
  automatically.
- Need a color in JavaScript (navigation header, an icon's `color` prop, a bottom sheet
  background)? Use `useThemeColors()`, which reads from `src/lib/theme.ts`.
- The sun/moon button in the header switches between light and dark mode; Settings also offers
  **System** (follow the phone).
- Open **Settings → UI Sandbox** to see every component, and every token, in both modes.

For details, and for how to re-brand the app, see **[docs/THEMING.md](docs/THEMING.md)**.

---

## Known issues

| Issue                                                                                                                          | Impact                              | Plan                                                       |
| ------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------- | ---------------------------------------------------------- |
| **FlashList v2 crash when data shrinks while the list is hidden** ([#2440](https://github.com/Shopify/flash-list/issues/2440)) | Handled: see `useValueWhileFocused` | Remove the workaround once FlashList fixes it.             |
| **DummyJSON doesn't save writes**                                                                                              | Changes disappear after refresh     | Expected. See [About the API](#about-the-api-please-read). |

---

## Troubleshooting

| Problem                                                 | Fix                                                                                                                  |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Styles not applied, or odd colors after a config change | `npx expo start --clear` (clears the Metro cache)                                                                    |
| "Project is incompatible with this version of Expo Go"  | You're on a physical phone with the latest Expo Go. See [Running on a physical phone](#running-on-a-physical-phone). |
| `npm install` errors about peer dependencies            | Delete `node_modules` and run `npm install` again. Don't mix npm, yarn and pnpm.                                     |
| You want to add a library                               | Use `npx expo install <package>` (not `npm install`), so you get a version that matches the SDK.                     |
| Engine warnings (`EBADENGINE`) during install           | Use Node 22 LTS (`nvm install 22 && nvm use 22`).                                                                    |
| Created products disappear after a refresh              | Expected: DummyJSON doesn't save writes. See [About the API](#about-the-api-please-read).                            |

---

## Further documentation

| Document                                             | Read it when                                       |
| ---------------------------------------------------- | -------------------------------------------------- |
| [docs/GETTING-STARTED.md](docs/GETTING-STARTED.md)   | It's your first day                                |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)         | You want to understand how data flows              |
| [docs/ADDING-A-FEATURE.md](docs/ADDING-A-FEATURE.md) | You need to add a new resource or screen           |
| [docs/THEMING.md](docs/THEMING.md)                   | You're styling something or adding UI components   |
| [docs/LIBRARIES.md](docs/LIBRARIES.md)               | You wonder why a library is here and how it's used |
| [docs/CONVENTIONS.md](docs/CONVENTIONS.md)           | You're about to open your first pull request       |

---

## License

MIT. See [LICENSE](LICENSE).
