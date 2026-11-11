import type { LucideIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  ZoomIn,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/shared/ui/icon';
import { haptics } from '@/shared/lib/haptics';

/**
 * Round "+" button in the bottom-right corner.
 * Shows two react-native-reanimated basics:
 *  - `entering`: a layout animation when the button first appears
 *  - `useSharedValue` + `withSpring`: a springy press effect running on the UI thread
 */
export function FloatingActionButton({
  icon,
  label,
  onPress,
}: {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
}) {
  const insets = useSafeAreaInsets();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  return (
    <View className="absolute right-5" style={{ bottom: insets.bottom + 20 }}>
      {/* Entering animation and press animation live on separate views (Reanimated rule). */}
      <Animated.View entering={ZoomIn.delay(150).springify()}>
        <Animated.View style={animatedStyle}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={label}
            onPressIn={() => scale.set(withSpring(0.9))}
            onPressOut={() => scale.set(withSpring(1))}
            onPress={() => {
              haptics.light();
              onPress();
            }}
            className="h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg shadow-black/25">
            <Icon as={icon} className="size-6 text-primary-foreground" />
          </Pressable>
        </Animated.View>
      </Animated.View>
    </View>
  );
}
