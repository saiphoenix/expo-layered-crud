import { Image } from 'expo-image';
import { router, Stack } from 'expo-router';
import { PackageX, Pencil, Star, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, ScrollView, useWindowDimensions, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getErrorMessage } from '@/shared/api';
import { EmptyState, ErrorState, LoadingState } from '@/shared/components/screen-states';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';
import { Separator } from '@/shared/ui/separator';
import { Text } from '@/shared/ui/text';
import { discountedPrice, formatPrice, humanize } from '@/shared/lib/format';
import { haptics } from '@/shared/lib/haptics';

import { catalogRoutes } from '../../catalog.routes';
import { ProductThumbnail } from '../../components/product-thumbnail';
import { StockBadge } from '../../components/stock-badge';
import { useProduct } from '../../data/product.queries';
import { DeleteProductDialog, useDeleteProduct } from '../delete-product';

/** READ (single item) screen, with buttons to UPDATE and DELETE. */
export function ProductDetailScreen({ productId }: { productId: number }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const { data: product, isPending, isError, error, refetch, fetchStatus } = useProduct(productId);
  const deleteProduct = useDeleteProduct();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  if (isError) return <ErrorState error={error} onRetry={refetch} />;
  if (!product) {
    // Pending but not fetching = the query is disabled (invalid id or unknown local item).
    if (isPending && fetchStatus === 'idle') {
      return <EmptyState icon={PackageX} title="Product not found" />;
    }
    return <LoadingState label="Loading product…" />;
  }

  const images = product.images.length > 0 ? product.images : [product.thumbnail].filter(Boolean);
  const finalPrice = discountedPrice(product.price, product.discountPercentage);
  const hasDiscount = product.discountPercentage > 0;

  const handleDelete = () => {
    setIsDeleteDialogOpen(false);
    deleteProduct.mutate(product.id, {
      onError: (deleteError) => {
        haptics.error();
        Alert.alert('Could not delete product', getErrorMessage(deleteError));
      },
    });
    haptics.success();
    router.back(); // optimistic: the item is already gone from the list
  };

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ title: product.title }} />

      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
        {images.length > 0 ? (
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
            {images.map((uri) => (
              <Image
                key={uri}
                source={uri}
                contentFit="contain"
                transition={250}
                style={{ width, height: width * 0.8 }}
              />
            ))}
          </ScrollView>
        ) : (
          <View className="items-center py-8">
            <ProductThumbnail size={160} />
          </View>
        )}

        <Animated.View entering={FadeInDown.duration(350)}>
          <View className="gap-4 p-4">
            <View className="flex-row flex-wrap gap-2">
              <Badge variant="secondary">
                <Text>{humanize(product.category)}</Text>
              </Badge>
              <StockBadge stock={product.stock} />
            </View>

            <View className="gap-1">
              <Text variant="h3">{product.title}</Text>
              {product.brand ? <Text variant="muted">by {product.brand}</Text> : null}
            </View>

            <View className="flex-row flex-wrap items-end gap-3">
              <Text className="text-3xl font-bold text-primary">{formatPrice(finalPrice)}</Text>
              {hasDiscount ? (
                <>
                  <Text variant="muted" className="pb-1 line-through">
                    {formatPrice(product.price)}
                  </Text>
                  <Badge className="mb-1.5 bg-success">
                    <Text className="text-success-foreground">
                      -{product.discountPercentage.toFixed(0)}%
                    </Text>
                  </Badge>
                </>
              ) : null}
            </View>

            {product.rating > 0 ? (
              <View className="flex-row items-center gap-1">
                <Icon as={Star} className="size-4 fill-amber-400 text-amber-400" />
                <Text className="font-medium">{product.rating.toFixed(1)}</Text>
                <Text variant="muted">/ 5</Text>
              </View>
            ) : null}

            <Separator />

            <View className="gap-2">
              <Text variant="large">Description</Text>
              <Text className="leading-6 text-muted-foreground">{product.description}</Text>
            </View>

            {product.tags.length > 0 ? (
              <View className="flex-row flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    <Text>#{tag}</Text>
                  </Badge>
                ))}
              </View>
            ) : null}
          </View>
        </Animated.View>
      </ScrollView>

      <View
        className="absolute inset-x-0 bottom-0 flex-row gap-3 border-t border-border bg-background px-4 pt-3"
        style={{ paddingBottom: insets.bottom + 12 }}>
        <Button
          variant="outline"
          className="flex-1"
          onPress={() => router.push(catalogRoutes.edit(product.id))}>
          <Icon as={Pencil} />
          <Text>Edit</Text>
        </Button>
        <Button
          variant="destructive"
          className="flex-1"
          onPress={() => setIsDeleteDialogOpen(true)}>
          <Icon as={Trash2} className="text-white" />
          <Text>Delete</Text>
        </Button>
      </View>

      <DeleteProductDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        productTitle={product.title}
        onConfirm={handleDelete}
      />
    </View>
  );
}
