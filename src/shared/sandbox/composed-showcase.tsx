import { Bell, PackageSearch, Palette } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { ApiError } from '@/shared/api';
import { FormField } from '@/shared/components/form-field';
import { EmptyState, ErrorState, LoadingState } from '@/shared/components/screen-states';
import { SettingsGroup, SettingsRow } from '@/shared/components/settings-row';
import { ThemeToggle } from '@/shared/components/theme-toggle';
import { Input } from '@/shared/ui/input';
import { Separator } from '@/shared/ui/separator';
import { Switch } from '@/shared/ui/switch';
import { Text } from '@/shared/ui/text';
import { SandboxLabel, SandboxSection } from './sandbox-section';

const SAMPLE_ERROR = new ApiError({
  kind: 'network',
  message: 'Could not reach the server. Check your internet connection.',
});

/**
 * COMPOSED components: OUR components, built from the primitives.
 * Use these in screens. When you need a new pattern twice, make it a composed component.
 */
export function ComposedShowcase() {
  const [notifications, setNotifications] = useState(true);
  const noop = () => {};

  return (
    <View className="gap-8">
      <View className="rounded-lg bg-primary/10 p-4">
        <Text className="text-sm">
          <Text className="text-sm font-semibold">Primitives</Text> (src/shared/ui) →{' '}
          <Text className="text-sm font-semibold">Shared</Text> (src/shared/components) →{' '}
          <Text className="text-sm font-semibold">Module</Text>{' '}
          (src/modules/&lt;module&gt;/components) →{' '}
          <Text className="text-sm font-semibold">Feature</Text>{' '}
          (src/modules/&lt;module&gt;/features)
        </Text>
      </View>

      <SandboxSection
        title="Screen states"
        description="Every data screen shows one of these while loading, failing or empty."
        file="src/shared/components/screen-states.tsx">
        <SandboxLabel>LoadingState</SandboxLabel>
        <View className="h-28">
          <LoadingState />
        </View>
        <Separator />
        <SandboxLabel>ErrorState</SandboxLabel>
        <ErrorState error={SAMPLE_ERROR} onRetry={noop} />
        <Separator />
        <SandboxLabel>EmptyState</SandboxLabel>
        <EmptyState
          icon={PackageSearch}
          title="No products found"
          description="Try a different search term."
        />
      </SandboxSection>

      <SandboxSection
        title="FormField"
        description="Label + input + error/hint. Used by every form field."
        file="src/shared/components/form-field.tsx">
        <FormField label="Title" hint="Shown to customers">
          <Input placeholder="e.g. Wireless Headphones" />
        </FormField>
        <FormField label="Price" error="Price must be greater than 0">
          <Input defaultValue="0" aria-invalid className="border-destructive" />
        </FormField>
      </SandboxSection>

      <SandboxSection
        title="Settings rows"
        file="src/shared/components/settings-row.tsx"
        className="border-0 bg-transparent p-0">
        <SettingsGroup title="Example group">
          <SettingsRow
            icon={Palette}
            label="With chevron"
            description="Has onPress"
            onPress={noop}
          />
          <Separator />
          <SettingsRow
            icon={Bell}
            label="With a switch"
            right={<Switch checked={notifications} onCheckedChange={setNotifications} />}
          />
          <Separator />
          <SettingsRow icon={Palette} label="With a value" value="1.0.0" />
        </SettingsGroup>
      </SandboxSection>

      <SandboxSection title="ThemeToggle" file="src/shared/components/theme-toggle.tsx">
        <View className="flex-row items-center gap-3">
          <ThemeToggle />
          <Text variant="muted">Same button as in the header</Text>
        </View>
      </SandboxSection>
    </View>
  );
}
