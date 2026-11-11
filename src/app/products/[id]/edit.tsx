import { router, useLocalSearchParams } from 'expo-router';
import { PackageX } from 'lucide-react-native';
import { View } from 'react-native';

import { EmptyState, ErrorState, LoadingState } from '@/components/common/screen-states';
import { ProductForm } from '@/components/products/product-form';
import { haptics } from '@/lib/haptics';
import { useProduct, useUpdateProduct } from '@/queries';
import { productToFormInput } from '@/schemas/product.schema';

/** UPDATE screen. */
export default function EditProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const productId = Number(id);

  const { data: product, isPending, isError, error, refetch, fetchStatus } = useProduct(productId);
  const updateProduct = useUpdateProduct();

  if (isError) return <ErrorState error={error} onRetry={refetch} />;
  if (!product) {
    if (isPending && fetchStatus === 'idle') {
      return <EmptyState icon={PackageX} title="Product not found" />;
    }
    return <LoadingState />;
  }

  return (
    <View className="flex-1 bg-background">
      <ProductForm
        key={product.id}
        defaultValues={productToFormInput(product)}
        submitLabel="Save changes"
        requireChanges
        onSubmit={async (values) => {
          await updateProduct.mutateAsync({ id: product.id, payload: values });
          haptics.success();
          router.back();
        }}
      />
    </View>
  );
}
