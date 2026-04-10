import {VStack, theme, Text, Pressable} from '@components/atoms';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import { OTPMethodType } from '@services/consts';
import {ArrowRight2} from 'iconsax-react-native';
import React, {ForwardedRef, memo} from 'react';

interface OtpListProps {
  loading: boolean;
  item: OTPMethodType;
  bottomSheetRef: ForwardedRef<BottomSheetModal>;
}

const OtpList = memo(({loading, item, bottomSheetRef}: OtpListProps) => (
  <Pressable
    disabled={loading}
    padding={{
      paddingHorizontal: 20,
      paddingVertical: 10,
    }}
    onPress={() => {
      item.onPress();
      // Use the ref to close the BottomSheetModal
      (
        bottomSheetRef as React.MutableRefObject<BottomSheetModal | null>
      )?.current?.close();
    }}
    fill
    borderRadius={12}
    items="center"
    spacing={12}>
    <VStack
      borderRadius={25}
      items="center"
      justify="center"
      width={55}
      height={55}
      backgroundColor={theme.pallate.neutral['04']}>
      {/* {item.icon} */}
    </VStack>
    <VStack fill>
      <Text
        type="b2"
        weight="bold"
        color={theme.pallate.neutral['01']}
        text={item.title}
      />
      <Text
        type="l1"
        color={theme.pallate.neutral['01']}
        text={item.description}
      />
    </VStack>
    <ArrowRight2 size={16} color={theme.pallate.neutral['01']} />
  </Pressable>
));

OtpList.displayName = 'OtpList';
export default OtpList;
