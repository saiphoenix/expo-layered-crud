import { BottomSheetView } from '@gorhom/bottom-sheet';
import { Eye, type LucideIcon, Pencil, Trash2 } from 'lucide-react-native';
import type { Ref } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBottomSheet, type AppBottomSheetRef } from '@/shared/components/app-bottom-sheet';
import { Icon } from '@/shared/ui/icon';
import { Separator } from '@/shared/ui/separator';
import { Text } from '@/shared/ui/text';
import { cn } from '@/shared/lib/utils';
import type { Product } from '../../data/product.schema';

import { ProductThumbnail } from '../../components/product-thumbnail';

function ActionRow({
  icon,
  label,
  destructive,
  onPress,
}: {
  icon: LucideIcon;
  label: string;
  destructive?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className="flex-row items-center gap-3 rounded-md px-3 py-3.5 active:bg-accent">
      <Icon as={icon} className={cn('size-5', destructive && 'text-destructive')} />
      <Text className={cn('text-base', destructive && 'text-destructive')}>{label}</Text>
    </Pressable>
  );
}

/** Bottom sheet with View / Edit / Delete for one product. */
export function ProductActionsSheet({
  ref,
  product,
  onView,
  onEdit,
  onDelete,
}: {
  ref: Ref<AppBottomSheetRef>;
  product: Product | null;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}) {
  const insets = useSafeAreaInsets();

  return (
    <AppBottomSheet ref={ref} enableDynamicSizing>
      <BottomSheetView style={{ paddingBottom: insets.bottom + 12 }}>
        {product ? (
          <View className="gap-2 px-4">
            <View className="flex-row items-center gap-3 pb-2">
              <ProductThumbnail uri={product.thumbnail} size={44} />
              <Text className="flex-1 font-semibold" numberOfLines={2}>
                {product.title}
              </Text>
            </View>
            <Separator />
            <ActionRow icon={Eye} label="View details" onPress={() => onView(product)} />
            <ActionRow icon={Pencil} label="Edit product" onPress={() => onEdit(product)} />
            <ActionRow
              icon={Trash2}
              label="Delete product"
              destructive
              onPress={() => onDelete(product)}
            />
          </View>
        ) : null}
      </BottomSheetView>
    </AppBottomSheet>
  );
}
