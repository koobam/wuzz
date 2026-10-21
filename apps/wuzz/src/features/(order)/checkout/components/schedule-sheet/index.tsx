import { Button, Text, theme, VStack } from '@components/atoms';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { memo, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PickupTimeSection } from '../pickup-time-section';

export interface ScheduleSheetProps {
  modalRef: React.RefObject<BottomSheetModal | null>;
  title: string;
  date: string;
  slotId: string | null;
  onSelectDate: (date: string) => void;
  onSelectSlot: (slotId: string) => void;
}

const renderBackdrop = (props: BottomSheetBackdropProps) => (
  <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
);

/** Bottom sheet for picking the day and the window. Choices apply as they are
 *  made; "Selesai" only closes it, and waits for a window. */
export const ScheduleSheet = memo(function ScheduleSheet({
  modalRef,
  title,
  date,
  slotId,
  onSelectDate,
  onSelectSlot,
}: ScheduleSheetProps) {
  const { bottom } = useSafeAreaInsets();
  const handleDone = useCallback(() => {
    modalRef.current?.dismiss();
  }, [modalRef]);

  return (
    <BottomSheetModal
      ref={modalRef}
      enableDynamicSizing
      enablePanDownToClose
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.handle}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView
        style={{
          paddingHorizontal: theme.spacing.large,
          paddingBottom: bottom + theme.spacing.large,
        }}
      >
        <VStack gap={theme.spacing.tiny}>
          <Text type="s3" weight="bold">
            {title}
          </Text>
          <Text type="l1" color={theme.pallate.neutral['04']}>
            Pilih tanggal, lalu jam yang tersedia.
          </Text>
        </VStack>
        <PickupTimeSection
          date={date}
          slotId={slotId}
          onSelectDate={onSelectDate}
          onSelectSlot={onSelectSlot}
          bleed={theme.spacing.large}
        />
        <Button
          rounded
          size="md"
          variant="primary"
          disabled={slotId == null}
          onPress={slotId == null ? undefined : handleDone}
        >
          <Text type="b2" weight="semibold" color={theme.pallate.neutral['01']}>
            Selesai
          </Text>
        </Button>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  background: { backgroundColor: theme.pallate.neutral['01'] },
  handle: { backgroundColor: theme.pallate.neutral['03'] },
});
