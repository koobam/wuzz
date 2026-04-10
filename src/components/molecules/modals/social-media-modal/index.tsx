import React, { memo, useCallback, useMemo } from 'react';
import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  VStack,
  Text,
  theme,
  BottomSheetBackdrop,
  Button,
} from '@components/atoms';
import { SocialMediaType } from '@services/consts';
import { ChannelTypeDTO } from '@core/api/verification.types';
import {
  IconBrandFacebook,
  IconBrandTiktok,
  IconBrandX,
} from 'tabler-icons-react-native';

interface SocialMediaModalProps {
  loading: boolean;
  ref: React.ForwardedRef<BottomSheetModal>;
  onPressChannel: (channel: ChannelTypeDTO) => void;
}

export const SocialMediaModal = memo((props: SocialMediaModalProps) => {
  const { onPressChannel, ref } = props;
  const { bottom, top } = useSafeAreaInsets();

  // const otpMethods: SocialMediaType[] = useMemo(
  //   () => [
  //     {
  //       icon: (
  //         <IconBrandFacebook size={20} color={theme.pallate.neutral['01']} />
  //       ),
  //       onPress: () => onPressChannel('sms'),
  //       title: 'Facebook',
  //     },
  //     {
  //       icon: <IconBrandTiktok size={20} color={theme.pallate.neutral['01']} />,
  //       onPress: () => onPressChannel('sms'),
  //       title: 'Tiktok',
  //     },
  //     {
  //       icon: <IconBrandX size={20} color={theme.pallate.neutral['01']} />,
  //       onPress: () => onPressChannel('sms'),
  //       title: 'Twtiter (X.com)',
  //     },
  //   ],
  //   [onPressChannel],
  // );

  const renderBackdrop = useCallback(
    (val: React.JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop {...val} />
    ),
    [],
  );

  const renderItem = useCallback(({ item }: { item: SocialMediaType }) => {
    return (
      <Button
        margin={{
          marginTop: theme.spacing.standard,
          marginHorizontal: theme.spacing.large,
        }}
        spacing={theme.spacing.tiny}
        variant="default"
        rounded
      >
        {item.icon}
        <Text type="l1" color={theme.pallate.neutral['01']}>
          {item.title}
        </Text>
      </Button>
    );
  }, []);

  const ListHeaderComponent = useMemo(() => {
    return (
      <VStack
        backgroundColor={theme.pallate.neutral['06']}
        borderWidth={{
          borderBottomWidth: 1,
        }}
        borderColor={theme.pallate.neutral['04']}
        padding={theme.spacing.large}
      >
          <Text
            type="s3"
            weight="bold"
            color={theme.pallate.neutral['01']}
            text={'Let’s Get You In'}
          />
          <Text
            type="l1"
            color={theme.pallate.neutral['01']}
            text="Choose a social media to continue."
          />
      </VStack>
    );
  }, []);

  return (
    <BottomSheetModal
      ref={ref}
      enableDynamicSizing
      enablePanDownToClose
      topInset={top + theme.spacing.standard}
      keyboardBehavior="interactive"
      backgroundStyle={{ backgroundColor: theme.pallate.neutral['06'] }}
      handleIndicatorStyle={{ backgroundColor: theme.pallate.neutral['03'] }}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetFlatList
        contentContainerStyle={{
          paddingBottom: bottom + theme.spacing.standard,
        }}
        initialNumToRender={0}
        ListHeaderComponent={ListHeaderComponent}
        data={[]}
        stickyHeaderIndices={[0]}
        renderItem={renderItem}
        scrollEnabled={false}
      />
    </BottomSheetModal>
  );
});

SocialMediaModal.displayName = 'molecules/social-media-modal';
export default SocialMediaModal;
