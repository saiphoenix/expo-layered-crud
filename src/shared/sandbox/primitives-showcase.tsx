import { BottomSheetView } from '@gorhom/bottom-sheet';
import {
  AlertTriangle,
  Bell,
  Bold,
  Heart,
  Info,
  Italic,
  Mail,
  Plus,
  Search,
  Settings,
  ShoppingCart,
  Trash2,
  Underline,
  User,
} from 'lucide-react-native';
import { useRef, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBottomSheet, type AppBottomSheetRef } from '@/shared/components/app-bottom-sheet';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { Checkbox } from '@/shared/ui/checkbox';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { Icon } from '@/shared/ui/icon';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Progress } from '@/shared/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group';
import { Separator } from '@/shared/ui/separator';
import { Skeleton } from '@/shared/ui/skeleton';
import { Switch } from '@/shared/ui/switch';
import { Text } from '@/shared/ui/text';
import { Textarea } from '@/shared/ui/textarea';
import { ToggleGroup, ToggleGroupIcon, ToggleGroupItem } from '@/shared/ui/toggle-group';

import { SandboxLabel, SandboxSection } from './sandbox-section';

/* Class names must be written out in full so Tailwind can find them (no string building). */
const COLOR_TOKENS = [
  { name: 'background', className: 'bg-background' },
  { name: 'foreground', className: 'bg-foreground' },
  { name: 'card', className: 'bg-card' },
  { name: 'primary', className: 'bg-primary' },
  { name: 'secondary', className: 'bg-secondary' },
  { name: 'muted', className: 'bg-muted' },
  { name: 'accent', className: 'bg-accent' },
  { name: 'destructive', className: 'bg-destructive' },
  { name: 'success', className: 'bg-success' },
  { name: 'border', className: 'bg-border' },
];

const BUTTON_VARIANTS = [
  'default',
  'secondary',
  'outline',
  'ghost',
  'destructive',
  'link',
] as const;
const TEXT_VARIANTS = ['h1', 'h2', 'h3', 'h4', 'lead', 'large', 'p', 'small', 'muted'] as const;
const ICONS = [Search, Heart, Bell, Mail, User, Settings, ShoppingCart, Trash2, Info, Plus];

/**
 * PRIMITIVES: the React Native Reusables components in `src/shared/ui`.
 * They know nothing about products or the API. Everything else is built from them.
 */
