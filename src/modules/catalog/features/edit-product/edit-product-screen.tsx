import { router } from 'expo-router';
import { PackageX } from 'lucide-react-native';
import { View } from 'react-native';

import { EmptyState, ErrorState, LoadingState } from '@/shared/components/screen-states';

import { haptics } from '@/shared/lib/haptics';

import { ProductForm } from '../../components/product-form';
import { useProduct } from '../../data/product.queries';
import { productToFormInput } from '../../data/product.schema';
import { useUpdateProduct } from './use-update-product';

/** UPDATE screen. */
/** The route file reads the URL and passes the id in, so this screen is easy to reuse and test. */
export function EditProductScreen({ productId }: { productId: number }) {
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
