import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

/** A titled block in the UI Sandbox. */
export function SandboxSection({
  title,
  description,
  file,
  children,
  className,
}: {
  title: string;
  description?: string;
  /** Where the component lives, so readers can jump to the code. */
  file?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <View className="gap-3">
      <View className="gap-0.5">
        <Text variant="h4">{title}</Text>
        {description ? <Text variant="muted">{description}</Text> : null}
        {file ? <Text className="font-mono text-xs text-muted-foreground">{file}</Text> : null}
      </View>
      <View className={cn('gap-4 rounded-lg border border-border bg-card p-4', className)}>
        {children}
      </View>
    </View>
  );
}

/** Small caption above a group of examples. */
export function SandboxLabel({ children }: { children: string }) {
  return (
    <Text className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </Text>
  );
}