export function PrimitivesShowcase() {
  const insets = useSafeAreaInsets();
  const [checked, setChecked] = useState(true);
  const [switchOn, setSwitchOn] = useState(false);
  const [density, setDensity] = useState('comfortable');
  const [formatting, setFormatting] = useState<string[]>(['bold']);
  const [progress, setProgress] = useState(40);
  const sheetRef = useRef<AppBottomSheetRef>(null);

  return (
    <View className="gap-8">
      <SandboxSection
        title="Color tokens"
        description="Defined once in global.css. They switch automatically in dark mode."
        file="src/global.css">
        <View className="flex-row flex-wrap gap-3">
          {COLOR_TOKENS.map((token) => (
            <View key={token.name} className="w-[30%] items-center gap-1">
              <View className={`h-12 w-full rounded-md border border-border ${token.className}`} />
              <Text className="text-xs">{token.name}</Text>
            </View>
          ))}
        </View>
      </SandboxSection>

      <SandboxSection title="Typography" file="src/shared/ui/text.tsx">
        {TEXT_VARIANTS.map((variant) => (
          <Text key={variant} variant={variant} className={variant === 'h1' ? 'text-left' : ''}>
            {variant} · The quick brown fox
          </Text>
        ))}
        <Text variant="code">variant=&quot;code&quot;</Text>
      </SandboxSection>

      <SandboxSection title="Button" file="src/shared/ui/button.tsx">
        <SandboxLabel>Variants</SandboxLabel>
        <View className="flex-row flex-wrap gap-2">
          {BUTTON_VARIANTS.map((variant) => (
            <Button key={variant} variant={variant}>
              <Text>{variant}</Text>
            </Button>
          ))}
        </View>
        <SandboxLabel>Sizes</SandboxLabel>
        <View className="flex-row flex-wrap items-center gap-2">
          <Button size="sm">
            <Text>Small</Text>
          </Button>
          <Button>
            <Text>Default</Text>
          </Button>
          <Button size="lg">
            <Text>Large</Text>
          </Button>
          <Button size="icon" variant="outline" accessibilityLabel="Add">
            <Icon as={Plus} />
          </Button>
        </View>
        <SandboxLabel>With icon / disabled</SandboxLabel>
        <View className="flex-row flex-wrap gap-2">
          <Button>
            <Icon as={Mail} />
            <Text>Send email</Text>
          </Button>
          <Button disabled>
            <Text>Disabled</Text>
          </Button>
        </View>
      </SandboxSection>

      <SandboxSection title="Inputs" file="src/shared/ui/input.tsx · textarea.tsx · label.tsx">
        <View className="gap-2">
          <Label>Email</Label>
          <Input placeholder="you@example.com" keyboardType="email-address" />
        </View>
        <View className="gap-2">
          <Label>With error</Label>
          <Input defaultValue="not-an-email" aria-invalid className="border-destructive" />
          <Text className="text-sm text-destructive">Please enter a valid email</Text>
        </View>
        <View className="gap-2">
          <Label>Disabled</Label>
          <Input placeholder="Can't type here" editable={false} />
        </View>
        <View className="gap-2">
          <Label>Textarea</Label>
          <Textarea placeholder="Write something longer…" />
        </View>
      </SandboxSection>

      <SandboxSection
        title="Selection controls"
        file="checkbox.tsx · switch.tsx · radio-group.tsx · toggle-group.tsx">
        <View className="flex-row items-center gap-3">
          <Checkbox
            checked={checked}
            onCheckedChange={setChecked}
            aria-labelledby="sandbox-terms"
          />
          <Label nativeID="sandbox-terms" onPress={() => setChecked((c) => !c)}>
            Accept terms and conditions
          </Label>
        </View>
        <View className="flex-row items-center justify-between">
          <Label nativeID="sandbox-notifications">Notifications {switchOn ? 'on' : 'off'}</Label>
          <Switch
            checked={switchOn}
            onCheckedChange={setSwitchOn}
            aria-labelledby="sandbox-notifications"
          />
        </View>
        <Separator />
        <RadioGroup value={density} onValueChange={setDensity}>
          {['default', 'comfortable', 'compact'].map((option) => (
            <View key={option} className="flex-row items-center gap-3">
              <RadioGroupItem value={option} aria-labelledby={`density-${option}`} />
              <Label nativeID={`density-${option}`} onPress={() => setDensity(option)}>
                {option}
              </Label>
            </View>
          ))}
        </RadioGroup>
        <Separator />
        <ToggleGroup
          type="multiple"
          variant="outline"
          value={formatting}
          onValueChange={setFormatting}>
          <ToggleGroupItem value="bold" aria-label="Bold" isFirst>
            <ToggleGroupIcon as={Bold} />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italic">
            <ToggleGroupIcon as={Italic} />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Underline" isLast>
            <ToggleGroupIcon as={Underline} />
          </ToggleGroupItem>
        </ToggleGroup>
      </SandboxSection>

      <SandboxSection title="Badge" file="src/shared/ui/badge.tsx">
        <View className="flex-row flex-wrap gap-2">
          <Badge>
            <Text>default</Text>
          </Badge>
          <Badge variant="secondary">
            <Text>secondary</Text>
          </Badge>
          <Badge variant="destructive">
            <Text>destructive</Text>
          </Badge>
          <Badge variant="outline">
            <Text>outline</Text>
          </Badge>
        </View>
      </SandboxSection>

      <SandboxSection
        title="Card"
        file="src/shared/ui/card.tsx"
        className="border-0 bg-transparent p-0">
        <Card>
          <CardHeader>
            <CardTitle>Card title</CardTitle>
            <CardDescription>Cards group related content.</CardDescription>
          </CardHeader>
          <CardContent>
            <Text>Anything can go in the content area.</Text>
          </CardContent>
          <CardFooter className="gap-2">
            <Button variant="outline" className="flex-1">
              <Text>Cancel</Text>
            </Button>
            <Button className="flex-1">
              <Text>Save</Text>
            </Button>
          </CardFooter>
        </Card>
      </SandboxSection>

      <SandboxSection title="Feedback" file="alert.tsx · progress.tsx · skeleton.tsx">
        <Alert icon={Info}>
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>This is a default alert.</AlertDescription>
        </Alert>
        <Alert icon={AlertTriangle} variant="destructive">
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>This is a destructive alert.</AlertDescription>
        </Alert>
        <View className="gap-2">
          <Text variant="small">Progress: {progress}%</Text>
          <Progress value={progress} />
          <Button
            variant="secondary"
            size="sm"
            className="self-start"
            onPress={() => setProgress((p) => (p >= 100 ? 0 : p + 20))}>
            <Text>Advance</Text>
          </Button>
        </View>
        <View className="flex-row items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <View className="flex-1 gap-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </View>
        </View>
      </SandboxSection>

      <SandboxSection title="Avatar" file="src/shared/ui/avatar.tsx">
        <View className="flex-row gap-3">
          <Avatar alt="Emily">
            <AvatarImage source={{ uri: 'https://dummyjson.com/icon/emilys/128' }} />
            <AvatarFallback>
              <Text>EM</Text>
            </AvatarFallback>
          </Avatar>
          <Avatar alt="No image">
            <AvatarFallback>
              <Text>JD</Text>
            </AvatarFallback>
          </Avatar>
        </View>
      </SandboxSection>

      <SandboxSection
        title="Overlays"
        description="Dialogs render into <PortalHost /> in the root layout."
        file="dialog.tsx · alert-dialog.tsx · common/app-bottom-sheet.tsx">
        <View className="flex-row flex-wrap gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Text>Dialog</Text>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>A regular dialog with any content inside.</DialogDescription>
              </DialogHeader>
              <Input placeholder="Your name" />
              <DialogFooter>
                <DialogClose asChild>
                  <Button>
                    <Text>Done</Text>
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">
                <Text>Alert dialog</Text>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  Alert dialogs ask for confirmation before something important.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  <Text>Cancel</Text>
                </AlertDialogCancel>
                <AlertDialogAction>
                  <Text>Continue</Text>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button variant="outline" onPress={() => sheetRef.current?.present()}>
            <Text>Bottom sheet</Text>
          </Button>
        </View>
        <AppBottomSheet ref={sheetRef} enableDynamicSizing>
          <BottomSheetView style={{ paddingBottom: insets.bottom + 16 }}>
            <View className="gap-3 px-4">
              <Text variant="large">Bottom sheet</Text>
              <Text variant="muted">
                @gorhom/bottom-sheet, styled with theme colors. Drag down or tap outside to close.
              </Text>
              <Button onPress={() => sheetRef.current?.dismiss()}>
                <Text>Close</Text>
              </Button>
            </View>
          </BottomSheetView>
        </AppBottomSheet>
      </SandboxSection>

      <SandboxSection
        title="Icons"
        description="lucide-react-native through <Icon as={…} />, colored with className."
        file="src/shared/ui/icon.tsx">
        <View className="flex-row flex-wrap gap-4">
          {ICONS.map((IconComponent, index) => (
            <Icon key={index} as={IconComponent} className="size-6 text-foreground" />
          ))}
        </View>
        <View className="flex-row gap-4">
          <Icon as={Heart} className="size-6 text-primary" />
          <Icon as={Heart} className="size-6 text-destructive" />
          <Icon as={Heart} className="size-6 text-success" />
          <Icon as={Heart} className="size-6 text-muted-foreground" />
        </View>
      </SandboxSection>
    </View>
  );
}
