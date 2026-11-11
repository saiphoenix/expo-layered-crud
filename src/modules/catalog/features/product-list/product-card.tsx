import { EllipsisVertical, Star } from 'lucide-react-native';
import { memo } from 'react';
import { Pressable, View } from 'react-native';

import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';
import { Text } from '@/shared/ui/text';
import { discountedPrice, formatPrice, humanize } from '@/shared/lib/format';
import type { Product } from '../../data/product.schema';

import { ProductThumbnail } from '../../components/product-thumbnail';
import { StockBadge } from '../../components/stock-badge';

/**
 * One row in the product list.
 * Pure UI: it receives data + callbacks as props and never fetches anything itself.
 */
export const ProductCard = memo(function ProductCard({
  product,
  onPress,
  onMorePress,
}: {
  product: Product;
  onPress: (product: Product) => void;
  onMorePress: (product: Product) => void;
}) {
  const finalPrice = discountedPrice(product.price, product.discountPercentage);

  return (
    // The row and the "⋮" button are SIBLINGS, not nested: a button inside a button
    // is invalid on web and confusing for screen readers.
    <View className="mx-4 mb-3 flex-row items-center rounded-lg border border-border bg-card">
      <Pressable
        onPress={() => onPress(product)}
        onLongPress={() => onMorePress(product)}
        accessibilityRole="button"
        accessibilityLabel={`${product.title}, ${formatPrice(finalPrice)}`}
        className="flex-1 flex-row items-center gap-3 rounded-lg p-3 active:opacity-80">
        <ProductThumbnail uri={product.thumbnail} size={72} recyclingKey={String(product.id)} />

        <View className="flex-1 gap-1">
          <Text className="font-semibold" numberOfLines={1}>
            {product.title}
          </Text>
          <Text variant="muted" numberOfLines={1}>
            {[product.brand, humanize(product.category)].filter(Boolean).join(' · ')}
          </Text>
          <View className="flex-row flex-wrap items-center gap-2">
            <Text className="font-bold text-primary">{formatPrice(finalPrice)}</Text>
            {product.rating > 0 ? (
              <View className="flex-row items-center gap-0.5">
                <Icon as={Star} className="size-3.5 fill-amber-400 text-amber-400" />
                <Text variant="muted">{product.rating.toFixed(1)}</Text>
              </View>
            ) : null}
            <StockBadge stock={product.stock} />
          </View>
        </View>
      </Pressable>

      <Button
        variant="ghost"
        size="icon"
        className="mr-2 rounded-full"
        onPress={() => onMorePress(product)}
        accessibilityLabel={`More actions for ${product.title}`}>
        <Icon as={EllipsisVertical} className="size-5 text-muted-foreground" />
      </Button>
    </View>
  );
});
