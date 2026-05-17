import { memo } from 'react';
import { Box, Flex, Icon, Text, theme } from '@components/atoms';
import type { CategoryCardProps } from './category-card.types';
import GesturePressable from '@components/atoms/gesture-pressable';

export const CategoryCard = memo(({ item, onPress }: CategoryCardProps) => (
  <GesturePressable
    direction="column"
    fill
    onPress={onPress}
    justify="center"
    items="center"
    gap={theme.spacing.tiny}
  >
    <Flex
      width={60}
      height={60}
      items="center"
      justify="center"
      borderRadius={30}
      backgroundColor={theme.pallate.neutral['03']}
    >
      <Icon icon={item.icon} size={40} color={theme.pallate.neutral['04']} />
      {item.discount !== undefined && item.discount !== 0 && (
        <Box
          position={{
            top: 0,
            right: -5,
          }}
          backgroundColor={
            item.discount_type === 'percentage'
              ? theme.pallate.danger['03']
              : theme.pallate.primary['03']
          }
          padding={{
            paddingHorizontal: theme.spacing.small,
            paddingVertical: 3,
          }}
          borderRadius={10}
        >
          <Text type="l2" weight="semibold" color={theme.pallate.neutral['01']}>
            {item.discount}
          </Text>
        </Box>
      )}
    </Flex>
    <Text type="l1" align="center">
      {item.name}
    </Text>
  </GesturePressable>
));

CategoryCard.displayName = 'CategoryCard';
