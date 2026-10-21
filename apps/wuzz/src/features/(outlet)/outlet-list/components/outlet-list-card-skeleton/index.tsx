import { HStack, Shimmer, theme, VStack } from '@components/atoms';
import { memo } from 'react';
import { StyleSheet } from 'react-native';

const CARD_BORDER_RADIUS = 24;
const PHOTO_WIDTH = 80;
const PHOTO_HEIGHT = 50;

const styles = StyleSheet.create({
  cardWrapper: {
    marginHorizontal: theme.spacing.large,
    borderRadius: CARD_BORDER_RADIUS,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: theme.pallate.neutral['03'],
    overflow: 'hidden',
  },
});

const rowPadding = { paddingHorizontal: theme.spacing.large };

/** Skeleton loading yang meniru layout OutletListCard (nama, alamat, foto, tag). */
export const OutletListCardSkeleton = memo(() => (
  <VStack
    style={styles.cardWrapper}
    gap={theme.spacing.standard}
    padding={{ paddingVertical: theme.spacing.large }}
  >
    <VStack padding={rowPadding} gap={theme.spacing.small}>
      <Shimmer width="60%" height={16} borderRadius={6} />
      <Shimmer width="45%" height={12} borderRadius={6} />
    </VStack>
    <HStack padding={rowPadding} gap={theme.spacing.tiny}>
      <Shimmer width={PHOTO_WIDTH} height={PHOTO_HEIGHT} borderRadius={10} />
      <Shimmer width={PHOTO_WIDTH} height={PHOTO_HEIGHT} borderRadius={10} />
      <Shimmer width={PHOTO_WIDTH} height={PHOTO_HEIGHT} borderRadius={10} />
    </HStack>
    <HStack padding={rowPadding} gap={theme.spacing.small}>
      <Shimmer width={90} height={32} borderRadius={10} />
      <Shimmer width={70} height={32} borderRadius={10} />
    </HStack>
  </VStack>
));

OutletListCardSkeleton.displayName = 'OutletListCardSkeleton';
