import type { OrderStatusDetail, OrderSummaryItemDetail } from '../../../types';

export type OrderStatusBottomSheetContentProps = {
  order: OrderStatusDetail;
  onCopyTransactionId?: (transactionId: string) => void;
  onWuzzerCall?: (phoneNumber: string) => void;
  onWuzzerChat?: (wuzzerId: string) => void;
  onWuzzerRate?: (wuzzerId: string, rating: number) => void;
  /** When provided, item info tap opens this flow (e.g. detail bottom sheet); else Alert */
  onItemDetailPress?: (item: OrderSummaryItemDetail) => void;
};
