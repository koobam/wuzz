import { Fragment, memo } from 'react';
import { Box, Divider, theme } from '@components/atoms';

export const ItemSeparator = memo(() => {
  return (
    <Fragment>
      <Divider thickness={theme.spacing.large} />
      <Box
        width="100%"
        height={1}
        backgroundColor={theme.pallate.neutral['05']}
      />
      <Divider thickness={theme.spacing.large} />
    </Fragment>
  );
});

ItemSeparator.displayName = 'ItemSeparator';

