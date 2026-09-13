import { HStack, Text, theme, VStack } from '@components/atoms';
import { memo } from 'react';
import Dash from 'react-native-dash';
import type { PriceBreakdownSectionProps } from './price-breakdown-section.types';

export const PriceBreakdownSection = memo(
  ({ prices, total }: PriceBreakdownSectionProps) => (
    <VStack
      borderWidth={1}
      borderColor={theme.pallate.neutral['03']}
      borderRadius={theme.spacing.large}
      padding={theme.spacing.large}
      gap={theme.spacing.standard}
    >
      {prices.map((line, index) => (
        <HStack
          key={`prices-${index}`}
          justify="space-between"
          items="center"
        >
          <Text type="l1" color={theme.pallate.neutral['05']}>
            {line.label}
          </Text>
          <Text type="l1" color={theme.pallate.neutral['05']}>
            {line.price}
          </Text>
        </HStack>
      ))}
      <Dash
        dashColor={theme.pallate.neutral['03']}
        dashGap={4}
        dashLength={4}
        dashThickness={1}
      />
      <HStack justify="space-between" items="center">
        <Text
          type="l1"
          weight="medium"
          color={theme.pallate.neutral['05']}
        >
          Total Harga Layanan
        </Text>
        <Text type="b2" color={theme.pallate.neutral['05']}>
          {total}
        </Text>
      </HStack>
    </VStack>
  ),
);

PriceBreakdownSection.displayName = 'PriceBreakdownSection';
