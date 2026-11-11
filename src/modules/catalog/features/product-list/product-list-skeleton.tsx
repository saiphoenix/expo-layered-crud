import { View } from 'react-native';

import { Skeleton } from '@/shared/ui/skeleton';

/** Grey placeholder rows shown while the first page loads. */
export function ProductListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <View accessibilityLabel="Loading products" className="pt-1">
      {Array.from({ length: rows }, (_, index) => (
        <View
          key={index}
          className="mx-4 mb-3 flex-row items-center gap-3 rounded-lg border border-border p-3">
          <Skeleton className="h-[72px] w-[72px] rounded-md" />
          <View className="flex-1 gap-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </View>
        </View>
      ))}
    </View>
  );
}
