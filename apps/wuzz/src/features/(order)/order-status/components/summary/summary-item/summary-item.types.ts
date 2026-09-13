import type { OrderSummaryItemDetail } from '../../../types';

export type SummaryItemProps = {
  item: OrderSummaryItemDetail;
  onInfoPress?: (item: OrderSummaryItemDetail) => void;
};
