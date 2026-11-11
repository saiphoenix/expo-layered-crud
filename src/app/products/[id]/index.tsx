import { useLocalSearchParams } from 'expo-router';

import { ProductDetailScreen } from '@/modules/catalog';

/**
 * Route "/products/:id".
 * The route file's only job: read the URL params and hand them to the feature screen.
 */
export default function ProductDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ProductDetailScreen productId={Number(id)} />;
}
