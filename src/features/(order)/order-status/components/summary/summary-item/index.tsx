import {
  Box,
  Flex,
  HStack,
  Pressable,
  Text,
  theme,
  VStack,
} from '@components/atoms';
import Image from '@components/atoms/image';
import { MenuEmptyPlaceholder } from '@assets/index';
import { memo, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import type { OrderSummaryItemStatus } from '../../../types';
import { DESCRIPTION_SEPARATOR } from '../../../utils';
import type { SummaryItemProps } from './summary-item.types';
import { TierIconSvg } from './tier-icon-svg';

const DUMMY_IMAGE_URI = MenuEmptyPlaceholder;

const ITEM_STATUS_LABELS: Record<OrderSummaryItemStatus, string> = {
  pending: 'Menunggu',
  ongoing: 'Menjemput',
  delivering: 'Mengantar',
  completed: 'Selesai',
};

const STATUS_BADGE_BG: Record<OrderSummaryItemStatus, string> = {
  pending: theme.pallate.neutral['02'],
  ongoing: theme.pallate.info['02'],
  delivering: theme.pallate.secondary['02'],
  completed: theme.pallate.success['02'],
};

const STATUS_BADGE_TEXT_COLOR: Record<OrderSummaryItemStatus, string> = {
  pending: theme.pallate.neutral['05'],
  ongoing: theme.pallate.info['04'],
  delivering: theme.pallate.secondary['05'],
  completed: theme.pallate.success['05'],
};

const IMAGE_SIZE = 55;
const TIER_ICON_SIZE = 25;
const TIER_ICON_INSET = -5;

const imageSizeStyle = StyleSheet.create({
  fill: { width: IMAGE_SIZE, height: IMAGE_SIZE, overflow: 'hidden' as const, borderRadius: 16 },
});

export const SummaryItem = memo(({ item, onInfoPress }: SummaryItemProps) => {
  const showItemKg = item.laundryKg != null && item.laundryKg > 0;
  const showItemStatus =
    item.itemStatus != null && item.itemStatus in ITEM_STATUS_LABELS;
  const showTierIcon =
    item.serviceTier != null &&
    (item.serviceTier === 'express' ||
      item.serviceTier === 'kilat' ||
      item.serviceTier === 'reguler');
  const handlePress = useCallback(() => {
    onInfoPress?.(item);
  }, [item, onInfoPress]);

  return (
    <Pressable
      onPress={handlePress}
      gap={theme.spacing.standard}
      items="center"
      padding={{
        paddingVertical: theme.spacing.small,
      }}
    >
      <Box
        width={IMAGE_SIZE}
        height={IMAGE_SIZE}
        borderRadius={16}
        backgroundColor={theme.pallate.neutral['02']}
      >
        <Image
          uri={DUMMY_IMAGE_URI}
          resizeMode="cover"
          style={imageSizeStyle.fill}
        />
        {showTierIcon && item.serviceTier != null && (
          <Flex
            position={{ bottom: TIER_ICON_INSET, right: TIER_ICON_INSET }}
            zIndex={1}
            width={TIER_ICON_SIZE}
            height={TIER_ICON_SIZE}
            borderRadius={8}
            backgroundColor={theme.pallate.neutral['01']}
            items="center"
            justify="center"
          >
            <TierIconSvg
              tier={item.serviceTier}
              size={16}
              color={theme.pallate.neutral['05']}
            />
          </Flex>
        )}
      </Box>
      <VStack fill>
        <Text
          type="l1"
          weight="medium"
          color={theme.pallate.neutral['05']}
        >
          {item.itemsSummary}
        </Text>
        <Text margin={{marginBottom: theme.spacing.small}} type="l2" color={theme.pallate.neutral['04']}>
          {item.description.join(DESCRIPTION_SEPARATOR)}
        </Text>
        {(showItemKg || showItemStatus) && (
          <HStack gap={theme.spacing.tiny} items="center">
            {showItemKg && (
              <Box
                padding={{
                  paddingHorizontal: theme.spacing.small,
                  paddingVertical: theme.spacing.tiny,
                }}
                borderRadius={6}
                backgroundColor={theme.pallate.neutral['02']}
              >
                <Text
                  type="l2"
                  weight="medium"
                  color={theme.pallate.neutral['05']}
                >
                  {item.laundryKg} kg
                </Text>
              </Box>
            )}
            {showItemStatus && item.itemStatus && (
              <Box
                padding={{
                  paddingHorizontal: theme.spacing.small,
                  paddingVertical: theme.spacing.tiny,
                }}
                borderRadius={6}
                backgroundColor={STATUS_BADGE_BG[item.itemStatus]}
              >
                <Text
                  type="l2"
                  weight="medium"
                  color={STATUS_BADGE_TEXT_COLOR[item.itemStatus]}
                >
                  {ITEM_STATUS_LABELS[item.itemStatus]}
                </Text>
              </Box>
            )}
          </HStack>
        )}
      </VStack>
      <VStack items="flex-end" gap={theme.spacing.tiny}>
        <Text
          type="l2"
          weight="medium"
          color={theme.pallate.neutral['05']}
        >
          Harga
        </Text>
        <Text type="l1" color={theme.pallate.neutral['05']}>
          {item.total}
        </Text>
      </VStack>
    </Pressable>
  );
});

SummaryItem.displayName = 'SummaryItem';
