import { memo } from 'react';
import { StyleSheet } from 'react-native';
import { HStack, Icon, Text, theme, VStack } from '@components/atoms';
import { TIER_COLOR, TIER_LABEL } from '../../utils';
import type { LeaderboardBenefitCardProps } from './leaderboard-benefit-card.types';
import type { Tier } from '../../utils';

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.pallate.neutral['01'],
    borderRadius: theme.spacing.large,
    borderCurve: 'continuous',
    marginHorizontal: theme.spacing.large,
    marginTop: theme.spacing.large,
    marginBottom: theme.spacing.small,
    padding: theme.spacing.standard,
    borderWidth: 1,
    borderColor: theme.pallate.neutral['03'],
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    borderCurve: 'continuous',
    marginTop: 6,
  },
});

export const LeaderboardBenefitCard = memo(function LeaderboardBenefitCard({
  tier,
  benefits,
  xpMin,
  xpMax,
}: LeaderboardBenefitCardProps) {
  const color = TIER_COLOR[tier];
  const xpLabel = xpMax
    ? `${xpMin.toLocaleString()} – ${xpMax.toLocaleString()} XP`
    : `${xpMin.toLocaleString()}+ XP`;

  return (
    <VStack style={styles.card} gap={theme.spacing.standard}>
      <HStack items="center" justify="between">
        <HStack items="center" gap={theme.spacing.small}>
          <Icon icon={tier} size={28} />
          <VStack>
            <Text type="b2" weight="semibold" color={color}>
              {TIER_LABEL[tier]}
            </Text>
            <Text type="l2" color={theme.pallate.neutral['04']}>
              {xpLabel}
            </Text>
          </VStack>
        </HStack>
        <Text type="l2" weight="medium" color={theme.pallate.neutral['04']}>
          Benefit
        </Text>
      </HStack>

      <VStack gap={theme.spacing.small}>
        {benefits.map((benefit, index) => (
          <HStack
            key={index}
            items="flex-start"
            gap={theme.spacing.small}
          >
            <VStack style={[styles.dot, { backgroundColor: color }]} />
            <Text fill type="l2" color={theme.pallate.neutral['05']}>
              {benefit}
            </Text>
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
});

export type { LeaderboardBenefitCardProps } from './leaderboard-benefit-card.types';
