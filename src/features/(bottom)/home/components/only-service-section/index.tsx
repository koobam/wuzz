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
import type { OnlyServiceSectionProps, OnlyServiceCardProps } from './only-service-section.types';

const OnlyServiceCard = memo(
  ({ item, onPress }: OnlyServiceCardProps) => (
    <Pressable
      direction="column"
      fill
      onPress={onPress}
      justify="center"
      items="center"
      gap={theme.spacing.small}
      borderRadius={20}
      padding={theme.spacing.medium}
      backgroundColor={theme.pallate.neutral['02']}
    >
      <Flex width={50} height={50} borderRadius={20} items="center" justify="center">
        <Icon
          icon={item.icon ?? 'bag'}
          size={60}
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
            <Text
              type="l2"
              weight="semibold"
              color={theme.pallate.neutral['01']}
            >
              {item.promo}
            </Text>
          </Box>
        )}
      </Flex>
      <Text type="l2" align="center" weight="medium">
        {item.name}
      </Text>
    </Pressable>
  ),
);

OnlyServiceCard.displayName = 'OnlyServiceCard';

export const OnlyServiceSection = memo(
  ({ onServicePress, items }: OnlyServiceSectionProps) => {
    if (!items || items.length === 0) return null;
    return (
      <VStack
        gap={theme.spacing.standard}
        padding={{
          paddingHorizontal: theme.spacing.large,
          paddingBottom: theme.spacing.large,
        }}
      >
        <VStack>
          <Text type="s2" weight="semibold">
            Ala Carte
          </Text>
          <Text type="l1" color={theme.pallate.neutral['04']}>
            Cuci, kering, atau setrika saja—sesuai kebutuhan.
          </Text>
        </VStack>
        <HStack items="stretch" gap={theme.spacing.small}>
          {items?.map(item => (
            <Flex key={item.id} fill>
              <OnlyServiceCard
                item={item}
                onPress={() => onServicePress(item.id)}
              />
            </Flex>
          ))}
        </HStack>
      </VStack>
    );
  },
);

OnlyServiceSection.displayName = 'OnlyServiceSection';
