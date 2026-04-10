import { Flex, HStack, Text, theme, VStack } from '@components/atoms';
import { memo } from 'react';
import type { WhatWeDoStepCardProps } from './what-we-do-step-card.types';

export const WhatWeDoStepCard = memo(
  ({ step, index }: WhatWeDoStepCardProps) => (
    <VStack
      spacing={theme.spacing.small}
      borderRadius={12}
      width={300}
      backgroundColor={theme.pallate.neutral['02']}
      padding={theme.spacing.large}
    >
      <HStack spacing={theme.spacing.small} items="center">
        <Flex
          width={30}
          height={30}
          borderRadius={12}
          backgroundColor={theme.pallate.primary['03']}
          items="center"
          justify="center"
        >
          <Text type="l1" weight="bold" color={theme.pallate.neutral['01']}>
            {index + 1}
          </Text>
        </Flex>
        <Text
          type="b2"
          fill
          weight="medium"
          color={theme.pallate.neutral['05']}
        >
          {step.title}
        </Text>
      </HStack>
      <Text type="l1" color={theme.pallate.neutral['05']}>
        {step.description}
      </Text>
    </VStack>
  ),
);

WhatWeDoStepCard.displayName = 'WhatWeDoStepCard';
