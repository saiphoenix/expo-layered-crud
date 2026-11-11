import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, CircleAlert } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getErrorMessage } from '@/shared/api';
import type { AppBottomSheetRef } from '@/shared/components/app-bottom-sheet';
import { FormField } from '@/shared/components/form-field';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';
import { Input } from '@/shared/ui/input';
import { Text } from '@/shared/ui/text';
import { Textarea } from '@/shared/ui/textarea';
import { haptics } from '@/shared/lib/haptics';
import { humanize } from '@/shared/lib/format';
import { cn } from '@/shared/lib/utils';
import {
  productFormSchema,
  type ProductFormInput,
  type ProductFormValues,
} from '../data/product.schema';

import { CategoryPickerSheet } from './category-picker-sheet';

/**
 * Create / edit form (react-hook-form + zod).
 *
 * - The zod schema (`productFormSchema`) is the single source of truth for validation.
 * - The form does NOT know about the API. The screen passes `onSubmit`,
 *   which calls a React Query mutation. That keeps this component reusable.
 */
export function ProductForm({
  defaultValues,
  submitLabel,
  onSubmit,
  requireChanges = false,
}: {
  defaultValues: ProductFormInput;
  submitLabel: string;
  onSubmit: (values: ProductFormValues) => Promise<unknown>;
  /** Edit mode: keep the button disabled until something changed. */
  requireChanges?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const categorySheetRef = useRef<AppBottomSheetRef>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
    mode: 'onTouched', // validate a field after the user leaves it
  });

  const submitForm = handleSubmit(
    async (values) => {
      setSubmitError(null);
      try {
        await onSubmit(values);
      } catch (error) {
        haptics.error();
        setSubmitError(getErrorMessage(error));
      }
    },
    () => haptics.error()
  );
  // Called without the native event: RN press/submit events are not web BaseSyntheticEvents.
  const submit = () => void submitForm();

  return (
    <View className="flex-1">
      <KeyboardAwareScrollView
        bottomOffset={24}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        {/* KeyboardAwareScrollView is a 3rd-party component, so NativeWind's
            contentContainerClassName doesn't work on it - we style an inner View instead. */}
        <View className="gap-5 p-4">
          {submitError ? (
            <Alert variant="destructive" icon={CircleAlert}>
              <AlertTitle>Could not save</AlertTitle>
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          ) : null}

          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormField label="Title" error={errors.title?.message}>
                <Input
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="e.g. Wireless Headphones"
                  returnKeyType="next"
                  aria-invalid={!!errors.title}
                />
              </FormField>
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormField label="Description" error={errors.description?.message}>
                <Textarea
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="What makes this product great?"
                  aria-invalid={!!errors.description}
                />
              </FormField>
            )}
          />

          <View className="flex-row gap-3">
            <View className="flex-1">
              <Controller
                control={control}
                name="price"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormField label="Price (USD)" error={errors.price?.message}>
                    <Input
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="0.00"
                      keyboardType="decimal-pad"
                      aria-invalid={!!errors.price}
                    />
                  </FormField>
                )}
              />
            </View>
            <View className="flex-1">
              <Controller
                control={control}
                name="stock"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormField label="Stock" error={errors.stock?.message}>
                    <Input
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="0"
                      keyboardType="number-pad"
                      aria-invalid={!!errors.stock}
                    />
                  </FormField>
                )}
              />
            </View>
          </View>

          <Controller
            control={control}
            name="category"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormField label="Category" error={errors.category?.message}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Choose a category"
                  onPress={() => categorySheetRef.current?.present()}
                  className={cn(
                    'h-10 flex-row items-center justify-between rounded-md border border-input bg-background px-3 dark:bg-input/30',
                    errors.category && 'border-destructive'
                  )}>
                  <Text className={cn(!value && 'text-muted-foreground/60')}>
                    {value ? humanize(value) : 'Select a category'}
                  </Text>
                  <Icon as={ChevronDown} className="size-4 text-muted-foreground" />
                </Pressable>
                <CategoryPickerSheet
                  ref={categorySheetRef}
                  selected={value}
                  onSelect={(slug) => {
                    onChange(slug);
                    onBlur();
                    categorySheetRef.current?.dismiss();
                  }}
                />
              </FormField>
            )}
          />

          <Controller
            control={control}
            name="brand"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormField label="Brand" hint="Optional" error={errors.brand?.message}>
                <Input
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="e.g. Acme"
                  returnKeyType="done"
                  onSubmitEditing={submit}
                  aria-invalid={!!errors.brand}
                />
              </FormField>
            )}
          />

          <Button
            size="lg"
            onPress={submit}
            disabled={isSubmitting || (requireChanges && !isDirty)}
            className="mt-2">
            <Text>{isSubmitting ? 'Saving…' : submitLabel}</Text>
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
