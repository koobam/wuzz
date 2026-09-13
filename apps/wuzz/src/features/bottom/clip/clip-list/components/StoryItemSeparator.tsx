import { memo } from 'react';
import { Divider, theme } from '@components/atoms';

export const StoryItemSeparator = memo(() => (
  <Divider thickness={theme.spacing.standard} />
));

StoryItemSeparator.displayName = 'StoryItemSeparator';

