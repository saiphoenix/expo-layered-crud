import { View } from 'react-native';

import { SandboxLabel, SandboxSection } from '@/shared/sandbox/sandbox-section';

import type { Product } from '../data/product.schema';
import { ProductCard, ProductListSkeleton } from '../features/product-list';
import { ProductThumbnail } from './product-thumbnail';
import { StockBadge } from './stock-badge';

const SAMPLE_PRODUCT: Product = {
  id: 0,
  title: 'Sample Wireless Headphones',
  description: 'Example product used only in the sandbox.',
  category: 'mobile-accessories',
  price: 99.99,
  discountPercentage: 15,
  rating: 4.6,
  stock: 8,
  brand: 'Acme',
  thumbnail:
    'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods/thumbnail.webp',
  images: [],
  tags: [],
};

/**
 * CATALOG module components, shown in the UI Sandbox.
 * Each module owns its own showcase, so `src/shared` never has to import business code.
 */
export function CatalogShowcase() {
  const noop = () => {};

  return (
    <View className="gap-8">
      <SandboxSection
        title="Product components"
        description="Feature components: they know about the Product type, but still don't fetch."
        file="src/modules/catalog/components/*">
        <SandboxLabel>StockBadge</SandboxLabel>
        <View className="flex-row flex-wrap gap-2">
          <StockBadge stock={50} />
          <StockBadge stock={3} />
          <StockBadge stock={0} />
        </View>
        <SandboxLabel>ProductThumbnail</SandboxLabel>
        <View className="flex-row gap-3">
          <ProductThumbnail uri={SAMPLE_PRODUCT.thumbnail} size={64} />
          <ProductThumbnail size={64} />
        </View>
      </SandboxSection>

      <View className="gap-3">
        <SandboxLabel>ProductCard</SandboxLabel>
        <View className="-mx-4">
          <ProductCard product={SAMPLE_PRODUCT} onPress={noop} onMorePress={noop} />
        </View>
        <SandboxLabel>ProductListSkeleton</SandboxLabel>
        <View className="-mx-4">
          <ProductListSkeleton rows={2} />
        </View>
      </View>
    </View>
  );
}
