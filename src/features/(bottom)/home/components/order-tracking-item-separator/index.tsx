import { Divider, theme } from '@components/atoms';
import { memo } from 'react';

export const OrderTrackingItemSeparator = memo(() => (
  <Divider thickness={theme.spacing.standard} />
));

OrderTrackingItemSeparator.displayName = 'OrderTrackingItemSeparator';
