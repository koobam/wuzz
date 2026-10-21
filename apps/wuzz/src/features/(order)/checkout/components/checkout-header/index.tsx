import {
  GlassBlur,
  glassSurface,
  HStack,
  Pressable,
  Text,
  theme,
} from '@components/atoms';
import { ArrowLeft2, MessageQuestion } from 'iconsax-react-native';
import { memo } from 'react';
import { StyleSheet } from 'react-native';
import type { CheckoutHeaderProps } from './checkout-header.types';

/** Height of the floating pills; the page clears it with its top padding. */
export const BACK_HEIGHT = 50;

/**
 * The two frosted pills that float over the map, pinned while the page scrolls:
 * "Kembali" at the left and "Bantuan" at the right.
 */
export const CheckoutHeader = memo(function CheckoutHeader({
  onBackPress,
  onHelpPress,
  topInset,
}: CheckoutHeaderProps) {
  return (
    <HStack
      items="center"
      justify="space-between"
      style={[styles.row, { top: topInset + theme.spacing.standard }]}
      pointerEvents="box-none"
    >
      <Pressable
        onPress={onBackPress}
        items="center"
        gap={theme.spacing.tiny}
        height={BACK_HEIGHT}
        padding={{ paddingHorizontal: theme.spacing.medium }}
        borderRadius={16}
        style={styles.pill}
        removeClippedSubviews
      >
        <GlassBlur />
        <ArrowLeft2 size={18} color={theme.pallate.neutral['05']} />
        <Text type="b2" weight="bold" color={theme.pallate.neutral['05']}>
          Kembali
        </Text>
      </Pressable>
      <Pressable
        onPress={onHelpPress}
        items="center"
        gap={theme.spacing.tiny}
        height={BACK_HEIGHT}
        padding={{ paddingHorizontal: theme.spacing.medium }}
        borderRadius={16}
        style={styles.pill}
        removeClippedSubviews
      >
        <GlassBlur />
        <MessageQuestion size={18} color={theme.pallate.neutral['05']} />
        <Text type="b2" weight="bold" color={theme.pallate.neutral['05']}>
          Bantuan
        </Text>
      </Pressable>
    </HStack>
  );
});

export type { CheckoutHeaderProps } from './checkout-header.types';

const styles = StyleSheet.create({
  row: {
    position: 'absolute',
    left: theme.spacing.large,
    right: theme.spacing.large,
    zIndex: 10,
  },
  // Frosted glass over the map: the shared surface (hairline edge, faint tint,
  // clipping) with the blur as its first child. No shadow.
  pill: {
    ...glassSurface,
    flexDirection: 'row',
  },
});
