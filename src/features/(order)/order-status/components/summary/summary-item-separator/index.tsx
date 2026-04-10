import { Divider, theme } from '@components/atoms';
import { memo } from 'react';

export const SummaryItemSeparator = memo(() => (
  <Divider thickness={theme.spacing.tiny} />
));

SummaryItemSeparator.displayName = 'SummaryItemSeparator';
