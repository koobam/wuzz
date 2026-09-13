import { memo } from 'react';
import { Text, theme, VStack } from '@components/atoms';

export const ProcessingSection = memo(() => (
  <VStack
    gap={theme.spacing.standard}
    padding={{
      paddingHorizontal: theme.spacing.large,
      paddingBottom: theme.spacing.large,
    }}
  >
    <VStack>
      <Text type="s2" weight="semibold">
        Lagi diproses oleh Wuzz!
      </Text>
      <Text type="l1" color={theme.pallate.neutral['04']}>
        Kami sedang memproses pesananmu.
      </Text>
    </VStack>
  </VStack>
));

ProcessingSection.displayName = 'ProcessingSection';
