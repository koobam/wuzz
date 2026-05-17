import { VStack, theme } from '@components/atoms';
import { memo, useCallback } from 'react';
import { Alert } from 'react-native';
import { OrderStatusTimeline } from '../../timeline';
import { OrderSummaryRow } from '../../summary';
import { RateWuzzerSection, WuzzerCard } from '../../map';
import type { OrderSummaryItemDetail } from '../../../types';
import { usePaymentSummaryRows } from '../../../hooks';
import { DESCRIPTION_SEPARATOR } from '../../../utils';
import { PaymentSummarySection } from '../payment-summary';
import type { OrderStatusBottomSheetContentProps } from './order-status-bottom-sheet-content.types';

export const OrderStatusBottomSheetContent = memo(
  ({
    order,
    onCopyTransactionId,
    onWuzzerCall,
    onWuzzerChat,
    onWuzzerRate,
    onItemDetailPress,
  }: OrderStatusBottomSheetContentProps) => {
    const handleCopyPress = useCallback(
      (transactionId: string) => {
        onCopyTransactionId?.(transactionId);
      },
      [onCopyTransactionId],
    );

    const handleItemDetailPress = useCallback(
      (item: OrderSummaryItemDetail) => {
        if (onItemDetailPress) {
          onItemDetailPress(item);
          return;
        }
        const desc = item.description.join(DESCRIPTION_SEPARATOR);
        const lines = [
          item.itemsSummary,
          desc,
          item.total,
          item.laundryKg != null ? `${item.laundryKg} kg` : null,
        ].filter(Boolean);
        Alert.alert('Detail item', lines.join('\n'));
      },
      [onItemDetailPress],
    );

    const paymentSummaryRows = usePaymentSummaryRows(order);
    const showRateSection =
      order.status === 'completed' &&
      order.wuzzer != null &&
      onWuzzerRate != null;

    return (
      <VStack
        gap={theme.spacing.extraLarge}
        padding={{
          paddingHorizontal: theme.spacing.large,
        }}
      >
        <OrderStatusTimeline
          currentStatus={order.status}
          dateFormatted={order.dateFormatted}
          transactionId={order.transactionId}
          onCopyTransactionId={handleCopyPress}
        />
        {order.wuzzer != null && (
          <WuzzerCard
            wuzzer={order.wuzzer}
            onCallPress={onWuzzerCall}
            onChatPress={onWuzzerChat}
          />
        )}
        {showRateSection && order.wuzzer != null && (
          <RateWuzzerSection
            wuzzerId={order.wuzzer.id}
            wuzzerName={order.wuzzer.name}
            onSubmit={onWuzzerRate}
          />
        )}
        <OrderSummaryRow
          order={order}
          onItemDetailPress={handleItemDetailPress}
        />
        <PaymentSummarySection
          rows={paymentSummaryRows}
          paymentMethod={order.paymentMethod}
        />
      </VStack>
    );
  },
);

OrderStatusBottomSheetContent.displayName = 'OrderStatusBottomSheetContent';
