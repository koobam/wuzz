import { memo } from 'react';
import {
  Box,
  Flex,
  HStack,
  Icon,
  Pressable,
  Text,
  theme,
  VStack,
} from '@components/atoms';
import type {
  OnlyServiceSectionProps,
  OnlyServiceCardProps,
} from './only-service-section.types';

const OnlyServiceCard = memo(({ item, onPress }: OnlyServiceCardProps) => (
  <Pressable
    direction="column"
    fill
    onPress={onPress}
    justify="flex-end"
    height={150}
    borderRadius={14}
    padding={theme.spacing.medium}
    backgroundColor={theme.pallate.neutral['02']}
  >
    <Icon
      icon={item.icon ?? 'bag'}
      size={45}
      color={theme.pallate.neutral['04']}
    />
    {item.promo !== undefined && item.promo !== '' && (
      <Box
        position={{
          top: -2,
          right: -30,
        }}
        backgroundColor={
          typeof item.promo === 'string' && item.promo.trim().endsWith('%')
            ? theme.pallate.danger['03']
            : theme.pallate.primary['03']
        }
        padding={{
          paddingHorizontal: theme.spacing.small,
          paddingVertical: 2,
        }}
        borderRadius={999}
      >
        <Text type="l2" weight="semibold" color={theme.pallate.neutral['01']}>
          {item.promo}
        </Text>
      </Box>
    )}
    <Text
      margin={{ marginTop: theme.spacing.small }}
      type="b2"
      weight="semibold"
    >
      {item.name}
    </Text>
    <Text type="l2" numberOfLines={2}>
      {item.description}
    </Text>
  </Pressable>
));

OnlyServiceCard.displayName = 'OnlyServiceCard';

export const OnlyServiceSection = memo(
  ({ title, subtitle, onServicePress, items }: OnlyServiceSectionProps) => {
    return (
      <VStack
        gap={theme.spacing.standard}
        padding={{ paddingHorizontal: theme.spacing.large }}
      >
        <VStack>
          <Text type="s2" weight="semibold">
            {title}
          </Text>
          <Text type="l1" color={theme.pallate.neutral['04']}>
            {subtitle}
          </Text>
        </VStack>
        <HStack items="stretch" gap={theme.spacing.small}>
          {items?.map(item => (
            <Flex key={item.id} fill>
              <OnlyServiceCard
                item={item}
                onPress={item.onPress ?? (() => onServicePress(item.id))}
              />
            </Flex>
          ))}
        </HStack>
      </VStack>
    );
  },
);

OnlyServiceSection.displayName = 'OnlyServiceSection';
