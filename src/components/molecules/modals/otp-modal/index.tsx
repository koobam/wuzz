import React, { memo, useCallback, useMemo } from 'react';
import { BottomSheetFlashList, BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  VStack,
  Text,
  theme,
  Divider,
  BottomSheetBackdrop,
} from '@components/atoms';
import { Call, Message2, Whatsapp } from 'iconsax-react-native';
import { OTPMethodType } from '@services/consts';
import { ChannelTypeDTO } from '@core/api/verification.types';
import OtpList from './otp-list';

interface OTPModalProps {
  loading: boolean;
  ref: React.ForwardedRef<BottomSheetModal>;
  onPressChannel: (channel: ChannelTypeDTO) => void;
}

export const OtpModal = memo((props: OTPModalProps) => {
  const { loading, onPressChannel, ref } = props;
  const { bottom, top } = useSafeAreaInsets();

  const otpMethods: OTPMethodType[] = useMemo(
    () => [
      {
        title: 'SMS',
        // icon: <Message2 size={20} color={theme.pallate.neutral['01']} />,
        onPress: () => onPressChannel('sms'),
        description: 'Receive your OTP code via SMS.',
      },
      {
        title: 'Call',
        // icon: <Call size={20} color={theme.pallate.neutral['01']} />,
        // onPress: () => onPressChannel('call'),
        description: 'Receive your OTP code via SMS.',
      },
      {
        title: 'WhatsApp',
        // icon: <Whatsapp size={20} color={theme.pallate.neutral['01']} />,
        // onPress: () => onPressChannel('whatsapp'),
        description: 'Receive your OTP code via whatsapp.',
      },
    ],
    [onPressChannel],
  );

  const renderBackdrop = useCallback(
    (val: React.JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop {...val} />
    ),
    [],
  );

  const ItemSeparatorComponent = useCallback(() => {
    return <Divider thickness={theme.spacing.standard} />;
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: OTPMethodType }) => {
      return <OtpList loading={loading} item={item} bottomSheetRef={ref} />;
    },
    [loading, ref],
  );

  const ListHeaderComponent = useMemo(() => {
    return (
      <VStack
        backgroundColor={theme.pallate.neutral['06']}
        padding={theme.spacing.large}
      >
        <VStack fill>
          <Text
            type="s2"
            weight="bold"
            color={theme.pallate.neutral['01']}
            text={'Select a Method'}
          />
          <Text
            type="b2"
            color={theme.pallate.neutral['01']}
            text="Choose how you'd like to receive your OTP code."
          />
        </VStack>
      </VStack>
    );
  }, []);

  return (
    <BottomSheetModal
      ref={ref}
      topInset={top + theme.spacing.standard}
      keyboardBehavior="interactive"
      backgroundStyle={{ backgroundColor: theme.pallate.neutral['06'] }}
      handleIndicatorStyle={{ backgroundColor: theme.pallate.neutral['03'] }}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetFlashList
        contentContainerStyle={{
          paddingBottom: bottom + theme.spacing.standard,
        }}
        ListHeaderComponent={ListHeaderComponent}
        ItemSeparatorComponent={ItemSeparatorComponent}
        data={otpMethods}
        estimatedItemSize={100}
        stickyHeaderIndices={[0]}
        renderItem={renderItem}
      />
    </BottomSheetModal>
  );
});

OtpModal.displayName = '@molecules/otp-modal';
export default OtpModal;
