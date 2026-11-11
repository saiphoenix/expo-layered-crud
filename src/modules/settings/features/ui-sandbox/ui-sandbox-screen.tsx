import { useState } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CatalogShowcase } from '@/modules/catalog';
import { ComposedShowcase } from '@/shared/sandbox/composed-showcase';
import { PrimitivesShowcase } from '@/shared/sandbox/primitives-showcase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Text } from '@/shared/ui/text';

/**
 * UI SANDBOX: every UI building block on one screen.
 *
 * - Primitives: React Native Reusables components (src/shared/ui)
 * - Shared:     our own app-wide components built on top of them (src/shared/components)
 * - Modules:    each module's own components (e.g. CatalogShowcase from src/modules/catalog)
 *
 * Use it to check how a component looks in light/dark mode, and as a
 * catalogue before building something new. Add every new shared component here.
 */
export function UiSandboxScreen() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState('primitives');

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4"
      contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      keyboardShouldPersistTaps="handled">
      <Tabs value={tab} onValueChange={setTab} className="gap-6">
        <TabsList className="w-full">
          <TabsTrigger value="primitives" className="flex-1">
            <Text>Primitives</Text>
          </TabsTrigger>
          <TabsTrigger value="composed" className="flex-1">
            <Text>Shared</Text>
          </TabsTrigger>
          <TabsTrigger value="modules" className="flex-1">
            <Text>Modules</Text>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="primitives">
          <PrimitivesShowcase />
        </TabsContent>
        <TabsContent value="composed">
          <ComposedShowcase />
        </TabsContent>
        <TabsContent value="modules">
          <CatalogShowcase />
        </TabsContent>
      </Tabs>
    </ScrollView>
  );
}
