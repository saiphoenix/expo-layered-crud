import { Link, Stack } from 'expo-router';
import { MapPinOff } from 'lucide-react-native';
import { View } from 'react-native';

import { EmptyState } from '@/shared/components/screen-states';
import { Button } from '@/shared/ui/button';
import { Text } from '@/shared/ui/text';

export default function NotFoundScreen() {
  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ title: 'Not found' }} />
      <EmptyState
        icon={MapPinOff}
        title="This screen doesn't exist"
        action={
          <Link href="/" asChild>
            <Button>
              <Text>Go to products</Text>
            </Button>
          </Link>
        }
      />
    </View>
  );
}
