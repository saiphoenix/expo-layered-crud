import { router } from 'expo-router';
import { ChevronRight, Layers, Package, Palette, Plus, Tags } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { catalogRoutes, TopRatedCarousel, useCategories, useProductCount } from '@/modules/catalog';
import { settingsRoutes } from '@/modules/settings';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';
import { Skeleton } from '@/shared/ui/skeleton';
import { Text } from '@/shared/ui/text';

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
  { name: 'Routes', path: 'src/app  (thin: render a feature screen)' },
  { name: 'Feature', path: 'src/modules/catalog/features/product-list' },
  { name: 'Module data', path: 'src/modules/catalog/data  (queries → service)' },
  { name: 'Shared API client', path: 'src/shared/api' },
];

/** HOME tab: a small dashboard built from three independent queries. */
export function HomeScreen() {
  const productCount = useProductCount();
  const categories = useCategories();

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="gap-6 p-4 pb-10">
      <Animated.View entering={FadeInDown.duration(350)}>
        <View className="gap-2 rounded-xl bg-primary p-5">
          <Text className="text-2xl font-bold text-primary-foreground">Welcome 👋</Text>
          <Text className="text-primary-foreground/80">
            A production-style Expo starter: modules and vertical feature slices, React Query,
            NativeWind and React Native Reusables, on a real API.
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
          <Button className="flex-1" onPress={() => router.push(catalogRoutes.create)}>
            <Icon as={Plus} />
            <Text>Add product</Text>
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onPress={() => router.push(settingsRoutes.uiSandbox)}>
            <Icon as={Palette} />
            <Text>UI Sandbox</Text>
          </Button>
        </View>
      </View>

      <View className="gap-3">
        <SectionHeader title="Top rated" onSeeAll={() => router.navigate(catalogRoutes.list)} />
        <TopRatedCarousel />
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
              Each feature is a vertical slice through these layers. See docs/ARCHITECTURE.md.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
