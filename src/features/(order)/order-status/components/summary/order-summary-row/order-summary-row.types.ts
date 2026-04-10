import type { OrderStatusDetail, OrderSummaryItemDetail } from '../../../types';

export type OrderSummaryRowProps = {
  order: OrderStatusDetail;
  /** Called when user taps info icon on an item; use to show detail modal/sheet */
  onItemDetailPress?: (item: OrderSummaryItemDetail) => void;
};
