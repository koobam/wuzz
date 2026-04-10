import { HStack, Pressable, Text, theme, VStack } from '@components/atoms';
import { Fragment, memo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DEFAULT_PRICE_LABEL } from '../../utils';
import type { LaundryFooterProps } from './laundry-footer.types';

export const LaundryFooter = memo(function LaundryFooter({
  priceLabel = DEFAULT_PRICE_LABEL,
  onAddToCart,
  onBingungPress,
}: LaundryFooterProps) {
  const { bottom } = useSafeAreaInsets();

  return (
    <Fragment>
      <HStack
        padding={{
          paddingHorizontal: theme.spacing.large,
          paddingBottom: theme.spacing.medium * 2.5,
          paddingTop: theme.spacing.large,
        }}
        backgroundColor={theme.pallate.primary['03']}
        borderRadius={{
          borderTopLeftRadius: theme.spacing.large,
          borderTopRightRadius: theme.spacing.large,
        }}
        spacing={theme.spacing.standard}
      >
        <Text
          fill
          numberOfLines={2}
          type="l1"
          color={theme.pallate.neutral['01']}
        >
          Harga masih estimasi, petugas kami yang pastikan nanti.
        </Text>
        <Pressable
          onPress={onBingungPress}
          padding={{
            paddingVertical: theme.spacing.standard,
            paddingHorizontal: theme.spacing.large,
          }}
          borderRadius={999}
          backgroundColor={theme.pallate.primary['04']}
        >
          <Text type="l2" weight="medium" color={theme.pallate.neutral['01']}>
            Bingung ?
          </Text>
        </Pressable>
      </HStack>
      <VStack
        spacing={theme.spacing.large}
        margin={{
          marginTop: -theme.spacing.large,
        }}
        borderRadius={theme.spacing.large}
        backgroundColor={theme.pallate.neutral['01']}
        padding={{
          paddingHorizontal: theme.spacing.large,
          paddingTop: theme.spacing.large,
          paddingBottom: bottom ? theme.spacing.standard + bottom : theme.spacing.large,
        }}
      >
        <Pressable
          onPress={onAddToCart}
          items="center"
          justify="center"
          padding={theme.spacing.large}
          borderRadius={999}
          backgroundColor={theme.pallate.primary['03']}
        >
          <Text type="b2" weight="semibold" color={theme.pallate.neutral['01']}>
            Tambah Keranjang ({priceLabel})
          </Text>
        </Pressable>
      </VStack>
    </Fragment>
  );
});

export type { LaundryFooterProps } from './laundry-footer.types';
