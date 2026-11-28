import { Star } from 'lucide-react-native';
import { View } from 'react-native';

import { Icon } from '@/shared/ui/icon';
import { Text } from '@/shared/ui/text';

export function Rating({
  value,
  showValue = false,
  size = 'sm',
}: {
  value: number;
  showValue?: boolean;
  size?: 'sm' | 'md';
}) {
  const starSize = size === 'sm' ? 'size-3.5' : 'size-4';

  return (
    <View
      accessible
      accessibilityLabel={`Rated ${value.toFixed(1)} out of 5`}
      className="flex-row items-center gap-1">
      <View className="flex-row items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => {
          const filled = i + 1 <= Math.round(value);

          return (
            <Icon
              key={`star-${i}`}
              as={Star}
              className={`${starSize} ${filled ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`}
            />
          );
        })}
      </View>
      {showValue ? <Text variant="muted">{value.toFixed(1)}</Text> : null}
    </View>
  );
}
