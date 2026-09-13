import { Flex, theme } from '@components/atoms';
import { memo } from 'react';

export const MoodItemSeparator = memo(() => (
  <Flex height={theme.spacing.small} width={theme.spacing.small} />
));

MoodItemSeparator.displayName = 'MoodItemSeparator';
