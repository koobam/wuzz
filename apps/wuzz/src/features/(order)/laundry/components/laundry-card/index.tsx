import { HStack, Text, theme, VStack } from '@components/atoms';
import { memo } from 'react';
import { BASE_PRICE_PER_KG } from '../../utils';
import { formatPriceRupiah } from '../../utils/format';
import type { LaundryCardProps } from './laundry-card.types';

const DEFAULT_TITLE = 'Laundry';
const DEFAULT_DESCRIPTION =
  'Cuci dan setrika kiloan solusi cepat dan praktis untuk pakaian.';

export const LaundryCard = memo(function LaundryCard({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  basePricePerKg = BASE_PRICE_PER_KG,
  priceLabel: priceLabelProp,
  priceUnit,
  showKgLabel = true,
}: LaundryCardProps) {
  const displayPrice =
    priceLabelProp ?? formatPriceRupiah(basePricePerKg);
  const showSuffix = priceLabelProp == null && (priceUnit != null ? priceUnit.length > 0 : showKgLabel);
  const suffix = priceUnit && priceUnit.length > 0 ? `/${priceUnit}` : '/kg';

  return (
    <HStack
      margin={{ marginHorizontal: theme.spacing.large }}
      borderWidth={1}
      backgroundColor={theme.pallate.neutral['01']}
      borderColor={theme.pallate.neutral['02']}
      borderRadius={theme.spacing.large}
      padding={theme.spacing.large}
      gap={theme.spacing.large}
      items="center"
    >
      <VStack fill>
        <Text type="s3" weight="semibold">
          {title}
        </Text>
        <Text type="l2" color={theme.pallate.neutral['04']}>
          {description}
        </Text>
      </VStack>
      <VStack items="flex-end">
        <Text
          type="b2"
          color={theme.pallate.neutral['05']}
          weight="semibold"
        >
          Harga
        </Text>
        <Text type="b1" color={theme.pallate.neutral['05']}>
          {displayPrice}
          {showSuffix && (
            <Text type="l1" color={theme.pallate.neutral['05']}>
              {suffix}
            </Text>
          )}
        </Text>
      </VStack>
    </HStack>
  );
});

export type { LaundryCardProps } from './laundry-card.types';
