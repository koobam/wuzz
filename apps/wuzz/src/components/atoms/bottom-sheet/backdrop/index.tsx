import {BottomSheetDefaultBackdropProps} from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import React, {memo} from 'react';
import {StyleSheet} from 'react-native';
import {BottomSheetBackdrop as GorhomBottomSheetBackdrop} from '@gorhom/bottom-sheet';

export const BottomSheetBackdrop = memo(
  (props: React.JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps) => (
    <GorhomBottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      style={[props?.style, styles.bottomSheetBackdrop].filter(Boolean)}
      enableTouchThrough

    />
  ),
);

const styles = StyleSheet.create({
  bottomSheetBackdrop: {backgroundColor: 'rgba(255,255,255,0.4)'},
});


export default BottomSheetBackdrop;
