import { Flex, HStack, Text, theme, VStack } from '@components/atoms';
import { memo } from 'react';
import type { OrderStatusLocationCardProps } from './order-status-location-card.types';

export const OrderStatusLocationCard = memo(
  ({ title, description, icon }: OrderStatusLocationCardProps) => (
    <HStack
      spacing={theme.spacing.standard}
      items="center"
    >
      <Flex
        width={50}
        height={50}
        borderWidth={1}
        borderColor={theme.pallate.neutral['02']}
        borderRadius={999}
        items="center"
        justify="center"
        backgroundColor={theme.pallate.neutral['01']}
      >
        {icon}
      </Flex>
      <VStack
        fill
        backgroundColor={theme.pallate.neutral['01']}
        padding={{
          paddingHorizontal: theme.spacing.large,
          paddingVertical: theme.spacing.medium,
        }}
        borderRadius={999}
      >
        <Text type="l1" weight="semibold" color={theme.pallate.neutral['05']}>
          {title}
        </Text>
        <Text
          type="l2"
          color={theme.pallate.neutral['04']}
          numberOfLines={2}
          text={description}
        />
      </VStack>
    </HStack>
  ),
);

OrderStatusLocationCard.displayName = 'OrderStatusLocationCard';
