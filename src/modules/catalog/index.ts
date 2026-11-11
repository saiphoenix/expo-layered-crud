/**
 * PUBLIC API of the CATALOG module.
 *
 * This file is the module's "front door". Code OUTSIDE src/modules/catalog (routes in
 * src/app, other modules) may import ONLY from '@/modules/catalog' - never from a deep path
 * like '@/modules/catalog/data/...'. ESLint enforces it.
 *
 * Export the smallest surface other code needs. Everything else stays private, so the
 * module can be refactored without breaking the rest of the app.
 */

// Navigation
export { catalogRoutes } from './catalog.routes';

// Screens (rendered by route files in src/app)
export { CreateProductScreen } from './features/create-product';
export { EditProductScreen } from './features/edit-product';
export { ProductDetailScreen } from './features/product-detail';
export { ProductListScreen } from './features/product-list';

// Widgets and read hooks other modules may use (e.g. the Home dashboard)
export { TopRatedCarousel } from './features/top-rated';
export { useCategories, useProductCount } from './data/product.queries';

// Types other modules may need
export type { Category, Product } from './data/product.schema';

// UI Sandbox section for this module
export { CatalogShowcase } from './components/catalog-showcase';
