import { Image } from 'expo-image';
import { Package } from 'lucide-react-native';
import { View } from 'react-native';

import { Icon } from '@/shared/ui/icon';
import { cn } from '@/shared/lib/utils';

/** Product image with a placeholder icon when there is no image URL. */
export function ProductThumbnail({
  uri,
  size,
  recyclingKey,
  className,
}: {
  uri?: string;
  size: number;
  /** Needed inside recycled lists (FlashList) so old images don't flash. */
  recyclingKey?: string;
  className?: string;
}) {
  return (
    <View
      className={cn('items-center justify-center overflow-hidden rounded-md bg-muted', className)}
      style={{ width: size, height: size }}>
      {uri ? (
        <Image
          source={uri}
          recyclingKey={recyclingKey}
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
          style={{ width: size, height: size }}
          accessibilityIgnoresInvertColors
        />
      ) : (
        <Icon as={Package} className="size-6 text-muted-foreground" />
      )}
    </View>
  );
}
