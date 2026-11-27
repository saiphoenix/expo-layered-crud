import Constants from 'expo-constants';
import { router } from 'expo-router';
import {
  GraduationCap,
  Globe,
  Info,
  Mail,
  Monitor,
  Moon,
  Palette,
  RefreshCw,
  Smartphone,
  Sun,
} from 'lucide-react-native';
import { Alert, Linking, ScrollView, View } from 'react-native';

import { learnRoutes } from '@/modules/learn';
import { getErrorMessage } from '@/shared/api';
import { SettingsGroup, SettingsRow } from '@/shared/components/settings-row';
import { Separator } from '@/shared/ui/separator';
import { Text } from '@/shared/ui/text';
import { ToggleGroup, ToggleGroupIcon, ToggleGroupItem } from '@/shared/ui/toggle-group';
import { env } from '@/shared/config/env';
import { useThemePreference, type ThemePreference } from '@/shared/hooks/use-theme-preference';
import { haptics } from '@/shared/lib/haptics';

import { settingsRoutes } from '../../settings.routes';
import { useResetServerData } from './use-reset-server-data';

const SUPPORT_EMAIL = 'support@example.com';

const THEME_OPTIONS: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

/** SETTINGS tab: appearance, developer tools (UI Sandbox) and app info. */
export function SettingsScreen() {
  const [themePreference, setThemePreference] = useThemePreference();
  const resetServerData = useResetServerData();

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="gap-6 p-4 pb-10">
      <SettingsGroup title="Appearance">
        <View className="gap-3 p-4">
          <Text className="text-base">Theme</Text>
          <ToggleGroup
            type="single"
            variant="outline"
            className="w-full"
            value={themePreference}
            onValueChange={(value) => value && setThemePreference(value as ThemePreference)}>
            {THEME_OPTIONS.map((option, index) => (
              <ToggleGroupItem
                key={option.value}
                value={option.value}
                aria-label={option.label}
                isFirst={index === 0}
                isLast={index === THEME_OPTIONS.length - 1}
                className="flex-1 flex-row gap-2">
                <ToggleGroupIcon as={option.icon} />
                <Text>{option.label}</Text>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </View>
      </SettingsGroup>

      <SettingsGroup title="Help">
        <SettingsRow
          icon={Mail}
          label="Contact support"
          description="Email our support team"
          onPress={() =>
            Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=Help%20with%20the%20app`).catch(
              (error: unknown) =>
                Alert.alert('Unable to open email', getErrorMessage(error)),
            )
          }
        />
      </SettingsGroup>

      <SettingsGroup title="Developer">
        {/* 📘 WEEK 1 DEMO: entry point to the teaching screens (route "/learn") */}
        <SettingsRow
          icon={GraduationCap}
          label="Week 1 Demo"
          description="Core components, TS, Tailwind, Expo Router, Zod"
          onPress={() => router.push(learnRoutes.students)}
        />
        <Separator />
        <SettingsRow
          icon={Palette}
          label="UI Sandbox"
          description="Every UI component in one place"
          onPress={() => router.push(settingsRoutes.uiSandbox)}
        />
        <Separator />
        <SettingsRow
          icon={RefreshCw}
          label="Reset cached data"
          description="Reload everything from the API"
          onPress={() =>
            resetServerData.mutate(undefined, {
              onSuccess: () => haptics.success(),
              onError: (error) => Alert.alert('Reset failed', getErrorMessage(error)),
            })
          }
        />
      </SettingsGroup>

      <SettingsGroup title="About">
        <SettingsRow icon={Info} label="App version" value={Constants.expoConfig?.version ?? '–'} />
        <Separator />
        <SettingsRow
          icon={Smartphone}
          label="Expo SDK"
          value={Constants.expoConfig?.sdkVersion ?? '58'}
        />
        <Separator />
        <SettingsRow icon={Globe} label="API" value={env.apiUrl.replace(/^https?:\/\//, '')} />
      </SettingsGroup>
    </ScrollView>
  );
}
