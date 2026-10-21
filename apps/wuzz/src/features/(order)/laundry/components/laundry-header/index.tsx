import {
  GlassBlur,
  glassSurface,
  HStackAnimated,
  Pressable,
  Text,
  theme,
} from '@components/atoms';
import { ArrowLeft2, MessageQuestion } from 'iconsax-react-native';
import { memo } from 'react';
import { StyleSheet } from 'react-native';
import type { LaundryHeaderProps } from './laundry-header.types';

/** The same height as the back and help pills on the checkout. */
const PILL_HEIGHT = 50;

/**
 * Back and help as frosted pills floating over the banner, the same glass and
 * size as the checkout's, so the two screens read as one design.
 */
export const LaundryHeader = memo(function LaundryHeader({
  style,
  title,
  onBackPress,
  onHelpPress,
}: LaundryHeaderProps) {
  return (
    <HStackAnimated style={style} justify="space-between">
      <Pressable
        onPress={onBackPress}
        items="center"
        gap={theme.spacing.tiny}
        height={PILL_HEIGHT}
        padding={{ paddingHorizontal: theme.spacing.medium }}
        borderRadius={16}
        style={styles.pill}
        removeClippedSubviews
      >
        <GlassBlur />
        <ArrowLeft2 size={18} color={theme.pallate.neutral['05']} />
        <Text
          type="b2"
          weight="bold"
          color={theme.pallate.neutral['05']}
          numberOfLines={1}
        >
          {title}
        </Text>
      </Pressable>
      <Pressable
        onPress={onHelpPress}
        items="center"
        gap={theme.spacing.tiny}
        height={PILL_HEIGHT}
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
    </HStackAnimated>
  );
});

export type { LaundryHeaderProps } from './laundry-header.types';

const styles = StyleSheet.create({
  // Frosted glass over the banner: the shared surface with the blur as its first
  // child. No shadow.
  pill: {
    ...glassSurface,
    flexDirection: 'row',
  },
});
