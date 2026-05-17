import { VStack, theme } from '@components/atoms';
import { memo } from 'react';
import { ORDER_STATUS_STEP_CONFIG } from '../../../utils/constants';
import { OrderStatusProgressBar } from '../order-status-progress-bar';
import { StatusStepCard } from '../status-step-card';
import { TransactionIdRow } from '../transaction-id-row';
import type { OrderStatusTimelineProps } from './order-status-timeline.types';

export const OrderStatusTimeline = memo(
  ({
    currentStatus,
    dateFormatted,
    transactionId,
    onCopyTransactionId,
  }: OrderStatusTimelineProps) => {
    const stepConfig = ORDER_STATUS_STEP_CONFIG[currentStatus];

    return (
      <VStack gap={theme.spacing.standard}>
        <StatusStepCard
          title={stepConfig.title}
          description={stepConfig.description}
        />
        <TransactionIdRow
          dateFormatted={dateFormatted}
          transactionId={transactionId}
          onCopyPress={onCopyTransactionId}
        />
        <OrderStatusProgressBar currentStatus={currentStatus} />
      </VStack>
    );
  }
);

OrderStatusTimeline.displayName = 'OrderStatusTimeline';
