import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Label } from '@/shared/ui/label';
import { Text } from '@/shared/ui/text';

/** Label + input + error message: the standard layout for every form field. */
export function FormField({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <View className="gap-2">
      <Label>{label}</Label>
      {children}
      {error ? (
        <Text className="text-sm text-destructive">{error}</Text>
      ) : hint ? (
        <Text variant="muted">{hint}</Text>
      ) : null}
    </View>
  );
}
