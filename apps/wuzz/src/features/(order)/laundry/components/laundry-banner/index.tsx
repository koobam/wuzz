import { theme, VStackAnimated } from '@components/atoms';
import Image from '@components/atoms/image';
import { memo } from 'react';
import { StyleSheet } from 'react-native';
import type { LaundryBannerProps } from './laundry-banner.types';

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

export const LaundryBanner = memo(function LaundryBanner({
  style,
  imageUri,
  backgroundColor = theme.pallate.neutral['02'],
}: LaundryBannerProps) {
  return (
    <VStackAnimated
      style={style}
      backgroundColor={backgroundColor}
    >
      <Image
        uri={imageUri}
        style={[styles.image, styles.imageRadius]}
      />
    </VStackAnimated>
  );
});

export type { LaundryBannerProps } from './laundry-banner.types';
