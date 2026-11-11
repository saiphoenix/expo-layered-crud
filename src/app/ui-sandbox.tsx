import { useState } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ComposedShowcase } from '@/components/sandbox/composed-showcase';
import { PrimitivesShowcase } from '@/components/sandbox/primitives-showcase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';

/**
 * UI SANDBOX: every UI building block on one screen.
 *
 * - Primitives: React Native Reusables components (src/components/ui)
 * - Composed:   our own components built on top of them
 *
 * Use it to check how a component looks in light/dark mode, and as a
 * catalogue before building something new. Add every new shared component here.
 */
export default function UiSandboxScreen() {
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
            <Text>Composed</Text>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="primitives">
          <PrimitivesShowcase />
        </TabsContent>
        <TabsContent value="composed">
          <ComposedShowcase />
        </TabsContent>
      </Tabs>
    </ScrollView>
  );
}
