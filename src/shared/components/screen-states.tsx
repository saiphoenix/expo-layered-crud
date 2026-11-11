import { CircleAlert, type LucideIcon, RefreshCw } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { getErrorMessage } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';
import { Text } from '@/shared/ui/text';
import { useThemeColors } from '@/shared/hooks/use-theme-colors';

/**
 * Every data screen has the same 4 states: loading, error, empty, success.
 * These components keep the first three consistent across the app.
 */

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  const colors = useThemeColors();
  return (
    <View className="flex-1 items-center justify-center gap-3 p-6">
      <ActivityIndicator color={colors.primary} />
      <Text variant="muted">{label}</Text>
    </View>
  );
}

export function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  return (
    <View className="flex-1 items-center justify-center gap-4 p-6">
      <View className="rounded-full bg-destructive/10 p-4">
        <Icon as={CircleAlert} className="size-8 text-destructive" />
      </View>
      <View className="items-center gap-1">
        <Text variant="large">Something went wrong</Text>
        <Text variant="muted" className="text-center">
          {getErrorMessage(error)}
        </Text>
      </View>
      {onRetry ? (
        <Button variant="outline" onPress={onRetry}>
          <Icon as={RefreshCw} />
          <Text>Try again</Text>
        </Button>
      ) : null}
    </View>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <View className="flex-1 items-center justify-center gap-4 p-6">
      <View className="rounded-full bg-muted p-4">
        <Icon as={icon} className="size-8 text-muted-foreground" />
      </View>
      <View className="items-center gap-1">
        <Text variant="large">{title}</Text>
        {description ? (
          <Text variant="muted" className="text-center">
            {description}
          </Text>
        ) : null}
      </View>
      {action}
    </View>
  );
}
