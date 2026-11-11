import { router } from 'expo-router';
import { ChevronRight, Layers, Package, Palette, Plus, Star, Tags } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { Pressable, ScrollView, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ErrorState } from '@/components/common/screen-states';
import { ProductThumbnail } from '@/components/products/product-thumbnail';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { discountedPrice, formatPrice } from '@/lib/format';
import { useCategories, useProductCount, useTopRatedProducts } from '@/queries';

function StatCard({
  icon,
  label,
  value,
  isLoading,
}: {
  icon: LucideIcon;
  label: string;
  value?: number;
  isLoading: boolean;
}) {
  return (
    <View className="flex-1 gap-2 rounded-lg border border-border bg-card p-4">
      <Icon as={icon} className="size-5 text-primary" />
      {isLoading ? (
        <Skeleton className="h-7 w-16" />
      ) : (
        <Text className="text-2xl font-bold">{value ?? '–'}</Text>
      )}
      <Text variant="muted">{label}</Text>
    </View>
  );
}

function SectionHeader({ title, onSeeAll }: { title: string; onSeeAll?: () => void }) {
  return (
    <View className="flex-row items-center justify-between">
      <Text variant="large">{title}</Text>
      {onSeeAll ? (
        <Button variant="link" size="sm" onPress={onSeeAll} className="px-0">
          <Text>See all</Text>
        </Button>
      ) : null}
    </View>
  );
}

const LAYERS = [
  { name: 'Screens & components', path: 'src/app · src/components' },
  { name: 'React Query hooks', path: 'src/queries' },
  { name: 'Services', path: 'src/services' },
  { name: 'API client', path: 'src/api' },
];

/** HOME tab: a small dashboard built from three independent queries. */
export default function HomeScreen() {
  const productCount = useProductCount();
  const categories = useCategories();
  const topRated = useTopRatedProducts();

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="gap-6 p-4 pb-10">
      <Animated.View entering={FadeInDown.duration(350)}>
        <View className="gap-2 rounded-xl bg-primary p-5">
          <Text className="text-2xl font-bold text-primary-foreground">Welcome 👋</Text>
          <Text className="text-primary-foreground/80">
            A production-style Expo starter: layered architecture, React Query, NativeWind and React
            Native Reusables, on a real API.
          </Text>
        </View>
      </Animated.View>

      <View className="flex-row gap-3">
        <StatCard
          icon={Package}
          label="Products"
          value={productCount.data}
          isLoading={productCount.isPending}
        />
        <StatCard
          icon={Tags}
          label="Categories"
          value={categories.data?.length}
          isLoading={categories.isPending}
        />
      </View>

      <View className="gap-3">
        <SectionHeader title="Quick actions" />
        <View className="flex-row gap-3">
          <Button className="flex-1" onPress={() => router.push('/products/new')}>
            <Icon as={Plus} />
            <Text>Add product</Text>
          </Button>
          <Button variant="outline" className="flex-1" onPress={() => router.push('/ui-sandbox')}>
            <Icon as={Palette} />
            <Text>UI Sandbox</Text>
          </Button>
        </View>
      </View>

      <View className="gap-3">
        <SectionHeader title="Top rated" onSeeAll={() => router.navigate('/products')} />
        {topRated.isError ? (
          <ErrorState error={topRated.error} onRetry={topRated.refetch} />
        ) : (
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
                    onPress={() =>
                      router.push({
                        pathname: '/products/[id]',
                        params: { id: String(product.id) },
                      })
                    }
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
        )}
      </View>

      <View className="gap-3">
        <SectionHeader title="How this app is built" />
        <View className="rounded-lg border border-border bg-card p-4">
          {LAYERS.map((layer, index) => (
            <View key={layer.name}>
              <View className="flex-row items-center gap-3">
                <View className="h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                  <Text className="text-xs font-bold text-primary">{index + 1}</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-medium">{layer.name}</Text>
                  <Text variant="muted">{layer.path}</Text>
                </View>
              </View>
              {index < LAYERS.length - 1 ? (
                <Icon
                  as={ChevronRight}
                  className="my-1 ml-1.5 size-4 rotate-90 text-muted-foreground"
                />
              ) : null}
            </View>
          ))}
          <View className="mt-3 flex-row items-center gap-2">
            <Icon as={Layers} className="size-4 text-muted-foreground" />
            <Text variant="muted" className="flex-1">
              Each layer only talks to the one below it. See docs/ARCHITECTURE.md.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
