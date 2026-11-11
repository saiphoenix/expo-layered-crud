import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { Check } from 'lucide-react-native';
import type { Ref } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBottomSheet, type AppBottomSheetRef } from '@/shared/components/app-bottom-sheet';
import { ErrorState, LoadingState } from '@/shared/components/screen-states';
import { Icon } from '@/shared/ui/icon';
import { Text } from '@/shared/ui/text';
import { useCategories } from '../data/product.queries';

/**
 * Bottom sheet listing categories from the API.
 * The query only runs when the sheet is opened (its content mounts on `present()`),
 * and is cached for an hour afterwards.
 */
function CategoryList({
  selected,
  onSelect,
}: {
  selected?: string;
  onSelect: (slug: string) => void;
}) {
  const insets = useSafeAreaInsets();
  const { data: categories, isPending, isError, error, refetch } = useCategories();

  if (isPending) return <LoadingState label="Loading categories…" />;
  if (isError) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <BottomSheetFlatList
      data={categories}
      keyExtractor={(item) => item.slug}
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 16 }}
      ListHeaderComponent={<Text className="pb-2 text-lg font-semibold">Choose a category</Text>}
      renderItem={({ item }) => {
        const isSelected = item.slug === selected;
        return (
          <Pressable
            onPress={() => onSelect(item.slug)}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            className="flex-row items-center justify-between rounded-md px-3 py-3 active:bg-accent">
            <Text className={isSelected ? 'font-semibold text-primary' : undefined}>
              {item.name}
            </Text>
            {isSelected ? <Icon as={Check} className="size-5 text-primary" /> : <View />}
          </Pressable>
        );
      }}
    />
  );
}

export function CategoryPickerSheet({
  ref,
  selected,
  onSelect,
}: {
  ref: Ref<AppBottomSheetRef>;
  selected?: string;
  onSelect: (slug: string) => void;
}) {
  return (
    <AppBottomSheet ref={ref} snapPoints={['60%', '90%']} enableDynamicSizing={false}>
      <CategoryList selected={selected} onSelect={onSelect} />
    </AppBottomSheet>
  );
}
