import { theme, VStackAnimated } from '@components/atoms';
import Image from '@components/atoms/image';
import { memo } from 'react';
import { StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import type { AnimatedStyle } from 'react-native-reanimated';

type AddressBannerProps = {
  style?: StyleProp<AnimatedStyle<ViewStyle>>;
  imageUri: string | number;
  backgroundColor?: string;
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageRadius: {
    borderBottomLeftRadius: theme.spacing.large * 2,
    borderCurve: 'continuous',
    borderBottomRightRadius: theme.spacing.large * 2,
  },
});

/** Banner atas yang meregang saat over-scroll (dipakai di halaman list alamat). */
export const AddressBanner = memo(function AddressBanner({
  style,
  imageUri,
  backgroundColor = theme.pallate.neutral['02'],
}: AddressBannerProps) {
  return (
    <VStackAnimated style={style} backgroundColor={backgroundColor}>
      <Image uri={imageUri} style={[styles.image, styles.imageRadius]} />
    </VStackAnimated>
  );
});

AddressBanner.displayName = 'AddressBanner';
