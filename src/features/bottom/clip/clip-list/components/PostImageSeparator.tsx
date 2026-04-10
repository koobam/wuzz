import { memo } from 'react';
import { Divider, theme } from '@components/atoms';

export const PostImageSeparator = memo(() => (
  <Divider thickness={theme.spacing.tiny} />
));

PostImageSeparator.displayName = 'PostImageSeparator';

