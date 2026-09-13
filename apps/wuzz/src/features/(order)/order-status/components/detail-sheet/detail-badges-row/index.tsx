import { HStack, Text, theme, VStack } from '@components/atoms';
import { Calendar, Flash, Timer1, WeightMeter } from 'iconsax-react-native';
import { memo } from 'react';
import { SERVICE_TIER_LABEL } from '../../../utils';
import type { DetailBadgesRowProps } from './detail-badges-row.types';

const SERVICE_TIER_ICON = {
  express: Flash,
  kilat: Timer1,
  reguler: Calendar,
} as const;

export const DetailBadgesRow = memo(({ item }: DetailBadgesRowProps) => {
  const showKg = item.laundryKg != null && item.laundryKg > 0;
  const tierLabel =
    item.serviceTier != null ? SERVICE_TIER_LABEL[item.serviceTier] : null;
  const showTier = tierLabel != null && item.serviceTier != null;

  if (!showKg && !showTier) {
    return null;
  }

  const TierIcon = showTier ? SERVICE_TIER_ICON[item.serviceTier!] : null;

  return (
    <HStack
      fill
      gap={theme.spacing.small}
      items="center"
      justify="space-between"
    >
      {showKg && (
        <HStack
          fill
          gap={theme.spacing.small}
          items="center"
          justify="center"
          height={50}
          borderRadius={8}
          backgroundColor={theme.pallate.neutral['02']}
        >
          <WeightMeter
            size={20}
            variant="Bold"
            color={theme.pallate.neutral['05']}
          />
          <VStack>
            <Text type="l1" weight="medium">
              Berat
            </Text>
            <Text type="l2" color={theme.pallate.neutral['05']}>
              {item.laundryKg} Kilogram
            </Text>
          </VStack>
        </HStack>
      )}
      {showTier && TierIcon != null && (
        <HStack
          fill
          gap={theme.spacing.small}
          items="center"
          justify="center"
          borderRadius={8}
          height={50}
          backgroundColor={theme.pallate.neutral['02']}
        >
          <TierIcon
            size={20}
            variant="Bold"
            color={theme.pallate.neutral['05']}
          />
          <VStack>
            <Text type="l1" weight="medium">
              Tier
            </Text>
            <Text type="l1" color={theme.pallate.neutral['05']}>
              {tierLabel}
            </Text>
          </VStack>
        </HStack>
      )}
    </HStack>
  );
});

DetailBadgesRow.displayName = 'DetailBadgesRow';
