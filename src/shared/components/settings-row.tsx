import { ChevronRight, type LucideIcon } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { Icon } from '@/shared/ui/icon';
import { Text } from '@/shared/ui/text';
import { cn } from '@/shared/lib/utils';

/**
 * A row in a settings-style list. A good example of a COMPOSED component:
 * it is just Pressable + Icon + Text primitives arranged in a reusable way.
 */
export function SettingsRow({
  icon,
  label,
  description,
  value,
  onPress,
  right,
  destructive,
}: {
  icon: LucideIcon;
  label: string;
  description?: string;
  /** Text shown on the right (e.g. a version number). */
  value?: string;
  onPress?: () => void;
  /** Custom element on the right (e.g. a Switch). */
  right?: ReactNode;
  destructive?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      className="flex-row items-center gap-3 px-4 py-3.5 active:bg-accent">
      <View className={cn('rounded-md bg-muted p-2', destructive && 'bg-destructive/10')}>
        <Icon as={icon} className={cn('size-4', destructive && 'text-destructive')} />
      </View>
      <View className="flex-1">
        <Text className={cn('text-base', destructive && 'text-destructive')}>{label}</Text>
        {description ? <Text variant="muted">{description}</Text> : null}
      </View>
      {value ? (
        <Text variant="muted" numberOfLines={1} className="max-w-[50%]">
          {value}
        </Text>
      ) : null}
      {right}
      {onPress && !right ? (
        <Icon as={ChevronRight} className="size-4 text-muted-foreground" />
      ) : null}
    </Pressable>
  );
}

/** A titled group of SettingsRows inside a card. */
export function SettingsGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View className="gap-2">
      <Text className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </Text>
      <View className="overflow-hidden rounded-lg border border-border bg-card">{children}</View>
    </View>
  );
}
