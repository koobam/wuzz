import { Box, Flex, HStack, Text, theme, VStack } from '@components/atoms';
import { memo } from 'react';
import {
  DEFAULT_XP_EARNED,
  DEFAULT_XP_TO_NEXT,
  LOYALTY_TIER_CONFIG,
  TIER_ICON_SIZE,
} from '../../../utils';
import type { OrderRewardsHandleContentProps } from './order-rewards-handle-content.types';

function getXpProgress(
  xpBefore: number,
  xpEarned: number,
  xpToNext: number,
): { xpRemaining: number; beforePct: number; earnedPct: number; remainingPct: number } {
  const total = xpBefore + xpEarned;
  const xpRemaining = Math.max(0, xpToNext - total);
  const scale = xpToNext > 0 ? xpToNext : 1;
  const beforePct = Math.min(100, (xpBefore / scale) * 100);
  const earnedPct = Math.min(100 - beforePct, (xpEarned / scale) * 100);
  const remainingPct = Math.max(0, 100 - beforePct - earnedPct);
  return { xpRemaining, beforePct, earnedPct, remainingPct };
}

export const OrderRewardsHandleContent = memo(
  ({
    currentTier,
    nextTierBenefit,
    xpBeforeOrder = 0,
    xpToNextTier = DEFAULT_XP_TO_NEXT,
    xpEarnedFromOrder = DEFAULT_XP_EARNED,
  }: OrderRewardsHandleContentProps) => {
    const current = LOYALTY_TIER_CONFIG[currentTier];
    const next = current.nextTier != null ? LOYALTY_TIER_CONFIG[current.nextTier!] : null;
    const benefitCopy = nextTierBenefit ?? next?.benefit ?? '';
    const progress = getXpProgress(xpBeforeOrder, xpEarnedFromOrder, xpToNextTier);
    const CurrentIcon = current.Icon;

    return (
      <VStack
        borderWidth={1}
        margin={{
          marginHorizontal: theme.spacing.large,
          marginTop: -theme.spacing.large * 2,
        }}
        backgroundColor={theme.pallate.neutral['01']}
        borderColor={theme.pallate.neutral['03']}
        borderRadius={theme.spacing.large}
        padding={theme.spacing.large}
        spacing={theme.spacing.standard}
      >
        <HStack justify="space-between" items="center" spacing={theme.spacing.small}>
          <HStack spacing={theme.spacing.tiny} items="center">
            <Flex
              width={TIER_ICON_SIZE}
              height={TIER_ICON_SIZE}
              items="center"
              justify="center"
            >
              <CurrentIcon width={TIER_ICON_SIZE} height={TIER_ICON_SIZE} />
            </Flex>
            <Text type="l1" weight="semibold" color={theme.pallate.neutral['05']}>
              {current.label}
            </Text>
          </HStack>
          {next != null && next.Icon != null ? (
            <>
                <Text fill type="l3" color={theme.pallate.neutral['04']} align="center">
                  {benefitCopy}
                </Text>
              <HStack spacing={theme.spacing.tiny} items="center">
                <Flex
                  width={TIER_ICON_SIZE}
                  height={TIER_ICON_SIZE}
                  items="center"
                  justify="center"
                >
                  <next.Icon width={TIER_ICON_SIZE} height={TIER_ICON_SIZE} />
                </Flex>
                <Text type="l1" weight="semibold" color={theme.pallate.neutral['05']}>
                  {next.label}
                </Text>
              </HStack>
            </>
          ) : (
            <Flex fill items="center" justify="center">
              <Text type="l1" color={theme.pallate.neutral['05']} align="center">
                {current.label}
              </Text>
            </Flex>
          )}
        </HStack>
        <HStack
          spacing={theme.spacing.standard}
          items="center"
          justify="space-between"
        >
          <Flex
            fill
            height={6}
            borderRadius={8}
            backgroundColor={theme.pallate.neutral['03']}
          >
            <Flex
              borderRadius={{
                borderTopLeftRadius: 8,
                borderBottomLeftRadius: 8,
              }}
              width={`${progress.beforePct}%`}
              backgroundColor={theme.pallate.primary['03']}
            />
            <Flex
              width={`${progress.earnedPct}%`}
              backgroundColor={current.progressColor}
            />
            <Flex
              items="center"
              borderRadius={{
                borderTopRightRadius: 8,
                borderBottomRightRadius: 8,
              }}
              width={`${progress.remainingPct}%`}
              backgroundColor={theme.pallate.neutral['03']}
            >
              <Box
                padding={{
                  paddingHorizontal: theme.spacing.small,
                  paddingVertical: theme.spacing.tiny,
                }}
                borderRadius={50}
                backgroundColor={current.progressColor}
                zIndex={1}
                position={{
                  right: 0,
                }}
              >
                <Text
                  type="l2"
                  weight="medium"
                  text={`+${xpEarnedFromOrder}`}
                  color={theme.pallate.neutral['01']}
                />
              </Box>
            </Flex>
          </Flex>
          {next != null ? (
            <Text type="l2" color={theme.pallate.neutral['05']}>
              {xpToNextTier} XP · {progress.xpRemaining} left
            </Text>
          ) : (
            <Text type="l2" color={theme.pallate.neutral['05']}>
              Max
            </Text>
          )}
        </HStack>
      </VStack>
    );
  },
);

OrderRewardsHandleContent.displayName = 'OrderRewardsHandleContent';
