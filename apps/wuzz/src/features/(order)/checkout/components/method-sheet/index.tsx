import {
  Flex,
  HStack,
  Pressable,
  Text,
  theme,
  VStack,
} from '@components/atoms';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { Shop, TruckFast } from 'iconsax-react-native';
import { memo, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ORDER_METHOD_OPTIONS, type OrderMethod } from '../../types';

export interface MethodSheetProps {
  modalRef: React.RefObject<BottomSheetModal | null>;
  value: OrderMethod;
  onSelect: (value: OrderMethod) => void;
}

const renderBackdrop = (props: BottomSheetBackdropProps) => (
  <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
);

/** Bottom sheet for changing how the order changes hands. */
export const MethodSheet = memo(function MethodSheet({
  modalRef,
  value,
  onSelect,
}: MethodSheetProps) {
  const { bottom } = useSafeAreaInsets();
  const handleSelect = useCallback(
    (next: OrderMethod) => {
      onSelect(next);
      modalRef.current?.dismiss();
    },
    [modalRef, onSelect],
  );

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
            Metode Pemesanan
          </Text>
          <Text type="l1" color={theme.pallate.neutral['04']}>
            Pilih cara laundrymu berpindah tangan.
          </Text>
        </VStack>
        <VStack
          gap={theme.spacing.standard}
          margin={{ marginTop: theme.spacing.standard }}
        >
          {ORDER_METHOD_OPTIONS.map(option => {
            const selected = option.value === value;
            const Icon = option.value === 'delivery' ? TruckFast : Shop;
            return (
              <Pressable
                key={option.value}
                onPress={() => handleSelect(option.value)}
                items="center"
                gap={theme.spacing.standard}
                padding={theme.spacing.medium}
                borderRadius={20}
                style={[styles.option, selected && styles.optionSelected]}
              >
                <HStack
                  items="center"
                  justify="center"
                  width={44}
                  height={44}
                  borderRadius={14}
                  backgroundColor={theme.pallate.neutral['02']}
                >
                  <Icon
                    size={24}
                    variant="Bulk"
                    color={theme.pallate.neutral['05']}
                  />
                </HStack>
                <VStack fill>
                  <Text type="b1" weight="bold">
                    {option.label}
                  </Text>
                  <Text type="l1" color={theme.pallate.neutral['04']}>
                    {option.description}
                  </Text>
                </VStack>
                <Flex
                  width={25}
                  height={25}
                  borderRadius={15}
                  borderWidth={2}
                  borderColor={
                    selected
                      ? theme.pallate.primary['03']
                      : theme.pallate.neutral['03']
                  }
                  items="center"
                  justify="center"
                >
                  {selected && (
                    <Flex
                      width={15}
                      height={15}
                      borderRadius={15}
                      backgroundColor={theme.pallate.primary['03']}
                    />
                  )}
                </Flex>
              </Pressable>
            );
          })}
        </VStack>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  background: { backgroundColor: theme.pallate.neutral['01'] },
  handle: { backgroundColor: theme.pallate.neutral['03'] },
  option: {
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: theme.pallate.neutral['03'],
  },
  optionSelected: { borderColor: theme.pallate.primary['03'] },
});
