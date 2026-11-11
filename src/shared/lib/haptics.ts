import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/** Small vibration feedback. Silently does nothing on web. */
export const haptics = {
  light: () => {
    if (Platform.OS !== 'web') void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },
  success: () => {
    if (Platform.OS !== 'web')
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },
  error: () => {
    if (Platform.OS !== 'web')
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  },
};
