import type { Href } from 'expo-router';

/**
 * Every route of the CATALOG module, in one place.
 * Screens navigate with `router.push(catalogRoutes.detail(5))` instead of typing paths,
 * so renaming a route means changing one file. The route FILES live in `src/app/products/`.
 */
export const catalogRoutes = {
  list: '/products' as const satisfies Href,
  create: '/products/new' as const satisfies Href,
  detail: (id: number) =>
    ({ pathname: '/products/[id]', params: { id: String(id) } }) satisfies Href,
  edit: (id: number) =>
    ({ pathname: '/products/[id]/edit', params: { id: String(id) } }) satisfies Href,
};
