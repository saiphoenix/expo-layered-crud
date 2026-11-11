import { Bell, PackageSearch, Palette } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { ApiError } from '@/api';
import { FormField } from '@/components/common/form-field';
import { EmptyState, ErrorState, LoadingState } from '@/components/common/screen-states';
import { SettingsGroup, SettingsRow } from '@/components/common/settings-row';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { ProductCard } from '@/components/products/product-card';
import { ProductListSkeleton } from '@/components/products/product-list-skeleton';
import { ProductThumbnail } from '@/components/products/product-thumbnail';
import { StockBadge } from '@/components/products/stock-badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import type { Product } from '@/schemas/product.schema';

import { SandboxLabel, SandboxSection } from './sandbox-section';

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

const SAMPLE_ERROR = new ApiError({
  kind: 'network',
  message: 'Could not reach the server. Check your internet connection.',
});

/**
 * COMPOSED components: OUR components, built from the primitives.
 * Use these in screens. When you need a new pattern twice, make it a composed component.
 */
export function ComposedShowcase() {
  const [notifications, setNotifications] = useState(true);
  const noop = () => {};

  return (
    <View className="gap-8">
      <View className="rounded-lg bg-primary/10 p-4">
        <Text className="text-sm">
          <Text className="text-sm font-semibold">Primitives</Text> (src/components/ui) →{' '}
          <Text className="text-sm font-semibold">Common</Text> (src/components/common) →{' '}
          <Text className="text-sm font-semibold">Feature</Text> (src/components/products) →{' '}
          <Text className="text-sm font-semibold">Screens</Text> (src/app)
        </Text>
      </View>

      <SandboxSection
        title="Screen states"
        description="Every data screen shows one of these while loading, failing or empty."
        file="src/components/common/screen-states.tsx">
        <SandboxLabel>LoadingState</SandboxLabel>
        <View className="h-28">
          <LoadingState />
        </View>
        <Separator />
        <SandboxLabel>ErrorState</SandboxLabel>
        <ErrorState error={SAMPLE_ERROR} onRetry={noop} />
        <Separator />
        <SandboxLabel>EmptyState</SandboxLabel>
        <EmptyState
          icon={PackageSearch}
          title="No products found"
          description="Try a different search term."
        />
      </SandboxSection>

      <SandboxSection
        title="FormField"
        description="Label + input + error/hint. Used by every form field."
        file="src/components/common/form-field.tsx">
        <FormField label="Title" hint="Shown to customers">
          <Input placeholder="e.g. Wireless Headphones" />
        </FormField>
        <FormField label="Price" error="Price must be greater than 0">
          <Input defaultValue="0" aria-invalid className="border-destructive" />
        </FormField>
      </SandboxSection>

      <SandboxSection
        title="Settings rows"
        file="src/components/common/settings-row.tsx"
        className="border-0 bg-transparent p-0">
        <SettingsGroup title="Example group">
          <SettingsRow
            icon={Palette}
            label="With chevron"
            description="Has onPress"
            onPress={noop}
          />
          <Separator />
          <SettingsRow
            icon={Bell}
            label="With a switch"
            right={<Switch checked={notifications} onCheckedChange={setNotifications} />}
          />
          <Separator />
          <SettingsRow icon={Palette} label="With a value" value="1.0.0" />
        </SettingsGroup>
      </SandboxSection>

      <SandboxSection title="ThemeToggle" file="src/components/common/theme-toggle.tsx">
        <View className="flex-row items-center gap-3">
          <ThemeToggle />
          <Text variant="muted">Same button as in the header</Text>
        </View>
      </SandboxSection>

      <SandboxSection
        title="Product components"
        description="Feature components: they know about the Product type, but still don't fetch."
        file="src/components/products/*">
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
