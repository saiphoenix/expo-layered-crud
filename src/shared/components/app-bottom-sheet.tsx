import {
  BottomSheetBackdrop,
  BottomSheetModal,
  type BottomSheetBackdropProps,
  type BottomSheetModalProps,
} from '@gorhom/bottom-sheet';
import type { Ref } from 'react';

import { useThemeColors } from '@/shared/hooks/use-theme-colors';

function Backdrop(props: BottomSheetBackdropProps) {
  return <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.5} />;
}

/**
 * @gorhom/bottom-sheet modal, pre-styled with our theme colors.
 * Open it with `ref.current?.present()`, close it with `ref.current?.dismiss()`.
 */
export function AppBottomSheet({
  ref,
  children,
  ...props
}: BottomSheetModalProps & { ref?: Ref<BottomSheetModal> }) {
  const colors = useThemeColors();

  return (
    <BottomSheetModal
      ref={ref}
      backdropComponent={Backdrop}
      backgroundStyle={{ backgroundColor: colors.card }}
      handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}
      {...props}>
      {children}
    </BottomSheetModal>
  );
}

export type { BottomSheetModal as AppBottomSheetRef };
