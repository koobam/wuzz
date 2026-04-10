import { Divider, theme } from '@components/atoms';
import { memo } from 'react';

export const PaymentSummarySeparator = memo(() => (
  <Divider thickness={theme.spacing.standard} />
));

PaymentSummarySeparator.displayName = 'PaymentSummarySeparator';
