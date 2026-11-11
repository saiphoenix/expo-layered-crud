# Theming, dark mode and UI components

## How theming works

```
src/global.css          ← colors defined ONCE as CSS variables (light + dark)
      │
tailwind.config.js      ← maps class names to those variables: bg-primary → hsl(var(--primary))
      │
className="bg-primary"  ← you use the class; NativeWind picks the light or dark value
```

### The tokens

| Token                                | Used for                                 | Example classes                      |
| ------------------------------------ | ---------------------------------------- | ------------------------------------ |
| `background` / `foreground`          | Screen background / main text            | `bg-background`, `text-foreground`   |
| `card` / `card-foreground`           | Cards, sheets                            | `bg-card`                            |
| `primary` / `primary-foreground`     | Brand color: main buttons, prices, links | `bg-primary`, `text-primary`         |
| `secondary` / `secondary-foreground` | Less important buttons and badges        | `bg-secondary`                       |
| `muted` / `muted-foreground`         | Subtle backgrounds, secondary text       | `bg-muted`, `text-muted-foreground`  |
| `accent` / `accent-foreground`       | Pressed/hover states                     | `active:bg-accent`                   |
| `destructive`                        | Delete, errors                           | `bg-destructive`, `text-destructive` |
| `success` / `success-foreground`     | Positive states (discount badge)         | `bg-success`                         |
| `border`, `input`, `ring`            | Borders, input borders, focus rings      | `border-border`                      |
| `--radius`                           | Corner rounding                          | `rounded-lg`, `rounded-md`           |

Values are **HSL** (`hue saturation% lightness%`), e.g. `243 75% 59%` is indigo.
You can even use opacity: `bg-primary/10` is primary at 10% opacity.

### Rules

1. ✅ `className="bg-card text-foreground"`
2. ❌ `style={{ backgroundColor: '#fff' }}` or `className="bg-white text-gray-900"`
   (breaks dark mode)
3. Need a color as a **string** (navigation header, `ActivityIndicator color`, bottom sheet
   background)? Use the hook:

   ```tsx
   const colors = useThemeColors();
   <ActivityIndicator color={colors.primary} />;
   ```

### Re-branding the app (changing the primary color)

1. Pick a color, e.g. emerald `160 84% 39%`.
2. In `src/global.css`, change `--primary` and `--ring` in **both** `:root` and `.dark:root`
   (use a lighter value for dark mode).
3. In `src/lib/theme.ts`, change `primary` and `ring` to the same values (`'hsl(160 84% 39%)'`).
4. Restart with a clean cache: `npx expo start --clear`.

