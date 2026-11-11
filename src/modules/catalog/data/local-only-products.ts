import type { Product } from './product.schema';

/**
 * ⚠️  DEMO-API WORKAROUND - delete this file when you use a real backend.
 *
 * DummyJSON is a public demo API. POST / PUT / DELETE answer exactly like a
 * real server, but nothing is actually saved:
 *   - every new product comes back with the same id (total + 1, e.g. 195)
 *   - asking the server for that new product later returns 404
 *
 * So, for products created in this session we:
 *   1. give each one a unique id on the device, and
 *   2. remember that it only exists locally, so we never ask the server about it.
 *
 * Everything else in the app works exactly as it would with a real API.
 */
const localProductIds = new Set<number>();
let nextLocalId = 100_000;

export function toLocalProduct(serverProduct: Product): Product {
  const id = nextLocalId++;
  localProductIds.add(id);
  return { ...serverProduct, id };
}

export function isLocalProduct(id: number) {
  return localProductIds.has(id);
}
