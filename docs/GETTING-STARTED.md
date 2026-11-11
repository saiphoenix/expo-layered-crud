# Getting started: your first day

This guide assumes you have **never run a React Native app before**. Follow it top to bottom.
It takes about 30–60 minutes (most of it is downloads).

---

## Step 1: Install the tools

### 1.1 Node.js (required)

Node runs the JavaScript tooling. We recommend installing it with **nvm** (Node Version Manager),
so you can switch versions later.

```bash
# macOS / Linux: install nvm (see https://github.com/nvm-sh/nvm for the latest command)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# restart your terminal, then:
nvm install 22
nvm use 22
node -v   # should print v22.x.x
```

On Windows, use [nvm-windows](https://github.com/coreybutler/nvm-windows) or the installer from
[nodejs.org](https://nodejs.org) (choose the **LTS** version).

### 1.2 Git (required)

```bash
git --version   # if this fails, install Git from https://git-scm.com
```

### 1.3 A code editor (recommended): VS Code

Install [VS Code](https://code.visualstudio.com). When you open this project, VS Code suggests
extensions (`.vscode/extensions.json`). Click **Install All**. They give you:

- **ESLint**: shows lint errors as you type
- **Prettier**: formats files on save
- **Tailwind CSS IntelliSense**: autocompletes `className="..."`
- **Expo Tools**: autocompletes `app.json`

### 1.4 Something to run the app on (pick at least one)

| Option               | Platform    | How to set it up                                                                                                                   |
| -------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Web browser**      | any         | Nothing to install. Easiest way to start, but not 100% the same as a phone.                                                        |
| **iOS Simulator**    | macOS only  | Install **Xcode** from the Mac App Store, open it once, accept the license. [Guide](https://docs.expo.dev/workflow/ios-simulator/) |
| **Android Emulator** | any         | Install **Android Studio** and create a virtual device. [Guide](https://docs.expo.dev/workflow/android-studio-emulator/)           |
| **Your own phone**   | iOS/Android | See "Running on a physical phone" in the [README](../README.md#running-on-a-physical-phone).                                       |

---

## Step 2: Get the code and install dependencies

```bash
git clone <this-repo-url> expo-layered-crud
cd expo-layered-crud
npm install
```

`npm install` downloads every library listed in `package.json` into `node_modules/`.
It takes a minute or two. Warnings (`npm warn ...`) are normal; errors (`npm ERR!`) are not.

Optional: copy the environment file. The defaults already point to the public API.

```bash
cp .env.example .env
```

---

## Step 3: Start the app

```bash
npm start
```

You'll see a QR code and a menu. Press:

- `w` to open it in your **browser**
- `i` to open it in the **iOS Simulator** (first time: it installs Expo Go, so say yes)
- `a` to open it in the **Android Emulator**

You should see the **Home** tab, with a tab bar at the bottom. 🎉

**Things to try:**

1. On **Home**, scroll through "Top rated" and tap a product.
2. Open the **Products** tab and scroll down. More products load automatically (infinite scroll).
3. Type "phone" in the search box.
4. Tap a product to see its details.
5. Tap **Edit**, change the price, and tap **Save changes**.
6. Go back, tap **⋮** on a product, then **Delete product**.
7. Tap the **+** button and create a product.
8. Open **Settings**, switch the theme to Dark, then open the **UI Sandbox** and browse
   both tabs (Primitives / Composed).
9. Pull down on the list to refresh. Your changes disappear: the demo API doesn't save
   anything (see [README → About the API](../README.md#about-the-api-please-read)).

---

## Step 4: Make your first change

Let's prove that **Fast Refresh** works: you save a file and the app updates instantly.

1. Open `src/app/(tabs)/_layout.tsx`.
2. Find `title: 'Products'` and change it to `'My Products'`.
3. Save. The header text changes immediately, without restarting.

Now a styling change:

1. Open `src/components/products/product-card.tsx`.
2. Find `className="text-primary font-bold"` (the price) and change `text-primary` to
   `text-destructive`.
3. Save. Prices turn red, in **both** light and dark mode, because `destructive` is a theme token.
4. Undo your changes (`git checkout .`).

---

## Step 5: Learn how the code is organised

Read these in order:

1. [ARCHITECTURE.md](ARCHITECTURE.md) explains the four layers and follows one request from button
   press to server and back. **This is the most important document.**
2. [THEMING.md](THEMING.md) covers colors, dark mode, UI components and the **UI Sandbox**.
3. [LIBRARIES.md](LIBRARIES.md) explains what each library does and where it's used.
4. [CONVENTIONS.md](CONVENTIONS.md) lists the rules to follow before opening a pull request.
5. [ADDING-A-FEATURE.md](ADDING-A-FEATURE.md) is a recipe for adding a new resource. Try it as
   an exercise!

### A suggested reading path through the code

Follow one feature, the **product list**, from top to bottom:

| #   | File                               | Look for                                 |
| --- | ---------------------------------- | ---------------------------------------- |
| 1   | `src/app/index.tsx`                | `useProductList(debouncedSearch)`        |
| 2   | `src/queries/products.queries.ts`  | `useProductList` → `productQueries.list` |
| 3   | `src/queries/query-keys.ts`        | `productKeys.list`                       |
| 4   | `src/services/products.service.ts` | `productsService.list`                   |
| 5   | `src/api/http-client.ts`           | `request()`, the only `fetch` in the app |
| 6   | `src/schemas/product.schema.ts`    | `productListResponseSchema`              |

---

## Step 6: Before you push code

Always run:

```bash
npm run validate
```

It runs the type checker, the linter, the formatter check and the tests. If it passes locally,
CI will pass too.

---

## Glossary

| Term                  | Meaning                                                                                   |
| --------------------- | ----------------------------------------------------------------------------------------- |
| **Expo**              | A framework and set of tools on top of React Native that handles most of the native setup |
| **Expo Go**           | An app that can run your project without building it. Great for learning.                 |
| **Development build** | Your own version of "Expo Go", built with your exact native libraries                     |
| **Metro**             | The bundler: it turns all your files into one JavaScript bundle for the phone             |
| **Fast Refresh**      | Saving a file updates the running app without losing its state                            |
| **SDK version**       | Expo's version (58 here). All `expo-*` packages must match it.                            |
| **CRUD**              | Create, Read, Update, Delete: the four basic data operations                              |
| **Query**             | Reading data (GET) through React Query                                                    |
| **Mutation**          | Changing data (POST / PUT / DELETE) through React Query                                   |
| **Cache**             | Data React Query keeps in memory, so screens don't download it again                      |
| **Optimistic update** | Updating the UI _before_ the server confirms, and undoing it if the server fails          |
| **Token** (theming)   | A named color like `primary` whose actual value depends on light/dark mode                |