> Tip: [ui.shadcn.com/themes](https://ui.shadcn.com/themes) generates full token sets you can
> paste into `global.css`. Copy the HSL values into `src/lib/theme.ts` too.

### Dark mode

- `app.json` → `"userInterfaceStyle": "automatic"`: follows the phone's setting by default.
- `ThemeToggle` (header) calls NativeWind's `toggleColorScheme()`.
- Classes can target dark mode explicitly: `className="bg-white dark:bg-black"`, but prefer
  tokens, which switch automatically.

---

## Component layers and the UI Sandbox

UI code is built in **three levels**. Each level only uses the levels below it:

```
3. Feature components   src/components/products/   ProductCard, ProductForm, StockBadge, ...
         ▲                                          know about Product, never fetch data
2. Composed components  src/components/common/     ScreenStates, FormField, SettingsRow,
         ▲                                          AppBottomSheet, FloatingActionButton, ThemeToggle
1. Primitives           src/components/ui/         Button, Text, Input, Card, Dialog, Switch, ...
                                                    (React Native Reusables, no business logic)
```

- **Need a button, input or dialog?** Use a primitive.
- **Writing the same arrangement of primitives twice?** Turn it into a composed component in
  `src/components/common/`.
- **Only makes sense for one feature?** Put it in `src/components/<feature>/`.

### UI Sandbox

**Settings → UI Sandbox** (route `/ui-sandbox`, file `src/app/ui-sandbox.tsx`) shows every
component on one screen, in two tabs:

| Tab            | Shows                                                                                                                                                   | Source                                           |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| **Primitives** | Color tokens, typography, buttons, inputs, checkbox/switch/radio/toggle, badges, card, alerts, progress, skeleton, avatar, dialogs, bottom sheet, icons | `src/components/sandbox/primitives-showcase.tsx` |
| **Composed**   | Screen states, FormField, settings rows, ThemeToggle, product components                                                                                | `src/components/sandbox/composed-showcase.tsx`   |

Use it to:

- check how something looks in **light and dark** mode (switch in Settings),
- see what already exists **before** building a new component,
- try out a new component in isolation.

**Rule:** when you add a shared component (levels 1 or 2), add an example of it to the sandbox.

---

## UI components: React Native Reusables

[React Native Reusables](https://reactnativereusables.com) (RNR) is the React Native version of
**shadcn/ui**. Components are **copied into your project** (`src/components/ui/`), not installed
as a black-box package. You own the code and can change it.

### Already installed

`button` · `text` · `input` · `textarea` · `label` · `card` · `badge` · `skeleton` · `separator` ·
`alert` · `alert-dialog` · `dialog` · `icon` · `avatar` · `checkbox` · `switch` · `radio-group` ·
`toggle` · `toggle-group` · `tabs` · `progress`

### Adding more

```bash
npx @react-native-reusables/cli@latest add dialog select switch tabs --styling-library nativewind
```

The CLI reads `components.json`, installs any needed dependencies and writes the files to
`src/components/ui/`. If it asks to overwrite an existing file (for example `text.tsx`), answer
**No** unless you want to lose local changes. Browse all components at
[reactnativereusables.com/docs](https://reactnativereusables.com/docs).

### Usage cheatsheet

```tsx
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Plus } from 'lucide-react-native';

<Text variant="h3">Title</Text>
<Text variant="muted">Secondary text</Text>

<Button variant="default | secondary | outline | ghost | destructive | link" size="sm | default | lg | icon">
  <Icon as={Plus} />          {/* icons inside a Button take the button's text color */}
  <Text>Add</Text>
</Button>
```

- **Always wrap strings in `<Text>`** from `@/components/ui/text`, not the one from `react-native`.
  It picks up theme colors and button/badge text styles automatically.
- **Icons:** use `<Icon as={SomeLucideIcon} className="size-5 text-primary" />` so icons accept
  `className` and theme colors.
- `src/components/ui/` is excluded from ESLint because it's vendor code. Modify it carefully.

### Portals

Dialogs (`AlertDialog`) render into `<PortalHost />` in `src/app/_layout.tsx`, so they appear
above everything. Don't remove it.

---

## Animation

We use **react-native-reanimated** (animations run on the UI thread):

- **Layout animations**: `entering={FadeInDown}` on the product details content.
- **Shared values**: the `+` button scales with a spring when pressed
  (`src/components/common/floating-action-button.tsx`).

Rule from Reanimated: don't put an `entering` animation and an animated `transform` style on the
**same** view. Nest two `Animated.View`s instead (see the FAB).

## Bottom sheets

`src/components/common/app-bottom-sheet.tsx` wraps `@gorhom/bottom-sheet`'s `BottomSheetModal`
with theme colors and a backdrop. Use it like this:

```tsx
const ref = useRef<AppBottomSheetRef>(null);
ref.current?.present(); // open
ref.current?.dismiss(); // close
<AppBottomSheet ref={ref} enableDynamicSizing>
  <BottomSheetView>...</BottomSheetView>
</AppBottomSheet>;
```

Examples: `product-actions-sheet.tsx` (dynamic height) and `category-picker-sheet.tsx` (snap
points + a scrollable list).
