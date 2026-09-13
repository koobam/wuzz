import { Text, theme, VStack } from '@components/atoms';
import { FlashList } from '@shopify/flash-list';
import { memo, useCallback } from 'react';
import type { OrderSummaryItemDetail } from '../../../types';
import { MOCK_ORDER_SUMMARY_ITEMS } from '../../../mocks';
import { SummaryItem } from '../summary-item';
import { SummaryItemSeparator } from '../summary-item-separator';
import type { OrderSummaryRowProps } from './order-summary-row.types';

export const OrderSummaryRow = memo(
  ({ order: _order, onItemDetailPress }: OrderSummaryRowProps) => {
    const handleInfoPress = useCallback(
      (item: OrderSummaryItemDetail) => {
        onItemDetailPress?.(item);
      },
      [onItemDetailPress],
    );

    const renderSummaryItem = useCallback(
      ({ item }: { item: OrderSummaryItemDetail }) => (
        <SummaryItem item={item} onInfoPress={handleInfoPress} />
      ),
      [handleInfoPress],
    );

    const keyExtractor = useCallback(
      (item: OrderSummaryItemDetail, index: number) => {
        return `${item.itemsSummary}-${item.description.join('-')}-${index}`;
      },
      [],
    );

    return (
      <VStack gap={theme.spacing.standard}>
        <Text type="s2" weight="medium" color={theme.pallate.neutral['05']}>
          Ringkasan pesanan
        </Text>
        <FlashList
          data={MOCK_ORDER_SUMMARY_ITEMS}
          renderItem={renderSummaryItem}
          keyExtractor={keyExtractor}
          scrollEnabled={false}
          ItemSeparatorComponent={SummaryItemSeparator}
        />
      </VStack>
    );
  },
);

OrderSummaryRow.displayName = 'OrderSummaryRow';
