import { Box, theme } from '@components/atoms';
import { memo } from 'react';

export const StepListSeparator = memo(() => (
  <Box width={theme.spacing.standard} />
));

StepListSeparator.displayName = 'StepListSeparator';
