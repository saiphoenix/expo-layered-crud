import { router } from 'expo-router';
import { View } from 'react-native';

import { haptics } from '@/shared/lib/haptics';

import { catalogRoutes } from '../../catalog.routes';
import { ProductForm } from '../../components/product-form';
import { emptyProductForm } from '../../data/product.schema';
import { useCreateProduct } from './use-create-product';

/** CREATE screen. */
export function CreateProductScreen() {
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
          router.replace(catalogRoutes.detail(product.id));
        }}
      />
    </View>
  );
}
