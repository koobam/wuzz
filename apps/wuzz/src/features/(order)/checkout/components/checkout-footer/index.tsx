import { HStack, Pressable, Text, theme, VStack } from '@components/atoms';
import { ArrowRight2 } from 'iconsax-react-native';
import { memo } from 'react';
import { StyleSheet, type LayoutChangeEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CARD_RADIUS = 20;
/** How far the card rides down over the hint tab behind it. */
const TAB_OVERLAP = theme.spacing.medium;

export interface CheckoutFooterProps {
  totalLabel: string;
  /** Under the amount: what is being booked, so the last look before paying has
   *  something true to check. */
  caption?: string;
  disabled?: boolean;
  /** Yang masih kurang, di tab gelap di belakang kartu, supaya tombol mati tidak
   *  terasa rusak. */
  hint?: string;
  onPress?: () => void;
  /** Tapped while disabled: the bar looks blocked, but a tap should say why. */
  onDisabledPress?: () => void;
  /** Reports the footer's height so the page can keep its last section clear. */
  onLayout?: (event: LayoutChangeEvent) => void;
}

/**
 * The pay bar, floating over the bottom of the checkout. The dark tab behind it
 * carries the reason the button is inert; the arrow is bare and tilted, the way
 * the cart's is.
 */
export const CheckoutFooter = memo(function CheckoutFooter({
  totalLabel,
  caption,
  disabled = false,
  hint,
  onPress,
  onDisabledPress,
  onLayout,
}: CheckoutFooterProps) {
  const { bottom } = useSafeAreaInsets();
  return (
    <VStack
      onLayout={onLayout}
      items="stretch"
      style={[styles.wrap, { bottom: bottom + theme.spacing.standard }]}
    >
      <Pressable
        onPress={disabled ? onDisabledPress : onPress}
        disabled={disabled && !onDisabledPress}
        direction="column"
        items="stretch"
      >
        {hint ? (
          <VStack
            margin={{ marginHorizontal: theme.spacing.large }}
            style={styles.tab}
          >
            <Text
              type="l1"
              weight="semibold"
              align="center"
              color={theme.pallate.neutral['01']}
              text={hint}
            />
          </VStack>
        ) : null}
        <HStack
          items="center"
          gap={theme.spacing.standard}
          borderRadius={CARD_RADIUS}
          backgroundColor={theme.pallate.neutral['01']}
          padding={theme.spacing.medium}
          style={styles.card}
        >
          <VStack fill style={styles.text}>
            <Text
              type="b1"
              weight="semibold"
              color={theme.pallate.neutral['05']}
            >
              Pesan
              <Text
                type="b1"
                weight="regular"
                color={theme.pallate.neutral['05']}
              >
                {` · ${totalLabel}`}
              </Text>
            </Text>
            {caption ? (
              <Text
                type="l2"
                numberOfLines={1}
                color={theme.pallate.neutral['04']}
              >
                {caption}
              </Text>
            ) : null}
          </VStack>
          <HStack items="center" justify="center" style={styles.arrow}>
            <ArrowRight2 size={22} color={theme.pallate.neutral['05']} />
          </HStack>
        </HStack>
      </Pressable>
    </VStack>
  );
});

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: theme.spacing.large,
    right: theme.spacing.large,
    zIndex: 10,
    elevation: 10,
  },
  tab: {
    backgroundColor: theme.pallate.neutral['05'],
    borderTopLeftRadius: CARD_RADIUS,
    borderTopRightRadius: CARD_RADIUS,
    borderCurve: 'continuous',
    paddingHorizontal: theme.spacing.large,
    paddingTop: theme.spacing.small,
    paddingBottom: theme.spacing.large,
    marginBottom: -TAB_OVERLAP,
  },
  card: {
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: theme.pallate.neutral['05'],
  },
  text: { minWidth: 0 },
  arrow: { width: 28, height: 28, transform: [{ rotate: '-45deg' }] },
});
