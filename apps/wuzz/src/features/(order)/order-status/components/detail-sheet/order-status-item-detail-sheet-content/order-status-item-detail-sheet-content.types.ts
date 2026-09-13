import type { OrderSummaryItemDetail } from '../../../types';

export type OrderStatusItemDetailSheetContentProps = {
  item: OrderSummaryItemDetail | null;
  onClose: () => void;
};
