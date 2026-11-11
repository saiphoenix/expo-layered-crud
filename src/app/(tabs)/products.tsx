import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { PackageSearch, Plus, Search, X } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getErrorMessage } from '@/api';
import type { AppBottomSheetRef } from '@/components/common/app-bottom-sheet';
import { FloatingActionButton } from '@/components/common/floating-action-button';
import { EmptyState, ErrorState } from '@/components/common/screen-states';
import { DeleteProductDialog } from '@/components/products/delete-product-dialog';
import { ProductActionsSheet } from '@/components/products/product-actions-sheet';
import { ProductCard } from '@/components/products/product-card';
import { ProductListSkeleton } from '@/components/products/product-list-skeleton';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useValueWhileFocused } from '@/hooks/use-value-while-focused';
import { haptics } from '@/lib/haptics';
import { useDeleteProduct, useProductList } from '@/queries';
import type { Product } from '@/schemas/product.schema';

/**
 * READ (list) screen.
 * Note: no fetch, no URLs, no cache logic here - the screen only uses hooks
 * from the React Query layer (`@/queries`) and renders UI.
 */
export default function ProductsScreen() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search.trim(), 400);

  const productList = useProductList(debouncedSearch);
  // See the hook for why: avoids a FlashList crash when items are deleted from another screen.
  const listData = useValueWhileFocused(productList.data);
  const deleteProduct = useDeleteProduct();

  const [isPullRefreshing, setIsPullRefreshing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const actionsSheetRef = useRef<AppBottomSheetRef>(null);

  const openProduct = (product: Product) =>
    router.push({ pathname: '/products/[id]', params: { id: String(product.id) } });

  const openActions = (product: Product) => {
    haptics.light();
    setSelectedProduct(product);
    actionsSheetRef.current?.present();
  };

  const refresh = async () => {
    setIsPullRefreshing(true);
    await productList.refetch();
    setIsPullRefreshing(false);
  };

  const confirmDelete = () => {
    if (!productToDelete) return;
    deleteProduct.mutate(productToDelete.id, {
      onSuccess: () => haptics.success(),
      onError: (error) => {
        haptics.error();
        Alert.alert('Could not delete product', getErrorMessage(error));
      },
    });
    setProductToDelete(null);
  };

  const renderContent = () => {
    if (productList.isPending) return <ProductListSkeleton />;
    if (productList.isError) {
      return <ErrorState error={productList.error} onRetry={productList.refetch} />;
    }

    const { products, total } = listData ?? productList.data;

    return (
      <FlashList
        data={products}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={openProduct} onMorePress={openActions} />
        )}
        ListHeaderComponent={
          <Text variant="muted" className="px-4 pb-3">
            {total} {total === 1 ? 'product' : 'products'}
            {debouncedSearch ? ` for “${debouncedSearch}”` : ''}
          </Text>
        }
        ListEmptyComponent={
          <EmptyState
            icon={PackageSearch}
            title="No products found"
            description={
              debouncedSearch ? 'Try a different search term.' : 'Tap + to add your first product.'
            }
          />
        }
        ListFooterComponent={
          productList.isFetchingNextPage ? (
            <ActivityIndicator className="py-4" color={colors.primary} />
          ) : null
        }
        onEndReached={() => {
          if (productList.hasNextPage && !productList.isFetchingNextPage) {
            void productList.fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        refreshing={isPullRefreshing}
        onRefresh={refresh}
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ paddingBottom: insets.bottom + 96 }}
      />
    );
  };

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 pb-3 pt-2">
        <View className="justify-center">
          <Icon as={Search} className="absolute left-3 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChangeText={setSearch}
            placeholder="Search products"
            className="px-9"
            autoCorrect={false}
            returnKeyType="search"
            accessibilityLabel="Search products"
          />
          {search ? (
            <Pressable
              onPress={() => setSearch('')}
              accessibilityLabel="Clear search"
              hitSlop={8}
              className="absolute right-3">
              <Icon as={X} className="size-4 text-muted-foreground" />
            </Pressable>
          ) : null}
        </View>
      </View>

      <View className="flex-1">{renderContent()}</View>

      <FloatingActionButton
        icon={Plus}
        label="Add product"
        onPress={() => router.push('/products/new')}
      />

      <ProductActionsSheet
        ref={actionsSheetRef}
        product={selectedProduct}
        onView={(product) => {
          actionsSheetRef.current?.dismiss();
          openProduct(product);
        }}
        onEdit={(product) => {
          actionsSheetRef.current?.dismiss();
          router.push({ pathname: '/products/[id]/edit', params: { id: String(product.id) } });
        }}
        onDelete={(product) => {
          actionsSheetRef.current?.dismiss();
          setProductToDelete(product);
        }}
      />

      <DeleteProductDialog
        open={productToDelete !== null}
        onOpenChange={(open) => !open && setProductToDelete(null)}
        productTitle={productToDelete?.title}
        onConfirm={confirmDelete}
      />
    </View>
  );
}
