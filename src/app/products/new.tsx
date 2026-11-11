import { router } from 'expo-router';
import { View } from 'react-native';

import { ProductForm } from '@/components/products/product-form';
import { haptics } from '@/lib/haptics';
import { useCreateProduct } from '@/queries';
import { emptyProductForm } from '@/schemas/product.schema';

/** CREATE screen. */
export default function NewProductScreen() {
  const createProduct = useCreateProduct();

  return (
    <View className="flex-1 bg-background">
      <ProductForm
        defaultValues={emptyProductForm}
        submitLabel="Create product"
        onSubmit={async (values) => {
          const product = await createProduct.mutateAsync(values);
          haptics.success();
          // Replace the form with the new product's page, so "back" goes to the list.
          router.replace({ pathname: '/products/[id]', params: { id: String(product.id) } });
        }}
      />
    </View>
  );
}
