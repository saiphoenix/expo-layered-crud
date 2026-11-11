import { router } from 'expo-router';
import { Star } from 'lucide-react-native';
import { Pressable, ScrollView, View } from 'react-native';

import { ErrorState } from '@/shared/components/screen-states';
import { Icon } from '@/shared/ui/icon';
import { Skeleton } from '@/shared/ui/skeleton';
import { Text } from '@/shared/ui/text';
import { discountedPrice, formatPrice } from '@/shared/lib/format';

import { catalogRoutes } from '../../catalog.routes';
import { ProductThumbnail } from '../../components/product-thumbnail';
import { useTopRatedProducts } from '../../data/product.queries';

/**
 * TOP RATED: a horizontal carousel of the 10 best-rated products.
 * A self-contained WIDGET: it fetches its own data, so any screen (e.g. Home) can render
 * `<TopRatedCarousel />` without knowing anything about products.
 */
export function TopRatedCarousel() {
  const topRated = useTopRatedProducts();

  if (topRated.isError) {
    return <ErrorState error={topRated.error} onRetry={topRated.refetch} />;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-3"
      className="-mx-4"
      contentContainerStyle={{ paddingHorizontal: 16 }}>
      {topRated.isPending
        ? Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-[200px] w-[150px] rounded-lg" />
          ))
        : topRated.data.map((product) => (
            <Pressable
              key={product.id}
              accessibilityRole="button"
              accessibilityLabel={product.title}
              onPress={() => router.push(catalogRoutes.detail(product.id))}
              className="w-[150px] gap-2 rounded-lg border border-border bg-card p-2 active:opacity-80">
              <ProductThumbnail uri={product.thumbnail} size={134} />
              <Text className="font-medium" numberOfLines={1}>
                {product.title}
              </Text>
              <View className="flex-row items-center justify-between">
                <Text className="font-bold text-primary">
                  {formatPrice(discountedPrice(product.price, product.discountPercentage))}
                </Text>
                <View className="flex-row items-center gap-0.5">
                  <Icon as={Star} className="size-3 fill-amber-400 text-amber-400" />
                  <Text variant="muted">{product.rating.toFixed(1)}</Text>
                </View>
              </View>
            </Pressable>
          ))}
    </ScrollView>
  );
}
