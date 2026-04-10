import { Flex, HStack, Text, theme } from '@components/atoms';
import { Truck } from 'iconsax-react-native';
import { memo } from 'react';
import type { StatusStepCardProps } from './status-step-card.types';

export const StatusStepCard = memo(
  ({ title, description }: StatusStepCardProps) => (
    <HStack items="center" spacing={theme.spacing.standard}>
      <Flex
        padding={theme.spacing.standard}
        backgroundColor={theme.pallate.primary['01']}
        borderRadius={16}
      >
        <Truck variant="Bulk" size={24} color={theme.pallate.primary['04']} />
      </Flex>
      <Flex fill direction="column">
        <Text type="s3" weight="semibold" color={theme.pallate.neutral['05']}>
          {title}
        </Text>
        <Text type="l1" color={theme.pallate.neutral['04']}>
          {description}
        </Text>
      </Flex>
    </HStack>
  )
);

StatusStepCard.displayName = 'StatusStepCard';
