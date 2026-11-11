import { useLocalSearchParams } from 'expo-router';

import { EditProductScreen } from '@/modules/catalog';

/** Route "/products/:id/edit". Reads the id from the URL and renders the feature screen. */
export default function EditProductRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <EditProductScreen key={id} productId={Number(id)} />;
}
