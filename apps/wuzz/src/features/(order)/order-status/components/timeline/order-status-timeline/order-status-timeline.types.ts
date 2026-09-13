import type { OrderStatusType } from '../../../types';

export type OrderStatusTimelineProps = {
  currentStatus: OrderStatusType;
  dateFormatted: string;
  transactionId: string;
  onCopyTransactionId?: (transactionId: string) => void;
};
